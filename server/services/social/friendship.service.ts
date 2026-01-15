/**
 * Friendship Service
 * Handles friend requests, relationships, and presence
 */

import { db } from '../../db';
import { friendships, users, userBlocks } from '../../../shared/schema';
import { eq, or, and, desc, ne } from 'drizzle-orm';
import { logger } from '../../logger';

export type FriendshipStatus = 'pending' | 'accepted' | 'declined';

export interface FriendRequest {
  id: number;
  requesterId: number;
  addresseeId: number;
  status: FriendshipStatus;
  requestedAt: Date;
  respondedAt: Date | null;
}

export interface Friend {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  zodiacSign: string | null;
  friendshipId: number;
  friendSince: Date;
}

export interface PendingRequest {
  id: number;
  user: {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
    zodiacSign: string | null;
  };
  requestedAt: Date;
  type: 'incoming' | 'outgoing';
}

/**
 * Send a friend request
 */
export async function sendFriendRequest(
  requesterId: number,
  addresseeEmail: string
): Promise<{ success: boolean; message: string; request?: FriendRequest }> {
  try {
    // Find addressee by email
    const [addressee] = await db
      .select()
      .from(users)
      .where(eq(users.email, addresseeEmail.toLowerCase()));

    if (!addressee) {
      return { success: false, message: 'User not found' };
    }

    if (addressee.id === requesterId) {
      return { success: false, message: 'Cannot send friend request to yourself' };
    }

    // Check if blocked
    const [block] = await db
      .select()
      .from(userBlocks)
      .where(
        or(
          and(eq(userBlocks.blockerId, requesterId), eq(userBlocks.blockedId, addressee.id)),
          and(eq(userBlocks.blockerId, addressee.id), eq(userBlocks.blockedId, requesterId))
        )
      );

    if (block) {
      return { success: false, message: 'Cannot send friend request' };
    }

    // Check for existing friendship/request
    const [existing] = await db
      .select()
      .from(friendships)
      .where(
        or(
          and(eq(friendships.requesterId, requesterId), eq(friendships.addresseeId, addressee.id)),
          and(eq(friendships.requesterId, addressee.id), eq(friendships.addresseeId, requesterId))
        )
      );

    if (existing) {
      if (existing.status === 'accepted') {
        return { success: false, message: 'Already friends' };
      }
      if (existing.status === 'pending') {
        return { success: false, message: 'Friend request already pending' };
      }
    }

    // Create friend request
    const [request] = await db
      .insert(friendships)
      .values({
        requesterId,
        addresseeId: addressee.id,
        status: 'pending',
      })
      .returning();

    logger.info({ requesterId, addresseeId: addressee.id }, 'Friend request sent');

    return {
      success: true,
      message: 'Friend request sent',
      request: mapToFriendRequest(request),
    };
  } catch (error) {
    logger.error({ err: error }, 'Failed to send friend request');
    throw error;
  }
}

/**
 * Respond to a friend request
 */
export async function respondToFriendRequest(
  userId: number,
  requestId: number,
  accept: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const [request] = await db
      .select()
      .from(friendships)
      .where(and(
        eq(friendships.id, requestId),
        eq(friendships.addresseeId, userId),
        eq(friendships.status, 'pending')
      ));

    if (!request) {
      return { success: false, message: 'Friend request not found' };
    }

    await db
      .update(friendships)
      .set({
        status: accept ? 'accepted' : 'declined',
        respondedAt: new Date(),
      })
      .where(eq(friendships.id, requestId));

    logger.info({ requestId, userId, accept }, 'Friend request responded');

    return {
      success: true,
      message: accept ? 'Friend request accepted' : 'Friend request declined',
    };
  } catch (error) {
    logger.error({ err: error }, 'Failed to respond to friend request');
    throw error;
  }
}

/**
 * Get user's friends list
 */
export async function getFriends(userId: number): Promise<Friend[]> {
  try {
    // Get accepted friendships where user is either requester or addressee
    const acceptedFriendships = await db
      .select()
      .from(friendships)
      .where(and(
        eq(friendships.status, 'accepted'),
        or(
          eq(friendships.requesterId, userId),
          eq(friendships.addresseeId, userId)
        )
      ))
      .orderBy(desc(friendships.respondedAt));

    // Get friend user IDs
    const friendUserIds = acceptedFriendships.map((f) =>
      f.requesterId === userId ? f.addresseeId : f.requesterId
    );

    if (friendUserIds.length === 0) return [];

    // Get friend user details
    const friendUsers = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        zodiacSign: users.zodiacSign,
      })
      .from(users)
      .where(
        or(...friendUserIds.map((id) => eq(users.id, id)))
      );

    // Map to Friend objects
    const friendsMap = new Map(friendUsers.map((u) => [u.id, u]));

    return acceptedFriendships
      .map((f) => {
        const friendId = f.requesterId === userId ? f.addresseeId : f.requesterId;
        const user = friendsMap.get(friendId);
        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          zodiacSign: user.zodiacSign,
          friendshipId: f.id,
          friendSince: f.respondedAt!,
        };
      })
      .filter((f): f is Friend => f !== null);
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to get friends');
    throw error;
  }
}

