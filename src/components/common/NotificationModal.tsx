import React, { useEffect, useState } from 'react';

const NotificationModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [animation, setAnimation] = useState('hidden');

  useEffect(() => {
    // Check if we should show the modal today
    const shouldShowModal = () => {
      const lastShown = localStorage.getItem('notification_last_shown');
      if (!lastShown) return true;
      
      const lastDate = new Date(lastShown);
      const today = new Date();
      
      // Check if it's a new day
      return (
        lastDate.getDate() !== today.getDate() ||
        lastDate.getMonth() !== today.getMonth() ||
        lastDate.getFullYear() !== today.getFullYear()
      );
    };

    // Show modal if it hasn't been shown today
    if (shouldShowModal()) {
      // Small delay for better UX
      setTimeout(() => {
        setShowModal(true);
        
        // Add animation after showing
        setTimeout(() => {
          setAnimation('visible');
        }, 100);
      }, 1500);
    }
  }, []);

  const handleAllow = () => {
    // Handle permission request
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  const closeModal = () => {
    // Start close animation
    setAnimation('hidden');
    
    // Remove modal after animation
    setTimeout(() => {
      // Save the current date to localStorage
      localStorage.setItem('notification_last_shown', new Date().toISOString());
      setShowModal(false);
    }, 300);
  };

  if (!showModal) return null;

  return (
    <div id="onesignal-slidedown-container" className="onesignal-slidedown-container onesignal-reset slide-down position-fixed"
      style={{ 
        zIndex: 9999, 
        width: '100%', 
        top: animation === 'visible' ? '0' : '-200px', 
        left: 0,
        backgroundColor: 'transparent',
        transition: 'top 0.3s ease-in-out'
      }}>
      <div id="onesignal-slidedown-dialog" className="onesignal-slidedown-dialog" style={{
        backgroundColor: 'white',
        borderRadius: '0 0 8px 8px',
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)',
        maxWidth: '550px',
        margin: '0 auto'
      }}>
        <div id="normal-slidedown">
          <div className="slidedown-body p-3" id="slidedown-body">
            <div className="d-flex align-items-center">
              <div className="slidedown-body-icon me-3">
                <img className="default-icon" alt="notification icon" width="40"
                  src="data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Cg clip-path='url(%23clip0)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M33.232 28.434a2.5 2.5 0 001.768.733 1.667 1.667 0 010 3.333H5a1.667 1.667 0 110-3.333 2.5 2.5 0 002.5-2.5v-8.104A13.262 13.262 0 0118.333 5.122V1.667a1.666 1.666 0 113.334 0v3.455A13.262 13.262 0 0132.5 18.563v8.104a2.5 2.5 0 00.732 1.767zM16.273 35h7.454a.413.413 0 01.413.37 4.167 4.167 0 11-8.28 0 .417.417 0 01.413-.37z' fill='%23BDC4CB'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0'%3E%3Cpath fill='%23fff' d='M0 0h40v40H0z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" />
              </div>
              <div className="slidedown-body-message">
                We'd like to show you notifications for the latest news and updates.
              </div>
            </div>
            <div className="clearfix"></div>
          </div>
          <div className="slidedown-footer p-3 border-top" id="slidedown-footer">
            <div className="d-flex justify-content-end">
              <button 
                className="btn btn-outline-secondary me-2" 
                onClick={handleCancel}
                id="onesignal-slidedown-cancel-button"
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleAllow}
                id="onesignal-slidedown-allow-button"
              >
                Allow
              </button>
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
