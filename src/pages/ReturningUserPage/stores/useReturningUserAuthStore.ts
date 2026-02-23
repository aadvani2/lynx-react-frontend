import { create } from 'zustand';

interface ReturningUserAuthState {
  loading: boolean;
  userPhone: string;
  setLoading: (loading: boolean) => void;
  setUserPhone: (phone: string) => void;
  reset: () => void;
}

export const useReturningUserAuthStore = create<ReturningUserAuthState>((set) => ({
  loading: true,
  userPhone: '',
  setLoading: (loading) => set({ loading }),
  setUserPhone: (userPhone) => set({ userPhone }),
  reset: () => set({ loading: true, userPhone: '' }),
}));
