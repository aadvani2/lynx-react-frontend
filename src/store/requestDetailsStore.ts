import { create } from 'zustand';

export interface RequestDetailsData {
  success?: boolean;
  latitude?: number;
  longitude?: number;
  request_status?: string;
  progressStartTime?: string | null;
  progressTime?: number;
  onHoldMinute?: number;
  data?: {
    user_timezone?: number;
    request?: {
      services_name: string;
      status_message: string;
      sub_category_name: string;
      schedule_msg: string;
      id: number;
      user_id?: number;
      request_id?: number;
      provider_id?: number | null;
      member_id?: number | null;
      cat_id?: number;
      service_id?: string;
      description?: string;
      files?: string | null;
      schedule_time?: string;
      address_type?: string;
      full_address?: string;
      block_no?: string;
      street?: string;
      zip_code?: string;
      city?: string;
      state?: string;
      latitude?: number;
      longitude?: number;
      contact_person?: string;
      dial_code?: string;
      country_code?: string;
      phone?: string;
      dial_code2?: string;
      country_code2?: string;
      phone2?: string | null;
      service_tier_id?: number;
      service_tier?: string;
      service_tier_tag?: string;
      duration?: number;
      show_timer?: number;
      total?: number;
      discount?: number | null;
      payable_amount?: number;
      refund_amount?: number;
      promocode_id?: number | null;
      promocode?: string | null;
      promocode_type?: string | null;
      promocode_value?: number | null;
      cancel_reason?: string | null;
      flag_report?: string | null;
      status?: string;
      accepted_time?: string | null;
      inprocess_time?: string | null;
      completed_time?: string | null;
      cancellation_time?: string | null;
      on_hold_time?: string | null;
      verification_code?: string | null;
      token?: string;
      payment_status?: string;
      payment_at?: string;
      is_emailsend?: number;
      cancel_user_type?: string | null;
      cancel_by?: string | null;
      auto_cancellation?: number;
      updated_by?: string | null;
      deleted_at?: string | null;
      created_at?: string;
      updated_at?: string;
      provider?: {
        id: number;
        name: string;
        email: string;
        phone: string;
        dial_code: string;
        image?: string;
      };
    };
    type?: string;
    currentPage?: number;
    status_icon?: string;
    verify_icon?: string | null;
    timeout_message?: string;
    message?: string;
    cancel_alert_message?: string;
    buttons?: {
      btn_chat?: number;
      btn_chat_send?: number;
      btn_accept?: number;
      btn_decline?: number;
      btn_propose_schedule?: number;
      btn_history?: number;
      btn_cancel?: number;
      btn_complete?: number;
      btn_feedback?: number;
      [k: string]: number | undefined;
    };
    hold_req_msg?: string;
    channel_name?: string;
    filter_status?: boolean;
    request_duration?: string;
  };
}

interface RequestDetailsState {
  // State
  requestDetails: RequestDetailsData | null;
  loading: boolean;
  error: string | null;
  
  // Request parameters
  requestId: number | null;
  requestType: string;
  currentPage: number;

  // Actions
  setRequestDetails: (details: RequestDetailsData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setRequestParams: (id: number, type: string, page: number) => void;
  
  // Reset function
  reset: () => void;
}

const initialState = {
  requestDetails: null,
  loading: false,
  error: null,
  requestId: null,
  requestType: 'all',
  currentPage: 1
};

export const useRequestDetailsStore = create<RequestDetailsState>((set) => ({
  ...initialState,

  // Actions
  setRequestDetails: (requestDetails) => set({ requestDetails }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setRequestParams: (requestId, requestType, currentPage) => 
    set({ requestId, requestType, currentPage }),
  
  // Reset function
  reset: () => set(initialState)
})); 