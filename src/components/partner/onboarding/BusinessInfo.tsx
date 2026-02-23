import React from 'react';

interface BusinessInfoProps {
  defaultValues?: {
    establishmentYear?: string | number;
    companySize?: string;
    bio?: string;
    description?: string;
  };
}

const BusinessInfo: React.FC<BusinessInfoProps> = ({ 
  defaultValues = {
    establishmentYear: '',
    companySize: '',
    bio: '',
    description: ''
  } 
}) => {
  return (
    <>
      <div className="col-md-12">
        <p className="lead mb-1 text-start">Additional Business Info</p>
        <p>Help us (and customers) get to know you better:</p>
      </div>
      <div className="col-md-6">
        <div className="form-floating mb-4">
          <input 
            type="number" 
            className="form-control" 
            name="exp" 
            required 
            placeholder="Establishment Year" 
            id="exp" 
            defaultValue={defaultValues.establishmentYear}
            onKeyDown={(e) => e.key === '.' && e.preventDefault()}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              target.value = target.value.replace(/[^0-9]*/g, '');
            }}
          />
          <label htmlFor="exp">Establishment Year</label>
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-floating mb-4">
          <select 
            className="form-select" 
            name="company_size" 
            id="company_size"
            defaultValue={defaultValues.companySize || 'Select Company Size'}
          >
            <option disabled>Select Company Size</option>
            <option value="1 to 10 Employees">1 to 10 Employees</option>
            <option value="11 to 50 Employees">11 to 50 Employees</option>
            <option value="51 to 100 Employees">51 to 100 Employees</option>
            <option value="101 to 500 Employees">101 to 500 Employees</option>
            <option value="501 to 1000 Employees">501 to 1000 Employees</option>
            <option value="1001 or More Employees">1001 or More Employees</option>
          </select>
          <label htmlFor="company_size">Company Size</label>
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-floating mb-4">
          <textarea 
            className="form-control" 
            name="bio" 
            placeholder="Short Bio" 
            rows={3} 
            id="bio" 
            defaultValue={defaultValues.bio}
          />
          <label htmlFor="bio">Short Bio</label>
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-floating mb-4">
          <textarea 
            className="form-control" 
            name="description" 
            placeholder="Business Description" 
            rows={3} 
            id="description" 
            defaultValue={defaultValues.description}
          />
          <label htmlFor="description">Business Description</label>
        </div>
      </div>
      <div className="alert d-none" id="response" />
    </>
  );
};

export default BusinessInfo;
