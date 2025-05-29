/**
 * Redis utility for caching and performance optimization
 * This module provides a Redis client and caching utilities
 */

import { env } from '@/config/env';
import { createClient, RedisClientType } from 'redis';

// Redis client instance
let redisClient: RedisClientType | null = null;

// Redis configuration
const REDIS_CONFIG = {
  url: env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    connectTimeout: 5000,
    lazyConnect: true,
  },
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
};

// Cache TTL configurations (in seconds)
export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

/**
 * Initialize Redis client
 */
export async function initRedis(): Promise<RedisClientType | null> {
  try {
    if (redisClient) {
      return redisClient;
    }

    redisClient = createClient(REDIS_CONFIG);

    redisClient.on('error', err => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis client connected');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis client ready');
    });

    redisClient.on('end', () => {
      console.log('❌ Redis client disconnected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    return null;
  }
}

/**
 * Get Redis client instance
 */
export function getRedisClient(): RedisClientType | null {
  return redisClient;
}

/**
 * Close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

/**
 * Cache utilities
 */
export class CacheManager {
  private client: RedisClientType | null;

  constructor() {
    this.client = getRedisClient();
  }

  /**
   * Set a value in cache with TTL
   */
  async set(
    key: string,
    value: any,
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<boolean> {
    try {
      if (!this.client) return false;

      const serializedValue = JSON.stringify(value);
      await this.client.setEx(key, ttl, serializedValue);
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!this.client) return null;

      const value = await this.client.get(key);
      if (!value) return null;

      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Delete a key from cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      if (!this.client) return false;

      const result = await this.client.del(key);
      return result > 0;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Check if a key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    try {
      if (!this.client) return false;

      const result = await this.client.exists(key);
      return result > 0;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  /**
   * Set TTL for an existing key
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      if (!this.client) return false;

      const result = await this.client.expire(key, ttl);
      return result;
    } catch (error) {
      console.error('Cache expire error:', error);
      return false;
    }
  }

  /**
   * Get TTL for a key
   */
  async ttl(key: string): Promise<number> {
    try {
      if (!this.client) return -1;

      return await this.client.ttl(key);
    } catch (error) {
      console.error('Cache TTL error:', error);
      return -1;
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<boolean> {
    try {
      if (!this.client) return false;

      await this.client.flushAll();
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<any> {
    try {
      if (!this.client) return null;

      const info = await this.client.info('memory');
      const keyspace = await this.client.info('keyspace');

      return {
        memory: info,
        keyspace: keyspace,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return null;
    }
  }

  /**
   * Increment a counter
   */
  async increment(key: string, amount: number = 1): Promise<number> {
    try {
      if (!this.client) return 0;

      return await this.client.incrBy(key, amount);
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }

  /**
   * Set multiple values at once
   */
  async mset(keyValuePairs: Record<string, any>): Promise<boolean> {
    try {
      if (!this.client) return false;

      const serializedPairs: Record<string, string> = {};
      for (const [key, value] of Object.entries(keyValuePairs)) {
        serializedPairs[key] = JSON.stringify(value);
      }

      await this.client.mSet(serializedPairs);
      return true;
    } catch (error) {
      console.error('Cache mset error:', error);
      return false;
    }
  }

  /**
   * Get multiple values at once
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      if (!this.client) return keys.map(() => null);

      const values = await this.client.mGet(keys);
      return values.map(value => {
        if (!value) return null;
        try {
          return JSON.parse(value) as T;
        } catch {
          return null;
        }
      });
    } catch (error) {
      console.error('Cache mget error:', error);
      return keys.map(() => null);
    }
  }
}

// Export singleton instance
export const cache = new CacheManager();

/**
 * Cache decorator for functions
 */
export function cached(ttl: number = CACHE_TTL.MEDIUM) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;

      // Try to get from cache first
      const cachedResult = await cache.get(cacheKey);
      if (cachedResult !== null) {
        return cachedResult;
      }

      // Execute original method
      const result = await method.apply(this, args);

      // Cache the result
      await cache.set(cacheKey, result, ttl);

      return result;
    };
  };
}
