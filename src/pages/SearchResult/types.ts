export interface ResultItem {
  id: string;
  name: string;
  distance: string;
  rating: string;
  reviews: string;
  description: string;
  image: string;
  established: string;
}

export interface Provider {
  rating_count: number;
  id: number;
  name: string;
  distance: string;
  avg_rating: number;
  bio: string;
  image?: string | null;
  exp: number;
}

export interface ApiResponse {
  success: boolean;
  providers: Provider[];
  requestData: Record<string, unknown>;
  searchService: string;
  providerCount: number;
}

export interface SearchData {
  service: string;
  service_id: string;
  zipCode: string;
  serviceTier: number;
  date: string;
}
