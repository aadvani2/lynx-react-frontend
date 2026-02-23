export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  dial_code: string;
  country_code: string;
}

export interface CategoryInfo {
  title: string;
}

export interface ProviderInfo {
  name: string;
  email: string;
  phone: string;
  dial_code: string;
}

export interface RequestItem {
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
  customer: CustomerInfo;
  category: CategoryInfo;
  provider: ProviderInfo;
}

export interface InProgressRequestsResponse {
  success: boolean;
  data: {
    title: string;
    requests: RequestItem[];
    type: string;
    user_timezone: number;
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}
