import React, { useCallback } from 'react';
import { Autocomplete } from '@react-google-maps/api';

interface AddressSearchComponentProps {
  onAutocompleteLoad?: (autocomplete: google.maps.places.Autocomplete) => void;
  onPlaceChanged?: () => void;
  placeholder?: string;
  label?: string;
  inputId?: string;
  className?: string;
}

const AddressSearchComponent: React.FC<AddressSearchComponentProps> = ({
  onAutocompleteLoad,
  onPlaceChanged,
  placeholder = "",
  label = "Search Address",
  inputId = "autocomplete",
  className = "form-control pac-target-input"
}) => {
  const handleAutocompleteLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    onAutocompleteLoad?.(autocomplete);
  }, [onAutocompleteLoad]);

  const handlePlaceChanged = useCallback(() => {
    onPlaceChanged?.();
  }, [onPlaceChanged]);

  return (
    <Autocomplete onLoad={handleAutocompleteLoad} onPlaceChanged={handlePlaceChanged}>
      <div className="form-floating mb-2 mb-md-4">
        <input 
          type="text" 
          className={className} 
          name="location" 
          placeholder={placeholder} 
          id={inputId} 
          autoComplete="off" 
        />
        <label htmlFor={inputId}>{label}</label>
      </div>
    </Autocomplete>
  );
};

export default AddressSearchComponent;
