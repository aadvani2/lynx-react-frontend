// src/services/authService.ts
import { api } from "../api/api";
import { CUSTOMER_ENDPOINTS } from "../apiEndpoints/customer";
import type { NotificationItem } from "../../types/notifications";

export interface NotificationApiResponse {
  success: boolean;
  title: string;
  view: string;
  data: {
    page: string;
    seo_title: string;
    menu: string;
    notifications: NotificationItem[];
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
  getPage: [];
  isAccepted: number;
  version: string;
}

export const customerService = {
  getEditProfileInfo: (payload: { user_timezone: number; page: number }) =>
    api.get(`${CUSTOMER_ENDPOINTS.GET_EDIT_PROFILE_INFO}?user_timezone=${encodeURIComponent(payload.user_timezone)}&page=${encodeURIComponent(payload.page)}`),

  updateProfile: (formData: FormData) => api.post(CUSTOMER_ENDPOINTS.UPDATE_PROFILE, formData),

  // Subscription
  getSubscriptionDetails: (payload: { subId: string; user_timezone: number }) =>
    api.post(CUSTOMER_ENDPOINTS.SUBSCRIPTION_DETAILS, payload),

  getMySubscription: (payload: { user_timezone: number }) =>
    api.get(`${CUSTOMER_ENDPOINTS.GET_MY_SUBSCRIPTION}?user_timezone=${encodeURIComponent(payload.user_timezone)}`),

  getUpgradePricingList: (payload: { sub_id: string }) =>
    api.post(CUSTOMER_ENDPOINTS.UPGRADE_PRICING_LIST, payload),

  // Requests
  getAllRequests: (payload: { employee_id: number | null; user_timezone: number; page: number; filter?: string }) =>
    api.post(CUSTOMER_ENDPOINTS.GET_ALL_REQUESTS, payload),

  getAcceptedRequests: (payload: { employee_id: number | null; user_timezone: number; page: number; filter?: string }) =>
    api.post(CUSTOMER_ENDPOINTS.GET_REQUESTS_ACCEPTED, payload),

  getOnHoldRequests: (payload: { employee_id: number | null; user_timezone: number; page: number; filter?: string }) =>
    api.post(CUSTOMER_ENDPOINTS.GET_REQUESTS_ON_HOLD, payload),

  getInProcessRequests: (payload: { employee_id: number | null; user_timezone: number; page: number; filter?: string }) =>
    api.post(CUSTOMER_ENDPOINTS.GET_REQUESTS_IN_PROCESS, payload),

  getCompletedRequests: (payload: { employee_id: number | null; user_timezone: number; page: number; filter?: string }) =>
    api.post(CUSTOMER_ENDPOINTS.GET_REQUESTS_COMPLETED, payload),

  getCancelledRequests: (payload: { employee_id: number | null; user_timezone: number; page: number; filter?: string }) =>
    api.post(CUSTOMER_ENDPOINTS.GET_REQUESTS_CANCELLED, payload),

  getPendingRequests: (payload: { employee_id: number | null; user_timezone: number; page: number; filter?: string }) =>
    api.post(CUSTOMER_ENDPOINTS.GET_REQUESTS_PENDING, payload),

  getRequestDetails: async (payload: { id: number; type: string; user_timezone: number; currentPage: number; filter_status: boolean }) => {
    try {
      const response = await api.post(CUSTOMER_ENDPOINTS.GET_REQUEST_DETAILS, payload);

      const request = response.data?.request || {};
      const provider = request.provider || {};

      const filteredResponse = {
        success: response.success,
        request_status: response.request_status,
        progressStartTime: response.progressStartTime,
        progressTime: response.progressTime,
        onHoldMinute: response.onHoldMinute,
        data: {
          request: {
            id: request.id ?? 0,
            request_id: request.request_id ?? '',
            schedule_msg: request.schedule_msg ?? '',
            updated_at: request.updated_at ?? '',
            service_tier: request.service_tier ?? '',
            description: request.description ?? '',
            city: request.city ?? '',
            state: request.state ?? '',
            zip_code: request.zip_code ?? '',
            contact_person: request.contact_person ?? '',
            phone: request.phone ?? '',
            dial_code: request.dial_code ?? '',
            full_address: request.full_address ?? '',
            files: request.files ?? [],
            status: request.status ?? 'pending',
            schedule_time: request.schedule_time ?? '',
            sub_category_name: request.sub_category_name ?? '',
            status_message: request.status_message ?? '',
            services_name: request.services_name ?? '',
            verification_code:request.verification_code ?? '',
            provider: {
              id: provider.id ?? 0,
              name: provider.name ?? '',
              email: provider.email ?? '',
              phone: provider.phone ?? '',
              dial_code: provider.dial_code ?? '',
              image: provider.image ?? '',
            },
          },
          buttons: response.data?.buttons ?? {},
          messages: {
            message: response.data?.message ?? '',
            cancel_alert_message: response.data?.cancel_alert_message ?? '',
            hold_req_msg: response.data?.hold_req_msg ?? '',
            timeout_message: response.data?.timeout_message ?? '',
          },
        },
      };

      return filteredResponse;
    } catch (error) {
      console.error('Error in getRequestDetails:', error);
      throw error;
    }
  },

  refreshProgress: (payload: { id: number; percentage?: number }) =>
    api.post(CUSTOMER_ENDPOINTS.REFRESH_PROGRESS, payload),

  getScheduleRequestHistory: (payload: { request_id: number; user_timezone: number }) =>
    api.post(CUSTOMER_ENDPOINTS.SCHEDULE_REQUEST_HISTORY, payload),

  cancelRequest: (payload: { cancel_reason: string; request_id: number }) => {
    return api.post(CUSTOMER_ENDPOINTS.CANCEL_REQUEST, payload);
  },

  // Saved cards
  getSavedCards: (payload: { user_timezone: number }) =>
    api.get(`${CUSTOMER_ENDPOINTS.GET_SAVED_CARDS}?user_timezone=${encodeURIComponent(payload.user_timezone)}`),

  saveCard: (paymentMethod: string) =>
    api.post(CUSTOMER_ENDPOINTS.SAVE_CARD, { payment_method: paymentMethod }),

  setPrimaryCard: (cardId: string) =>
    api.post(CUSTOMER_ENDPOINTS.SET_DEFAULT_CARD, { id: cardId }),

  deleteCard: (cardId: string, isDefault: string) =>
    api.post(CUSTOMER_ENDPOINTS.DELETE_CARD, { id: cardId, isDefault }),

  // Notifications
  getNotifications: async (user_timezone: number, page: number = 1): Promise<{
    notifications: NotificationItem[];
    currentPage: number;
    total: number;
    perPage: number;
    lastPage: number;
  }> => {
    const res: NotificationApiResponse = await api.get(`${CUSTOMER_ENDPOINTS.GET_NOTIFICATIONS}?user_timezone=${encodeURIComponent(user_timezone)}&page=${encodeURIComponent(page)}`);

    if (res.data && Array.isArray(res.data.notifications)) {
      return {
        notifications: res.data.notifications,
        currentPage: res.data.current_page,
        total: res.data.total,
        perPage: res.data.per_page,
        lastPage: res.data.last_page,
      };
    }

    return { notifications: [], currentPage: 1, total: 0, perPage: 10, lastPage: 1 };
  },
  getNotificationsInfo: (user_timezone: number) =>
    api.get(`${CUSTOMER_ENDPOINTS.GET_NOTIFICATIONS}?user_timezone=${encodeURIComponent(user_timezone)}`),

  // Settings
  getSettings: (user_timezone: number) =>
    api.get(`${CUSTOMER_ENDPOINTS.GET_SETTINGS}?user_timezone=${encodeURIComponent(user_timezone)}`),

  // Addresses
  getAddresses: (user_timezone: number) =>
    api.get(`${CUSTOMER_ENDPOINTS.GET_ADDRESSES}?user_timezone=${encodeURIComponent(user_timezone)}`),
  addAddress: (payload: {
    id?: number;
    latitude: number | undefined;
    longitude: number | undefined;
    country: string;
    type: string;
    block_no: string;
    full_address: string;
    zip_code: string;
    city: string;
    state: string;
  }) => api.post(CUSTOMER_ENDPOINTS.ADD_ADDRESS, payload),
  getAddressDetails: (payload: { id: number; mode: string }) =>
    api.post(CUSTOMER_ENDPOINTS.ADDRESS_DETAILS, payload),
  deleteAddress: (id: number | string) =>
    api.post(CUSTOMER_ENDPOINTS.DELETE_ADDRESS, { id }),

  // Transactions
  getTransactionHistory: (payload: { user_timezone: number; page?: number }) => {
    const params = new URLSearchParams({
      user_timezone: payload.user_timezone.toString()
    });

    if (payload.page) {
      params.append('page', payload.page.toString());
    }

    return api.get(`${CUSTOMER_ENDPOINTS.GET_TRANSACTION_HISTORY}?${params.toString()}`);
  },

  // Referrals
  getMyReferrals: (payload: { user_timezone: number; page: number }) =>
    api.post(CUSTOMER_ENDPOINTS.GET_MY_REFERRALS, payload),

  submitFeedback: (payload: { rating: number; request_id: string; feedback: string }) =>
    api.post(CUSTOMER_ENDPOINTS.SUBMIT_FEEDBACK, payload),

  newPurposeAdd: (payload: { request_id: number; receiver: string; user_timezone: number; message: string; purpose_time: string }) =>
    api.post(CUSTOMER_ENDPOINTS.NEW_PURPOSE_ADD, payload),

  acceptRequest: async (payload: { request_id: number; is_accepted: number }) => {
    try {
      const response = await api.post(CUSTOMER_ENDPOINTS.ACCEPT_DECLINE_REQUEST, payload);
      return response.success;
    } catch (error) {
      console.error('Error accepting request:', error);
      throw error;
    }
  },
};