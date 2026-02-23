/**
 * Request Deduplication and Caching Utility
 * 
 * This utility provides:
 * 1. Request deduplication - prevents multiple identical API calls from executing simultaneously
 * 2. Response caching with expiration - caches API responses for a configurable duration
 * 3. Automatic cache invalidation - removes expired entries
 * 
 * Usage Examples:
 * 
 * 1. Basic usage with default 5-minute cache:
 * ```typescript
 * const cachedGetServices = withRequestCache(
 *   async () => api.get('/services'),
 *   { expireDuration: 5 * 60 * 1000 } // 5 minutes
 * );
 * ```
 * 
 * 2. Apply to existing service method:
 * ```typescript
 * // In your service file
 * const getServicesImpl = async (): Promise<ServiceResponse> => {
 *   const response = await api.get(GENERAL_ENDPOINTS.PUBLIC_SERVICES);
 *   return response.data;
 * };
 * 
 * export const servicesService = {
 *   getServices: withRequestCache(getServicesImpl, {
 *     expireDuration: 5 * 60 * 1000 // 5 minutes
 *   }),
 * };
 * ```
 * 
 * 3. With custom cache key for parameterized requests:
 * ```typescript
 * const getServiceById = withRequestCache(
 *   async (id: string) => api.get(`/services/${id}`),
 *   {
 *     expireDuration: 10 * 60 * 1000, // 10 minutes
 *     getCacheKey: (id: string) => `service:${id}` // Custom key
 *   }
 * );
 * ```
 * 
 * Benefits:
 * - Prevents duplicate API calls when multiple components call the same endpoint
 * - Reduces server load and improves performance
 * - Automatically handles cache expiration
 * - Works seamlessly with React 18 StrictMode
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  promise?: Promise<T>;
}

interface RequestCacheOptions {
  /**
   * Cache expiration duration in milliseconds
   * Default: 5 minutes (300000ms)
   */
  expireDuration?: number;
  
  /**
   * Custom cache key generator function
   * If not provided, uses JSON.stringify of arguments
   */
  getCacheKey?: (...args: unknown[]) => string;
  
  /**
   * Enable stale-while-revalidate pattern
   * When true: returns stale cache immediately, then fetches fresh data in background
   * When false: waits for fresh data if cache is expired (default)
   * 
   * Performance benefit: User sees data instantly, fresh data loads in background
   * Best for: Data that changes infrequently but should feel instant
   */
  staleWhileRevalidate?: boolean;
  
  /**
   * Stale threshold - how long data can be stale before requiring refresh
   * Only used when staleWhileRevalidate is true
   * Default: same as expireDuration
   */
  staleThreshold?: number;
}

/**
 * Creates a unique cache key from function arguments
 */
function defaultGetCacheKey(...args: unknown[]): string {
  try {
    return JSON.stringify(args);
  } catch {
    // Fallback to string representation if JSON.stringify fails
    return args.map(arg => String(arg)).join('|');
  }
}

