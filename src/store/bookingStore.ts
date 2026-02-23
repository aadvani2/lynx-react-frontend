import { create } from 'zustand';
import { servicesService } from '../services/generalServices/servicesService';
import { useAuthStore } from './authStore';

interface Service {
  id: number;
  title: string;
  slug: string;
  image: string;
}

interface ServiceData {
  success: boolean;
  data: {
    page: string;
    seo_title: string;
    seo_desc: string;
    menu: string;
    category: {
      id: number;
      title: string;
      slug: string;
    };
    subcategory: {
      id: number;
      title: string;
      slug: string;
    };
    services: Service[];
  };
}

// New interface for service tier response
interface ServiceTier {
  tier_id: number;
  tag: string;
  duration: number;
  description: string;
  payable_amount: number;
  refund_amount: number;
  status: string;
  is_schedulable: number;
}

interface ServiceTierResponse {
  success: boolean;
  title: string;
  service_tiers: ServiceTier[];
  session_schedule_time: string | null;
}

interface BookingState {
  // Service data
  serviceData: ServiceData | null;
  selectedServices: number[];

  // Service tier data
  selectedTier: string; // Changed to string to match API response
  serviceTierData: ServiceTierResponse | null;

  // UI state
  currentSection: 'service-details' | 'service-tier' | 'address-selection';
  loading: boolean;
  error: string | null;
  isLoadingServiceTier: boolean;
  isAuthModalOpen: boolean;

  // Subcategory
  subcategory: string | null;
}

interface BookingActions {
  // Service data actions
  setServiceData: (data: ServiceData | null) => void;
  setSelectedServices: (services: number[]) => void;
  addSelectedService: (serviceId: number) => void;
  removeSelectedService: (serviceId: number) => void;
  toggleSelectedService: (serviceId: number) => void;

  // Service tier actions
  setSelectedTier: (tier: string) => void;
  setServiceTierData: (data: ServiceTierResponse | null) => void;

