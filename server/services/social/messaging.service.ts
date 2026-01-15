/**
 * Direct Messaging Service
 * Handles conversations and messages between users
 */

import { db } from '../../db';
import {
  dmConversations,
  dmParticipants,
  dmMessages,
  users,
} from '../../../shared/schema';
import { eq, or, and, desc, sql, ne } from 'drizzle-orm';
import { logger } from '../../logger';
import { areFriends } from './friendship.service';

export interface Conversation {
  id: number;
  otherUser: {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
    zodiacSign: string | null;
  };
  lastMessage: string | null;
  lastMessageAt: Date | null;
  unreadCount: number;
  createdAt: Date;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number | null;
  content: string;
  isDeleted: boolean;
  createdAt: Date;
}

/**
 * Get or create a conversation between two users
 */
export async function getOrCreateConversation(
  userId: number,
  otherUserId: number
): Promise<{ conversation: Conversation | null; error?: string }> {
  try {
    // Verify the other user exists
    const [otherUser] = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        zodiacSign: users.zodiacSign,
      })
      .from(users)
      .where(eq(users.id, otherUserId));

    if (!otherUser) {
      return { conversation: null, error: 'User not found' };
    }

    // Check if they're friends (optional - can be removed if you want to allow messaging anyone)
    const friends = await areFriends(userId, otherUserId);
    if (!friends) {
      return { conversation: null, error: 'You must be friends to start a conversation' };
    }

    // Check for existing conversation
    const existingParticipant = await db
      .select()
      .from(dmParticipants)
      .where(eq(dmParticipants.userId, userId));

    const existingConvIds = existingParticipant.map((p) => p.conversationId);

    if (existingConvIds.length > 0) {
      // Find conversation with both users
      const otherParticipant = await db
        .select()
        .from(dmParticipants)
        .where(and(
          eq(dmParticipants.userId, otherUserId),
          sql`${dmParticipants.conversationId} IN (${sql.join(existingConvIds, sql`,`)})`
        ));

      if (otherParticipant.length > 0) {
        // Existing conversation found
        const [conv] = await db
          .select()
          .from(dmConversations)
          .where(eq(dmConversations.id, otherParticipant[0].conversationId));

        if (conv) {
          // Get unread count from participant record
          const [myParticipant] = await db
            .select()
            .from(dmParticipants)
            .where(and(
              eq(dmParticipants.conversationId, conv.id),
              eq(dmParticipants.userId, userId)
            ));

          return {
            conversation: {
              id: conv.id,
              otherUser,
              lastMessage: conv.lastMessagePreview,
              lastMessageAt: conv.lastMessageAt,
              unreadCount: myParticipant?.unreadCount || 0,
              createdAt: conv.createdAt!,
            },
          };
        }
      }
    }

    // Create new conversation
    const [newConv] = await db
      .insert(dmConversations)
      .values({
        messageCount: 0,
      })
      .returning();

    // Add participants
    await db.insert(dmParticipants).values([
      { conversationId: newConv.id, userId, unreadCount: 0 },
      { conversationId: newConv.id, userId: otherUserId, unreadCount: 0 },
    ]);

    logger.info({ userId, otherUserId, conversationId: newConv.id }, 'Created conversation');

    return {
      conversation: {
        id: newConv.id,
        otherUser,
        lastMessage: null,
        lastMessageAt: null,
        unreadCount: 0,
        createdAt: newConv.createdAt!,
      },
    };
  } catch (error) {
    logger.error({ err: error }, 'Failed to get or create conversation');
    throw error;
  }
}

/**
 * Get all conversations for a user
 */
