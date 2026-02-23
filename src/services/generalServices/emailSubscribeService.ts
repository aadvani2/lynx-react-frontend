import { api } from "../api/api";
import { GENERAL_ENDPOINTS } from "../apiEndpoints/general";

interface EmailSubscribePayload {
  email: string;
  from: string;
  service_id?: string;
  service?: string;
  service_tier?: string;
  service_tier_tag?: string;
  zip_code?: string;
  date?: string;
}

export const emailSubscribeService = {
  subscribeEmail: (payload: EmailSubscribePayload) =>
    api.post(GENERAL_ENDPOINTS.EMAIL_SUBSCRIBE, payload),
};
