import { useCallback, useRef, useEffect } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Define state interface for onboarding location data
export interface OnboardingMapState {
  // Location data
  markerPos: { lat: number; lng: number } | null;
  unitNumber: string;
  
  // Address data
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  
  // Radius data
  selectedUnit: 'miles' | 'km';
  radiusValues: {
    emergency: number | '';
    scheduled: number | '';
  };
  
  // Actions
  setMarkerPos: (pos: { lat: number; lng: number } | null) => void;
  setUnitNumber: (unitNumber: string) => void;
  setAddressData: (data: Partial<{
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  }>) => void;
  setSelectedUnit: (unit: 'miles' | 'km') => void;
  setRadiusValues: (values: Partial<{ emergency: number | ''; scheduled: number | '' }>) => void;
}

// Create Zustand store for onboarding map data
export const useOnboardingMapStore = create<OnboardingMapState>()(
  devtools(
    (set) => ({
      // Default initial values
      markerPos: {
        lat: 32.776373,
        lng: -96.810897
      },
      unitNumber: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      latitude: 0,
      longitude: 0,
      selectedUnit: 'miles',
      radiusValues: {
        emergency: '',
        scheduled: ''
      },
      
      // Actions
      setMarkerPos: (markerPos) => set({ markerPos }),
      setUnitNumber: (unitNumber) => set({ unitNumber }),
      setAddressData: (data) => set((state) => ({ ...state, ...data })),
      setSelectedUnit: (selectedUnit) => set({ selectedUnit }),
      setRadiusValues: (values) => set((state) => ({
        radiusValues: { ...state.radiusValues, ...values }
      }))
    }),
    {
      name: 'onboarding-map-store'
    }
  )
);

