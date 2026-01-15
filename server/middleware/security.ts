import helmet from 'helmet';
import cors from 'cors';
import type { Express, Request, Response, NextFunction } from 'express';

// Security headers middleware using Helmet
export function setupSecurity(app: Express): void {
  // Helmet configuration
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'", // Required for Vite in dev
            'js.stripe.com',
            'https://accounts.google.com',
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'fonts.googleapis.com',
          ],
          fontSrc: [
            "'self'",
            'fonts.gstatic.com',
            'data:',
          ],
          imgSrc: [
            "'self'",
            'data:',
            'blob:',
            '*.stripe.com',
            'https://lh3.googleusercontent.com',
            'https://avatars.githubusercontent.com',
          ],
          connectSrc: [
            "'self'",
            'api.stripe.com',
            'wss://*', // WebSocket connections
            'ws://*',
          ],
          frameSrc: [
            'js.stripe.com',
            'https://accounts.google.com',
          ],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
        },
      },
      crossOriginEmbedderPolicy: false, // Disable for external resources
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xContentTypeOptions: true,
      xDnsPrefetchControl: { allow: true },
      xDownloadOptions: true,
      xFrameOptions: { action: 'deny' },
      xPermittedCrossDomainPolicies: { permittedPolicies: 'none' },
      xXssProtection: true,
    })
  );

  // CORS configuration
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5000',
    'http://localhost:3000',
    'http://127.0.0.1:5000',
  ];

  // In development, allow the Replit domain
  if (process.env.REPLIT_DOMAIN) {
    allowedOrigins.push(`https://${process.env.REPLIT_DOMAIN}`);
  }

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Request-ID',
        'X-Requested-With',
      ],
      exposedHeaders: [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset',
      ],
      maxAge: 86400, // 24 hours
    })
  );

  // Trust proxy for accurate IP addresses behind reverse proxies
  app.set('trust proxy', 1);
}

// Request ID middleware for tracking
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const requestId = req.headers['x-request-id'] as string || generateRequestId();
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
}

// Generate a unique request ID
function generateRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

// Sanitize request body to prevent XSS
export function sanitizeMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
}

// Recursively sanitize an object
function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'string' ? sanitizeString(item) :
        typeof item === 'object' && item !== null ? sanitizeObject(item as Record<string, unknown>) :
        item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

// Basic string sanitization (escape HTML entities)
function sanitizeString(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export default setupSecurity;