export async function getConversations(userId: number): Promise<Conversation[]> {
  try {
    // Get all conversation IDs for user with their unread counts
    const userParticipations = await db
      .select()
      .from(dmParticipants)
      .where(eq(dmParticipants.userId, userId));

    if (userParticipations.length === 0) return [];

    const convIds = userParticipations.map((p) => p.conversationId);
    const unreadMap = new Map(userParticipations.map((p) => [p.conversationId, p.unreadCount || 0]));

    // Get conversations
    const conversations = await db
      .select()
      .from(dmConversations)
      .where(sql`${dmConversations.id} IN (${sql.join(convIds, sql`,`)})`)
      .orderBy(desc(dmConversations.lastMessageAt));

    // Get other participants for each conversation
    const otherParticipants = await db
      .select()
      .from(dmParticipants)
      .where(and(
        sql`${dmParticipants.conversationId} IN (${sql.join(convIds, sql`,`)})`,
        ne(dmParticipants.userId, userId)
      ));

    // Get user details
    const otherUserIds = otherParticipants.map((p) => p.userId);
    const otherUsers = otherUserIds.length > 0
      ? await db
          .select({
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            zodiacSign: users.zodiacSign,
          })
          .from(users)
          .where(sql`${users.id} IN (${sql.join(otherUserIds, sql`,`)})`)
      : [];

    const usersMap = new Map(otherUsers.map((u) => [u.id, u]));
    const participantsMap = new Map(otherParticipants.map((p) => [p.conversationId, p.userId]));

    // Build conversation list
    const result: Conversation[] = [];
    for (const conv of conversations) {
      const otherUserId = participantsMap.get(conv.id);
      const otherUser = otherUserId ? usersMap.get(otherUserId) : null;

      if (otherUser) {
        result.push({
          id: conv.id,
          otherUser,
          lastMessage: conv.lastMessagePreview,
          lastMessageAt: conv.lastMessageAt,
          unreadCount: unreadMap.get(conv.id) || 0,
          createdAt: conv.createdAt!,
        });
      }
    }

    return result;
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to get conversations');
    throw error;
  }
}

/**
 * Get messages for a conversation
 */
export async function getMessages(
  conversationId: number,
  userId: number,
  limit: number = 50,
  _beforeId?: number
): Promise<Message[]> {
  try {
    // Verify user is participant
    const [participant] = await db
      .select()
      .from(dmParticipants)
      .where(and(
        eq(dmParticipants.conversationId, conversationId),
        eq(dmParticipants.userId, userId)
      ));

    if (!participant) {
      throw new Error('Not a participant in this conversation');
    }

    const messages = await db
      .select()
      .from(dmMessages)
      .where(eq(dmMessages.conversationId, conversationId))
      .orderBy(desc(dmMessages.createdAt))
      .limit(limit);

    // Mark messages as read - reset unread count
    await db
      .update(dmParticipants)
      .set({
        unreadCount: 0,
        lastReadAt: new Date(),
      })
      .where(and(
        eq(dmParticipants.conversationId, conversationId),
        eq(dmParticipants.userId, userId)
      ));

    return messages.map(mapToMessage).reverse(); // Return in chronological order
  } catch (error) {
    logger.error({ err: error, conversationId }, 'Failed to get messages');
    throw error;
  }
}

/**
 * Send a message
 */
export async function sendMessage(
  conversationId: number,
  senderId: number,
  content: string
): Promise<Message> {
  try {
    // Verify sender is participant
    const [participant] = await db
      .select()
      .from(dmParticipants)
      .where(and(
        eq(dmParticipants.conversationId, conversationId),
        eq(dmParticipants.userId, senderId)
      ));

    if (!participant) {
      throw new Error('Not a participant in this conversation');
    }

    // Create message
    const [message] = await db
      .insert(dmMessages)
      .values({
        conversationId,
        senderId,
        content,
      })
      .returning();

    // Update conversation
    await db
      .update(dmConversations)
      .set({
        lastMessageAt: new Date(),
        lastMessagePreview: content.substring(0, 100),
        messageCount: sql`${dmConversations.messageCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(dmConversations.id, conversationId));

    // Update sender's last read
    await db
      .update(dmParticipants)
      .set({
        lastReadAt: new Date(),
        unreadCount: 0,
      })
      .where(and(
        eq(dmParticipants.conversationId, conversationId),
        eq(dmParticipants.userId, senderId)
      ));

    // Increment unread count for other participants
    await db
      .update(dmParticipants)
      .set({
        unreadCount: sql`COALESCE(${dmParticipants.unreadCount}, 0) + 1`,
      })
      .where(and(
        eq(dmParticipants.conversationId, conversationId),
        ne(dmParticipants.userId, senderId)
      ));

    logger.info({ conversationId, senderId }, 'Message sent');

    return mapToMessage(message);
  } catch (error) {
    logger.error({ err: error }, 'Failed to send message');
    throw error;
  }
}

/**
 * Get total unread message count for user
 */
export async function getTotalUnreadCount(userId: number): Promise<number> {
  const participants = await db
    .select({ unreadCount: dmParticipants.unreadCount })
    .from(dmParticipants)
    .where(eq(dmParticipants.userId, userId));

  return participants.reduce((sum, p) => sum + (p.unreadCount || 0), 0);
}

function mapToMessage(entry: typeof dmMessages.$inferSelect): Message {
  return {
    id: entry.id,
    conversationId: entry.conversationId,
    senderId: entry.senderId,
    content: entry.content,
    isDeleted: entry.isDeleted || false,
    createdAt: entry.createdAt!,
  };
}
