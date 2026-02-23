import { api } from '../api/api';
import { GENERAL_ENDPOINTS } from '../apiEndpoints/general';

export interface IntakeChatRequest {
  conversationId?: string;
  userMessage: string;
}

export type IntakeMissingField =
  | "serviceCategory"
  | "serviceSubcategory"
  | "service"
  | "isEmergency"
  | "zipcode"
  | "description";

export interface IntakeCollectedFields {
  serviceCategory: { id: number; name: string } | null;
  serviceSubcategory: { id: number; name: string } | null;
  service: string | null;
  service_id: number | null;
  isEmergency: boolean | null;
  zipcode: string | null;
  description: string | null;
  scheduleDate: string | null;
  scheduleTime: string | null;
}

export interface IntakeChatResponse {
  status: number;
  conversationId: string;
  botMessage: string;
  collected: IntakeCollectedFields;
  missingFields: IntakeMissingField[];
  isComplete: boolean;
  showSpListButton: boolean;
}

/**
 * AI Intake Chat Service - talks to /api/chat/intake
 */
export const aiIntakeChatService = {
  sendMessage: async (payload: IntakeChatRequest): Promise<IntakeChatResponse> => {
    if (!payload.userMessage || !payload.userMessage.trim()) {
      throw new Error("Please enter a message before sending.");
    }

    const response = await api.post(GENERAL_ENDPOINTS.AI_INTAKE_CHAT, payload);

    // Assume backend returns the shape documented in the spec
    if (response && typeof response === "object") {
      return response as IntakeChatResponse;
    }

    throw new Error("Unexpected response from intake chat API.");
  },
};


