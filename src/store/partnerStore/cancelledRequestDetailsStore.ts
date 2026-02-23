import { create } from 'zustand';
import { partnerService } from '../../services/partnerService/partnerService';
import type { ScheduleHistoryEntry } from '../../types/scheduleHistory';

export interface CancelledRequestDetails {
  request: {
    service_tier_tag: string;
    services_name: string;
    id: number;
    request_id: number;
    status: string;
    duration: number;
    customer: {
      name: string;
      email: string;
      phone: string;
      dial_code: string;
      country_code: string;
    };
    category: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    contact_person: string;
    phone: string;
    dial_code: string;
    country_code: string;
    created_at: string;
    updated_at: string;
  };
  type: string;
  currentPage: number;
  request_duration: string;
  user_timezone: number;
  status_icon: string;
  message: string;
  cancel_alert_message: string;

  buttons: string[];
  hold_req_msg: string;
}

interface CancelledRequestDetailsState {
  // State
  requestDetails: CancelledRequestDetails | null;
  loading: boolean;
  error: string | null;
  
  // Request parameters
  requestId: number | null;
  requestType: string;
  currentPage: number;

  // Schedule History State
  scheduleHistory: ScheduleHistoryEntry[];
  scheduleHistoryLoading: boolean;
  scheduleHistoryError: string | null;

  // Actions
  setRequestDetails: (details: CancelledRequestDetails | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setRequestParams: (id: number, type: string, page: number) => void;
  
  // Data fetching
  fetchRequestDetails: (requestId?: number) => Promise<void>;
  fetchScheduleHistory: (requestId: number, userTimezone: number) => Promise<void>;
  
  // Reset function
  reset: () => void;
}

const initialState = {
  requestDetails: null,
  loading: false,
  error: null,
  requestId: null,
  requestType: 'cancelled',
  currentPage: 1,
  scheduleHistory: [],
  scheduleHistoryLoading: false,
  scheduleHistoryError: null
};

export const useCancelledRequestDetailsStore = create<CancelledRequestDetailsState>((set, get) => ({
  ...initialState,

  // Actions
  setRequestDetails: (requestDetails) => set({ requestDetails }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setRequestParams: (requestId, requestType, currentPage) => 
    set({ requestId, requestType, currentPage }),
  
  // Data fetching
  fetchRequestDetails: async (requestId?: number) => {
    const id = requestId || get().requestId;
    
    if (!id) {
      set({ error: 'No request ID provided', loading: false });
      return;
    }

    set({ loading: true, error: null });

    try {
      const payload = {
        id: typeof id === 'string' ? parseInt(id) : id,
        type: "cancelled",
        user_timezone: new Date().getTimezoneOffset() / -60,
        currentPage: 1
      };

      const response = await partnerService.getRequestDetails(payload);

      if (response?.success) {
        set({ requestDetails: response.data, loading: false });
      } else {
        set({ error: response?.message || 'Failed to load request details', loading: false });
      }
    } catch (error) {
      console.error('Error getting request details:', error);
      set({ error: 'Failed to load request details', loading: false });
    }
  },

  fetchScheduleHistory: async (requestId: number, userTimezone: number) => {
    set({ scheduleHistoryLoading: true, scheduleHistoryError: null });
    try {
      const response = await partnerService.getScheduleRequestHistory({
        request_id: requestId,
        user_timezone: userTimezone
      });
      if (response?.success) {
        set({ scheduleHistory: response.data?.history || [], scheduleHistoryLoading: false });
      } else {
        set({ scheduleHistoryError: response?.message || 'Failed to load schedule history', scheduleHistoryLoading: false });
      }
    } catch (error) {
      console.error('Error getting schedule history:', error);
      set({ scheduleHistoryError: 'Failed to load schedule history', scheduleHistoryLoading: false });
    }
  },

  // Reset function
  reset: () => set(initialState),
}));
