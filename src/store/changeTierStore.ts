import { create } from 'zustand';
import { partnerService } from '../services/partnerService/partnerService';
interface ServicePartnerTier {
  id: number;
  name: string;
  description: string;
  servicetier_ids: string;
  is_default: string;
  display_order: number;
  status: string;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

interface ChangeTierState {
  currentTier: number;
  selectedTier: number;
  loading: boolean;
  error: string | null;
  timezoneHours: number;
  servicePartnerTiers: ServicePartnerTier[];
}

interface ChangeTierActions {
  fetchTierInfo: () => Promise<void>;
  fetchServicePartnerTiers: () => Promise<void>;
  setSelectedTier: (tierValue: number) => void;
}

const getInitialTimezoneHours = () => {
  return -new Date().getTimezoneOffset() / 60;
};

export const useChangeTierStore = create<ChangeTierState & ChangeTierActions>((set, get) => ({
  currentTier: 0, // Initialize currentTier
  selectedTier: 0,
  loading: true,
  error: null,
  timezoneHours: getInitialTimezoneHours(),
  servicePartnerTiers: [],

  fetchTierInfo: async () => {
    set({ loading: true, error: null });
    try {
      const timezoneHours = get().timezoneHours;
      const res: string | number | null = await partnerService.getChangeTierInfo(timezoneHours);

      if (res && typeof res === 'number') {
        set({ currentTier: res, selectedTier: res });
      } else {
        console.warn("Failed to fetch tier information, defaulting to 0.");
        set({ currentTier: 0, selectedTier: 0 });
      }
    } catch (err) {
      console.error("Error fetching change tier info from store:", err);
      set({ error: err instanceof Error ? err.message : "An unexpected error occurred." });
    } finally {
      set({ loading: false });
    }
  },

  fetchServicePartnerTiers: async () => {
    set({ loading: true, error: null });
    try {
      const res: { success: boolean; message?: string; data?: { service_partner_tiers: ServicePartnerTier[] } } = await partnerService.getServicePartnerTiers();

      if (res.success && res.data) {
        set({ servicePartnerTiers: res.data.service_partner_tiers });

        // If selectedTier is 0 (initial state), set it to the first available tier
        if (get().selectedTier === 0 && res.data.service_partner_tiers.length > 0) {
          set({ selectedTier: res.data.service_partner_tiers[0].id });
        }
      } else {
        set({ error: res.message || "Failed to fetch service partner tiers." });
      }
    } catch (err) {
      console.error("Error fetching service partner tiers from store:", err);
      set({ error: err instanceof Error ? err.message : "An unexpected error occurred." });
    } finally {
      set({ loading: false });
    }
  },

  setSelectedTier: (tierValue: number) => {
    set({ selectedTier: tierValue });
  },
}));
