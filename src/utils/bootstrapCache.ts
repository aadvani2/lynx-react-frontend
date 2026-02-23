/**
 * Bootstrap Data Cache
 * Caches settings, profile, and timezone data to prevent unnecessary refetches
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Get cached data if available and not expired
 */
export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const age = Date.now() - entry.timestamp;
  if (age > CACHE_TTL) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

/**
 * Set cached data
 */
export function setCached<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Clear cached data for a specific key
 */
export function clearCached(key: string): void {
  cache.delete(key);
}

/**
 * Clear all cached data
 */
export function clearAllCached(): void {
  cache.clear();
}

/**
 * Cache keys
 */
export const CACHE_KEYS = {
  customerSettings: (timezone: number) => `customer:settings:${timezone}`,
  partnerSettings: (timezone: number) => `partner:settings:${timezone}`,
  customerProfile: (timezone: number, page: number) => `customer:profile:${timezone}:${page}`,
  customerSubscription: (timezone: number) => `customer:subscription:${timezone}`,
  partnerDashboard: () => `partner:dashboard`,
} as const;