// Hook for map functionality
export const useOnboardingMap = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const emergencyCircleRef = useRef<google.maps.Circle | null>(null);
  const scheduledCircleRef = useRef<google.maps.Circle | null>(null);
  
  const {
    markerPos,
    radiusValues,
    selectedUnit,
    setMarkerPos,
    setAddressData
  } = useOnboardingMapStore();

  // Conversion functions
  const milesToMeters = (miles: number): number => miles * 1609.34;
  const kmToMeters = (km: number): number => km * 1000;

  // Get circle radius in meters
  const getRadiusInMeters = (radius: number | ''): number => {
    if (radius === '' || radius === null || radius === undefined || (typeof radius === 'number' && radius <= 0)) {
      return 0;
    }
    return selectedUnit === 'miles' ? milesToMeters(radius as number) : kmToMeters(radius as number);
  };

  // Clear all circles
  const clearAllCircles = useCallback(() => {
    if (emergencyCircleRef.current) {
      emergencyCircleRef.current.setMap(null);
      emergencyCircleRef.current = null;
    }
    if (scheduledCircleRef.current) {
      scheduledCircleRef.current.setMap(null);
      scheduledCircleRef.current = null;
    }
  }, []);

  // Create circle
  const createCircle = useCallback((center: { lat: number; lng: number }, radius: number, color: string) => {
    if (!mapRef.current || radius <= 0) return null;
    return new google.maps.Circle({
      center,
      radius,
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.2,
      map: mapRef.current
    });
  }, []);

  // Update circles based on current values
  const updateCircles = useCallback(() => {
    if (!mapRef.current || !markerPos) return;
    clearAllCircles();
    // Emergency: yellow
    if (radiusValues.emergency !== '' && typeof radiusValues.emergency === 'number' && radiusValues.emergency > 0) {
      const radius = getRadiusInMeters(radiusValues.emergency);
      emergencyCircleRef.current = createCircle(markerPos, radius, '#FFD600'); // yellow
    }
    // Scheduled: green
    if (radiusValues.scheduled !== '' && typeof radiusValues.scheduled === 'number' && radiusValues.scheduled > 0) {
      const radius = getRadiusInMeters(radiusValues.scheduled);
      scheduledCircleRef.current = createCircle(markerPos, radius, '#00FF00'); // green
    }
  }, [markerPos, radiusValues, selectedUnit, clearAllCircles, createCircle, getRadiusInMeters]);

  // Auto-zoom function based on circle radius
  const autoZoomToFitCircles = useCallback(() => {
    if (!mapRef.current || !markerPos) return;

    const emergencyRadius = typeof radiusValues.emergency === 'number' ? radiusValues.emergency : 0;
    const scheduledRadius = typeof radiusValues.scheduled === 'number' ? radiusValues.scheduled : 0;
    const maxRadius = Math.max(emergencyRadius, scheduledRadius);
    
    // Always center the map on the marker, even if radius is 0
    mapRef.current.setCenter(markerPos);
    
    if (maxRadius <= 0) {
      // If radius is 0, set a default zoom level for better visibility
      mapRef.current.setZoom(14);
      return;
    }

    // Convert radius to meters for zoom calculation
    const radiusInMeters = selectedUnit === 'miles' ? milesToMeters(maxRadius) : kmToMeters(maxRadius);
    
    // Calculate appropriate zoom level based on radius
    let zoomLevel;
    if (radiusInMeters < 500) { // Very small radius (less than 500m)
      zoomLevel = 16;
    } else if (radiusInMeters < 1000) { // Less than 1km
      zoomLevel = 15;
    } else if (radiusInMeters < 5000) { // Less than 5km
      zoomLevel = 13;
    } else if (radiusInMeters < 10000) { // Less than 10km
      zoomLevel = 11;
    } else if (radiusInMeters < 25000) { // Less than 25km
      zoomLevel = 9;
    } else if (radiusInMeters < 50000) { // Less than 50km
      zoomLevel = 7;
    } else {
      zoomLevel = 5; // Very large radius
    }

    // Set zoom level with smooth transition
    mapRef.current.setZoom(zoomLevel);
  }, [markerPos, radiusValues, selectedUnit, milesToMeters, kmToMeters]);

  // Update function - handles auto-zoom and circles based on radius values
  const updateMap = useCallback(() => {
    if (!mapRef.current || !markerPos) return;
    updateCircles();
    autoZoomToFitCircles();
  }, [markerPos, updateCircles, autoZoomToFitCircles]);

  // Map event handlers
  const onLoadMap = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    // Set initial position if marker exists
    if (markerPos && mapRef.current) {
      mapRef.current.setCenter(markerPos);
      updateMap();
    }
  }, [markerPos, updateMap]);

  const onUnmountMap = useCallback(() => {
    clearAllCircles();
    mapRef.current = null;
  }, [clearAllCircles]);

  const onAutocompleteLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const pos = { lat, lng };
        
        setMarkerPos(pos);
        if (mapRef.current) {
          mapRef.current.setCenter(pos);
        }
        
        // Parse address components
        const comps = place.address_components ?? [];
        let address = "", city = "", state = "", zipCode = "", country = "";
        
        comps.forEach((c) => {
          const t = c.types;
          if (t.includes("street_number")) address = c.long_name + " ";
          else if (t.includes("route")) address += c.long_name;
          else if (t.includes("locality")) city = c.long_name;
          else if (t.includes("administrative_area_level_1")) state = c.short_name;
          else if (t.includes("postal_code")) zipCode = c.long_name;
          else if (t.includes("country")) country = c.short_name;
        });

        setAddressData({
          address: address.trim() || place.formatted_address || "",
          city,
          state,
          zipCode,
          country,
          latitude: lat,
          longitude: lng
        });
      }
    }
  }, [setMarkerPos, setAddressData]);

  // Effects to update map when values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateMap();
    }, 300); // 300ms delay for smooth real-time updates

    return () => clearTimeout(timeoutId);
  }, [radiusValues, selectedUnit, updateMap]);

  useEffect(() => {
    if (markerPos) {
      updateMap();
    }
  }, [markerPos, updateMap]);

  return {
    onLoadMap,
    onUnmountMap,
    onAutocompleteLoad,
    onPlaceChanged
  };
};
