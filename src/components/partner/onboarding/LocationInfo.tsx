import React from 'react';

interface LocationInfoProps {
  defaultValues?: {
    address?: string;
    unit_number?: string;
    zip_code?: string;
    city?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
    country?: string;
  };
}

const LocationInfo: React.FC<LocationInfoProps> = ({ 
  defaultValues = {
    address: '',
    unit_number: '',
    zip_code: '',
    city: '',
    state: '',
    latitude: 0,
    longitude: 0,
    country: ''
  }
}) => {
  return (
    <>
      <div className="col-md-12">
        <p className="lead mb-3 text-start">Location Information</p>
      </div>
      <div className="col-md-12">
        <div className="form-floating mb-4">
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
        <div className="form-floating mb-4">
          {/* map */}
          <input 
            type="hidden" 
            className="form-control" 
            name="latitude" 
            id="latitude" 
            data-validate-hidden 
            defaultValue={defaultValues.latitude} 
          />
          <input 
            type="hidden" 
            className="form-control" 
            name="longitude" 
            id="longitude" 
            data-validate-hidden 
            defaultValue={defaultValues.longitude} 
          />
          <input 
            type="hidden" 
            className="form-control" 
            name="country" 
            id="country" 
            data-validate-hidden 
            defaultValue={defaultValues.country} 
          />
        </div>
      </div>

      {/* Address Details */}
      <div className="row" id="addressDetails">
        <div className="col-md-8">
          <div className="form-floating mb-4">
            <input 
              type="text" 
              className="form-control" 
              name="address" 
              placeholder="Address" 
              data-validate-hidden 
              id="address" 
              defaultValue={defaultValues.address} 
            />
            <label htmlFor="address">Address</label>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating mb-4">
            <input 
              type="text" 
              className="form-control" 
              name="unit_number" 
              placeholder="Unit Number" 
              id="unit_number" 
              defaultValue={defaultValues.unit_number} 
            />
            <label htmlFor="unit_number">Unit Number</label>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating mb-4">
            <input 
              type="text" 
              className="form-control" 
              name="zip_code" 
              data-validate-hidden 
              placeholder="Zip code" 
              id="zip_code" 
              defaultValue={defaultValues.zip_code} 
            />
            <label htmlFor="zip_code">Zip code</label>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating mb-4">
            <input 
              type="text" 
              className="form-control" 
              name="city" 
              data-validate-hidden 
              placeholder="City" 
              id="city" 
              defaultValue={defaultValues.city} 
            />
            <label htmlFor="city">City</label>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating mb-4">
            <input 
              type="text" 
              className="form-control" 
              name="state" 
              data-validate-hidden 
              placeholder="State" 
              id="state" 
              defaultValue={defaultValues.state} 
            />
            <label htmlFor="state">State</label>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationInfo;
