import { create } from 'zustand';

interface PartnerDashboardState {
  rating: number | null;
  ratingCount: number | null;
  servicePartnerTierName: string | null;
  isDashboardLoaded: boolean;
  setDashboardData: (
    rating: number | null,
    ratingCount: number | null,
    servicePartnerTierName: string | null
  ) => void;
  resetDashboard: () => void;
}

export const usePartnerDashboardStore = create<PartnerDashboardState>((set) => ({
  rating: null,
  ratingCount: null,
  servicePartnerTierName: null,
  isDashboardLoaded: false,
  setDashboardData: (rating, ratingCount, servicePartnerTierName) =>
    set({
      rating,
      ratingCount,
      servicePartnerTierName,
      isDashboardLoaded: true,
    }),
  resetDashboard: () =>
    set({
      rating: null,
      ratingCount: null,
      servicePartnerTierName: null,
      isDashboardLoaded: false,
    }),
}));
