import { useCallback, useRef, useEffect } from 'react';
import { useServiceTiersStore } from '../store/serviceTiersStore';

export const useServiceTiersMap = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const {
    markerPos,
    radiusValues,
    selectedUnit,
    setMarkerPos,
    setApiData
  } = useServiceTiersStore();

  // Conversion functions
  const milesToMeters = (miles: number): number => miles * 1609.34;
  const kmToMeters = (km: number): number => km * 1000;

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
  }, [markerPos, radiusValues, selectedUnit]);

  // Update function - handles auto-zoom based on radius values
  const updateMap = useCallback(() => {
    if (!mapRef.current || !markerPos) return;
    
    // Auto-zoom to fit the radius values
    autoZoomToFitCircles();
  }, [markerPos, autoZoomToFitCircles]);


  // Map event handlers
  const onLoadMap = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmountMap = useCallback(() => {
    mapRef.current = null;
  }, []);


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
        let address = "", city = "", state = "", zip_code = "", country = "";
        
        comps.forEach((c) => {
          const t = c.types;
          if (t.includes("street_number")) address = c.long_name + " ";
          else if (t.includes("route")) address += c.long_name;
          else if (t.includes("locality")) city = c.long_name;
          else if (t.includes("administrative_area_level_1")) state = c.short_name;
          else if (t.includes("postal_code")) zip_code = c.long_name;
          else if (t.includes("country")) country = c.short_name;
        });

        setApiData({
          address: address.trim() || place.formatted_address || "",
          city,
          state,
          zip_code,
          country,
          latitude: lat,
          longitude: lng
        });
      }
    }
  }, [setMarkerPos, setApiData]);

  // Effects
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
