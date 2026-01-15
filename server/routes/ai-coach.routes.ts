/**
 * AI Coach API Routes
 * Handles AI wellness coach conversations and interactions
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { logger } from '../logger';
import {
  createConversation,
  getConversationContext,
  getUserConversations,
  getConversationMessages,
  deleteConversation,
} from '../services/ai/context.service';
import {
  generateCoachResponse,
  getSuggestedPrompts,
  getZodiacWellnessInsight,
} from '../services/ai/coach.service';
import {
  streamCoachResponse,
  initSSEResponse,
  sendSSE,
  startKeepAlive,
  cleanupSSE,
  handleSSEDisconnect,
} from '../services/ai/streaming.service';

const router = Router();

// Validation schemas
const createConversationSchema = z.object({
  topic: z.string().optional(),
});

const sendMessageSchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
  stream: z.boolean().optional().default(true),
});

/**
 * POST /api/v2/ai/conversations
 * Create a new conversation
 */
router.post('/conversations', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const validatedInput = createConversationSchema.parse(req.body);

    const conversation = await createConversation(
      req.user.id,
      req.user.zodiacSign || undefined,
      validatedInput.topic
    );

    const suggestedPrompts = getSuggestedPrompts(req.user.zodiacSign);
    const zodiacInsight = req.user.zodiacSign
      ? getZodiacWellnessInsight(req.user.zodiacSign)
      : null;

    res.status(201).json({
      success: true,
      message: 'Conversation created',
      data: {
        conversation,
        suggestedPrompts,
        zodiacInsight,
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error creating conversation');

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Could not create conversation. Please try again.',
    });
  }
});

/**
 * GET /api/v2/ai/conversations
 * Get all conversations for the current user
 */
router.get('/conversations', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const conversations = await getUserConversations(req.user.id);

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching conversations');
    res.status(500).json({
      success: false,
      message: 'Could not retrieve conversations.',
    });
  }
});

/**
 * GET /api/v2/ai/conversations/:id
 * Get a specific conversation with context
 */
router.get('/conversations/:id', async (req: Request, res: Response) => {
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

    const context = await getConversationContext(conversationId, req.user.id);

    if (!context) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    res.status(200).json({
      success: true,
      data: context,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching conversation');
    res.status(500).json({
      success: false,
      message: 'Could not retrieve conversation.',
    });
  }
});

/**
 * GET /api/v2/ai/conversations/:id/messages
 * Get messages for a conversation
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
    const offset = parseInt(req.query.offset as string) || 0;

    const messages = await getConversationMessages(
      conversationId,
      req.user.id,
      limit,
      offset
    );

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching messages');

    if ((error as Error).message === 'Conversation not found') {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Could not retrieve messages.',
    });
  }
});

/**
 * POST /api/v2/ai/conversations/:id/messages
 * Send a message to the AI coach (with optional streaming)
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

    const validatedInput = sendMessageSchema.parse(req.body);

    // Get conversation context
    const context = await getConversationContext(conversationId, req.user.id);

    if (!context) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    // Stream response or return full response
    if (validatedInput.stream) {
      // Handle SSE streaming
      const keepAlive = startKeepAlive(res);

      handleSSEDisconnect(req, res, () => cleanupSSE(res, keepAlive));

      await streamCoachResponse(res, validatedInput.message, context);

      cleanupSSE(res, keepAlive);
    } else {
      // Return full response
      const response = await generateCoachResponse(validatedInput.message, context);

      res.status(200).json({
        success: true,
        data: {
          conversationId: context.id,
          message: response,
        },
      });
    }
  } catch (error) {
    logger.error({ err: error }, 'Error sending message');

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input',
        errors: error.errors,
      });
    }

    // Check if response is already being streamed
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Could not generate response. Please try again.',
      });
    }
  }
});

/**
 * DELETE /api/v2/ai/conversations/:id
 * Delete a conversation
 */
router.delete('/conversations/:id', async (req: Request, res: Response) => {
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

    const deleted = await deleteConversation(conversationId, req.user.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Conversation deleted',
    });
  } catch (error) {
    logger.error({ err: error }, 'Error deleting conversation');
    res.status(500).json({
      success: false,
      message: 'Could not delete conversation.',
    });
  }
});

/**
 * GET /api/v2/ai/prompts
 * Get suggested prompts for the user
 */
router.get('/prompts', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const prompts = getSuggestedPrompts(req.user.zodiacSign);
    const zodiacInsight = req.user.zodiacSign
      ? getZodiacWellnessInsight(req.user.zodiacSign)
      : null;

    res.status(200).json({
      success: true,
      data: {
        prompts,
        zodiacInsight,
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching prompts');
    res.status(500).json({
      success: false,
      message: 'Could not retrieve prompts.',
    });
  }
});

export default router;
