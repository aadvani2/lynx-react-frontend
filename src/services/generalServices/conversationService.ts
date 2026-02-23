import { api } from '../api/api';
import { GENERAL_ENDPOINTS } from '../apiEndpoints/general';

export const conversationService = {
  // Get conversation list
  getConversationList: (payload: { identity_name: string }) =>
    api.post(GENERAL_ENDPOINTS.CONVERSATION_LIST, payload),
  
  // Join Twilio channel
  joinChannel: (payload: {
    channel_name: string;
    identity_name: string;
    au_id: string;
    user_type: string;
    friendly_name: string;
    request_id?: number;
    request_status?: string | number;
  }, isProfessional: boolean = false) =>
    api.post(
      isProfessional ? GENERAL_ENDPOINTS.PROFESSIONAL_JOIN_CHANNEL : GENERAL_ENDPOINTS.JOIN_CHANNEL,
      payload
    ),

  // Generate Twilio token for chat client
  generateTwilioToken: (payload: { identity: string }) =>
    api.post(GENERAL_ENDPOINTS.TWILIO_TOKEN, payload),
};
