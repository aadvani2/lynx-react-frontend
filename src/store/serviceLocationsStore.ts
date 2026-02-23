import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AddressItem, ServiceLocationsState } from '../types/serviceLocations';
import { customerService } from '../services/customerServices/customerService';

export const useServiceLocationsStore = create<ServiceLocationsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      addresses: [],
      totalLocations: 0,
      isLoading: false,
      error: null,
      showEditor: false,
      editorMode: 'add',
      editorInitial: undefined,
      isSaving: false,
      
      // Form state
      formData: {
        id: undefined,
        type: 'home',
        blockNo: '',
        fullAddress: '',
        zip: '',
        city: '',
        state: '',
        country: '',
        lat: undefined,
        lng: undefined,
      },

      // Address list actions
      setAddresses: (addresses) => set({ addresses }),
      setTotalLocations: (count) => set({ totalLocations: count }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      addAddress: (address) => set((state) => ({
        addresses: [...state.addresses, address],
        totalLocations: state.totalLocations + 1
      })),
      
      updateAddress: (id, updatedAddress) => set((state) => ({
        addresses: state.addresses.map(addr => 
          addr.id === id ? { ...addr, ...updatedAddress } : addr
        )
      })),
      
      removeAddress: (id) => set((state) => ({
        addresses: state.addresses.filter(addr => addr.id !== id),
        totalLocations: Math.max(0, state.totalLocations - 1)
      })),
      
      clearAddresses: () => set({ addresses: [], totalLocations: 0 }),

      // Editor actions
      setShowEditor: (show) => set({ showEditor: show }),
      setEditorMode: (mode) => set({ editorMode: mode }),
      setEditorInitial: (initial) => set({ editorInitial: initial }),
      setSaving: (saving) => set({ isSaving: saving }),
      
      // Form actions
      setFormData: (data) => set((state) => ({ 
        formData: { ...state.formData, ...data } 
      })),
      resetFormData: () => set({ 
        formData: {
          id: undefined,
          type: 'home',
          blockNo: '',
          fullAddress: '',
          zip: '',
          city: '',
          state: '',
          country: '',
          lat: undefined,
          lng: undefined,
        }
      }),
      
      openAddEditor: () => set({
        showEditor: true,
        editorMode: 'add',
        editorInitial: undefined,
        formData: {
          id: undefined,
          type: 'home',
          blockNo: '',
          fullAddress: '',
          zip: '',
          city: '',
          state: '',
          country: '',
          lat: undefined,
          lng: undefined,
        }
      }),
      
      openEditEditor: (address) => set({
        showEditor: true,
        editorMode: 'edit',
        editorInitial: address,
        formData: {
          id: address.id,
          type: address.type || 'home',
          blockNo: address.block_no ? String(address.block_no) : address.unit_number || '',
          fullAddress: address.full_address || address.address || '',
          zip: address.zip_code || '',
          city: address.city || '',
          state: address.state || '',
          country: address.country || '',
          lat: address.latitude,
          lng: address.longitude,
        }
      }),
      
      closeEditor: () => set({
        showEditor: false,
        editorMode: 'add',
        editorInitial: undefined,
        isSaving: false,
        formData: {
          id: undefined,
          type: 'home',
          blockNo: '',
          fullAddress: '',
          zip: '',
          city: '',
          state: '',
          country: '',
          lat: undefined,
          lng: undefined,
        }
      }),

      // Combined actions
      loadAddresses: async () => {
        set({ isLoading: true, error: null });
        try {
          // Use statically imported customerService
          
          const tzOffsetMinutes = new Date().getTimezoneOffset();
          const timezoneHours = -tzOffsetMinutes / 60;
          
          const res = await customerService.getAddresses(timezoneHours);
          const raw = (res && (res as unknown as { data?: unknown }).data) ?? res;
          
          // Extract addresses and count
          let list: AddressItem[] = [];
          let count = 0;
          
          if (typeof raw === 'object' && raw !== null) {
            const obj = raw as any;
            
            if (Array.isArray(obj.addresses)) {
              list = obj.addresses;
            }
            
            if (obj.data !== undefined) {
              if (Array.isArray(obj.data)) {
                list = obj.data;
              } else {
                const dataObj = obj.data as { addresses?: AddressItem[]; location_count?: number };
                if (Array.isArray(dataObj.addresses)) list = dataObj.addresses;
                if (typeof dataObj.location_count === 'number') count = dataObj.location_count;
              }
            }
          }
          
          if (!count) count = Array.isArray(list) ? list.length : 0;
          
          set({ 
            addresses: list, 
            totalLocations: count, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Error loading addresses:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load addresses',
            isLoading: false 
          });
        }
      },

      saveAddress: async () => {
        set({ isSaving: true, error: null });
        try {
          const tzOffsetMinutes = new Date().getTimezoneOffset();
          const timezoneHours = -tzOffsetMinutes / 60;
          
          const { editorMode, formData } = get();
          
          const payload = {
            id: formData.id || Date.now(),
            type: formData.type,
            block_no: formData.blockNo,
            full_address: formData.fullAddress,
            zip_code: formData.zip,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            latitude: formData.lat,
            longitude: formData.lng,
            user_timezone: timezoneHours,
          };

          if (editorMode === 'edit' && formData.id) {
            // Update existing address - API method doesn't exist yet, so just update local state
            get().updateAddress(formData.id, payload as AddressItem);
          } else {
            // Add new address - API method doesn't exist yet, so just add to local state
            get().addAddress(payload as AddressItem);
          }
          
          set({ isSaving: false });
          get().closeEditor();
          
          // Reload addresses to ensure consistency
          await get().loadAddresses();
        } catch (error) {
          console.error('Error saving address:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to save address',
            isSaving: false 
          });
        }
      },

      deleteAddress: async (id) => {
        try {
          // Use statically imported customerService
          
          await customerService.deleteAddress(id);
          get().removeAddress(id);
        } catch (error) {
          console.error('Error deleting address:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete address'
          });
        }
      }
    }),
    {
      name: 'service-locations-store',
    }
  )
);
