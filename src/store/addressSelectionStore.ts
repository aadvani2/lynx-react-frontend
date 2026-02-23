import { create } from 'zustand';
import { servicesService } from '../services/generalServices/servicesService';
import type { PhoneInputData } from '../types/components';
import Swal from 'sweetalert2';
import { useAuthStore } from './authStore';
import { updateSessionData, getSessionData, clearSessionData } from '../utils/sessionDataManager';
import { getUserTimezoneOffset } from '../utils/timezoneHelper';

// Types
interface Address {
  id: number;
  user_id: number;
  type: string;
  full_address: string;
  block_no: string | null;
  street: string | null;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Provider {
  id: number;
  name: string;
  image: string;
  rating: number;
  review_count: number;
  distance: number;
  is_available: boolean;
  services: string;
  service_radius: string;
}

interface ContactApiResponse {
  success: boolean;
  user_info?: {
    allCards?: Array<{
      id?: string;
      last4: string;
      exp_month?: number;
      exp_year?: number;
      brand?: string;
    }>;
    payable_amount?: number;
    user_name?: string;
    user_phone?: string;
    user_dial_code?: string;
    country_code?: string;
    message?: string;
  };
}

interface ContactFormData {
  contact_person: string;
  phone: string;
  dial_code: string;
  country_code: string;
  description: string;
  files: File[];
  selectedPaymentMethodCard?: string;
}

interface AddressSelectionState {
  MAX_ADDRESSES: number;
  // Address related state
  addresses: Address[];
  selectedAddress: number | null;
  loading: boolean;

  // Provider related state
  providers: Provider[];
  showProviderLoader: boolean;
  showNoProviderAlert: boolean;
  noProviderMessage: string;
  showProviderList: boolean;
  areaMeta: { catId?: number; subcatId?: number } | null;

  // Contact information state
  showContactInformation: boolean;
  contactApiResponse: ContactApiResponse | null;
  contactFormData: ContactFormData;
  phoneData: PhoneInputData;
  previewImages: string[];
  showPaymentSection: boolean;
  isLoading: boolean;

  // Search state
  isSearchActive: boolean;

  // Request ID from storeSessionData
  firstRequestId: number | null;

  // Navigation
  onNavigateToRequests?: () => void;

  // Actions
  setAddresses: (addresses: Address[]) => void;
  setSelectedAddress: (address: number | null) => void;
  setLoading: (loading: boolean) => void;

  setProviders: (providers: Provider[]) => void;
  setShowProviderLoader: (show: boolean) => void;
  setShowNoProviderAlert: (show: boolean) => void;
  setNoProviderMessage: (message: string) => void;
  setShowProviderList: (show: boolean) => void;
  setAreaMeta: (meta: { catId?: number; subcatId?: number } | null) => void;

  setShowContactInformation: (show: boolean) => void;
  setContactApiResponse: (response: ContactApiResponse | null) => void;
  setContactFormData: (data: ContactFormData) => void;
  setPhoneData: (data: PhoneInputData) => void;
  setPreviewImages: (images: string[]) => void;
  setShowPaymentSection: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;

  setIsSearchActive: (active: boolean) => void;

  setFirstRequestId: (id: number | null) => void;

  // API Actions
  fetchAddresses: () => Promise<void>;
  handleAddressChange: (addressId: number, service: string, category: string, fromSearch: boolean) => Promise<void>;
  handleBookService: (providerId: number, service: string, category: string) => Promise<void>;
  handleProviderSearch: (query: string) => void;
  handleContactInformationFromSearch: (service: string, category: string) => Promise<void>;

  // Contact form actions
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePhoneChange: (data: PhoneInputData) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => Promise<void>;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleBrowseClick: () => void;
  removeImage: (index: number) => void;
  handlePaymentMethodChange: (cardId: string) => void;
  handleContactSubmit: (service: string, category: string) => Promise<void>;
  handleAddRequest: () => Promise<void>;
  setNavigateToRequests: (callback: () => void) => void;

