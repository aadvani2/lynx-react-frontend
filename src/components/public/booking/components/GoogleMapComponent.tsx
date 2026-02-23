import React, { useCallback } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { MAP_CONFIG } from '../../../../config/maps';

interface GoogleMapComponentProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  markerPosition?: google.maps.LatLngLiteral | null;
  onMapLoad?: (map: google.maps.Map) => void;
  onMapUnmount?: () => void;
  onMapClick?: (event: google.maps.MapMouseEvent) => void;
  mapContainerStyle?: React.CSSProperties;
  options?: google.maps.MapOptions;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  center,
  zoom,
  markerPosition,
  onMapLoad,
  onMapUnmount,
  onMapClick,
  mapContainerStyle = {
    width: '100%',
    height: '300px'
  },
  options = MAP_CONFIG.MAP_OPTIONS
}) => {
  const handleMapLoad = useCallback((map: google.maps.Map) => {
    onMapLoad?.(map);
  }, [onMapLoad]);

  const handleMapUnmount = useCallback(() => {
    onMapUnmount?.();
  }, [onMapUnmount]);

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    onMapClick?.(event);
  }, [onMapClick]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      onLoad={handleMapLoad}
      onUnmount={handleMapUnmount}
      onClick={handleMapClick}
      options={options}
    >
      {markerPosition && <Marker position={markerPosition} />}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
