/**
 * AI Streaming Service
 * Handles Server-Sent Events (SSE) for real-time AI responses
 */

import type { Response } from 'express';
import { generateCoachResponseStream } from './coach.service';
import { ConversationContext } from './context.service';
import { logger } from '../../logger';

// SSE message types
export type SSEEventType = 'message' | 'error' | 'done' | 'ping';

/**
 * Send an SSE message to the client
 */
export function sendSSE(res: Response, event: SSEEventType, data: unknown): void {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  res.write(message);
}

/**
 * Initialize SSE response headers
 */
export function initSSEResponse(res: Response): void {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
  res.flushHeaders();
}

/**
 * Stream AI coach response via SSE
 */
export async function streamCoachResponse(
  res: Response,
  userMessage: string,
  context: ConversationContext
): Promise<void> {
  try {
    initSSEResponse(res);

    // Start streaming
    sendSSE(res, 'message', { type: 'start', conversationId: context.id });

    let fullResponse = '';

    // Stream tokens as they arrive
    const stream = generateCoachResponseStream(userMessage, context);

    for await (const token of stream) {
      fullResponse += token;
      sendSSE(res, 'message', { type: 'token', content: token });
    }

    // Send completion signal
    sendSSE(res, 'done', {
      type: 'complete',
      conversationId: context.id,
      totalLength: fullResponse.length,
    });

    res.end();

    logger.info(
      { conversationId: context.id, responseLength: fullResponse.length },
      'Completed SSE stream'
    );
  } catch (error) {
    logger.error({ err: error, conversationId: context.id }, 'SSE stream error');

    // Send error to client
    sendSSE(res, 'error', {
      type: 'error',
      message: 'Failed to generate response. Please try again.',
    });

    res.end();
  }
}

/**
 * Keep-alive ping for long-running connections
 */
export function startKeepAlive(res: Response, intervalMs: number = 15000): NodeJS.Timeout {
  return setInterval(() => {
    if (!res.writableEnded) {
      sendSSE(res, 'ping', { timestamp: Date.now() });
    }
  }, intervalMs);
}

/**
 * Clean up SSE connection
 */
export function cleanupSSE(res: Response, keepAliveInterval?: NodeJS.Timeout): void {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }

  if (!res.writableEnded) {
    res.end();
  }
}

/**
 * Handle client disconnect during streaming
 */
export function handleSSEDisconnect(
  req: { on: (event: string, callback: () => void) => void },
  res: Response,
  cleanup: () => void
): void {
  req.on('close', () => {
    logger.debug('SSE client disconnected');
    cleanup();
    if (!res.writableEnded) {
      res.end();
    }
  });
}
