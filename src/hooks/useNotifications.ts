import { useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';

interface NotificationHookReturn {
  isInitialized: boolean;
  permissionStatus: string;
  playerId: string | null;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  getNotifications: (userTimezone: number) => Promise<any>;
}

export const useNotifications = (): NotificationHookReturn => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('default');
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize notifications on mount
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if notifications are supported
        if (!notificationService.isSupported()) {
          setError('Notifications are not supported in this browser');
          return;
        }

        // Get permission status
        const status = await notificationService.getPermissionStatus();
        setPermissionStatus(status);

        // Get player ID if permission is granted
        if (status === 'granted') {
          const id = await notificationService.getPlayerId();
          setPlayerId(id);
        }

        setIsInitialized(true);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize notifications');
      } finally {
        setIsLoading(false);
      }
    };

    initializeNotifications();
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const granted = await notificationService.requestPermission();
      
      if (granted) {
        setPermissionStatus('granted');
        const id = await notificationService.getPlayerId();
        setPlayerId(id);
      } else {
        setPermissionStatus('denied');
      }

      return granted;
    } catch (err: any) {
      setError(err.message || 'Failed to request permission');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getNotifications = useCallback(async (userTimezone: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await notificationService.getNotifications(userTimezone);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to get notifications');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isInitialized,
    permissionStatus,
    playerId,
    isLoading,
    error,
    requestPermission,
    getNotifications,
  };
};

