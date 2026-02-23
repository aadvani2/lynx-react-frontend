import { create } from 'zustand';

interface CustomerDashboardState {
  rating: number | null;
  ratingCount: number | null;
  isDashboardLoaded: boolean;
  setRating: (rating: number | null, ratingCount: number | null) => void;
  resetDashboard: () => void;
}

export const useCustomerDashboardStore = create<CustomerDashboardState>((set) => ({
  rating: null,
  ratingCount: null,
  isDashboardLoaded: false,
  setRating: (rating, ratingCount) => set({
    rating,
    ratingCount,
    isDashboardLoaded: true,
  }),
  resetDashboard: () => set({
    rating: null,
    ratingCount: null,
    isDashboardLoaded: false,
  }),
}));