  // UI actions
  setCurrentSection: (section: 'service-details' | 'service-tier' | 'address-selection') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsLoadingServiceTier: (loading: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;

  // Subcategory actions
  setSubcategory: (subcategory: string | null) => void;

  // Business logic actions
  fetchServiceData: (subcategory: string) => Promise<void>;
  handleServiceChange: (serviceId: number) => void;
  handleTierChange: (tierTag: string) => void;
  handleNext: () => Promise<void>;
  handlePrevious: () => void;
  handleServiceTierNext: () => void;
  handleCloseAuthModal: () => void;

  // Computed values
  getSubcategoryTitle: () => string;

  // Reset actions
  resetBookingState: () => void;
  resetServiceSelection: () => void;
  resetServiceTier: () => void;
}

export type BookingStore = BookingState & BookingActions;

const initialState: BookingState = {
  serviceData: null,
  selectedServices: [],
  selectedTier: 'Emergency', // Default to Emergency Service
  serviceTierData: null,
  currentSection: 'service-details',
  loading: true,
  error: null,
  isLoadingServiceTier: false,
  isAuthModalOpen: false,
  subcategory: null,
};

export const useBookingStore = create<BookingStore>()(

  (set, get) => ({
    ...initialState,

    // Service data actions
    setServiceData: (data) => set({ serviceData: data }),

    setSelectedServices: (services) => set({ selectedServices: services }),

    addSelectedService: (serviceId) => set((state) => ({
      selectedServices: [...state.selectedServices, serviceId]
    })),

    removeSelectedService: (serviceId) => set((state) => ({
      selectedServices: state.selectedServices.filter(id => id !== serviceId)
    })),

    toggleSelectedService: (serviceId) => set((state) => ({
      selectedServices: state.selectedServices.includes(serviceId)
        ? state.selectedServices.filter(id => id !== serviceId)
        : [...state.selectedServices, serviceId]
    })),

    // Service tier actions
    setSelectedTier: (tier) => set({ selectedTier: tier }),
    setServiceTierData: (data) => set({ serviceTierData: data }),

    // UI actions
    setCurrentSection: (section) => set({ currentSection: section }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setIsLoadingServiceTier: (loading) => set({ isLoadingServiceTier: loading }),
    setIsAuthModalOpen: (open) => set({ isAuthModalOpen: open }),

    // Subcategory actions
    setSubcategory: (subcategory) => set({ subcategory }),

    // Business logic actions
    fetchServiceData: async (subcategory: string) => {
      if (!subcategory) return;

      try {
        set({ loading: true, error: null });
        const response = await servicesService.getServiceBySubcategory(subcategory);
        // Clear selected services when loading new service data
        set({
          serviceData: response,
          loading: false,
          selectedServices: [] // Reset selected services for new subcategory
        });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch service data';
        set({ error: errorMessage, loading: false });
      }
    },

    handleServiceChange: (serviceId: number) => {
      const { selectedServices } = get();
      const newSelectedServices = selectedServices.includes(serviceId)
        ? selectedServices.filter(id => id !== serviceId)
        : [...selectedServices, serviceId];

      set({
        selectedServices: newSelectedServices
      });
    },

    handleTierChange: (tierTag: string) => {
      set({ selectedTier: tierTag });
    },

    handleNext: async () => {
      const { user, isAuthenticated, isVerified } = useAuthStore.getState();
      const { selectedServices, serviceData } = get();

      // Check if user is logged in as customer
      const isLoggedInCustomer = isAuthenticated && isVerified && user?.user_type === 'customer';

      if (!isLoggedInCustomer) {
        // Open login modal if user is not authenticated
        set({ isAuthModalOpen: true });
        return;
      }

      // User is logged in, call store_session_data API first
      try {
        set({ isLoadingServiceTier: true });

        // Get service titles for selected services only
        const bookedServicesTitles = selectedServices.map(serviceId => {
          const service = serviceData?.data?.services?.find((s: Service) => s.id === serviceId);
          return service?.title || `Service ${serviceId}`;
        });

        // Call store_session_data API first
        await servicesService.storeSessionData({
          booked_services: selectedServices,
          booked_services_title: bookedServicesTitles
        });

        // After successful session data storage, call get_service_tier API
        const response = await servicesService.getServiceTier();

        // Check if the response is successful
        if (response && response.success) {
          // Immediately call store_session_data with the first tier_id from the response
          const firstTier = response.service_tiers?.[0];
          if (firstTier && firstTier.tier_id) {
            await servicesService.storeSessionData({
              service_tier_id: firstTier.tier_id
            });
          }

          set({
            serviceTierData: response,
            currentSection: 'service-tier',
            isLoadingServiceTier: false
          });
        } else {
          // Handle unsuccessful response
          set({
            error: 'Failed to load service tier information. Please try again.',
            isLoadingServiceTier: false
          });
        }
      } catch (err: unknown) {
        // Handle API error
        const errorMessage = err instanceof Error ? err.message : 'Failed to process request. Please try again.';
        set({
          error: errorMessage,
          isLoadingServiceTier: false
        });
      }
    },

    handlePrevious: () => {
      const { currentSection } = get();

      // Navigate based on current section
      if (currentSection === 'address-selection') {
        set({ currentSection: 'service-tier' });
      } else if (currentSection === 'service-tier') {
        set({ currentSection: 'service-details' });
      } else {
        // Default fallback
        set({ currentSection: 'service-details' });
      }
    },

    handleServiceTierNext: () => {
      // Navigate to address selection section
      set({ currentSection: 'address-selection' });
    },

    handleCloseAuthModal: () => {
      set({ isAuthModalOpen: false });
    },

    // Computed values
    getSubcategoryTitle: () => {
      const { serviceData, subcategory } = get();
      return serviceData?.data?.subcategory?.title ||
        (subcategory ? subcategory.charAt(0).toUpperCase() + subcategory.slice(1) : 'Service');
    },

    // Reset actions
    resetBookingState: () => set(initialState),

    resetServiceSelection: () => set({
      selectedServices: [],
      currentSection: 'service-details'
    }),

    resetServiceTier: () => set({
      selectedTier: 'Emergency',
      serviceTierData: null,
      currentSection: 'service-details'
    }),
  }),
)
