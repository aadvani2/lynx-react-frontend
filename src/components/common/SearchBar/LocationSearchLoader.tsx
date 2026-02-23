import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_CONFIG } from "../../../config/maps";
import { servicesService } from "../../../services/generalServices/servicesService";
import LocationSearch from "../../public/home-page/NewHero/Components/LocationSearch";

interface LocationSearchLoaderProps {
  location: string;
  onLocationChange: (value: string) => void;
  onLocationSelect: () => void;
  onZipCodeChange: (zipCode: string) => void;
  when: "emergency" | "later" | null;
}

const LocationSearchLoader: React.FC<LocationSearchLoaderProps> = ({
  location,
  onLocationChange,
  onLocationSelect,
  onZipCodeChange,
  when,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.API_KEY,
    libraries: GOOGLE_MAPS_CONFIG.LIBRARIES,
  });

  if (!isLoaded) {
    return <div className="search__location-loading">Loading location…</div>;
  }

  return (
    <LocationSearch
      isLoaded={isLoaded}
      location={location}
      onLocationChange={onLocationChange}
      onLocationSelect={onLocationSelect}
      onZipCodeChange={onZipCodeChange}
      when={when}
      servicesService={servicesService}
    />
  );
};

export default LocationSearchLoader;
