import { useState, useCallback, useMemo } from 'react';
import { customerService } from '../services/customerServices/customerService';
import type { ScheduleHistoryResponse } from '../types/scheduleHistory';

export const useScheduleRequestHistory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<ScheduleHistoryResponse | null>(null);

  const timezoneHours = useMemo(() => {
    const tzOffsetMinutes = new Date().getTimezoneOffset();
    return -tzOffsetMinutes / 60;
  }, []);

  const fetchScheduleRequestHistory = useCallback(async (requestId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        request_id: requestId,
        user_timezone: timezoneHours
      };

      const response = await customerService.getScheduleRequestHistory(payload);
      
      setHistoryData(response as ScheduleHistoryResponse);
      return response;
      
    } catch (error) {
      console.error('❌ Failed to fetch schedule request history:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load schedule request history';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [timezoneHours]);

  const reset = useCallback(() => {
    setHistoryData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    historyData,
    fetchScheduleRequestHistory,
    reset
  };
};
