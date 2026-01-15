import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// New infrastructure imports
import { logger, httpLogger } from "./logger";
import { setupSecurity, requestIdMiddleware, sanitizeMiddleware } from "./middleware/security";
import { apiLimiter } from "./middleware/rate-limit";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { initializeWebSocket } from "./websocket/socket";
import { initializeWorkers, shutdownWorkers } from "./jobs/queues";
import { initializeScheduledJobs } from "./jobs/scheduler";
import { testRedisConnection } from "./config/redis";

const app = express();

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1);

// Request ID for tracking
app.use(requestIdMiddleware);

// Security middleware (Helmet, CORS)
setupSecurity(app);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Sanitize request bodies
app.use(sanitizeMiddleware);

// HTTP request logging (using Pino)
app.use(httpLogger);

// Rate limiting for API routes
app.use('/api', apiLimiter);

// Health check endpoint (before auth)
app.get('/health', async (_req: Request, res: Response) => {
  const redisConnected = await testRedisConnection();

  res.status(redisConnected ? 200 : 503).json({
    status: redisConnected ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      redis: redisConnected ? 'connected' : 'disconnected',
    },
  });
});

// Detailed health check for admin
app.get('/api/health/detailed', async (_req: Request, res: Response) => {
  const redisConnected = await testRedisConnection();

  res.json({
    status: redisConnected ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      redis: redisConnected ? 'connected' : 'disconnected',
    },
  });
});

(async () => {
  try {
    // Test Redis connection
    const redisConnected = await testRedisConnection();
    if (redisConnected) {
      logger.info('Redis connected successfully');

      // Initialize job workers and scheduler
      initializeWorkers();
      await initializeScheduledJobs();
    } else {
      logger.warn('Redis not available - running without caching and job queues');
    }

    // Register all routes
    const server = await registerRoutes(app);

    // Initialize WebSocket server
    const io = initializeWebSocket(server);
    logger.info('WebSocket server initialized');

    // 404 handler for API routes
    app.use('/api/*', notFoundHandler);

    // Global error handler
    app.use(errorHandler);

    // Setup Vite in development, serve static in production
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start server on PORT (Railway provides this) or default to 5000
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      logger.info(`Server running on port ${port}`);
      log(`serving on port ${port}`);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);

      // Close WebSocket connections
      io.close();

      // Shutdown workers
      await shutdownWorkers();

      // Close HTTP server
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force exit after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
})();
