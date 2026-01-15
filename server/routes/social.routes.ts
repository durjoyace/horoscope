/**
 * Social API Routes
 * Handles friendships, messaging, and social features
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { logger } from '../logger';
import {
  sendFriendRequest,
  respondToFriendRequest,
  getFriends,
  getPendingRequests,
  removeFriend,
  blockUser,
  unblockUser,
} from '../services/social/friendship.service';
import {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  getTotalUnreadCount,
} from '../services/social/messaging.service';

const router = Router();

// ==================== FRIENDSHIP ENDPOINTS ====================

/**
 * GET /api/v2/social/friends
 * Get user's friends list
 */
router.get('/friends', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const friends = await getFriends(req.user.id);

    res.status(200).json({
      success: true,
      data: friends,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching friends');
    res.status(500).json({
      success: false,
      message: 'Could not fetch friends.',
    });
  }
});

/**
 * POST /api/v2/social/friends/request
 * Send a friend request
 */
router.post('/friends/request', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const schema = z.object({
      email: z.string().email(),
    });

    const { email } = schema.parse(req.body);

    const result = await sendFriendRequest(req.user.id, email);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.request,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error sending friend request');

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Could not send friend request.',
    });
  }
});

/**
 * GET /api/v2/social/friends/requests
 * Get pending friend requests
 */
router.get('/friends/requests', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const requests = await getPendingRequests(req.user.id);

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching friend requests');
    res.status(500).json({
      success: false,
      message: 'Could not fetch friend requests.',
    });
  }
});

/**
 * POST /api/v2/social/friends/requests/:id/respond
 * Accept or decline a friend request
 */
router.post('/friends/requests/:id/respond', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const requestId = parseInt(req.params.id);
    if (isNaN(requestId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID',
      });
    }

    const schema = z.object({
      accept: z.boolean(),
    });

    const { accept } = schema.parse(req.body);

    const result = await respondToFriendRequest(req.user.id, requestId, accept);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error responding to friend request');
    res.status(500).json({
      success: false,
      message: 'Could not respond to friend request.',
    });
  }
});

/**
 * DELETE /api/v2/social/friends/:id
 * Remove a friend
 */
router.delete('/friends/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const friendId = parseInt(req.params.id);
    if (isNaN(friendId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid friend ID',
      });
    }

    const removed = await removeFriend(req.user.id, friendId);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Friendship not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Friend removed',
    });
  } catch (error) {
    logger.error({ err: error }, 'Error removing friend');
    res.status(500).json({
      success: false,
      message: 'Could not remove friend.',
    });
  }
});

/**
 * POST /api/v2/social/block/:id
 * Block a user
 */
router.post('/block/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const blockedId = parseInt(req.params.id);
    if (isNaN(blockedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    await blockUser(req.user.id, blockedId);

    res.status(200).json({
      success: true,
      message: 'User blocked',
    });
  } catch (error) {
    logger.error({ err: error }, 'Error blocking user');
    res.status(500).json({
      success: false,
      message: 'Could not block user.',
    });
  }
});

/**
 * DELETE /api/v2/social/block/:id
 * Unblock a user
 */
router.delete('/block/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const blockedId = parseInt(req.params.id);
    if (isNaN(blockedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    await unblockUser(req.user.id, blockedId);

    res.status(200).json({
      success: true,
      message: 'User unblocked',
    });
  } catch (error) {
    logger.error({ err: error }, 'Error unblocking user');
    res.status(500).json({
      success: false,
      message: 'Could not unblock user.',
    });
  }
});

// ==================== MESSAGING ENDPOINTS ====================

/**
 * GET /api/v2/social/conversations
 * Get all conversations
 */
router.get('/conversations', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const conversations = await getConversations(req.user.id);

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching conversations');
    res.status(500).json({
      success: false,
      message: 'Could not fetch conversations.',
    });
  }
});

/**
 * POST /api/v2/social/conversations
 * Start or get a conversation with a user
 */
router.post('/conversations', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const schema = z.object({
      userId: z.number(),
    });

    const { userId: otherUserId } = schema.parse(req.body);

    const result = await getOrCreateConversation(req.user.id, otherUserId);

    if (!result.conversation) {
      return res.status(400).json({
        success: false,
        message: result.error || 'Could not create conversation',
      });
    }

    res.status(200).json({
      success: true,
      data: result.conversation,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error creating conversation');
    res.status(500).json({
      success: false,
      message: 'Could not create conversation.',
    });
  }
});

/**
 * GET /api/v2/social/conversations/:id/messages
 * Get messages in a conversation
 */
router.get('/conversations/:id/messages', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const conversationId = parseInt(req.params.id);
    if (isNaN(conversationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid conversation ID',
      });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const messages = await getMessages(conversationId, req.user.id, limit);

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching messages');

    if ((error as Error).message === 'Not a participant in this conversation') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this conversation',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Could not fetch messages.',
    });
  }
});

/**
 * POST /api/v2/social/conversations/:id/messages
 * Send a message
 */
router.post('/conversations/:id/messages', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const conversationId = parseInt(req.params.id);
    if (isNaN(conversationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid conversation ID',
      });
    }

    const schema = z.object({
      content: z.string().min(1).max(2000),
    });

    const { content } = schema.parse(req.body);

    const message = await sendMessage(conversationId, req.user.id, content);

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error sending message');

    if ((error as Error).message === 'Not a participant in this conversation') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages in this conversation',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Could not send message.',
    });
  }
});

/**
 * GET /api/v2/social/unread
 * Get total unread message count
 */
router.get('/unread', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const count = await getTotalUnreadCount(req.user.id);

    res.status(200).json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching unread count');
    res.status(500).json({
      success: false,
      message: 'Could not fetch unread count.',
    });
  }
});

export default router;
