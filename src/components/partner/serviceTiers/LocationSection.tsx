import React from 'react';
import { Autocomplete } from '@react-google-maps/api';

interface LocationSectionProps {
  isLoaded: boolean;
  onAutocompleteLoad: (autocomplete: google.maps.places.Autocomplete) => void;
  onPlaceChanged: () => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  isLoaded,
  onAutocompleteLoad,
  onPlaceChanged
}) => {
  return (
    <div className="row">
      <div className="col-md-12">
        {isLoaded ? (
          <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
            <div className="form-floating mb-2 mb-md-4">
              <input 
                type="text" 
                className="form-control pac-target-input" 
                name="location" 
                placeholder="Search Business Address" 
                id="autocomplete" 
                autoComplete="off" 
              />
              <label htmlFor="autocomplete">Search Business Address</label>
            </div>
          </Autocomplete>
        ) : (
          <div className="form-floating mb-2 mb-md-4">
            <input 
              type="text" 
              className="form-control" 
              name="location" 
              placeholder="Search Business Address" 
              id="autocomplete" 
              autoComplete="off" 
              disabled 
            />
            <label htmlFor="autocomplete">Search Business Address</label>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSection;
