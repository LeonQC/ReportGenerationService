import type { Redis } from "ioredis";

/**
 * Tries to fetch a value from Redis and parses it.
 */
export async function getCached<T>(
  key: string,
  redis: Redis
): Promise<T | null> {
  const cached = await redis.get(key);
  if (!cached) return null;

  try {
    return JSON.parse(cached) as T;
  } catch {
    return null;
  }
}

/**
 * Stores a value in Redis with an optional TTL (in seconds).
 */
export async function setCached<T>(
  key: string,
  data: T,
  redis: Redis,
  ttlSeconds = 60
) {
  await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
}
