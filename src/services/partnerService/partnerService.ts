// src/services/partnerService.ts
import { api } from "../api/api";
import { PARTNER_ENDPOINTS } from "../apiEndpoints/partner";

export const partnerService = {
  // Availability
  setAvailability: (isAvailable: boolean) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_AVAILABILITY, { availability: isAvailable ? 1 : 0 }),

  // Dashboard info
  getDashboardInfo: async () => {
    try {
      const response = await api.get(PARTNER_ENDPOINTS.PROFESSIONAL_DASHBOARD_INFO);

      const data = response.data;
      // Ensure alerts is always an array
      const alerts = Array.isArray(response.alerts) ? response.alerts : [];

      const stats = data?.dashboard ?? null;
      const availFromApi = data.provider.availability;
      const isAccepted = response.isAccepted;
      const rating = data?.provider?.rating ?? null;
      const ratingCount = data?.provider?.rating_count ?? null;
      const servicePartnerTierName = data?.provider?.service_partner_tier_details?.name ?? null;

      return { stats, availFromApi, isAccepted, alerts, rating, ratingCount, servicePartnerTierName };
    } catch (error) {
      console.error('Error in getDashboardInfo:', error);
      throw error;
    }
  },

  // Pending requests
  getPendingRequests: (payload: { employee_id: number | null; user_timezone: number; page: number }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_PENDING_REQUESTS, payload),

  // Accepted requests
  getAcceptedRequests: (payload: { employee_id: number | null; user_timezone: number; page: number }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_ACCEPTED_REQUESTS, payload),

  // On hold requests (in progress)
  getOnHoldRequests: (payload: { employee_id: number | null; user_timezone: number; page: number }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_ON_HOLD_REQUESTS, payload),

  // In process requests
  getInProcessRequests: (payload: { employee_id: number | null; user_timezone: number; page: number }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_IN_PROCESS_REQUESTS, payload),

  // Completed requests
  getCompletedRequests: (payload: { employee_id: number | null; user_timezone: number; page: number }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_COMPLETED_REQUESTS, payload),

  // Cancelled requests
  getCancelledRequests: (payload: { employee_id: number | null; user_timezone: number; page: number }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_CANCELLED_REQUESTS, payload),

  // Manage employees info
  getManageEmployeesInfo: () => api.get(PARTNER_ENDPOINTS.PROFESSIONAL_MANAGE_EMPLOYEES_INFO),

  // Manage availability info
  getManageAvailabilityInfo: (userTimezone: number) =>
    api.get(`${PARTNER_ENDPOINTS.PROFESSIONAL_MANAGE_AVAILABILITY}?user_timezone=${userTimezone}`),

  // Manage service tiers info
  getManageServiceTiersInfo: (userTimezone: number) =>
    api.get(`${PARTNER_ENDPOINTS.PROFESSIONAL_MANAGE_SERVICE_TIERS}?user_timezone=${userTimezone}`).then(response => {
      const { provider } = response.data; // Only destructure provider
      // const { dataValues } = provider;

      let parsedServiceRadius = [];
      if (provider.service_radius && typeof provider.service_radius === 'string') {
        try {
          let parsed = JSON.parse(provider.service_radius);
          // Handle double-encoded JSON (if parsed result is still a string)
          if (typeof parsed === 'string') {
            parsed = JSON.parse(parsed);
          }
          // Ensure it's an array
          parsedServiceRadius = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.error("Failed to parse service_radius JSON:", e);
          parsedServiceRadius = [];
        }
      } else if (provider.service_radius && Array.isArray(provider.service_radius)) {
        parsedServiceRadius = provider.service_radius;
      }

      return {
        address: provider.address,
        unit_number: provider.unit_number,
        zip_code: provider.zip_code,
        city: provider.city,
        state: provider.state,
        latitude: provider.latitude,
        longitude: provider.longitude,
        country: provider.country,
        service_radius: parsedServiceRadius,
      };
    }),

  // Manage services info
  getManageServicesInfo: () => api.get(PARTNER_ENDPOINTS.PROFESSIONAL_MANAGE_SERVICES),

  // Set services info
  setServicesInfo: (payload: { service_type: string[]; services: number[] }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_SET_SERVICES_INFO, payload),

  // Update service tiers
  updateServiceTiers: (payload: Record<string, string | number>) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_UPDATE_SERVICE_TIERS, payload),

  // Get service tier schedule
  getServiceTierSchedule: (payload: { service_tier_id: string | number; service_tier_title: string }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_GET_SERVICE_TIER_SCHEDULE, payload),

  // Update service tier schedule
  updateServiceTierSchedule: (payload: Record<string, unknown>) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_UPDATE_SERVICE_TIER_SCHEDULE, payload),

  // Get service tier notification schedule
  getServiceTierNotifySchedule: (payload: { service_tier_id: string | number; service_tier_title: string }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_GET_SERVICE_TIER_NOTIFY_SCHEDULE, payload),

  // Update service tier notification schedule
  updateServiceTierNotifySchedule: (payload: Record<string, unknown>) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_UPDATE_SERVICE_TIER_NOTIFY_SCHEDULE, payload),

  // Add new employee
  addNewEmployee: (payload: FormData | Record<string, unknown>) => api.post(PARTNER_ENDPOINTS.PROFESSIONAL_ADD_EMPLOYEE, payload),

  // Get employee details
  getEmployeeDetails: (employeeId: number) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_EMPLOYEE_DETAILS, { member_id: employeeId }),

  // Set employee availability
  setEmployeeAvailability: (employeeId: number, isAvailable: boolean) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_EMPLOYEE_AVAILABILITY, {
      member_id: employeeId,
      availability: isAvailable ? 1 : 0
    }),

  // Set employee status
  setEmployeeStatus: (employeeId: number, isActive: boolean) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_EMPLOYEE_STATUS, {
      member_id: employeeId,
      status: isActive ? 'active' : 'inactive'
    }),

  // Delete employee
  deleteEmployee: (employeeId: number) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_DELETE_EMPLOYEE, {
      member_id: employeeId
    }),

  // Business profile info
  getBusinessProfileInfo: () => api.get(PARTNER_ENDPOINTS.PROFESSIONAL_BUSINESS_PROFILE_INFO),

  // Update company profile
  updateCompanyProfile: (payload: FormData) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_UPDATE_COMPANY_PROFILE, payload),

  // Notifications
  getNotificationsInfo: (userTimezone: number) =>
    api.get(`${PARTNER_ENDPOINTS.PROFESSIONAL_NOTIFICATIONS}?user_timezone=${userTimezone}`),

  // Settings
  getSettingsInfo: (userTimezone: number) =>
    api.get(`${PARTNER_ENDPOINTS.PROFESSIONAL_SETTINGS}?user_timezone=${userTimezone}`),

  // Get request details
  getRequestDetails: (payload: { id: number; type: string; user_timezone: number; currentPage: number }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_GET_REQUEST_DETAILS, payload),

  // Propose new time
  proposeNewTime: (payload: { request_id: number; receiver: string; user_timezone: number; message: string; purpose_time: string }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_NEW_PURPOSE_ADD, payload),

  // Get schedule request history
  getScheduleRequestHistory: (payload: { request_id: number; user_timezone: number }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_SCHEDULE_REQUEST_HISTORY, payload),

  // Accept request
  acceptRequest: (payload: { request_id: number; is_accepted: number }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_ACCEPT_REQUEST, payload),

  // Accept/Decline request
  acceptDeclineRequest: (payload: { request_id: string; is_accepted: number; decline_reason: string; receiver: string }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_ACCEPT_DECLINE_REQUEST, payload),

  // Get employees
  getEmployees: () => api.post(PARTNER_ENDPOINTS.PROFESSIONAL_EMPLOYEES, {}),

  // Assign employee
  assignEmployee: (payload: { employee_id: number; member_id: number; request_id: number; is_accepted: number }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_ASSIGN_EMPLOYEE, payload),

  // Verify arrival
  verifyArrival: (payload: { code: string; request_id: number }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_VERIFY_ARRIVAL, payload),

  // Cancel assignment
  cancelAssignment: (payload: { request_id: number; cancel_reason: string }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_CANCEL_ASSIGNMENT, payload),

  // Complete request
  completeRequest: (payload: { request_id: number; rating: number; feedback: string }) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_COMPLETE_REQUEST, payload),

  // Update location
  updateLocation: (payload: {
    location: string;
    latitude: number;
    longitude: number;
    country: string;
    address: string;
    unit_number: string;
    zip_code: string;
    city: string;
    state: string;
    switchRange: 'miles' | 'km';
    service_radius: Array<{
      tier_title: string;
      tier_id: number;
      is_available: number;
      radius: number;
    }>;
  }) => api.post(PARTNER_ENDPOINTS.PROFESSIONAL_UPDATE_LOCATION, payload),

  // Update request counter
  updateRequestCounter: (payload: { success: boolean; data: { requestCounter: { total_new_request: number; }; }; }) => api.post(PARTNER_ENDPOINTS.PROFESSIONAL_UPDATE_REQUEST_COUNTER, payload),

  // Change Tier Info
  getChangeTierInfo: async (user_timezone: number): Promise<number | null> => {
    const url = `${PARTNER_ENDPOINTS.CHANGE_TIER_INFO}?user_timezone=${encodeURIComponent(user_timezone)}`;
    const res = await api.get(url);
    if (res && res.data && res.data.provider && res.data.provider.dataValues && typeof res.data.provider.dataValues.service_partner_tier === 'number') {
      return res.data.provider.dataValues.service_partner_tier;
    }
    return null; // Return null if the expected data path is not found or not a number
  },

  // Get Service Partner Tiers
  getServicePartnerTiers: () => api.get(PARTNER_ENDPOINTS.SERVICE_PARTNER_TIERS),

  // Update Tier
  updateTier: (service_partner_tier: number) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_UPDATE_TIER, {
      service_partner_tier,
    }),

  // Accept Policy
  acceptPolicy: (policy_key: string, version: string) =>
    api.post(PARTNER_ENDPOINTS.PROFESSIONAL_ACCEPT_POLICY, {
      policy_key,
      version
    }),

  // Add Documents
  addDocuments: (name: string, file: File) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    return api.post(PARTNER_ENDPOINTS.PROFESSIONAL_ADD_DOCUMENTS, formData);
  },

  // Get Documents
  getDocuments: async () => {
    const response = await api.get(PARTNER_ENDPOINTS.PROFESSIONAL_GET_DOCUMENTS);

    // Filter response to include only necessary fields
    return {
      success: response.success,
      documents: response.documents || response.data?.documents || [],
      document_types: response.document_types || [],
    };
  },

  // Delete a document
  deleteDocument: async (documentId: number) => {
    const response = await api.post(PARTNER_ENDPOINTS.PROFESSIONAL_DELETE_DOCUMENT, {
      document_id: documentId
    });

    return response;
  },

  // Submit Onboarding Form
  submitOnboarding: (formData: FormData) => {
    return api.post(PARTNER_ENDPOINTS.PROFESSIONAL_SUBMIT_ONBOARDING, formData);
  },
};
