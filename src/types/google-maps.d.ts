declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google.maps {
  class Map {
    constructor(mapDiv: HTMLElement, opts?: MapOptions);
    setCenter(latLng: LatLng | LatLngLiteral): void;
  }

  class Marker {
    constructor(opts?: MarkerOptions);
    setPosition(latLng: LatLng | LatLngLiteral): void;
    getPosition(): LatLng | null;
    addListener(eventName: string, handler: (...args: unknown[]) => void): MapsEventListener;
  }

  // New Advanced Marker (recommended)
  namespace marker {
    class AdvancedMarkerElement {
      constructor(opts?: AdvancedMarkerOptions);
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      addListener(eventName: string, handler: (...args: unknown[]) => void): MapsEventListener;
    }

    interface AdvancedMarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
    }
  }

  class Geocoder {
    geocode(request: GeocoderRequest, callback: (results: GeocoderResult[] | null, status: GeocoderStatus) => void): void;
  }

  namespace places {
    class Autocomplete {
      constructor(input: HTMLInputElement, opts?: AutocompleteOptions);
      addListener(eventName: string, handler: (...args: unknown[]) => void): void;
      getPlace(): PlaceResult;
    }

    // New PlaceAutocompleteElement (recommended)
    class PlaceAutocompleteElement extends HTMLElement {
      constructor();
      addListener(eventName: string, handler: (...args: unknown[]) => void): MapsEventListener;
      getPlace(): PlaceResult;
    }
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
  }

  interface MarkerOptions {
    position?: LatLng | LatLngLiteral;
    map?: Map;
    draggable?: boolean;
  }

  interface LatLng {
    lat(): number;
    lng(): number;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface GeocoderRequest {
    location?: LatLng | LatLngLiteral;
  }

  interface GeocoderResult {
    address_components: GeocoderAddressComponent[];
  }

  interface GeocoderAddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }

  interface AutocompleteOptions {
    types?: string[];
    componentRestrictions?: ComponentRestrictions;
  }

  interface ComponentRestrictions {
    country: string | string[];
  }

  interface PlaceResult {
    geometry?: PlaceGeometry;
    formatted_address?: string;
    address_components?: GeocoderAddressComponent[];
  }

  interface PlaceGeometry {
    location?: LatLng;
  }

  type GeocoderStatus = 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR';
  type MapsEventListener = unknown;
}

export {}; 