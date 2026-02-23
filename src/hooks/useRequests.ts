import { useCallback, useEffect, useMemo } from 'react';
import { customerService } from '../services/customerServices/customerService';
import { useRequestsStore } from '../store/requestsStore';
import { extractRequestsData } from '../utils/requestsUtils';

export const useRequests = (requestType: string) => {
  const {
    requests,
    selectedFilter,
    timeFilter,
    page,
    title,
    total,
    perPage,
    lastPage,
    loading,
    error,
    requestCounts,
    setRequests,
    setSelectedFilter,
    setTimeFilter,
    setPage,
    setTitle,
    setTotal,
    setPerPage,
    setLastPage,
    setLoading,
    setError,
    setRequestCounts,
    reset
  } = useRequestsStore();

  const timezoneHours = useMemo(() => {
    const tzOffsetMinutes = new Date().getTimezoneOffset();
    return -tzOffsetMinutes / 60;
  }, []);

  const fetchByFilter = useCallback(async (filterKey: string, filterValue: string, pageNumber: number) => {
    const payload = {
      employee_id: null as number | null,
      user_timezone: timezoneHours,
      page: pageNumber,
      filter: filterValue || undefined,
    };

    switch (filterKey) {
      case 'accepted':
        return customerService.getAcceptedRequests(payload);
      case 'on hold':
        return customerService.getOnHoldRequests(payload);
      case 'in process':
        return customerService.getInProcessRequests(payload);
      case 'completed':
        return customerService.getCompletedRequests(payload);
      case 'cancelled':
        return customerService.getCancelledRequests(payload);
      case 'pending':
        return customerService.getPendingRequests(payload);
      case 'all':
      default:
        return customerService.getAllRequests(payload);
    }
  }, [timezoneHours]);

  // Removed fetchCounts

  const loadRequests = useCallback(async (filterKey: string, filterValue: string, pageNumber: number) => {
    try {
      setLoading(true);
      setError(null);
      let list = [] as ReturnType<typeof extractRequestsData>['list'];
      let meta = { title: undefined as string | undefined, currentPage: 1, total: 0, perPage: 10, lastPage: 1 };

      try {
        const res = await fetchByFilter(filterKey, filterValue, pageNumber);
        const raw = (res && (res as unknown as { data?: unknown }).data) ?? res;
        const extracted = extractRequestsData(raw);
        list = extracted.list;
        meta = extracted.meta as any;

        // Check if statusCounts is available in the response
        if ((res as any)?.data && (res as any).data.statusCounts) {
          const statusCounts = (res as any).data.statusCounts;
          Object.entries(statusCounts).forEach(([key, value]) => {
            const lower = key.toLowerCase();
            setRequestCounts(lower, value as number);
          });
        } else {
          setRequestCounts(filterKey, meta.total);
          const allFilterKeys = ['all', 'accepted', 'on hold', 'in process', 'completed', 'cancelled', 'pending'];
          allFilterKeys.forEach(key => { if (key !== filterKey) setRequestCounts(key, 0); });
        }
        // If API returned successfully but empty, fallback to local
        if (!Array.isArray(list) || list.length === 0) {
          throw new Error('empty');
        }
      } catch {
        // Local fallback: read from localStorage 'myRequests'
        try {
          const rawLocal = localStorage.getItem('myRequests');
          const items = rawLocal ? JSON.parse(rawLocal) as any[] : [];
          list = items.map((p, idx) => ({
            id: idx + 1,
            request_id: parseInt(String((p.requestId || '').toString().replace(/\D/g, '')).slice(-9)) || Date.now() % 1e9,
            category: { id: 1, title: p.service || 'Service', slug: (p.service || 'service').toLowerCase() },
            service: { id: 1, title: p.service || 'Service', slug: (p.service || 'service').toLowerCase() },
            status: 'pending',
            total: 0,
            created_at: p.scheduleDate || new Date().toISOString(),
            schedule_time: p.scheduleDate || '',
            service_name: p.service,
            priority: p.isEmergency ? 'High' : 'Normal',
            address: [p.address?.street, p.address?.city, p.address?.zipCode].filter(Boolean).join(', '),
            full_address: [p.address?.street, p.address?.city, p.address?.zipCode].filter(Boolean).join(', '),
            city: p.address?.city || '',
            state: '',
            zip_code: p.address?.zipCode || '',
            service_tier_tag: p.isEmergency ? 'Emergency' : 'Scheduled'
          }));
          meta = { title: undefined, currentPage: 1, total: list.length, perPage: 10, lastPage: 1 };
          setRequestCounts(filterKey, list.length);
        } catch {}
      }

      setRequests(list);
      setTitle(meta.title);
      setTotal(meta.total);
      setPerPage(meta.perPage);
      setLastPage(meta.lastPage);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [fetchByFilter, setLoading, setError, setRequests, setTitle, setTotal, setPerPage, setLastPage, setRequestCounts]);

  // Event handlers
  const handleFilterClick = useCallback((status: string) => {
    setSelectedFilter(status);
    setPage(1);
    loadRequests(status, timeFilter, 1);
  }, [setSelectedFilter, setPage, loadRequests, timeFilter]);

  const handleTimeChange = useCallback((value: string) => {
    setTimeFilter(value);
    setPage(1);
    loadRequests(selectedFilter, value, 1);
  }, [setTimeFilter, setPage, loadRequests, selectedFilter]);

  const handlePageClick = useCallback((pageNumber: number) => {
    setPage(pageNumber);
    loadRequests(selectedFilter, timeFilter, pageNumber);
  }, [setPage, loadRequests, selectedFilter, timeFilter]);

  // Effects
  useEffect(() => {
    const initialFilter = requestType && requestType !== 'all' ? requestType : 'all';
    setSelectedFilter(initialFilter);
    setPage(1);
    loadRequests(initialFilter, timeFilter, 1);
  }, [requestType, timezoneHours, setSelectedFilter, setPage, loadRequests, timeFilter]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return {
    // State
    requests,
    selectedFilter,
    timeFilter,
    page,
    title,
    total,
    perPage,
    lastPage,
    loading,
    error,
    requestCounts,

    // Actions
    handleFilterClick,
    handleTimeChange,
    handlePageClick,
    loadRequests,
    // Removed fetchCounts
  };
}; 