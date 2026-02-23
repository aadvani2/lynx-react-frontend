import { create } from 'zustand';

interface CustomerState {
  selectedSubscriptionId: string | null;
}

interface CustomerActions {
  setSelectedSubscriptionId: (id: string | null) => void;
  clearSelectedSubscriptionId: () => void;
}

export type CustomerStore = CustomerState & CustomerActions;

export const useCustomerStore = create<CustomerStore>((set) => ({
  // Initial state
  selectedSubscriptionId: null,

  // Actions
  setSelectedSubscriptionId: (id: string | null) => {
    set({ selectedSubscriptionId: id });
  },

  clearSelectedSubscriptionId: () => {
    set({ selectedSubscriptionId: null });
  },
}));