  // Reset actions
  resetProviderState: () => void;
  resetContactState: () => void;
  resetAll: () => void;
}

const initialState = {
  MAX_ADDRESSES: 3,
  addresses: [],
  selectedAddress: null,
  loading: true,
  providers: [],
  showProviderLoader: false,
  showNoProviderAlert: false,
  noProviderMessage: '',
  showProviderList: false,
  areaMeta: null,
  showContactInformation: false,
  contactApiResponse: null,
  contactFormData: {
    contact_person: '',
    phone: '',
    dial_code: '+1',
    country_code: 'US',
    description: '',
    files: [],
    selectedPaymentMethodCard: ''
  },
  phoneData: {
    phone: '',
    countryCode: '1',
    countryIso: 'US'
  },
  previewImages: [],
  showPaymentSection: false,
  isLoading: false,
  isSearchActive: false,
  firstRequestId: null,
  onNavigateToRequests: undefined,
};

export const useAddressSelectionStore = create<AddressSelectionState>()(
  (set, get) => ({
    ...initialState,

    // Address actions
    setAddresses: (addresses) => set({ addresses }),
    setSelectedAddress: (selectedAddress) => set({ selectedAddress }),
    setLoading: (loading) => set({ loading }),

    // Provider actions
    setProviders: (providers) => set({ providers }),
    setShowProviderLoader: (showProviderLoader) => set({ showProviderLoader }),
    setShowNoProviderAlert: (showNoProviderAlert) => set({ showNoProviderAlert }),
    setNoProviderMessage: (noProviderMessage) => set({ noProviderMessage }),
    setShowProviderList: (showProviderList) => set({ showProviderList }),
    setAreaMeta: (areaMeta) => set({ areaMeta }),

    // Contact actions
    setShowContactInformation: (showContactInformation) => set({ showContactInformation }),
    setContactApiResponse: (contactApiResponse) => set({ contactApiResponse }),
    setContactFormData: (contactFormData) => set({ contactFormData }),
    setPhoneData: (phoneData) => set({ phoneData }),
    setPreviewImages: (previewImages) => set({ previewImages }),
    setShowPaymentSection: (showPaymentSection) => set({ showPaymentSection }),
    setIsLoading: (isLoading) => set({ isLoading }),

    // Search actions
    setIsSearchActive: (isSearchActive) => set({ isSearchActive }),

    setFirstRequestId: (firstRequestId) => set({ firstRequestId }),

    // API Actions
    fetchAddresses: async () => {
      try {
        set({ loading: true });
        const response = await servicesService.selectAddress();

        if (response?.success && response?.addresses) {
          const addresses = response.addresses;
          const firstAddress = addresses[0];

          set({
            addresses,
            selectedAddress: firstAddress?.id || null,
            loading: false
          });

          // Store session data with the first address
          if (firstAddress) {
            // Check if user is logged in
            const isAuthenticated = useAuthStore.getState().isAuthenticated;

            // Prepare base payload
            let payload: any = {
              service_address_id: firstAddress.id.toString(),
              service_address: {
                latitude: firstAddress.latitude,
                longitude: firstAddress.longitude,
                state: firstAddress.state
              }
            };

            // Merge with existing sessionData
            const storedPayload = getSessionData();
            if (storedPayload) {
              payload = { ...storedPayload, ...payload };
            }

            if (!isAuthenticated) {
              // Pre-login flow: Store payload in sessionData only (no API calls)
              try {
                updateSessionData(payload);
                // Skip API calls and provider loading for pre-login flow
                set({
                  showProviderLoader: false,
                  showNoProviderAlert: false,
                  showProviderList: false,
                  showContactInformation: false
                });
              } catch (error) {
                console.error('Error storing session data in localStorage:', error);
                set({
                  showNoProviderAlert: true,
                  showProviderList: false,
                  showProviderLoader: false,
                  showContactInformation: false
                });
              }
            } else {
              // Post-login flow: Call API and then area-confirmation
              try {
                const storeResponse = await servicesService.storeSessionData(payload);

                // Store in sessionData as well for consistency
                updateSessionData(payload);

                // Remove sessionData after successful API call (optional cleanup)
                if (storeResponse?.success && storedPayload) {
                  clearSessionData();
                }

                // Capture first_request_id from response
                if (storeResponse?.success && storeResponse?.first_request_id) {
                  set({ firstRequestId: storeResponse.first_request_id });
                }

                // Call area-confirmation API after store_session_data succeeds
                set({ showProviderLoader: true });
                const { firstRequestId } = get();
                const areaResponse = await servicesService.areaConfirmation(firstRequestId || undefined);

                if (areaResponse?.success) {
                  const metaSource = (areaResponse as any)?.data || areaResponse;
                  const catId = Number((metaSource as any)?.catId || (metaSource as any)?.cat_id) || undefined;
                  const subcatId = Number((metaSource as any)?.subcatId || (metaSource as any)?.subcat_id) || undefined;
                  set({ areaMeta: catId || subcatId ? { catId, subcatId } : null });
                  if (areaResponse.showProvider && areaResponse.providers?.length > 0) {
                    set({
                      providers: areaResponse.providers,
                      showProviderList: true,
                      showNoProviderAlert: false,
                      showProviderLoader: false,
                      noProviderMessage: ''
                    });
                  } else {
                    set({
                      showNoProviderAlert: true,
                      showProviderList: false,
                      showProviderLoader: false,
                      showContactInformation: false,
                      noProviderMessage: areaResponse?.message || 'No nearby service providers found for the requested time.'
                    });
                  }
                } else {
                  set({
                    showNoProviderAlert: true,
                    showProviderList: false,
                    showProviderLoader: false,
                    showContactInformation: false,
                    noProviderMessage: areaResponse?.message || 'Unable to load providers for this address.'
                  });
                }
              } catch (error) {
                console.error('Error in address selection flow:', error);
                // Store payload in sessionData even on error
                updateSessionData(payload);
                set({
                  showNoProviderAlert: true,
                  showProviderList: false,
                  showProviderLoader: false,
                  showContactInformation: false
                });
              }
            }
          }
        } else {
          set({ loading: false });
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        set({
          loading: false,
          noProviderMessage: 'Unable to load providers for this address.'
        });
      }
    },

    handleAddressChange: async (addressId: number, service: string, category: string, fromSearch: boolean) => {
      try {
        const { addresses } = get();
        const selectedAddress = addresses.find(addr => addr.id === addressId);

        if (selectedAddress) {
          set({ selectedAddress: addressId });

          // Call store_session_data API with the selected address
          try {
            // Merge any existing session data (service_id, tier, etc.)
            const storedPayload = getSessionData();
            const payload = {
              ...(storedPayload || {}),
              service_address_id: addressId.toString(),
              service_address: {
                latitude: selectedAddress.latitude,
                longitude: selectedAddress.longitude,
                state: selectedAddress.state
              },
              zipcode: selectedAddress.zip_code || (storedPayload as any)?.zipcode,
              selected_provider_id: ''
            };

            const storeResponse = await servicesService.storeSessionData(payload);

            // Keep local session data in sync
            try {
              updateSessionData(payload);
            } catch (e) {
              console.error('Error updating session data in localStorage:', e);
            }

            // Capture first_request_id from response
            if (storeResponse?.success && storeResponse?.first_request_id) {
              set({ firstRequestId: storeResponse.first_request_id });
            }

            // Call area-confirmation API
            set({ showProviderLoader: true, showNoProviderAlert: false, showProviderList: false, showContactInformation: false });

            const { firstRequestId } = get();
            const areaResponse = await servicesService.areaConfirmation(firstRequestId || undefined);

                if (areaResponse?.success) {
                  const metaSource = (areaResponse as any)?.data || areaResponse;
                  const catId = Number((metaSource as any)?.catId || (metaSource as any)?.cat_id) || undefined;
                  const subcatId = Number((metaSource as any)?.subcatId || (metaSource as any)?.subcat_id) || undefined;
                  set({ areaMeta: catId || subcatId ? { catId, subcatId } : null });
                  if (areaResponse.showProvider && areaResponse.providers?.length > 0) {
                // Providers are available
                // If coming from search, automatically show contact information
                if (fromSearch) {
                  const contactResponse = await servicesService.contactInformation({
                    service,
                    category
                  });
                  if (contactResponse?.success) {
                    set({
                      providers: areaResponse.providers,
                      showProviderList: true,
                      showProviderLoader: false,
                      showNoProviderAlert: false,
                      noProviderMessage: '',
                      showContactInformation: true, // Show contact info automatically from search
                      contactApiResponse: contactResponse,
                    });
                  } else {
                    console.error('Failed to call contact-information API during address change (fromSearch):', contactResponse?.message);
                    set({
                      showProviderLoader: false,
                      showNoProviderAlert: false,
                      noProviderMessage: '',
                      showContactInformation: false, // Hide if contact info API fails
                    });
                    Swal.fire({
                      title: 'Error!',
                      text: contactResponse?.message || 'Failed to fetch contact information. Please try again.',
                      icon: 'error',
                      confirmButtonText: 'OK',
                      timer: 3000,
                      showConfirmButton: false,
                    });
                  }
                } else {
                  // Traditional flow: just show provider list, ContactInformationSection will be shown on Book Service click
                  set({
                    providers: areaResponse.providers,
                    showProviderList: true,
                    showProviderLoader: false,
                    showNoProviderAlert: false,
                    noProviderMessage: '',
                    showContactInformation: false,
                  });
                }
              } else {
                // No providers available
                set({
                  showNoProviderAlert: true,
                  showProviderList: false,
                  showProviderLoader: false,
                  showContactInformation: false,
                  noProviderMessage: areaResponse?.message || 'No nearby service providers found for the requested time.'
                });
              }
            } else {
              // areaConfirmation failed
              set({
                showNoProviderAlert: true,
                showProviderList: false,
                showProviderLoader: false,
                showContactInformation: false,
                noProviderMessage: areaResponse?.message || 'Unable to load providers for this address.'
              });
            }
          } catch (error) {
            console.error('Error calling store_session_data API:', error);
            set({
              showProviderLoader: false,
              showNoProviderAlert: true,
              showProviderList: false,
              showContactInformation: false,
              noProviderMessage: 'Unable to load providers for this address.'
            });
          }
        }
      } catch (error) {
        console.error('Error handling address change:', error);
        set({
          showProviderLoader: false,
          showNoProviderAlert: true,
          showProviderList: false,
          noProviderMessage: 'Unable to load providers for this address.'
        });
      }
    },

    handleBookService: async (providerId: number, service: string, category: string) => {
      try {
        // Check if providers are available before proceeding
        const { providers, showProviderList } = get();

        // Only proceed if providers are available and provider list is shown
        if (!showProviderList || !providers || providers.length === 0) {
          console.log('No providers available, skipping contact information');
          return;
        }

        set({ isLoading: true });

        // First call store_session_data API
        const storeResponse = await servicesService.storeSessionData({
          selected_provider_id: providerId.toString()
        });

        // Capture first_request_id from response
        if (storeResponse?.success && storeResponse?.first_request_id) {
          set({ firstRequestId: storeResponse.first_request_id });
        }

        if (storeResponse?.success) {
          // Then call contact-information API
          const contactResponse = await servicesService.contactInformation({
            service,
            category
          });

          if (contactResponse?.success) {
            // Store the API response and show contact information section
            set({
              contactApiResponse: contactResponse,
              showContactInformation: true
            });
          } else {
            console.error('Failed to call contact-information API:', contactResponse?.message);
          }
        } else {
          console.error('Failed to store provider selection:', storeResponse?.message);
        }
      } catch (error) {
        console.error('Error in handleBookService:', error);
      } finally {
        set({ isLoading: false });
      }
    },

    handleProviderSearch: (query: string) => {
      const { providers } = get();
      // Filter providers based on search query
      const filteredProviders = providers.filter(provider =>
        provider.name.toLowerCase().includes(query.toLowerCase()) ||
        provider.services.toLowerCase().includes(query.toLowerCase())
      );
      set({ providers: filteredProviders });
    },

    // Contact form actions
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const { contactFormData } = get();
      set({
        contactFormData: {
          ...contactFormData,
          [name]: value
        }
      });
    },

    handlePhoneChange: (data: PhoneInputData) => {
      const { contactFormData } = get();
      set({
        phoneData: data,
        contactFormData: {
          ...contactFormData,
          phone: data.phone,
          dial_code: `+${data.countryCode}`,
          country_code: data.countryIso
        }
      });
    },

    handlePaymentMethodChange: (cardId: string) => {
      const { contactFormData } = get();
      set({
        contactFormData: {
          ...contactFormData,
          selectedPaymentMethodCard: cardId
        }
      });
    },

    handleFileChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const { contactFormData, previewImages } = get();
      const newFiles = [...contactFormData.files, ...files];

      // Limit to 10 files
      if (newFiles.length > 10) {
        alert('Maximum 10 images allowed');
        return;
      }

      set({
        contactFormData: {
          ...contactFormData,
          files: newFiles.slice(0, 10)
        }
      });

      // Batch preview creation
      const readers: Promise<string>[] = files.map(file => {
        return new Promise((resolve) => {
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              resolve(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
          } else {
            resolve('');
          }
        });
      });
      const results = await Promise.all(readers);
      const validResults = results.filter(r => r);
      set({ previewImages: [...previewImages, ...validResults].slice(0, 10) });
    },

    handleDrop: async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      const { contactFormData, previewImages } = get();
      const newFiles = [...contactFormData.files, ...files];

      // Limit to 10 files
      if (newFiles.length > 10) {
        alert('Maximum 10 images allowed');
        return;
      }

      set({
        contactFormData: {
          ...contactFormData,
          files: newFiles.slice(0, 10)
        }
      });

      // Batch preview creation
      const readers: Promise<string>[] = files.map(file => {
        return new Promise((resolve) => {
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              resolve(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
          } else {
            resolve('');
          }
        });
      });
      const results = await Promise.all(readers);
      const validResults = results.filter(r => r);
      set({ previewImages: [...previewImages, ...validResults].slice(0, 10) });
    },

    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    },

