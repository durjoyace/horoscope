/**
 * Health Check Routes
 * Endpoints for monitoring application health
 */

import { Router, Request, Response } from 'express';
import { db } from '../db';
import { redis } from '../config/redis';
import { sql } from 'drizzle-orm';
import { logger } from '../logger';

const router = Router();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    database: ComponentStatus;
    redis: ComponentStatus;
    memory: ComponentStatus;
  };
}

interface ComponentStatus {
  status: 'up' | 'down' | 'degraded';
  latency?: number;
  message?: string;
}

/**
 * Basic health check - for load balancers
 * GET /health
 */
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Detailed health check - for monitoring
 * GET /health/detailed
 */
router.get('/detailed', async (_req: Request, res: Response) => {
  const startTime = Date.now();

  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      memory: checkMemory(),
    },
  };

  // Determine overall status
  const statuses = Object.values(health.checks).map((c) => c.status);
  if (statuses.includes('down')) {
    health.status = 'unhealthy';
  } else if (statuses.includes('degraded')) {
    health.status = 'degraded';
  }

  const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;

  logger.info({
    healthStatus: health.status,
    latency: Date.now() - startTime
  }, 'Health check completed');

  res.status(statusCode).json(health);
});

/**
 * Readiness probe - for Kubernetes
 * GET /health/ready
 */
router.get('/ready', async (_req: Request, res: Response) => {
  try {
    // Check critical dependencies
    const dbStatus = await checkDatabase();

    if (dbStatus.status === 'down') {
      return res.status(503).json({
        ready: false,
        reason: 'Database unavailable',
      });
    }

    res.status(200).json({ ready: true });
  } catch (error) {
    logger.error({ err: error }, 'Readiness check failed');
    res.status(503).json({ ready: false, reason: 'Internal error' });
  }
});

/**
 * Liveness probe - for Kubernetes
 * GET /health/live
 */
router.get('/live', (_req: Request, res: Response) => {
  // Just check if the process is alive
  res.status(200).json({ alive: true });
});

// Check database connectivity
async function checkDatabase(): Promise<ComponentStatus> {
  const start = Date.now();

  try {
    await db.execute(sql`SELECT 1`);
    return {
      status: 'up',
      latency: Date.now() - start,
    };
  } catch (error) {
    logger.error({ err: error }, 'Database health check failed');
    return {
      status: 'down',
      latency: Date.now() - start,
      message: 'Database connection failed',
    };
  }
}

// Check Redis connectivity
async function checkRedis(): Promise<ComponentStatus> {
  const start = Date.now();

  try {
    await redis.ping();
    return {
      status: 'up',
      latency: Date.now() - start,
    };
  } catch (error) {
    logger.warn({ err: error }, 'Redis health check failed');
    // Redis is non-critical, mark as degraded
    return {
      status: 'degraded',
      latency: Date.now() - start,
      message: 'Redis connection failed (caching disabled)',
    };
  }
}

// Check memory usage
function checkMemory(): ComponentStatus {
  const used = process.memoryUsage();
  const heapUsedMB = Math.round(used.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(used.heapTotal / 1024 / 1024);
  const heapPercent = (used.heapUsed / used.heapTotal) * 100;

  let status: ComponentStatus['status'] = 'up';
  let message: string | undefined;

  if (heapPercent > 90) {
    status = 'degraded';
    message = `High memory usage: ${heapPercent.toFixed(1)}%`;
  }

  return {
    status,
    message: message || `${heapUsedMB}MB / ${heapTotalMB}MB (${heapPercent.toFixed(1)}%)`,
  };
}

export default router;
