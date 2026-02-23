// src/services/generalServices/contactService.ts
import { api } from "../api/api";
import { GENERAL_ENDPOINTS } from "../apiEndpoints/general";
import type {
  ContactSubmitPayload,
  ContactSubmitResponse,
  ContactSubmitError
} from "../../types/contact";

// Re-export types for convenience
export type {
  ContactSubmitPayload,
  ContactSubmitResponse,
  ContactSubmitError
} from "../../types/contact";

export const contactService = {
  // Submit contact form
  submitContactForm: async (payload: ContactSubmitPayload): Promise<ContactSubmitResponse> => {
    try {
      const response = await api.post(GENERAL_ENDPOINTS.CONTACT_SUBMIT, payload);
      return response;
    } catch (error: unknown) {
      // Handle different types of errors
      if (error instanceof Error) {
        try {
          // Try to parse error message as JSON to extract server validation errors
          const errorData = JSON.parse(error.message);
          
          if (errorData.errors && Array.isArray(errorData.errors)) {
            // Extract validation error messages
            const validationMessages = errorData.errors.map((err: { msg: string }) => err.msg).join(', ');
            throw new Error(validationMessages);
          } else if (errorData.message) {
            throw new Error(errorData.message);
          } else {
            throw new Error(error.message);
          }
        } catch {
          // If parsing fails, use the original error message
          throw new Error(error.message);
        }
      } else if (typeof error === 'object' && error !== null) {
        const apiError = error as ContactSubmitError;
        
        if (apiError.errors && Array.isArray(apiError.errors)) {
          // Extract validation error messages from structured response
          const validationMessages = apiError.errors.map(err => err.msg).join(', ');
          throw new Error(validationMessages);
        } else {
          const errorMessage = apiError.message || 'Contact form submission failed';
          throw new Error(errorMessage);
        }
      } else {
        throw new Error('Contact form submission failed');
      }
    }
  },
}; 