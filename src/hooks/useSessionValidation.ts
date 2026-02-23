import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { customerService } from '../services/customerServices/customerService';
import { partnerService } from '../services/partnerService/partnerService';
import { getUserTimezoneOffset } from '../utils/timezoneHelper';
import { getCached, setCached, clearCached, CACHE_KEYS } from '../utils/bootstrapCache';

/**
 * Session Validation Hook
 * 
 * Periodically validates the user's session by making a lightweight API call.
 * If the session has been invalidated (e.g., logout from all devices),
 * the API will return 401, which triggers the existing 401 handler to log the user out.
 * 
 * This ensures that when a user logs out from another device (mobile app),
 * the web app will detect it within the validation interval and automatically log out.
 */
export const useSessionValidation = () => {
  const { isAuthenticated, user, token } = useAuthStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only run if user is authenticated
    if (!isAuthenticated || !user || !token) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Validation function - makes a lightweight API call only when cache is expired
    const validateSession = async () => {
      try {
        const userTimezone = getUserTimezoneOffset();
        
        // Make a lightweight API call based on user type
        // This will trigger 401 if session is invalid
        // Only call API if cache is expired (every 5 minutes) to reduce API calls
        switch (user.user_type) {
          case 'customer': {
            const cacheKey = CACHE_KEYS.customerSettings(userTimezone);
            const cached = getCached(cacheKey);
            
            // Only make API call if cache is expired or doesn't exist
            // getCached returns null if cache is expired (5 minutes TTL)
            if (!cached) {
              // Cache expired or doesn't exist - make API call to validate session and refresh cache
              const response = await customerService.getSettings(userTimezone);
              setCached(cacheKey, response);
            }
            // If cache is fresh, skip API call - session is still valid (cache wouldn't exist if 401 occurred)
            break;
          }
          case 'provider': {
            const cacheKey = CACHE_KEYS.partnerSettings(userTimezone);
            const cached = getCached(cacheKey);
            
            // Only make API call if cache is expired or doesn't exist
            // getCached returns null if cache is expired (5 minutes TTL)
            if (!cached) {
              // Cache expired or doesn't exist - make API call to validate session and refresh cache
              const response = await partnerService.getSettingsInfo(userTimezone);
              setCached(cacheKey, response);
            }
            // If cache is fresh, skip API call - session is still valid (cache wouldn't exist if 401 occurred)
            break;
          }
          case 'employee':
            // For employees, we can use a simple profile check if available
            // If not available, we can skip validation for employees
            // or use a different endpoint
            break;
          default:
            break;
        }
      } catch (error: any) {
        // Error is already handled by the 401 interceptor in api.ts
        // If it's a 401, the user will be automatically logged out
        // We just need to catch it here to prevent unhandled promise rejection
        if (error?.response?.status === 401 || error?.status === 401) {
          // 401 handler in api.ts will handle logout and redirect
          // Clear cache on 401 since session is invalid
          const userTimezone = getUserTimezoneOffset();
          if (user?.user_type === 'customer') {
            clearCached(CACHE_KEYS.customerSettings(userTimezone));
          } else if (user?.user_type === 'provider') {
            clearCached(CACHE_KEYS.partnerSettings(userTimezone));
          }
          return;
        }
        // For other errors, just log (don't interrupt user experience)
        console.debug('Session validation check failed (non-401):', error);
      }
    };

    // Run validation immediately on mount (will check cache expiration)
    validateSession();

    // Set up periodic validation (check every 30 seconds, but only call API when cache expires)
    // Cache expires every 5 minutes, so API calls will happen every 5 minutes max
    // This reduces API calls from 2/minute to 1/5minutes (12x reduction)
    intervalRef.current = setInterval(validateSession, 30000); // Check every 30 seconds

    // Cleanup on unmount or when auth state changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, user, token]);
};

