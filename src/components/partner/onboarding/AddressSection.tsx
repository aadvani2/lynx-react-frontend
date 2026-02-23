import React from 'react';
import { useOnboardingMapStore } from '../../../hooks/useOnboardingMap';

const AddressSection: React.FC = () => {
  const { 
    address, 
    city, 
    state, 
    zipCode, 
    unitNumber, 
    setAddressData, 
    setUnitNumber 
  } = useOnboardingMapStore();

  return (
    <div className="row" id="addressDetails">
      <div className="col-md-8">
        <div className="form-floating mb-2 mb-md-4">
          <textarea 
            className="form-control" 
            name="address" 
            placeholder="Address" 
            id="address" 
            value={address}
            onChange={(e) => {
              setAddressData({ address: e.target.value });
            }}
          />
          <label htmlFor="address">Address</label>
        </div>
      </div>
      <div className="col-md-4">
        <div className="form-floating mb-2 mb-md-4">
          <input 
            type="text" 
            className="form-control" 
            name="unit_number" 
            placeholder="Unit Number" 
            id="unit_number" 
            value={unitNumber}
            onChange={(e) => {
              setUnitNumber(e.target.value);
            }}
          />
          <label htmlFor="unit_number">Unit Number</label>
        </div>
      </div>
      <div className="col-md-4">
        <div className="form-floating mb-2 mb-md-4">
          <input 
            type="text" 
            className="form-control zip_code_val" 
            name="zip_code" 
            placeholder="Zip code" 
            id="zip_code" 
            value={zipCode}
            onChange={(e) => {
              setAddressData({ zipCode: e.target.value });
            }}
          />
          <label htmlFor="zip_code">Zip code</label>
        </div>
      </div>
      <div className="col-md-4">
        <div className="form-floating mb-2 mb-md-4">
          <input 
            type="text" 
            className="form-control" 
            name="city" 
            placeholder="City" 
            id="city" 
            value={city}
            onChange={(e) => {
              setAddressData({ city: e.target.value });
            }}
          />
          <label htmlFor="city">City</label>
        </div>
      </div>
      <div className="col-md-4">
        <div className="form-floating mb-2 mb-md-4">
          <input 
            type="text" 
            className="form-control" 
            name="state" 
            placeholder="State" 
            id="state" 
            value={state}
            onChange={(e) => {
              setAddressData({ state: e.target.value });
            }}
          />
          <label htmlFor="state">State</label>
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
