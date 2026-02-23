import { create } from 'zustand';
import Swal from 'sweetalert2';
import { partnerService } from '../../../../services/partnerService/partnerService';

interface CustomerDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  dial_code: string;
  country_code: string;
}

interface OnHoldRequestDetail {
  schedule_time: string;
  service_tier_tag: string;
  services_name: string;
  id: number;
  request_id: number;
  status: string;
  duration: number;
  customer: CustomerDetails;
  provider?: CustomerDetails; // Add provider property
  member: string | null;
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
  files: null;
  verification_code: string | null;
  timeout_minutes?: number;
  message?: string; // Add message property
  hold_req_msg?: string; // Add hold_req_msg property
}

interface HandshakeHistoryItem {
  id: number;
  request_id: number;
  sender: number;
  sender_type: string;
  receiver: number;
  receiver_type: string;
  new_schedule: string;
  is_accepted: number;
  final_status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface OnHoldRequestState {
  request: OnHoldRequestDetail | null;
  handshakehistory: HandshakeHistoryItem[] | null;
  channelName: string;
  loading: boolean;
  error: string | null;
  buttons?: {
    btn_chat?: number;
    btn_chat_send?: number;
    btn_accept?: number;
    btn_decline?: number;
    btn_propose_schedule?: number;
    btn_history?: number;
    btn_cancel?: number;
    btn_complete?: number;
    [k: string]: number | undefined;
  };
  // NEW
  type: string;
  currentPage: number;
  request_duration: string;
  status_icon: string;
  timeout_minutes: number;
  messages: {
    message: string;
    cancel_alert_message: string;
    hold_req_msg: string;
    timeout_message: string;
    type?: string; // Add type property
  };
  getRequestDetails: (id: number, type: string, user_timezone: number) => Promise<void>;
  acceptRequest: (payload: { requestId: number }) => Promise<boolean>;
  declineRequest: (payload: { requestId: number; reason: string; receiver: string }) => Promise<boolean>;
  proposeNewTime: (payload: { requestId: number; message: string; purpose_time: string; receiver: string; tz: number }) => Promise<boolean>;
}

export const useOnHoldRequestStore = create<OnHoldRequestState>((set, get) => ({
  request: null,
  handshakehistory: null,
  channelName: '',
  loading: false,
  error: null,
  buttons: {},
  // NEW
  type: '',
  currentPage: 1,
  request_duration: '',
  status_icon: '',
  timeout_minutes: 0,
  messages: {
    message: '',
    cancel_alert_message: '',
    hold_req_msg: '',
    timeout_message: '',
  },

  getRequestDetails: async (id, type, user_timezone) => {
    set({ loading: true, error: null });
    try {
      const payload = {
        id: id,
        type: type,
        user_timezone: user_timezone,
        currentPage: 1,
      };
      const response = await partnerService.getRequestDetails(payload);

      if (response?.success && response.data) {
        set({
          request: response.data.request,
          handshakehistory: response.data.request.HandshakeHistory,
          channelName: response.data.channel_name,
          buttons: response.data.buttons ?? {},
          currentPage: response.data.currentPage ?? 1,
          type: response.data.type ?? '',
          status_icon: response.data.status_icon ?? '',
          timeout_minutes: response.data.timeout_minutes ?? 0,
          request_duration: response.data.request_duration ?? '',
          messages: {
            message: response.data.message ?? '',
            cancel_alert_message: response.data.cancel_alert_message ?? '',
            hold_req_msg: response.data.hold_req_msg ?? '',
            timeout_message: response.data.timeout_message ?? '',
          },
        });
      } else {
        set({ error: response?.message || 'Failed to load request details.' });
      }
    } catch (err) {
      console.error('Failed to fetch request details:', err);
      set({ error: 'Failed to load request details. Please try again.' });
    } finally {
      set({ loading: false });
    }
  },

  acceptRequest: async ({ requestId }) => {
    if (!get().request) return false;
    try {
      const payload = {
        request_id: requestId,
        is_accepted: 1
      };
      const response = await partnerService.acceptRequest(payload);
      if (response?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Request accepted successfully!',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        return true;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: response?.message || 'Failed to accept request. Please try again.',
          confirmButtonText: 'OK',
        });
        return false;
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'An error occurred while accepting the request. Please try again.',
        confirmButtonText: 'OK',
      });
      return false;
    }
  },

  declineRequest: async ({ requestId, reason, receiver }) => {
    if (!get().request) return false;
    try {
      const payload = {
        request_id: requestId.toString(),
        is_accepted: 2,
        decline_reason: reason,
        receiver: receiver
      };
      const response = await partnerService.acceptDeclineRequest(payload);
      if (response?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Request declined successfully!',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        return true;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: response?.message || 'Failed to decline request. Please try again.',
          confirmButtonText: 'OK',
        });
        return false;
      }
    } catch (error) {
      console.error('Error declining request:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'An error occurred while declining the request. Please try again.',
        confirmButtonText: 'OK',
      });
      return false;
    }
  },

  proposeNewTime: async ({ requestId, message, purpose_time, receiver, tz }) => {
    if (!get().request) return false;
    try {
      const payload = {
        request_id: requestId,
        message: message,
        purpose_time: purpose_time,
        receiver: receiver,
        user_timezone: tz
      };
      const response = await partnerService.proposeNewTime(payload);
      if (response?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'New time proposed successfully!',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        return true;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: response?.message || 'Failed to propose new time. Please try again.',
          confirmButtonText: 'OK',
        });
        return false;
      }
    } catch (error) {
      console.error('Error proposing new time:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'An error occurred while proposing new time. Please try again.',
        confirmButtonText: 'OK',
      });
      return false;
    }
  }
}));
