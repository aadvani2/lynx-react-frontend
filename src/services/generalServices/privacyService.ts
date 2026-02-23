import { api } from "../api/api";
import { GENERAL_ENDPOINTS } from "../apiEndpoints/general";

// Privacy Request Payload interface
export interface PrivacyRequestPayload {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  dial_code: string;
  country_code: string;
  address: string;
  isPersonalData?: 1; // Only included if selected
  isUpdateData?: 1;   // Only included if selected
  isAccessData?: 1;   // Only included if selected
  isProcessData?: 1;  // Only included if selected
}

// Privacy Request API Response interface
export interface PrivacyRequestResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export const privacyService = {
  // Submit privacy/data deletion request
  submitDataDeletionRequest: async (payload: PrivacyRequestPayload): Promise<PrivacyRequestResponse> => {
    try {
      const response = await api.post(GENERAL_ENDPOINTS.DATA_DELETION_SUBMIT, payload);
      return response;
    } catch (error: unknown) {
      // Handle different types of errors
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to submit privacy request');
      }
    }
  }
}; 