import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ManageServiceTiersResponse } from '../hooks/useManageServiceTiers';

export interface LocationData {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface RadiusValues {
  emergency: number | '';
  scheduled: number | '';
}

export interface ServiceTiersState {
  // Location data
  unitNumber: string;
  markerPos: { lat: number; lng: number } | null;
  
  // Radius data
  selectedUnit: 'miles' | 'km';
  radiusValues: RadiusValues;
  
  // Map data
  emergencyCircle: google.maps.Circle | null;
  scheduledCircle: google.maps.Circle | null;
  
  // API data
  apiData: ManageServiceTiersResponse | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setMarkerPos: (pos: { lat: number; lng: number } | null) => void;
  setSelectedUnit: (unit: 'miles' | 'km') => void;
  setRadiusValues: (values: Partial<RadiusValues>) => void;
  setEmergencyCircle: (circle: google.maps.Circle | null) => void;
  setScheduledCircle: (circle: google.maps.Circle | null) => void;
  setApiData: (data: ManageServiceTiersResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utility actions
  clearAllCircles: () => void;
  resetForm: () => void;
}

const initialState = {
 
  markerPos: {
    lat: 32.776373,
    lng: -96.810897
  },
  selectedUnit: 'miles' as const,
  radiusValues: {
    emergency: '' as number | '',
    scheduled: '' as number | ''
  },
  emergencyCircle: null,
  scheduledCircle: null,
  apiData: null,
  loading: false,
  error: null
};

export const useServiceTiersStore = create<ServiceTiersState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      setMarkerPos: (markerPos) => 
        set({ markerPos }),
      
      setSelectedUnit: (selectedUnit) => 
        set({ selectedUnit }),
      
      setRadiusValues: (values) => 
        set((state) => ({
          radiusValues: { ...state.radiusValues, ...values }
        })),
      
      setEmergencyCircle: (emergencyCircle) => 
        set({ emergencyCircle }),
      
      setScheduledCircle: (scheduledCircle) => 
        set({ scheduledCircle }),
      
      setApiData: (apiData) => 
        set((state) => ({ 
          apiData: state.apiData === null 
            ? apiData 
            : { ...state.apiData, ...apiData } 
        })),
      
      setLoading: (loading) => 
        set({ loading }),
      
      setError: (error) => 
        set({ error }),
      
      clearAllCircles: () => {
        const { emergencyCircle, scheduledCircle } = get();
        if (emergencyCircle) {
          emergencyCircle.setMap(null);
        }
        if (scheduledCircle) {
          scheduledCircle.setMap(null);
        }
        set({ emergencyCircle: null, scheduledCircle: null });
      },
      
      resetForm: () => 
        set(initialState)
    }),
    {
      name: 'service-tiers-store'
    }
  )
);