    handleBrowseClick: () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'image/*';
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files) {
          const { handleFileChange } = get();
          handleFileChange({ target } as React.ChangeEvent<HTMLInputElement>);
        }
      };
      input.click();
    },

    removeImage: (index: number) => {
      const { contactFormData, previewImages } = get();
      const newFiles = contactFormData.files.filter((_, i) => i !== index);
      const newPreviews = previewImages.filter((_, i) => i !== index);

      set({
        contactFormData: {
          ...contactFormData,
          files: newFiles
        },
        previewImages: newPreviews
      });
    },

    handleContactSubmit: async (service: string, category: string) => {
      try {
        set({ isLoading: true });
        const response = await servicesService.contactInformation({
          service,
          category
        });

        if (response?.success) {
          console.log('Contact information submitted successfully');
          // Handle success - could navigate to next step or show success message
        } else {
          console.error('Failed to submit contact information:', response?.message);
        }
      } catch (error) {
        console.error('Error submitting contact information:', error);
      } finally {
        set({ isLoading: false });
      }
    },

    handleAddRequest: async () => {
      try {
        set({ isLoading: true });
        const { contactFormData, firstRequestId, onNavigateToRequests } = get();

        const response = await servicesService.addRequest({
          contact_person: contactFormData.contact_person,
          phone: contactFormData.phone,
          dial_code: contactFormData.dial_code,
          country_code: contactFormData.country_code,
          user_timezone: getUserTimezoneOffset(), // User's actual timezone
          description: contactFormData.description,
          files: contactFormData.files,
          paymentMethodCard: contactFormData.selectedPaymentMethodCard,
          first_request_id: firstRequestId || undefined
        });

        if (response?.success) {
          // Show success alert that auto-closes
          Swal.fire({
            title: 'Success!',
            text: 'Your service request has been submitted successfully!',
            icon: 'success',
            timer: 2000, // Auto-close after 3 seconds
            timerProgressBar: true,
            showConfirmButton: false,
          });

          // Navigate to RequestsContent after a short delay
          setTimeout(() => {
            if (onNavigateToRequests) {
              onNavigateToRequests();
            }
          }, 1000); // Wait 1 second before navigating
        } else {
          // Show error alert
          Swal.fire({
            title: 'Error!',
            text: response?.message || 'Failed to submit request. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        console.error('handleAddRequest: Error submitting request:', error);
        // Show error alert for exceptions
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while submitting your request. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        set({ isLoading: false });
      }
    },

    setNavigateToRequests: (callback: () => void) => {
      set({ onNavigateToRequests: callback });
    },

    // Handle contact information when coming from search flow
    handleContactInformationFromSearch: async (service: string, category: string) => {
      try {
        set({ isLoading: true, showProviderLoader: true });
        const { selectedAddress } = get();

        // First call store_session_data API to get first_request_id
        const storeResponse = await servicesService.storeSessionData({
          service_address_id: selectedAddress?.toString()
        });

        // Capture first_request_id from response
        let firstRequestId = null;
        if (storeResponse?.success && storeResponse?.first_request_id) {
          firstRequestId = storeResponse.first_request_id;
          set({ firstRequestId });
        }

        // Then call area-confirmation API with first_request_id
        const areaResponse = await servicesService.areaConfirmation(firstRequestId);

        if (areaResponse?.success) {
          const metaSource = (areaResponse as any)?.data || areaResponse;
          const catId = Number((metaSource as any)?.catId || (metaSource as any)?.cat_id) || undefined;
          const subcatId = Number((metaSource as any)?.subcatId || (metaSource as any)?.subcat_id) || undefined;
          set({ areaMeta: catId || subcatId ? { catId, subcatId } : null });
          if (areaResponse.showProvider && areaResponse.providers?.length > 0) {
            // Providers are available, proceed with contact information
            const contactResponse = await servicesService.contactInformation({
              service,
              category
            });

            if (contactResponse?.success) {
              // Store the API response and show contact information section
              set({
                contactApiResponse: contactResponse,
                showContactInformation: true,
                showProviderLoader: false,
                isLoading: false,
                showNoProviderAlert: false, // Ensure no provider alert is false
              });
            } else {
              console.error('handleContactInformationFromSearch: Failed to call contact-information API:', contactResponse?.message);
              set({
                showProviderLoader: false,
                isLoading: false,
                showNoProviderAlert: true, // Show alert if contact info API fails
                showContactInformation: false, // Hide contact info if API fails
              });
            }
          } else {
            // No providers available, show no provider alert
            set({
              showNoProviderAlert: true,
              showProviderLoader: false,
              showContactInformation: false,
              isLoading: false
            });
          }
        } else {
          console.error('handleContactInformationFromSearch: Failed to call area-confirmation API:', areaResponse?.message);
          set({
            showNoProviderAlert: true,
            showProviderLoader: false,
            showContactInformation: false,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('handleContactInformationFromSearch: Error in handleContactInformationFromSearch:', error);
        set({
          showNoProviderAlert: true,
          showProviderLoader: false,
          showContactInformation: false,
          isLoading: false
        });
      }
    },

    // Reset actions
    resetProviderState: () => set({
      providers: [],
      showProviderLoader: false,
      showNoProviderAlert: false,
      showProviderList: false,
    }),

    resetContactState: () => set({
      showContactInformation: false,
      contactApiResponse: null,
      contactFormData: {
        contact_person: '',
        phone: '',
        dial_code: '+1',
        country_code: 'US',
        description: '',
        files: [],
        selectedPaymentMethodCard: ''
      },
      phoneData: {
        phone: '',
        countryCode: '1',
        countryIso: 'US'
      },
      previewImages: [],
      showPaymentSection: false,
      isLoading: false,
      firstRequestId: null,
    }),

    resetAll: () => set(initialState),
  }),

);
