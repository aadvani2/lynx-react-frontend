import { create } from 'zustand';

interface AvailabilityState {
	availability: boolean;
	setAvailability: (value: boolean) => void;
}

export const useAvailabilityStore = create<AvailabilityState>((set) => ({
	availability: false,
	setAvailability: (value: boolean) => set({ availability: value }),
})); 