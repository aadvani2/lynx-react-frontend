import React from 'react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="modal-content"
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '450px',
            maxWidth: '90%',
            position: 'relative',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            className="btn-close position-absolute"
            onClick={onClose}
            style={{
              top: '15px',
              right: '15px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.08)',
              border: 'none'
            }}
          />

          {/* Logo - Top Center */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '25px',
            marginTop: '10px'
          }}>
            <img 
              src="" 
              alt="Lynx Logo" 
              style={{ 
                width: '77px', 
                height: '77px',
                display: 'block',
                margin: '0 auto'
              }}
            />
          </div>

          {/* Title - Below Logo */}
          <h2 
            style={{
              textAlign: 'center',
              marginBottom: '20px',
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#333',
              margin: '0 0 20px 0'
            }}
          >
            {title}
          </h2>

          {/* Message - Below Title */}
          <div 
            style={{
              textAlign: 'center',
              marginBottom: '30px',
              fontSize: '16px',
              color: '#666',
              lineHeight: '1.6',
              maxWidth: '350px'
            }}
          >
            {message}
          </div>

          {/* Action Button - Bottom Center */}
          <div style={{ textAlign: 'center', width: '100%' }}>
            <button
              type="button"
              onClick={onConfirm}
              className="btn btn-primary rounded-pill"
              style={{
                padding: '14px 40px',
                fontSize: '16px',
                fontWeight: '500',
                minWidth: '200px'
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutModal; 