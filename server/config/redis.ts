import Redis from 'ioredis';

// Check if Redis URL is properly configured
const redisUrl = process.env.REDIS_URL;
const isRedisConfigured = redisUrl && !redisUrl.includes('host:') && redisUrl.length > 10;

// Create a mock Redis client for when Redis is not available
class MockRedis {
  async get() { return null; }
  async set() { return 'OK'; }
  async setex() { return 'OK'; }
  async del() { return 0; }
  async keys() { return []; }
  async incr() { return 1; }
  async decr() { return 0; }
  async expire() { return 1; }
  async ttl() { return -1; }
  async ping() { throw new Error('Redis not configured'); }
  multi() { return { exec: async () => [[null, 1], [null, -1]] }; }
  duplicate() { return this; }
  on() { return this; }
  quit() { return Promise.resolve(); }
}

// Create Redis client with proper error handling
let redis: Redis | MockRedis;
let redisPub: Redis | MockRedis;
let redisSub: Redis | MockRedis;

if (isRedisConfigured) {
  const redisOptions = {
    maxRetriesPerRequest: null, // Disable retry limit to prevent crashes
    retryStrategy(times: number) {
      if (times > 10) {
        console.log('[Redis] Max retries reached, stopping reconnection');
        return null; // Stop retrying
      }
      const delay = Math.min(times * 100, 3000);
      return delay;
    },
    lazyConnect: true,
    enableOfflineQueue: false,
  };

  redis = new Redis(redisUrl!, redisOptions);

  // Only create pub/sub connections if main connection succeeds
  redisPub = redis.duplicate();
  redisSub = redis.duplicate();

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

  // Try to connect
  redis.connect().catch((err) => {
    console.error('[Redis] Initial connection failed:', err.message);
  });
} else {
  console.log('[Redis] Not configured or invalid URL - using mock client');
  redis = new MockRedis() as any;
  redisPub = new MockRedis() as any;
  redisSub = new MockRedis() as any;
}

export { redis, redisPub, redisSub };

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
      return JSON.parse(cached as string) as T;
    }
    return null;
  } catch (error) {
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
    // Silently fail - caching is optional
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    // Silently fail
  }
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    // Silently fail
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
