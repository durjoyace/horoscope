import pino from 'pino';
import pinoHttp from 'pino-http';

// Create base logger
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  base: {
    env: process.env.NODE_ENV || 'development',
  },
  redact: {
    paths: ['password', 'token', 'authorization', 'cookie', 'req.headers.authorization', 'req.headers.cookie'],
    censor: '[REDACTED]',
  },
});

// HTTP request logger middleware
export const httpLogger = pinoHttp({
  logger,
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    if (res.statusCode >= 300) return 'silent'; // Don't log redirects
    return 'info';
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} completed with ${res.statusCode}`;
  },
  customReceivedMessage: (req) => {
    return `${req.method} ${req.url} received`;
  },
  customErrorMessage: (_req, res, err) => {
    return `Request failed with ${res.statusCode}: ${err?.message || 'Unknown error'}`;
  },
  // Skip logging for static assets and health checks
  autoLogging: {
    ignore: (req) => {
      const ignorePaths = ['/health', '/favicon.ico', '/assets', '/_vite'];
      return ignorePaths.some(path => req.url?.startsWith(path));
    },
  },
  // Serialize request/response for structured logging
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      path: req.path,
      query: req.query,
      params: req.params,
      remoteAddress: req.remoteAddress,
      userAgent: req.headers?.['user-agent'],
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: pino.stdSerializers.err,
  },
});

// Create child loggers for different modules
export const createModuleLogger = (moduleName: string) => {
  return logger.child({ module: moduleName });
};

// Pre-configured module loggers
export const authLogger = createModuleLogger('auth');
export const apiLogger = createModuleLogger('api');
export const dbLogger = createModuleLogger('database');
export const wsLogger = createModuleLogger('websocket');
export const jobLogger = createModuleLogger('jobs');
export const aiLogger = createModuleLogger('ai');
export const stripeLogger = createModuleLogger('stripe');

export default logger;
