import React from 'react';
import { useServiceTiersStore } from '../../../store/serviceTiersStore';

const AddressSection: React.FC = () => {
  const { apiData, setApiData } = useServiceTiersStore();

  return (
    <div className="row" id="addressDetails">
      <div className="col-md-8">
        <div className="form-floating mb-2 mb-md-4">
          <textarea 
            className="form-control" 
            name="address" 
            placeholder="Address" 
            id="address" 
            value={apiData?.address || ''}
            onChange={(e) => {
              // Update address only, location will be set in the form submission
              setApiData({ address: e.target.value });
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
            value={apiData?.unit_number || ''}
            onChange={(e) => {
              setApiData({ unit_number: e.target.value });
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
            value={apiData?.zip_code || ''}
            onChange={(e) => {
              setApiData({ zip_code: e.target.value });
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
            value={apiData?.city || ''}
            onChange={(e) => {
              setApiData({ city: e.target.value });
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
            value={apiData?.state || ''}
            onChange={(e) => {
              setApiData({ state: e.target.value });
            }}
          />
          <label htmlFor="state">State</label>
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
