import React, { useState, useEffect } from 'react';
import PhoneInput from '../../public/PhoneInput';

interface ContactPersonInfoProps {
  defaultName?: string;
  defaultPhone?: string;
  defaultCountryCode?: string;
  defaultCountryIso?: string;
}

const ContactPersonInfo: React.FC<ContactPersonInfoProps> = ({ 
  defaultName = '',
  defaultPhone = '',
  defaultCountryCode = '1',
  defaultCountryIso = 'US'
}) => {
  const [phone, setPhone] = useState(defaultPhone);
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [countryIso, setCountryIso] = useState(defaultCountryIso);

  // Update state when props change (e.g., when API data loads)
  useEffect(() => {
    // Always update to allow clearing or setting values
    setPhone(defaultPhone || '');
    setCountryCode(defaultCountryCode || '1');
    setCountryIso(defaultCountryIso || 'US');
  }, [defaultPhone, defaultCountryCode, defaultCountryIso]);

  const handlePhoneInputChange = ({ phone, countryCode, countryIso }: { phone: string; countryCode: string; countryIso: string }) => {
    setPhone(phone);
    setCountryCode(countryCode);
    setCountryIso(countryIso);
  };

  return (
    <>
      <div className="col-md-12">
        <p className="lead mb-3 text-start">Contact Person Information</p>
        <hr className='mt-0 mb-5 ' />
      </div>
      <div className="col-md-6">
        <div className="form-group mb-4">
        <label htmlFor="contact_person" className="form-label">Name</label>
        <input 
            type="text" 
            className="form-control" 
            name="contact_person" 
            placeholder="Name" 
            id="contact_person" 
            defaultValue={defaultName} 
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-group mb-4" id="phoneDiv">
          <label htmlFor="cp_phone" className="form-label">Phone Number</label>
          <PhoneInput 
            onChange={handlePhoneInputChange} 
            initialValue={phone} 
            defaultCountry={countryIso.toLowerCase()} 
            name="cp_phone" 
            id="cp_phone" 
            required={true}
          />
          <input type="hidden" name="cp_dial_code" id="cp_dial_code" value={countryCode} />
          <input type="hidden" name="cp_country_code" id="cp_country_code" value={countryIso} />
        </div>
      </div>
    </>
  );
};

export default ContactPersonInfo;
