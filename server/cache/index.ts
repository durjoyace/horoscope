/**
 * Caching Utilities
 * Redis-based caching layer with fallback
 */

import { redis } from '../config/redis';
import { logger } from '../logger';

// Cache key prefixes
export const CACHE_KEYS = {
  USER: 'cache:user:',
  HOROSCOPE: 'cache:horoscope:',
  BIRTH_CHART: 'cache:birthchart:',
  LEADERBOARD: 'cache:leaderboard:',
  ACHIEVEMENTS: 'cache:achievements:',
  LUNAR_PHASE: 'cache:lunar:',
  AI_CONTEXT: 'cache:ai:',
} as const;

// Default TTLs (in seconds)
export const CACHE_TTL = {
  SHORT: 60,           // 1 minute
  MEDIUM: 300,         // 5 minutes
  LONG: 3600,          // 1 hour
  DAY: 86400,          // 24 hours
  WEEK: 604800,        // 7 days
} as const;

/**
 * Get a cached value
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    if (!data) return null;

    return JSON.parse(data) as T;
  } catch (error) {
    logger.warn({ err: error, key }, 'Cache get failed');
    return null;
  }
}

/**
 * Set a cached value
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<boolean> {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.warn({ err: error, key }, 'Cache set failed');
    return false;
  }
}

/**
 * Delete a cached value
 */
export async function deleteCache(key: string): Promise<boolean> {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    logger.warn({ err: error, key }, 'Cache delete failed');
    return false;
  }
}

/**
 * Delete multiple cached values by pattern
 */
export async function deleteCachePattern(pattern: string): Promise<number> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length === 0) return 0;

    const deleted = await redis.del(...keys);
    return deleted;
  } catch (error) {
    logger.warn({ err: error, pattern }, 'Cache pattern delete failed');
    return 0;
  }
}

/**
 * Get or set cached value (cache-aside pattern)
 */
export async function cacheAside<T>(
  key: string,
  ttl: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  // Try to get from cache
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();

  // Store in cache (fire and forget)
  setCache(key, data, ttl).catch(() => {});

  return data;
}

/**
 * Invalidate user-related caches
 */
export async function invalidateUserCache(userId: number): Promise<void> {
  const patterns = [
    `${CACHE_KEYS.USER}${userId}:*`,
    `${CACHE_KEYS.BIRTH_CHART}${userId}`,
    `${CACHE_KEYS.ACHIEVEMENTS}${userId}:*`,
    `${CACHE_KEYS.AI_CONTEXT}${userId}:*`,
  ];

  await Promise.all(patterns.map((p) => deleteCachePattern(p)));
}

/**
 * Invalidate leaderboard caches
 */
export async function invalidateLeaderboardCache(): Promise<void> {
  await deleteCachePattern(`${CACHE_KEYS.LEADERBOARD}*`);
}

/**
 * Cache decorator for class methods
 */
export function Cached(ttl: number = CACHE_TTL.MEDIUM, keyPrefix: string = 'cache:') {
  return function (
    _target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${keyPrefix}${propertyKey}:${JSON.stringify(args)}`;

      // Try cache first
      const cached = await getCache(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // Call original method
      const result = await originalMethod.apply(this, args);

      // Cache result
      await setCache(cacheKey, result, ttl);

      return result;
    };

    return descriptor;
  };
}

/**
 * Simple in-memory cache for development/fallback
 */
class MemoryCache {
  private cache: Map<string, { value: any; expires: number }> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds: number): void {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now > entry.expires) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

export const memoryCache = new MemoryCache();

export default {
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern,
  cacheAside,
  invalidateUserCache,
  invalidateLeaderboardCache,
  CACHE_KEYS,
  CACHE_TTL,
};
