import React from 'react';
import PhoneInput from '../../components/public/PhoneInput';
import { useCustomerProfile } from '../../hooks/useCustomerProfile';
import BackendImage from '../common/BackendImage/BackendImage';
import imageFailedToLoad from '../../assets/Icon/image-failed-to-load.png';

interface ProfileContentProps {
  setActivePage: (page: string) => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ setActivePage }) => {
  const {
    formData,
    loading,
    error,
    imagePreviewUrl,
    fullPhoneForInit,
    handleInputChange,
    handleFileChange,
    handlePhoneChange,
    handleSubmit,
  } = useCustomerProfile();

  return (
    <div className="card my-account-dashboard">
      <div className="card-header p-3 d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <button 
            className="btn btn-primary btn-sm rounded-pill" 
            onClick={() => setActivePage("dashboard")}
          >
            <i className="uil uil-arrow-left" /> Back
          </button>
          &nbsp;&nbsp;
          <h4 className="card-title mb-0">Edit Profile</h4>
        </div>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">{error}</div>
        )}
        <form className="text-start" id="form-profile" onSubmit={handleSubmit}>
          <input type="hidden" name="_token" defaultValue="YcVuEyltbKHnPGm11gB0E645D1fBpHiQhdY6XNA0" autoComplete="off" />
          <div className="row">
            <div className="col-md-12">
              <div className="form-floating mb-2 mb-md-4">
                <input 
                  type="file" 
                  className="form-control" 
                  name="image" 
                  id="profile_image" 
                  onChange={handleFileChange}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                />
                <label htmlFor="profile_image">Profile Picture (JPG, PNG, WEBP - Max 2MB, 2000x2000px)</label>
              </div>

              {imagePreviewUrl && (
                <div className="mb-3">
                  <div className="d-flex align-items-center">
                    <div style={{ width: '100px',height: '100px'}}>
                      <BackendImage
                        src={imagePreviewUrl}
                        alt="Profile preview"
                        className="w-100 h-100 object-fit-cover rounded"
                        placeholderImage={imageFailedToLoad}
                        placeholderText=""
                      />
                    </div>
                  </div>
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
                  onChange={handleInputChange}
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
                  disabled
                />
                <label htmlFor="email">Email</label>
              </div>

              <div className="mb-2 mb-md-4">
                <PhoneInput 
                  initialValue={fullPhoneForInit}
                  defaultCountry={formData.country_code?.toLowerCase()}
                  onChange={handlePhoneChange}
                />
              </div>

              <div className="form-floating mb-2 mb-md-4">
                <input 
                  type="number" 
                  className="form-control zip_code_val" 
                  name="zip_code" 
                  placeholder="Zip Code" 
                  id="zip_code_profile" 
                  value={formData.zip_code || ''}
                  onChange={handleInputChange}
                />
                <label htmlFor="zip_code_profile">Zip Code</label>
              </div>
              <div className="form-floating mb-2 mb-md-4">
                <input 
                  type="text" 
                  className="form-control" 
                  name="city" 
                  placeholder="City" 
                  id="city" 
                  value={formData.city || ''}
                  onChange={handleInputChange}
                />
                <label htmlFor="city">City</label>
              </div>
              <div className="form-floating mb-2 mb-md-4">
                <input 
                  type="text" 
                  className="form-control" 
                  name="state" 
                  placeholder="State" 
                  id="state" 
                  value={formData.state || ''}
                  onChange={handleInputChange}
                />
                <label htmlFor="state">State</label>
              </div>
              <div className="col-md-12">
                <div className="text-center">
                  <button type="submit" className="btn btn-primary rounded-pill btn-login" id="submit-profile" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileContent; 