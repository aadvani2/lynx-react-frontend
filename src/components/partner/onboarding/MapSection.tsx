import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { MAP_CONFIG } from '../../../config/maps';
import { useOnboardingMapStore } from '../../../hooks/useOnboardingMap';

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
  const { markerPos } = useOnboardingMapStore();

  // Handle map load
  const handleMapLoad = (map: google.maps.Map) => {
    onLoadMap(map);
  };

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
