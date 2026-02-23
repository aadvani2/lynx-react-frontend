import { create } from 'zustand';

interface CountdownState {
  show: boolean;
  timeRemaining: number;
  isExpired: boolean;
  timeoutRef: NodeJS.Timeout | null;
  countdownIntervalRef: NodeJS.Timeout | null;
  start: (seconds: number) => void;
  reset: (seconds?: number) => void;
  stop: () => void;
}

export const useCountdownStore = create<CountdownState>((set, get) => ({
  show: false,
  timeRemaining: 0,
  isExpired: false,
  timeoutRef: null,
  countdownIntervalRef: null,

  start: (initialSeconds: number) => {
    const { stop } = get();
    stop(); // Clear any existing timers

    set({ show: true, timeRemaining: initialSeconds, isExpired: false });

    const countdownInterval = setInterval(() => {
      set(state => {
        if (state.timeRemaining <= 1) {
          state.stop();
          return { isExpired: true, timeRemaining: 0 };
        }
        return { timeRemaining: state.timeRemaining - 1 };
      });
    }, 1000);
    set({ countdownIntervalRef: countdownInterval });
  },

  reset: (seconds?: number) => {
    const { timeoutRef, countdownIntervalRef } = get();
    if (timeoutRef) clearTimeout(timeoutRef);
    if (countdownIntervalRef) clearInterval(countdownIntervalRef);

    set({ show: false, isExpired: false, timeRemaining: seconds ?? 0 });

    // Set a new timeout to trigger the countdown after a delay (e.g., 2 minutes)
    const newTimeout = setTimeout(() => {
      get().start(seconds ?? 120); // Corrected: calling start via get()
    }, 120000); // 2 minutes delay before countdown starts

    set({ timeoutRef: newTimeout });
  },

  stop: () => {
    const { timeoutRef, countdownIntervalRef } = get();
    if (timeoutRef) clearTimeout(timeoutRef);
    if (countdownIntervalRef) clearInterval(countdownIntervalRef);
    set({ timeoutRef: null, countdownIntervalRef: null, show: false, isExpired: false, timeRemaining: 0 });
  },
}));
