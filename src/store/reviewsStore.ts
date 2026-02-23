import { create } from 'zustand';

interface ReviewsState {
  showReviews: boolean;
  setShowReviews: (show: boolean) => void;
  resetReviews: () => void;
}

export const useReviewsStore = create<ReviewsState>((set) => ({
  showReviews: false,
  setShowReviews: (showReviews) => set({ showReviews }),
  resetReviews: () => set({ showReviews: false }),
}));
