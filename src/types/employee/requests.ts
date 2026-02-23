export interface Customer {
  name: string;
  email: string;
  phone: string;
  dial_code: string;
  country_code: string;
}

export interface Category {
  title: string;
}

export interface Provider {
  name: string;
  email: string;
  phone: string;
  dial_code: string;
}

export interface Request {
  service_tier_tag: string;
  services_name: string;
  id: number;
  request_id: number;
  status: string;
  duration: number;
  total: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  contact_person: string;
  phone: string;
  dial_code: string;
  country_code: string;
  description: string;
  created_at: string;
  updated_at: string;
  progress_percentage?: number;
  customer: Customer;
  category: Category;
  provider: Provider;
}

export interface AcceptedRequestsData {
  title: string;
  requests: Request[];
  type: string;
  user_timezone: number;
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
}

export interface AcceptedRequestsResponse {
  success: boolean;
  data: AcceptedRequestsData;
}

export interface InProgressRequestsResponse {
  success: boolean;
  data: AcceptedRequestsData;
}

export interface CompletedRequestsResponse {
  success: boolean;
  data: AcceptedRequestsData;
}

export interface CancelledRequestsResponse {
  success: boolean;
  data: AcceptedRequestsData;
}

// Request Details Response Types
export interface RequestDetailsCustomer {
  name: string;
  email: string;
  phone: string;
  dial_code: string;
  country_code: string;
}

export interface RequestDetailsCategory {
  title: string;
}

export interface RequestDetailsProvider {
  name: string;
  email: string;
  phone: string;
  dial_code: string;
}

export interface RequestDetailsRequest {
  service_tier_tag?: string;
  services_name?: string;
  id: number;
  request_id: number;
  status: string;
  duration: number;
  total: number;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  contact_person?: string;
  phone?: string;
  dial_code?: string;
  country_code?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  progress_percentage?: number;
  customer?: RequestDetailsCustomer;
  category?: RequestDetailsCategory;
  provider?: RequestDetailsProvider;
}

export interface RequestDetailsData {
  request: RequestDetailsRequest;
  type: string;
  currentPage: number;
  request_duration: string;
  user_timezone: number;
  status_icon: string;
  message: string;
  cancel_alert_message: string;
  channel_name: string;
  buttons: unknown[];
  hold_req_msg: string;
}

export interface RequestDetailsResponse {
  success: boolean;
  request_status: string;
  data: RequestDetailsData;
}