/**
 * Get pending friend requests
 */
export async function getPendingRequests(userId: number): Promise<PendingRequest[]> {
  try {
    // Get incoming requests
    const incomingRequests = await db
      .select()
      .from(friendships)
      .where(and(
        eq(friendships.addresseeId, userId),
        eq(friendships.status, 'pending')
      ))
      .orderBy(desc(friendships.requestedAt));

    // Get outgoing requests
    const outgoingRequests = await db
      .select()
      .from(friendships)
      .where(and(
        eq(friendships.requesterId, userId),
        eq(friendships.status, 'pending')
      ))
      .orderBy(desc(friendships.requestedAt));

    // Get user details for all requests
    const userIds = [
      ...incomingRequests.map((r) => r.requesterId),
      ...outgoingRequests.map((r) => r.addresseeId),
    ];

    if (userIds.length === 0) return [];

    const requestUsers = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        zodiacSign: users.zodiacSign,
      })
      .from(users)
      .where(or(...userIds.map((id) => eq(users.id, id))));

    const usersMap = new Map(requestUsers.map((u) => [u.id, u]));

    const pending: PendingRequest[] = [];

    for (const req of incomingRequests) {
      const user = usersMap.get(req.requesterId);
      if (user) {
        pending.push({
          id: req.id,
          user,
          requestedAt: req.requestedAt!,
          type: 'incoming',
        });
      }
    }

    for (const req of outgoingRequests) {
      const user = usersMap.get(req.addresseeId);
      if (user) {
        pending.push({
          id: req.id,
          user,
          requestedAt: req.requestedAt!,
          type: 'outgoing',
        });
      }
    }

    return pending.sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to get pending requests');
    throw error;
  }
}

/**
 * Remove a friend
 */
export async function removeFriend(userId: number, friendId: number): Promise<boolean> {
  try {
    const [friendship] = await db
      .select()
      .from(friendships)
      .where(and(
        eq(friendships.status, 'accepted'),
        or(
          and(eq(friendships.requesterId, userId), eq(friendships.addresseeId, friendId)),
          and(eq(friendships.requesterId, friendId), eq(friendships.addresseeId, userId))
        )
      ));

    if (!friendship) return false;

    await db.delete(friendships).where(eq(friendships.id, friendship.id));

    logger.info({ userId, friendId }, 'Friend removed');
    return true;
  } catch (error) {
    logger.error({ err: error }, 'Failed to remove friend');
    throw error;
  }
}

/**
 * Check if two users are friends
 */
export async function areFriends(userId1: number, userId2: number): Promise<boolean> {
  const [friendship] = await db
    .select()
    .from(friendships)
    .where(and(
      eq(friendships.status, 'accepted'),
      or(
        and(eq(friendships.requesterId, userId1), eq(friendships.addresseeId, userId2)),
        and(eq(friendships.requesterId, userId2), eq(friendships.addresseeId, userId1))
      )
    ));

  return !!friendship;
}

/**
 * Block a user
 */
export async function blockUser(blockerId: number, blockedId: number): Promise<boolean> {
  try {
    // Remove any existing friendship
    await db
      .delete(friendships)
      .where(
        or(
          and(eq(friendships.requesterId, blockerId), eq(friendships.addresseeId, blockedId)),
          and(eq(friendships.requesterId, blockedId), eq(friendships.addresseeId, blockerId))
        )
      );

    // Add block
    await db.insert(userBlocks).values({
      blockerId,
      blockedId,
    });

    logger.info({ blockerId, blockedId }, 'User blocked');
    return true;
  } catch (error) {
    logger.error({ err: error }, 'Failed to block user');
    throw error;
  }
}

/**
 * Unblock a user
 */
export async function unblockUser(blockerId: number, blockedId: number): Promise<boolean> {
  try {
    await db
      .delete(userBlocks)
      .where(and(
        eq(userBlocks.blockerId, blockerId),
        eq(userBlocks.blockedId, blockedId)
      ));

    logger.info({ blockerId, blockedId }, 'User unblocked');
    return true;
  } catch (error) {
    logger.error({ err: error }, 'Failed to unblock user');
    throw error;
  }
}

/**
 * Get friend IDs for a user (helper for leaderboards)
 */
export async function getFriendIds(userId: number): Promise<number[]> {
  try {
    const acceptedFriendships = await db
      .select()
      .from(friendships)
      .where(and(
        eq(friendships.status, 'accepted'),
        or(
          eq(friendships.requesterId, userId),
          eq(friendships.addresseeId, userId)
        )
      ));

    return acceptedFriendships.map((f) =>
      f.requesterId === userId ? f.addresseeId : f.requesterId
    );
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to get friend IDs');
    return [];
  }
}

function mapToFriendRequest(entry: typeof friendships.$inferSelect): FriendRequest {
  return {
    id: entry.id,
    requesterId: entry.requesterId,
    addresseeId: entry.addresseeId,
    status: entry.status as FriendshipStatus,
    requestedAt: entry.requestedAt!,
    respondedAt: entry.respondedAt,
  };
}
