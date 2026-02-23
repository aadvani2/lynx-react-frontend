import { create } from 'zustand';

interface BookingData {
  service: string;
  location: string;
  when?: "emergency" | "later" | "schedule";
  scheduleDate?: string;
  scheduleTime?: string;
  provider?: {
    id?: number | string;
    name: string;
    distance: string;
    rating: string;
    reviews: string;
    description: string;
    image: string;
    established: string;
  };
  isNewUser: boolean;
  isReturningUser: boolean;
  isEmergency: boolean;
  isScheduled: boolean;
  lynxChoice?: boolean;
  selected_provider_id?: number | string;
  selectedProviderId?: number | string;
}

interface ContactInfo {
  email: string;
  fullName: string;
  phoneNumber: string;
}

interface AddressInfo {
  street: string;
  city: string;
  zipCode: string;
}

interface ReturningUserBookingState {
  bookingData: BookingData | null;
  contactInfo: ContactInfo;
  addressInfo: AddressInfo;
  setBookingData: (data: BookingData | null | ((prev: BookingData | null) => BookingData | null)) => void;
  setContactInfo: (info: ContactInfo) => void;
  setAddressInfo: (info: AddressInfo) => void;
  updateContactInfo: (updates: Partial<ContactInfo>) => void;
  updateAddressInfo: (updates: Partial<AddressInfo>) => void;
  reset: () => void;
}

const defaultContactInfo: ContactInfo = {
  email: '',
  fullName: '',
  phoneNumber: ''
};

const defaultAddressInfo: AddressInfo = {
  street: '',
  city: '',
  zipCode: ''
};

export const useReturningUserBookingStore = create<ReturningUserBookingState>((set, get) => ({
  bookingData: null,
  contactInfo: defaultContactInfo,
  addressInfo: defaultAddressInfo,
  setBookingData: (bookingData) =>
    set((state) => ({
      bookingData: typeof bookingData === 'function' ? bookingData(state.bookingData) : bookingData
    })),
  setContactInfo: (contactInfo) => set({ contactInfo }),
  setAddressInfo: (addressInfo) => set({ addressInfo }),
  updateContactInfo: (updates) => {
    const currentInfo = get().contactInfo;
    set({ contactInfo: { ...currentInfo, ...updates } });
  },
  updateAddressInfo: (updates) => {
    const currentInfo = get().addressInfo;
    set({ addressInfo: { ...currentInfo, ...updates } });
  },
  reset: () => set({
    bookingData: null,
    contactInfo: defaultContactInfo,
    addressInfo: defaultAddressInfo
  }),
}));
