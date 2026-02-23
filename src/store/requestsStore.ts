import { create } from 'zustand';

export interface Category {
  id: number;
  title: string;
  slug: string;
  image?: string;
  description?: string;
  color?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  image?: string;
}

export interface RequestItem {
  id: number;
  request_id: number;
  category: Category;
  service: Service;
  status: string;
  total: number;
  created_at: string;
  schedule_time: string;
  service_name?: string;
  priority?: string;
  address?: string;
  full_address: string;
  city: string;
  state: string;
  zip_code: string;
  service_tier_tag: "Emergency" | "Scheduled";
}

export interface RequestCounts {
  [key: string]: number; // Allow dynamic keys for counts
}

interface RequestsState {
  // State
  requests: RequestItem[];
  selectedFilter: string;
  timeFilter: string;
  page: number;
  title: string | undefined;
  total: number;
  perPage: number;
  lastPage: number;
  loading: boolean;
  error: string | null;
  requestCounts: RequestCounts;

  // Actions
  setRequests: (requests: RequestItem[]) => void;
  setSelectedFilter: (filter: string) => void;
  setTimeFilter: (filter: string) => void;
  setPage: (page: number) => void;
  setTitle: (title: string | undefined) => void;
  setTotal: (total: number) => void;
  setPerPage: (perPage: number) => void;
  setLastPage: (lastPage: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setRequestCounts: (filterKey: string, count: number) => void; // Modified to update single count

  // Reset function
  reset: () => void;
}

const initialState = {
  requests: [],
  selectedFilter: 'all',
  timeFilter: '',
  page: 1,
  title: undefined,
  total: 0,
  perPage: 10,
  lastPage: 1,
  loading: false,
  error: null,
  requestCounts: {
    all: 0,
    accepted: 0,
    'on hold': 0,
    'in process': 0,
    completed: 0,
    cancelled: 0,
    pending: 0
  }
};

export const useRequestsStore = create<RequestsState>((set) => ({
  ...initialState,

  // Actions
  setRequests: (requests) => set({ requests }),
  setSelectedFilter: (selectedFilter) => set({ selectedFilter }),
  setTimeFilter: (timeFilter) => set({ timeFilter }),
  setPage: (page) => set({ page }),
  setTitle: (title) => set({ title }),
  setTotal: (total) => set({ total }),
  setPerPage: (perPage) => set({ perPage }),
  setLastPage: (lastPage) => set({ lastPage }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setRequestCounts: (filterKey, count) => set((state) => ({
    requestCounts: { ...state.requestCounts, [filterKey]: count },
  })),

  // Reset function
  reset: () => set(initialState)
})); 