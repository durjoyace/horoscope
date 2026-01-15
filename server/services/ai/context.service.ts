/**
 * AI Context Service
 * Manages conversation context for AI coach interactions
 */

import { db } from '../../db';
import { aiConversations, aiMessages } from '../../../shared/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { getCache, setCache } from '../../cache/redis';
import { logger } from '../../logger';

// Types
export interface ConversationContext {
  id: number;
  userId: number;
  topic: string | null;
  zodiacSign: string | null;
  messageCount: number;
  lastMessageAt: string | null;
  recentMessages: Message[];
}

export interface Message {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

interface ConversationContextData {
  zodiacSign?: string;
  currentMood?: string;
  healthGoals?: string[];
}

// Maximum messages to keep in context
const MAX_CONTEXT_MESSAGES = 10;

// Cache TTL for conversation context (5 minutes)
const CONTEXT_CACHE_TTL = 300;

/**
 * Create a new conversation for a user
 */
export async function createConversation(
  userId: number,
  zodiacSign?: string,
  topic?: string
): Promise<ConversationContext> {
  try {
    const contextData: ConversationContextData = {};
    if (zodiacSign) {
      contextData.zodiacSign = zodiacSign;
    }

    const [conversation] = await db
      .insert(aiConversations)
      .values({
        userId,
        topic: topic || 'general',
        context: contextData,
      })
      .returning();

    const context: ConversationContext = {
      id: conversation.id,
      userId: conversation.userId,
      topic: conversation.topic,
      zodiacSign: (conversation.context as ConversationContextData)?.zodiacSign || null,
      messageCount: 0,
      lastMessageAt: null,
      recentMessages: [],
    };

    // Cache the new context
    await setCache(`ai:context:${conversation.id}`, context, CONTEXT_CACHE_TTL);

    logger.info({ conversationId: conversation.id, userId }, 'Created new AI conversation');
    return context;
  } catch (error) {
    logger.error({ err: error }, 'Failed to create AI conversation');
    throw error;
  }
}

/**
 * Get conversation context by ID
 */
export async function getConversationContext(
  conversationId: number,
  userId: number
): Promise<ConversationContext | null> {
  try {
    // Check cache first
    const cached = await getCache<ConversationContext>(`ai:context:${conversationId}`);
    if (cached && cached.userId === userId) {
      return cached;
    }

    // Fetch from database
    const [conversation] = await db
      .select()
      .from(aiConversations)
      .where(and(
        eq(aiConversations.id, conversationId),
        eq(aiConversations.userId, userId)
      ));

    if (!conversation) {
      return null;
    }

    // Get recent messages
    const messages = await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.conversationId, conversationId))
      .orderBy(desc(aiMessages.createdAt))
      .limit(MAX_CONTEXT_MESSAGES);

    const context: ConversationContext = {
      id: conversation.id,
      userId: conversation.userId,
      topic: conversation.topic,
      zodiacSign: (conversation.context as ConversationContextData)?.zodiacSign || null,
      messageCount: conversation.messageCount || 0,
      lastMessageAt: conversation.lastMessageAt?.toISOString() || null,
      recentMessages: messages.reverse().map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
        createdAt: m.createdAt!,
      })),
    };

    // Cache the context
    await setCache(`ai:context:${conversationId}`, context, CONTEXT_CACHE_TTL);

    return context;
  } catch (error) {
    logger.error({ err: error, conversationId }, 'Failed to get conversation context');
    throw error;
  }
}

/**
 * Add a message to a conversation
 */
export async function addMessage(
  conversationId: number,
  role: 'user' | 'assistant' | 'system',
  content: string
): Promise<Message> {
  try {
    const [message] = await db
      .insert(aiMessages)
      .values({
        conversationId,
        role,
        content,
      })
      .returning();

    // Update conversation metadata using raw SQL for the count
    await db
      .update(aiConversations)
      .set({
        messageCount: sql`(SELECT COUNT(*) FROM ai_messages WHERE conversation_id = ${conversationId})`,
        lastMessageAt: new Date(),
      })
      .where(eq(aiConversations.id, conversationId));

    // Invalidate cache
    await setCache(`ai:context:${conversationId}`, null, 1);

    return {
      id: message.id,
      role: message.role as 'user' | 'assistant' | 'system',
      content: message.content,
      createdAt: message.createdAt!,
    };
  } catch (error) {
    logger.error({ err: error, conversationId }, 'Failed to add message');
    throw error;
  }
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(userId: number): Promise<ConversationContext[]> {
  try {
    const conversations = await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.userId, userId))
      .orderBy(desc(aiConversations.lastMessageAt));

    return conversations.map((c) => ({
      id: c.id,
      userId: c.userId,
      topic: c.topic,
      zodiacSign: (c.context as ConversationContextData)?.zodiacSign || null,
      messageCount: c.messageCount || 0,
      lastMessageAt: c.lastMessageAt?.toISOString() || null,
      recentMessages: [],
    }));
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to get user conversations');
    throw error;
  }
}

/**
 * Get messages for a conversation
 */
export async function getConversationMessages(
  conversationId: number,
  userId: number,
  limit: number = 50,
  offset: number = 0
): Promise<Message[]> {
  try {
    // Verify user owns the conversation
    const [conversation] = await db
      .select()
      .from(aiConversations)
      .where(and(
        eq(aiConversations.id, conversationId),
        eq(aiConversations.userId, userId)
      ));

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const messages = await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.conversationId, conversationId))
      .orderBy(desc(aiMessages.createdAt))
      .limit(limit)
      .offset(offset);

    return messages.reverse().map((m) => ({
      id: m.id,
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
      createdAt: m.createdAt!,
    }));
  } catch (error) {
    logger.error({ err: error, conversationId }, 'Failed to get conversation messages');
    throw error;
  }
}

/**
 * Delete a conversation
 */
export async function deleteConversation(
  conversationId: number,
  userId: number
): Promise<boolean> {
  try {
    // Verify user owns the conversation
    const [conversation] = await db
      .select()
      .from(aiConversations)
      .where(and(
        eq(aiConversations.id, conversationId),
        eq(aiConversations.userId, userId)
      ));

    if (!conversation) {
      return false;
    }

    // Delete messages first (cascade)
    await db
      .delete(aiMessages)
      .where(eq(aiMessages.conversationId, conversationId));

    // Delete conversation
    await db
      .delete(aiConversations)
      .where(eq(aiConversations.id, conversationId));

    // Invalidate cache
    await setCache(`ai:context:${conversationId}`, null, 1);

    logger.info({ conversationId, userId }, 'Deleted AI conversation');
    return true;
  } catch (error) {
    logger.error({ err: error, conversationId }, 'Failed to delete conversation');
    throw error;
  }
}

/**
 * Build conversation history for OpenAI API
 */
export function buildMessageHistory(context: ConversationContext): Array<{
  role: 'user' | 'assistant' | 'system';
  content: string;
}> {
  return context.recentMessages.map((m) => ({
    role: m.role,
    content: m.content,
  }));
}
