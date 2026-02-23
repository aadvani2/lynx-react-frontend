import type { Libraries } from "@react-google-maps/api";

// Google Maps Configuration
export const GOOGLE_MAPS_LIBRARIES: Libraries = ["places", "marker"];

export const GOOGLE_MAPS_CONFIG = {
  API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyA9QKAggNqKYY4QGKZTX7MkfxT-lG41pog",
  LIBRARIES: GOOGLE_MAPS_LIBRARIES,
  VERSION: "weekly" as const
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 32.776664, lng: -96.796988 }, // Dallas, TX
  DEFAULT_ZOOM: 15,
  MAP_OPTIONS: {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  }
};

// Autocomplete Configuration
export const AUTOCOMPLETE_CONFIG = {
  TYPES: ['address'] as const,
  COUNTRY_RESTRICTION: 'us'
}; 