import Redis from 'ioredis';

// Redis connection configuration
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Create Redis client with retry strategy
export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  lazyConnect: true,
});

// Duplicate client for pub/sub (Socket.IO adapter)
export const redisPub = redis.duplicate();
export const redisSub = redis.duplicate();

// Connection event handlers
redis.on('connect', () => {
  console.log('[Redis] Connected successfully');
});

redis.on('error', (err) => {
  console.error('[Redis] Connection error:', err.message);
});

redis.on('close', () => {
  console.log('[Redis] Connection closed');
});

// Cache key patterns
export const CACHE_KEYS = {
  // User data
  user: (id: number) => `user:${id}`,
  userSession: (sessionId: string) => `session:${sessionId}`,
  userPresence: (id: number) => `presence:${id}`,

  // Horoscopes
  horoscope: (sign: string, date: string) => `horoscope:${sign}:${date}`,
  horoscopeBatch: (date: string) => `horoscope:batch:${date}`,

  // Birth charts
  birthChart: (userId: number) => `birth_chart:${userId}`,

  // Ephemeris
  ephemeris: (date: string) => `ephemeris:${date}`,
  lunarPhase: (date: string) => `lunar:${date}`,

  // Gamification
  leaderboard: (type: string) => `leaderboard:${type}`,
  userXP: (id: number) => `user:${id}:xp`,

  // Rate limiting
  rateLimit: (key: string) => `rate:${key}`,

  // AI context
  aiContext: (userId: number) => `ai:context:${userId}`,
};

// Cache TTLs in seconds
export const CACHE_TTLS = {
  user: 300,           // 5 minutes
  horoscope: 86400,    // 24 hours
  birthChart: 604800,  // 7 days
  ephemeris: 86400,    // 24 hours
  lunarPhase: 86400,   // 24 hours
  leaderboard: 300,    // 5 minutes
  presence: 300,       // 5 minutes
  aiContext: 3600,     // 1 hour
};

// Cache utility functions
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
    return null;
  } catch (error) {
    console.error('[Redis] Get cache error:', error);
    return null;
  }
}

export async function setCache<T>(key: string, value: T, ttl?: number): Promise<void> {
  try {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await redis.setex(key, ttl, serialized);
    } else {
      await redis.set(key, serialized);
    }
  } catch (error) {
    console.error('[Redis] Set cache error:', error);
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('[Redis] Delete cache error:', error);
  }
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('[Redis] Delete pattern error:', error);
  }
}

// Cache-aside pattern helper
export async function getWithCache<T>(
  key: string,
  ttl: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  const data = await fetchFn();
  await setCache(key, data, ttl);
  return data;
}

// Test Redis connection
export async function testRedisConnection(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.error('[Redis] Connection test failed:', error);
    return false;
  }
}

export default redis;
