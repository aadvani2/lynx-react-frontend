import { useCallback, useEffect, useMemo, useRef } from 'react';
import { customerService } from '../services/customerServices/customerService';
import { useRequestDetailsStore } from '../store/requestDetailsStore';

export const useRequestDetails = (requestId: number, requestType: string, currentPage: number) => {
  const {
    requestDetails,
    loading,
    error,
    setRequestDetails,
    setLoading,
    setError,
    setRequestParams,
    reset
  } = useRequestDetailsStore();

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPercentageRef = useRef<number>(0);

  const timezoneHours = useMemo(() => {
    const tzOffsetMinutes = new Date().getTimezoneOffset();
    return -tzOffsetMinutes / 60;
  }, []);

  const fetchRequestDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        id: requestId,
        type: requestType,
        user_timezone: timezoneHours,
        currentPage: currentPage,
        filter_status: false
      };

      const response = await customerService.getRequestDetails(payload);
      
      setRequestDetails(response);
      
    } catch (error) {
      console.error('Failed to fetch request details:', error);
      setError(error instanceof Error ? error.message : 'Failed to load request details');
    } finally {
      setLoading(false);
    }
  }, [requestId, requestType, currentPage, timezoneHours, setLoading, setError, setRequestDetails]);

  const refreshProgress = useCallback(async () => {
    try {
      const payload = {
        id: requestId,
        percentage: lastPercentageRef.current
      };

      const response = await customerService.refreshProgress(payload);
      
      if (response.success) {
        setRequestDetails(response);
        lastPercentageRef.current = response.progressTime || 0;
      }
      
    } catch (error) {
      console.error('Failed to refresh progress:', error);
    }
  }, [requestId, setRequestDetails]);

  // Effects
  useEffect(() => {
    setRequestParams(requestId, requestType, currentPage);
    fetchRequestDetails();
  }, [requestId, requestType, currentPage, setRequestParams, fetchRequestDetails]);

  // Progress refresh interval for pending requests
  useEffect(() => {
    if (requestDetails?.request_status === 'pending' && requestId) {
      // Start progress refresh interval (every 5 seconds as per Laravel)
      // refreshIntervalRef.current = setInterval(() => {
      //   console.log('Refreshing progress view for request ID:', requestId);
      //   refreshProgress();
      // }, 5000);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
          refreshIntervalRef.current = null;
        }
      };
    } else {
      // Clear interval if request is not pending
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    }
  }, [requestDetails?.request_status, requestId, refreshProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      reset();
    };
  }, [reset]);

  return {
    // State
    requestDetails,
    loading,
    error,
    
    // Actions
    fetchRequestDetails,
    refreshProgress,
    refetch: fetchRequestDetails
  };
}; 