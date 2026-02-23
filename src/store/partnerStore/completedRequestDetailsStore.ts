import { create } from 'zustand';
import { partnerService } from '../../services/partnerService/partnerService';
import type { ScheduleHistoryEntry } from '../../types/scheduleHistory';

export interface CompletedRequestDetails {
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
    provider: {
      id: number;
      name: string;
      email: string;
      phone: string;
      dial_code: string;
      country_code: string;
      image: string;
      bio: string;
      avg_rating: number;
      business_type: string;
      address: string;
      city: string;
      state: string;
      zip_code: string;
    },
    member: {
      id: number;
      name: string;
      email: string;
      phone: string;
      dial_code: string;
      country_code: string;
      phone2: string;
      dial_code2: string;
      country_code2: string;
      image: string;
      description: string;
      birth_date: string;
      avg_rating: number;
      status: string;
      availability: number;
    },
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
    files?: string; // Add files property
  };
  type: string;
  currentPage: number;
  request_duration: string;
  user_timezone: number;
  status_icon: string;
  message: string;
  cancel_alert_message: string;
  channel_name: string;
  buttons: string[];
  hold_req_msg: string;
}

interface CompletedRequestDetailsState {
  // State
  requestDetails: CompletedRequestDetails | null;
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
  setRequestDetails: (details: CompletedRequestDetails | null) => void;
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
  requestType: 'completed',
  currentPage: 1,
  scheduleHistory: [],
  scheduleHistoryLoading: false,
  scheduleHistoryError: null
};

export const useCompletedRequestDetailsStore = create<CompletedRequestDetailsState>((set, get) => ({
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
        type: "completed", // Changed from "accepted" to "completed"
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
      
      if (response && response.success) {
        set({
          scheduleHistory: response.data?.history || [],
          scheduleHistoryLoading: false,
          scheduleHistoryError: null
        });
      } else {
        set({
          scheduleHistory: [],
          scheduleHistoryLoading: false,
          scheduleHistoryError: response?.message || 'Failed to fetch schedule history'
        });
      }
    } catch (error) {
      console.error('Error fetching schedule history:', error);
      set({
        scheduleHistory: [],
        scheduleHistoryLoading: false,
        scheduleHistoryError: 'Failed to fetch schedule history'
      });
    }
  },
  
  reset: () => set(initialState)
}));
