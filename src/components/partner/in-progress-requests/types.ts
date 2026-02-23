export interface Category {
  id: number;
  title: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  dial_code: string;
  country_code: string;
}

export interface InProcessRequest {
  id: number;
  request_id: number;
  category: Category;
  description: string;
  tag: string;
  distance: string;
  address: string;
  status: string;
  timestamp: string;
  customer: Customer;
  total: number;
  created_at: string;
}
