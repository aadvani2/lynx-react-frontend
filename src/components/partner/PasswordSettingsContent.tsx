import React, { useState } from 'react';
import { useChangePassword } from '../../hooks/useChangePassword';

interface PasswordSettingsContentProps {
  setActivePage: (page: string) => void;
}

const PasswordSettingsContent: React.FC<PasswordSettingsContentProps> = ({ setActivePage }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    formData,
    isSubmitting,
    error,
    success,
    handleInputChange,
    handleSubmit
  } = useChangePassword();

  const handleBackToDashboard = () => {
    setActivePage("dashboard");
  };

  return (
    <div className="card my-account-dashboard">
      <div className="card-header p-3 d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <button 
            className="btn btn-primary btn-sm rounded-pill" 
            onClick={handleBackToDashboard}
          >
            <i className="uil uil-arrow-left" /> Back
          </button>
          &nbsp;&nbsp;
          <h4 className="card-title mb-0">Change Account Password</h4>
        </div>
      </div>
      <div className="card-body">
        <form className="text-start" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-12">
              <div className="form-floating password-field mb-2 mb-md-4">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="form-control"
                  name="current_password"
                  placeholder="Current Password"
                  id="current_password"
                  value={formData.current_password}
                  onChange={handleInputChange}
                  required
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className={showCurrentPassword ? "uil uil-eye-slash" : "uil uil-eye"} />
                </span>
                <label htmlFor="current_password">Current Password</label>
              </div>
              <div className="form-floating password-field mb-2 mb-md-4">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="form-control"
                  name="new_password"
                  placeholder="New Password"
                  id="new_password"
                  value={formData.new_password}
                  onChange={handleInputChange}
                  required
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className={showNewPassword ? "uil uil-eye-slash" : "uil uil-eye"} />
                </span>
                <label htmlFor="new_password">New Password</label>
              </div>
              <div className="form-floating password-field mb-4">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  name="confirm_password"
                  placeholder="Confirm Password"
                  id="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  required
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className={showConfirmPassword ? "uil uil-eye-slash" : "uil uil-eye"} />
                </span>
                <label htmlFor="confirm_password">Re-enter Password</label>
              </div>
            </div>
            
            {/* Error and Success Messages */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}
            
            <div className="text-center">
              <button 
                type="submit" 
                className="btn btn-primary rounded-pill btn-login" 
                id="submit-change-password"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Changing Password...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .password-field {
          position: relative;
        }
        
        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          color: #6c757d;
          transition: color 0.15s ease-in-out;
        }
        
        .password-toggle:hover {
          color: #495057;
        }
        
        .form-floating .password-toggle {
          top: 25%;
        }
      `}</style>
    </div>
  );
};

export default PasswordSettingsContent; 