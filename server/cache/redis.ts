/**
 * Redis Cache Utilities
 * Provides caching functionality using Redis
 */

import { redis } from '../config/redis';
import { logger } from '../logger';

// Default TTL (time to live) in seconds
const DEFAULT_TTL = 3600; // 1 hour

/**
 * Set a value in the cache
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number = DEFAULT_TTL
): Promise<void> {
  try {
    const serialized = JSON.stringify(value);
    await redis.setex(key, ttlSeconds, serialized);
  } catch (error) {
    logger.error({ err: error, key }, 'Failed to set cache');
    // Don't throw - cache failures shouldn't break the app
  }
}

/**
 * Get a value from the cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    logger.error({ err: error, key }, 'Failed to get cache');
    return null;
  }
}

/**
 * Delete a value from the cache
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    logger.error({ err: error, key }, 'Failed to delete cache');
  }
}

/**
 * Delete all keys matching a pattern
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    logger.error({ err: error, pattern }, 'Failed to delete cache pattern');
  }
}

/**
 * Check if a key exists in the cache
 */
export async function cacheExists(key: string): Promise<boolean> {
  try {
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error({ err: error, key }, 'Failed to check cache exists');
    return false;
  }
}

/**
 * Set cache with automatic expiration
 */
export async function setCacheWithExpiry<T>(
  key: string,
  value: T,
  expiryDate: Date
): Promise<void> {
  try {
    const ttlSeconds = Math.max(0, Math.floor((expiryDate.getTime() - Date.now()) / 1000));
    if (ttlSeconds > 0) {
      await setCache(key, value, ttlSeconds);
    }
  } catch (error) {
    logger.error({ err: error, key }, 'Failed to set cache with expiry');
  }
}

/**
 * Increment a counter in the cache
 */
export async function incrementCache(key: string, ttlSeconds?: number): Promise<number> {
  try {
    const value = await redis.incr(key);
    if (ttlSeconds && value === 1) {
      await redis.expire(key, ttlSeconds);
    }
    return value;
  } catch (error) {
    logger.error({ err: error, key }, 'Failed to increment cache');
    return 0;
  }
}

/**
 * Get or set cache (cache-aside pattern)
 */
export async function getOrSetCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = DEFAULT_TTL
): Promise<T> {
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  const value = await fetchFn();
  await setCache(key, value, ttlSeconds);
  return value;
}

export default {
  setCache,
  getCache,
  deleteCache,
  deleteCachePattern,
  cacheExists,
  setCacheWithExpiry,
  incrementCache,
  getOrSetCache,
};