/**
 * Wraps an async function with request deduplication and caching
 * 
 * @param fn - The async function to wrap
 * @param options - Configuration options
 * @returns Wrapped function with caching and deduplication
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withRequestCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: RequestCacheOptions = {}
): T {
  const {
    expireDuration = 5 * 60 * 1000, // Default: 5 minutes
    getCacheKey = defaultGetCacheKey,
    staleWhileRevalidate = false, // Default: wait for fresh data
    staleThreshold,
  } = options;
  
  // If staleThreshold not provided, use expireDuration
  const maxStaleAge = staleThreshold ?? expireDuration;

  // Cache storage: key -> CacheEntry
  const cache = new Map<string, CacheEntry<ReturnType<T>>>();

  // Cleanup expired entries periodically (every 1 minute)
  // Using void to indicate we intentionally don't store the interval ID
  void setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
      // Remove expired entries (but keep in-flight promises)
      if (!entry.promise && now - entry.timestamp > expireDuration) {
        cache.delete(key);
      }
    }
  }, 60 * 1000); // Run cleanup every minute

  // Return wrapped function
  return ((...args: Parameters<T>): Promise<ReturnType<T>> => {
    const cacheKey = getCacheKey(...args);
    const now = Date.now();
    
    // Check if we have a cached entry
    const cachedEntry = cache.get(cacheKey);
    const hasCachedData = cachedEntry && !cachedEntry.promise;
    const cachedAge = hasCachedData ? now - cachedEntry.timestamp : Infinity;
    const isFresh = cachedAge < expireDuration;
    const isStale = cachedAge >= expireDuration && cachedAge < maxStaleAge;
    
    // If we have valid cached data (not expired), return it immediately
    if (hasCachedData && isFresh) {
      return Promise.resolve(cachedEntry.data);
    }
    
    // Stale-while-revalidate pattern: return stale data immediately, fetch fresh in background
    if (staleWhileRevalidate && hasCachedData && isStale) {
      // Return stale data immediately
      const staleData = cachedEntry.data;
      
      // Fetch fresh data in background (if not already fetching)
      if (!cachedEntry.promise) {
        const refreshPromise = fn(...args)
          .then((result: ReturnType<T>) => {
            // Update cache with fresh data
            const entry = cache.get(cacheKey);
            if (entry) {
              entry.data = result;
              entry.timestamp = Date.now();
              delete entry.promise;
            } else {
              cache.set(cacheKey, {
                data: result,
                timestamp: Date.now(),
              });
            }
            return result;
          })
          .catch((error) => {
            // On error, keep stale data but remove promise so it can retry
            const entry = cache.get(cacheKey);
            if (entry) {
              delete entry.promise;
            }
            // Don't throw - we already returned stale data
            console.warn('Background refresh failed, using stale data:', error);
          });
        
        // Store refresh promise for deduplication
        if (cachedEntry) {
          cachedEntry.promise = refreshPromise;
        }
      }
      
      return Promise.resolve(staleData);
    }
    
    // Cache expired beyond stale threshold, or no cache - need fresh data
    if (hasCachedData && cachedAge >= maxStaleAge) {
      cache.delete(cacheKey);
    }
    
    // If there's an in-flight request (deduplication), return the same promise
    if (cachedEntry?.promise) {
      return cachedEntry.promise;
    }
    
    // Create new request
    const requestPromise = fn(...args)
      .then((result: ReturnType<T>) => {
        // Store result in cache
        const entry = cache.get(cacheKey);
        if (entry) {
          entry.data = result;
          entry.timestamp = Date.now();
          delete entry.promise; // Remove promise reference
        } else {
          cache.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
          });
        }
        return result;
      })
      .catch((error) => {
        // On error, remove the entry so it can be retried
        cache.delete(cacheKey);
        throw error;
      });
    
    // Store the promise for deduplication
    cache.set(cacheKey, {
      data: undefined as ReturnType<T>, // Will be set when promise resolves
      timestamp: now,
      promise: requestPromise,
    });
    
    return requestPromise;
  }) as T;
}

/**
 * Clear the cache for a specific function wrapper
 * Note: This requires storing cache references, which is not implemented in the current design.
 * For now, use clearAllCaches() to clear all caches.
 */
export function clearAllCaches(): void {
  // This is a placeholder - in a more advanced implementation,
  // we could track all cache instances and clear them
  // For now, individual caches are scoped to the wrapper function
  console.warn('clearAllCaches: Cache clearing is scoped to individual wrapper functions');
}

/**
 * Create a cache key generator that includes a prefix
 * Useful for namespacing different service methods
 */
export function createKeyGenerator(prefix: string) {
  return (...args: unknown[]): string => {
    const baseKey = defaultGetCacheKey(...args);
    return `${prefix}:${baseKey}`;
  };
}

