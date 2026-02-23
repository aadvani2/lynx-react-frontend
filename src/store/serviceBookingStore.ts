
import { create } from 'zustand';

interface ServiceBookingState {
  // Step control
  currentStep: 1 | 2 | 3;
  // Step 1: selected services
  selectedServices: number[];
  // Step 2: selected address
  location: string;
  zipCode: string | null;
  latLng?: { lat: number; lng: number } | null;
  // Step 3: service type & schedule
  selectedServiceType: 'emergency' | 'scheduled' | null;
  selectedScheduleTime: string | null; // "YYYY-MM-DD HH:mm"
  showDatePicker: boolean;

  // Setters / actions
  setCurrentStep: (step: 1 | 2 | 3) => void;
  setSelectedServices: (ids: number[]) => void;
  toggleService: (id: number) => void;
  setLocation: (location: string) => void;
  setZipCode: (zipCode: string | null) => void;
  setLatLng: (latLng: { lat: number; lng: number } | null) => void;
  setSelectedServiceType: (type: 'emergency' | 'scheduled' | null) => void;
  setSelectedScheduleTime: (dateTime: string | null) => void;
  setShowDatePicker: (open: boolean) => void;
  reset: () => void; // reset state when modal closes
}

export const useServiceBookingStore = create<ServiceBookingState>((set) => ({
  currentStep: 1,
  selectedServices: [],
  location: '',
  zipCode: null,
  latLng: null,
  selectedServiceType: null,
  selectedScheduleTime: null,
  showDatePicker: false,

  setCurrentStep: (step) => set({ currentStep: step }),
  setSelectedServices: (ids) => set({ selectedServices: ids }),
  toggleService: (id) =>
    set((state) => {
      const isSelected = state.selectedServices.includes(id);
      return {
        selectedServices: isSelected
          ? state.selectedServices.filter((serviceId) => serviceId !== id)
          : [...state.selectedServices, id],
      };
    }),
  setLocation: (location) => set({ location }),
  setZipCode: (zipCode) => set({ zipCode }),
  setLatLng: (latLng) => set({ latLng }),
  setSelectedServiceType: (type) => set({ selectedServiceType: type }),
  setSelectedScheduleTime: (dateTime) => set({ selectedScheduleTime: dateTime }),
  setShowDatePicker: (open) => set({ showDatePicker: open }),
  reset: () =>
    set({
      currentStep: 1,
      selectedServices: [],
      location: '',
      zipCode: undefined,
      latLng: null,
      selectedServiceType: null,
      selectedScheduleTime: null,
      showDatePicker: false,
    }),
}));
