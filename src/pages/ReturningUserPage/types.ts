export interface BookingData {
  service: string;
  location: string;
  when?: 'emergency' | 'later' | 'schedule';
  scheduleDate?: string;
  scheduleTime?: string;
  provider?: {
    id?: number | string;
    name: string;
    distance: string;
    rating: string;
    reviews: string;
    description: string;
    image: string;
    established: string;
  };
  isNewUser: boolean;
  isReturningUser: boolean;
  isEmergency: boolean;
  isScheduled: boolean;
  lynxChoice?: boolean;
  selected_provider_id?: number | string;
  selectedProviderId?: number | string;
  providerId?: number | string;
}

export interface ProviderItem {
  id: number;
  name: string;
  image: string;
  rating: number;
  review_count: number;
  distance: number;
  is_available: boolean;
  services?: string;
}

export interface Address {
  id?: number;
  user_id?: number;
  type: string;
  full_address: string;
  block_no: string | null;
  street?: string | null;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

