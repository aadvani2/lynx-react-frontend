import React, { useState } from 'react';
import PhoneInput from '../public/PhoneInput';
import type { PhoneInputData } from '../../types/components';
import BackendImage from '../common/BackendImage/BackendImage';
import imageFailedToLoad from '../../assets/Icon/image-failed-to-load.png';

interface FormData {
  name: string;
  email: string;
  phone1: string;
  phone2: string;
  phone1_dial_code: string;
  phone1_country_code: string;
  phone2_dial_code: string;
  phone2_country_code: string;
  birth_date: string;
  description: string;
  password: string;
  confirm_password: string;
  image: File | null;
  displayImage: string;
}

interface EmployeeFormProps {
  isEditMode: boolean;
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPhoneChange: (data: PhoneInputData, field: 'phone1' | 'phone2') => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  isEditMode,
  formData,
  onInputChange,
  onPhoneChange,
  onFileChange,
  onSubmit,
  isSubmitting = false
}) => {
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Date validation state
  const [dateError, setDateError] = useState<string>('');

  // Get today's date in YYYY-MM-DD format for max attribute
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Validate date of birth
  const validateDateOfBirth = (date: string) => {
    if (!date) {
      setDateError('');
      return true;
    }

    const selectedDate = new Date(date);
    const today = new Date();

    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      setDateError('Date of birth cannot be in the future');
      return false;
    }

    setDateError('');
    return true;
  };

  // Handle date change with validation
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    validateDateOfBirth(value);
    onInputChange(e);
  };

  // Enhanced form submit with date validation
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate date before submitting
    if (!validateDateOfBirth(formData.birth_date)) {
      return;
    }

    onSubmit(e);
  };

  // Check if displayImage is a preview URL (data/blob) or backend path
  const isPreviewUrl = formData.displayImage && /^(data:|blob:)/i.test(formData.displayImage);

  // Helper function to get phone number without country code
  const getPhoneNumberOnly = (phone: string, dialCode: string) => {
    if (!phone) return '';

    // Remove the dial code from the beginning if it's included
    const cleanDialCode = dialCode.replace('+', '');
    if (phone.startsWith('+' + cleanDialCode)) {
      return phone.substring(cleanDialCode.length + 1);
    }
    if (phone.startsWith(cleanDialCode)) {
      return phone.substring(cleanDialCode.length);
    }

    return phone;
  };

  // Helper function to get country code from dial code
  const getCountryFromDialCode = (countryCode: string) => {
    // Return the ISO country code, defaulting to 'us' if not provided
    return countryCode ? countryCode.toLowerCase() : 'us';
  };

  const handlePhone1Change = (data: PhoneInputData) => {
    onPhoneChange(data, 'phone1');
  };

  const handlePhone2Change = (data: PhoneInputData) => {
    onPhoneChange(data, 'phone2');
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0">
          {isEditMode ? 'Edit Employee' : 'Add New Employee'}
        </h5>
      </div>
      <form className="text-start mb-3" id="form-add-employee" onSubmit={handleFormSubmit} autoComplete="off" encType="multipart/form-data">
        <input type="hidden" name="_token" defaultValue="dNXnicfTxifDUFolCVSVYUUotEc6a34UBXKQNjUL" autoComplete="off" />
        <div>
          {isEditMode && (
            <div className="alert alert-info alert-icon mt-0" role="alert" id="passwordNotice">
              <i className="uil uil-exclamation-circle" /> Leave Password and Confirm Password empty if you are not
              going to change the password.
            </div>
          )}

          <div className="form-floating mb-2 mb-md-4">
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Name"
              id="name"
              value={formData.name}
              onChange={onInputChange}
              required
            />
            <label htmlFor="name">Name</label>
          </div>

          <div className="form-floating mb-2 mb-md-4">
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Email"
              id="email"
              value={formData.email}
              onChange={onInputChange}
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          {/* Phone 1 */}
          <div className="mb-2 mb-md-4">
            <label htmlFor="phone1" className="form-label">Phone 1</label>
            <PhoneInput
              name="phone1"
              id="phone1"
              placeholder="Enter phone number"
              initialValue={getPhoneNumberOnly(formData.phone1, formData.phone1_dial_code)}
              defaultCountry={getCountryFromDialCode(formData.phone1_country_code)}
              onChange={handlePhone1Change}
              required
            />
          </div>

          {/* Phone 2 */}
          <div className="mb-2 mb-md-4">
            <label htmlFor="phone2" className="form-label">Phone 2 (Optional)</label>
            <PhoneInput
              name="phone2"
              id="phone2"
              placeholder="Enter phone number (optional)"
              initialValue={getPhoneNumberOnly(formData.phone2, formData.phone2_dial_code)}
              defaultCountry={getCountryFromDialCode(formData.phone2_country_code)}
              onChange={handlePhone2Change}
            />
          </div>

          <div className="form-floating mb-2 mb-md-4">
            <input
              type="date"
              className={`form-control ${dateError ? 'is-invalid' : ''}`}
              name="birth_date"
              placeholder="Birth Date"
              id="birth_date"
              value={formData.birth_date}
              max={getTodayDate()}
              onChange={handleDateChange}
              required
            />
            <label htmlFor="birth_date">Birth Date</label>
            {dateError && (
              <div className="invalid-feedback">
                {dateError}
              </div>
            )}
          </div>

          <div className="form-floating mb-2 mb-md-4">
            <textarea
              className="form-control"
              name="description"
              placeholder="Description"
              id="description"
              rows={4}
              value={formData.description}
              onChange={onInputChange}
            />
            <label htmlFor="description">Description</label>
          </div>

          <div className="form-floating password-field mb-2 mb-md-4">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              name="password"
              placeholder="Password"
              id="password"
              value={formData.password}
              onChange={onInputChange}
            />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              <i className={showPassword ? 'uil uil-eye-slash' : 'uil uil-eye'} />
            </span>
            <label htmlFor="password">Password</label>
          </div>

          <div className="form-floating password-field mb-2 mb-md-4">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="form-control"
              name="confirm_password"
              placeholder="Confirm Password"
              id="confirm_password"
              value={formData.confirm_password}
              onChange={onInputChange}
            />
            <span className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
              <i className={showConfirmPassword ? 'uil uil-eye-slash' : 'uil uil-eye'} />
            </span>
            <label htmlFor="confirm_password">Confirm Password</label>
          </div>

          <div className="form-floating mb-2 mb-md-4">
            <input
              type="file"
              className="form-control"
              name="image"
              id="profile_image"
              onChange={onFileChange}
              accept="image/jpeg,image/jpg,image/png,image/webp"
            />
            <label htmlFor="profile_image">Profile Image (JPG, PNG, WEBP - Max 2MB, 2000x2000px)</label>
            {formData.displayImage && (
              <div className="mt-4" style={{ paddingBottom: 5, width: '100px', height: '100px' }}>
                <BackendImage
                  src={formData.displayImage}
                  alt="Profile Preview"
                  className="w-100 h-100 object-fit-cover rounded"
                  placeholderImage={imageFailedToLoad}
                  placeholderText=""
                  useBackendUrl={!isPreviewUrl}
                />
              </div>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <button
            type="submit"
            className="btn btn-primary rounded-pill btn-login"
            id="submit-add-employee"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {isEditMode ? 'Saving...' : 'Adding...'}
              </>
            ) : (
              isEditMode ? 'Save Changes' : 'Add Employee'
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default EmployeeForm; 