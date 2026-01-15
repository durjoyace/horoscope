import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';
import { logger } from '../logger';

// Custom rate limit store using Redis
class RedisRateLimitStore {
  prefix: string;

  constructor(prefix: string = 'rl:') {
    this.prefix = prefix;
  }

  async increment(key: string): Promise<{ totalHits: number; resetTime: Date }> {
    const redisKey = `${this.prefix}${key}`;

    try {
      const multi = redis.multi();
      multi.incr(redisKey);
      multi.ttl(redisKey);

      const results = await multi.exec();

      if (!results) {
        throw new Error('Redis multi exec failed');
      }

      const totalHits = results[0][1] as number;
      const ttl = results[1][1] as number;

      // If this is a new key, set expiration
      if (ttl === -1) {
        await redis.expire(redisKey, 60); // 1 minute window default
      }

      const resetTime = new Date(Date.now() + (ttl > 0 ? ttl * 1000 : 60000));

      return { totalHits, resetTime };
    } catch (error) {
      logger.error({ err: error }, '[RateLimit] Redis error');
      // Fallback: allow request but log the error
      return { totalHits: 1, resetTime: new Date(Date.now() + 60000) };
    }
  }

  async decrement(key: string): Promise<void> {
    const redisKey = `${this.prefix}${key}`;
    try {
      await redis.decr(redisKey);
    } catch (error) {
      logger.error({ err: error }, '[RateLimit] Redis decrement error');
    }
  }

  async resetKey(key: string): Promise<void> {
    const redisKey = `${this.prefix}${key}`;
    try {
      await redis.del(redisKey);
    } catch (error) {
      logger.error({ err: error }, '[RateLimit] Redis reset error');
    }
  }
}

// Standard response for rate limit exceeded
const rateLimitHandler = (_req: Request, res: Response) => {
  res.status(429).json({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
    },
  });
};

// Key generator that includes user ID for authenticated requests
const keyGenerator = (req: Request): string => {
  const userId = (req as any).user?.id;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  return userId ? `user:${userId}` : `ip:${ip}`;
};

// General API rate limiter (100 requests per minute)
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: rateLimitHandler,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/api/health';
  },
  validate: { xForwardedForHeader: false },
});

// Strict rate limiter for auth endpoints (5 requests per 15 minutes)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use IP for auth endpoints (not user ID since they're not authenticated yet)
    return `auth:${req.ip || req.socket.remoteAddress || 'unknown'}`;
  },
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        message: 'Too many authentication attempts. Please try again in 15 minutes.',
      },
    });
  },
  skipSuccessfulRequests: true,
  validate: { xForwardedForHeader: false },
});

// AI endpoint rate limiter (10 requests per minute)
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'AI_RATE_LIMIT_EXCEEDED',
        message: 'Too many AI requests. Please wait a moment before trying again.',
      },
    });
  },
  validate: { xForwardedForHeader: false },
});

// Signup rate limiter (3 signups per hour per IP)
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `signup:${req.ip || req.socket.remoteAddress || 'unknown'}`,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'SIGNUP_RATE_LIMIT_EXCEEDED',
        message: 'Too many signup attempts. Please try again later.',
      },
    });
  },
  validate: { xForwardedForHeader: false },
});

// Admin endpoint rate limiter (50 requests per minute)
export const adminLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: rateLimitHandler,
  validate: { xForwardedForHeader: false },
});

// WebSocket connection limiter (10 connections per minute per IP)
export const wsConnectionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `ws:${req.ip || req.socket.remoteAddress || 'unknown'}`,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'WS_RATE_LIMIT_EXCEEDED',
        message: 'Too many WebSocket connection attempts.',
      },
    });
  },
  validate: { xForwardedForHeader: false },
});

// Custom rate limiter factory for specific routes
export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
    handler: (_req, res) => {
      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: options.message || 'Too many requests. Please try again later.',
        },
      });
    },
    skipSuccessfulRequests: options.skipSuccessfulRequests,
    validate: { xForwardedForHeader: false },
  });
}

export default apiLimiter;
