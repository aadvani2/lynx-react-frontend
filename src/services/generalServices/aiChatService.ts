import { api } from '../api/api';
import { GENERAL_ENDPOINTS } from '../apiEndpoints/general';

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
  providers_url?: string;
  // Optional: support for structured JSON responses
  action?: string;
  message?: string;
}

/**
 * AI Chat Service - Handles communication with the backend chat API
 */
export const aiChatService = {
  /**
   * Send a chat message to the backend and get an assistant reply
   * @param messages - Array of conversation messages (full history)
   * @returns Promise with assistant reply and optional providers URL
   */
  sendMessage: async (messages: ChatMessage[]): Promise<ChatResponse> => {
    try {
      const response = await api.post(GENERAL_ENDPOINTS.AI_CHAT, {
        messages,
      });

      // Handle different possible response structures
      // Case 1: Response has a data property (common pattern)
      if (response && typeof response === 'object' && 'data' in response) {
        const data = (response as { data: unknown }).data;
        if (data && typeof data === 'object') {
          const chatData = data as Partial<ChatResponse>;
          if (chatData.reply || chatData.message) {
            return {
              reply: chatData.reply || chatData.message || '',
              providers_url: chatData.providers_url,
            };
          }
        }
      }

      // Case 2: Response directly has reply or message
      if (response && typeof response === 'object') {
        const directResponse = response as Partial<ChatResponse & { message?: string }>;
        if (directResponse.reply || directResponse.message) {
          return {
            reply: directResponse.reply || directResponse.message || '',
            providers_url: directResponse.providers_url,
          };
        }
      }

      // Case 3: Response is a string (unlikely but handle it)
      if (typeof response === 'string') {
        return {
          reply: response,
        };
      }

      throw new Error('Unexpected response format from chat API');
    } catch (error: unknown) {
      console.error('AI Chat API Error:', error);
      
      // Extract error message
      let errorMessage = 'Sorry, I had trouble talking to the server. Please try again.';
      
      if (error && typeof error === 'object') {
        // Check for nested error structures
        const errorObj = error as Record<string, unknown>;
        if (errorObj.message && typeof errorObj.message === 'string') {
          errorMessage = errorObj.message;
        } else if (errorObj.error && typeof errorObj.error === 'string') {
          errorMessage = errorObj.error;
        } else if (errorObj.response && typeof errorObj.response === 'object') {
          const response = errorObj.response as Record<string, unknown>;
          if (response.message && typeof response.message === 'string') {
            errorMessage = response.message;
          } else if (response.data && typeof response.data === 'object') {
            const data = response.data as Record<string, unknown>;
            if (data.message && typeof data.message === 'string') {
              errorMessage = data.message;
            }
          }
        }
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }

      throw new Error(errorMessage);
    }
  },
};

