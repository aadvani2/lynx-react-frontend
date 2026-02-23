// Component-related Types

// Phone Input Types
export interface PhoneInputData {
  phone: string;
  countryCode: string;
  countryIso: string;
}

export interface PhoneInputProps {
  onChange?: (data: PhoneInputData) => void;
  defaultCountry?: string;
  initialValue?: string;
  maxLength?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
}

// Google Maps Location Picker Types
export interface LocationData {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface GoogleMapsLocationPickerProps {
  initialLocation?: { lat: number; lng: number };
  onLocationChange?: (location: LocationData) => void;
  height?: string;
  className?: string;
}

// Address Selection Visibility Types
export interface ProviderListVisibility {
  addresses: any[];
  showAddressEditor: boolean;
  showProviderList: boolean;
  fromSearch: boolean;
}

export interface ContactInformationVisibility {
  addresses: any[];
  isLoading: boolean;
  showAddressEditor: boolean;
  showContactInformation: boolean;
  fromSearch: boolean;
  showNoProviderAlert: boolean;
}

export interface ProviderLoaderVisibility {
  showProviderLoader: boolean;
  showAddressEditor: boolean;
  fromSearch: boolean;
  showContactInformation: boolean;
}

export interface NoProviderAlertVisibility {
  showNoProviderAlert: boolean;
  showAddressEditor: boolean;
  fromSearch: boolean;
}

export interface PreviousButtonVisibility {
  showContactInformation: boolean;
  fromSearch: boolean;
}

export interface ParsedAddressComponents {
  city: string;
  state: string;
  zip_code: string;
  street_address: string; // Add this for completeness, if needed elsewhere
}
