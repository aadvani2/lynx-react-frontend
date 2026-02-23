import { create } from "zustand";
import {
  customerService,
} from "../services/customerServices/customerService";
import type { NotificationItem } from "../types/notifications";

interface NotificationState {
  notifications: NotificationItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  lastPage: number;
}

interface NotificationActions {
  setNotifications: (notifications: NotificationItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPage: (page: number) => void;
  setLastPage: (lastPage: number) => void;
  fetchNotifications: (page?: number) => Promise<void>;
}

export const useNotificationStore = create<
  NotificationState & NotificationActions
>((set, get) => ({
  notifications: [],
  loading: false,
  error: null,
  currentPage: 1,
  lastPage: 1,

  setNotifications: (notifications) => set({ notifications }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setLastPage: (lastPage) => set({ lastPage }),

  fetchNotifications: async (page: number = get().currentPage) => {
    set({ loading: true, error: null });

    try {
      const timezoneHours = -new Date().getTimezoneOffset() / 60;

      // Fetch notifications for the page we want
      const res = await customerService.getNotifications(timezoneHours, page);

      set({
        notifications: res.notifications,
        currentPage: Number(page), // ✅ ensure numeric
        lastPage: Number(res.lastPage), // ✅ ensure numeric
      });
    } catch (e: unknown) {
      set({
        error: e instanceof Error ? e.message : "Failed to load notifications",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
