import React, { useRef, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { MAP_CONFIG } from '../../../config/maps';
import { useServiceTiersStore } from '../../../store/serviceTiersStore';

interface MapSectionProps {
  isLoaded: boolean;
  onLoadMap: (map: google.maps.Map) => void;
  onUnmountMap: () => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '300px'
};

const MapSection: React.FC<MapSectionProps> = ({
  isLoaded,
  onLoadMap,
  onUnmountMap
}) => {
  const { markerPos, radiusValues, selectedUnit } = useServiceTiersStore();
  const mapRef = useRef<google.maps.Map | null>(null);
  const emergencyCircleRef = useRef<google.maps.Circle | null>(null);
  const scheduledCircleRef = useRef<google.maps.Circle | null>(null);

  // Conversion functions
  const milesToMeters = (miles: number): number => miles * 1609.34;
  const kmToMeters = (km: number): number => km * 1000;

  // Get circle radius in meters
  const getRadiusInMeters = (radius: number | '') => {
    if (radius === '' || radius === null || radius === undefined || (typeof radius === 'number' && radius <= 0)) {
      return 0;
    }
    return selectedUnit === 'miles' ? milesToMeters(radius as number) : kmToMeters(radius as number);
  };

  // Clear all circles
  const clearAllCircles = () => {
    if (emergencyCircleRef.current) {
      emergencyCircleRef.current.setMap(null);
      emergencyCircleRef.current = null;
    }
    if (scheduledCircleRef.current) {
      scheduledCircleRef.current.setMap(null);
      scheduledCircleRef.current = null;
    }
  };

  // Create circle
  const createCircle = (center: { lat: number; lng: number }, radius: number, color: string) => {
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
  };

  // Update circles based on current values
  const updateCircles = () => {
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
  };

  // Handle map load
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    onLoadMap(map);
  };

  // Update circles when values change
  useEffect(() => {
    if (markerPos) {
      updateCircles();
    }
  }, [markerPos, radiusValues, selectedUnit]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllCircles();
    };
  }, []);

  return (
    <>
      {isLoaded && (
        <div className="mb-3">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={markerPos || MAP_CONFIG.DEFAULT_CENTER}
            zoom={MAP_CONFIG.DEFAULT_ZOOM}
            onLoad={handleMapLoad}
            onUnmount={onUnmountMap}
            options={MAP_CONFIG.MAP_OPTIONS}
          >
            {markerPos && <Marker position={markerPos} />}
          </GoogleMap>
        </div>
      )}
    </>
  );
};

export default MapSection;
