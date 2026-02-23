import React from 'react';

interface SubmitButtonProps {
  isLoading?: boolean;
  onClick?: () => void;
  buttonText?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  isLoading = false, 
  onClick, 
  buttonText = 'Submit your information'
}) => {
  return (
    <div className="text-center">
      <button 
        id="form-submit-for-approval" 
        type="submit" 
        name="submit_for_approval" 
        className="btn btn-primary rounded-pill btn-login"
        disabled={isLoading}
        onClick={onClick}
      >
        {isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Submitting...
          </>
        ) : (
          buttonText
        )}
      </button>
    </div>
  );
};

export default SubmitButton;
