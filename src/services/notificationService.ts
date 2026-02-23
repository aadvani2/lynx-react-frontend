// Notification service for React frontend
// Handles OneSignal integration and notification management

interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: string;
  user_type: string;
  request_status?: string;
  btn_text?: string;
}

interface CustomerServiceType {
  getNotificationsInfo(userTimezone: number): Promise<any>;
}

interface PartnerServiceType {
  getNotificationsInfo(userTimezone: number): Promise<any>;
}

class NotificationService {
  private isInitialized = false;
  private userType: 'customer' | 'provider' | null = null;

  constructor() {
    this.initializeOneSignal();
  }

  private async initializeOneSignal() {
    try {
      // Check if OneSignal is available
      if (typeof window !== 'undefined' && window.OneSignal) {
        // Determine user type based on current page or user context
        this.userType = this.detectUserType();
        
        // Get OneSignal app ID based on user type
        const appId = this.getOneSignalAppId();
        
        if (appId) {
          await window.OneSignal.init({
            appId: appId,
            safari_web_id: process.env.REACT_APP_ONE_SIGNAL_SAFARI_WEB_ID,
            notifyButton: {
              enable: false, // Disable default notify button
            },
            allowLocalhostAsSecureOrigin: process.env.NODE_ENV === 'development',
          });

          this.isInitialized = true;
          console.log('OneSignal initialized successfully for', this.userType);
          
          // Set up notification event listeners
          this.setupEventListeners();
        }
      }
    } catch (error) {
      console.error('Failed to initialize OneSignal:', error);
    }
  }

  private detectUserType(): 'customer' | 'provider' | null {
    // Detect user type based on URL or other context
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.includes('/partner') || pathname.includes('/provider')) {
        return 'provider';
      } else if (pathname.includes('/customer') || pathname.includes('/user')) {
        return 'customer';
      }
    }
    return null;
  }

  private getOneSignalAppId(): string | null {
    if (this.userType === 'customer') {
      return process.env.REACT_APP_ONE_SIGNAL_CUSTOMER_APP_ID || null;
    } else if (this.userType === 'provider') {
      return process.env.REACT_APP_ONE_SIGNAL_PROVIDER_APP_ID || null;
    }
    return null;
  }

  private setupEventListeners() {
    if (!this.isInitialized || !window.OneSignal) return;

    // Listen for notification clicks
    window.OneSignal.on('notificationClick', (event: any) => {
      console.log('Notification clicked:', event);
      this.handleNotificationClick(event);
    });

    // Listen for notification received
    window.OneSignal.on('notificationDisplay', (event: any) => {
      console.log('Notification received:', event);
      this.handleNotificationReceived(event);
    });
  }

  private handleNotificationClick(event: any) {
    const data: NotificationData = event.notification.data;
    
    // Handle different notification types
    switch (data.type) {
      case 'new_request':
        if (this.userType === 'provider') {
          // Navigate to pending requests page
          window.location.href = '/partner/pending-requests';
        }
        break;
      case 'request_accepted':
        if (this.userType === 'customer') {
          // Navigate to accepted requests page
          window.location.href = '/customer/accepted-requests';
        }
        break;
      case 'request_completed':
        if (this.userType === 'customer') {
          // Navigate to completed requests page
          window.location.href = '/customer/completed-requests';
        }
        break;
      default:
        // Navigate to notifications page
        if (this.userType === 'customer') {
          window.location.href = '/customer/notifications';
        } else if (this.userType === 'provider') {
          window.location.href = '/partner/notifications';
        }
        break;
    }
  }

  private handleNotificationReceived(event: any) {
    // Show in-app notification or update notification count
    const data: NotificationData = event.notification.data;
    
    // You can implement custom in-app notification display here
    // For example, show a toast notification
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast({
        title: data.title,
        message: data.message,
        type: 'info'
      });
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isInitialized || !window.OneSignal) {
      console.warn('OneSignal not initialized');
      return false;
    }

    try {
      const permission = await window.OneSignal.Notifications.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  async getPermissionStatus(): Promise<string> {
    if (!this.isInitialized || !window.OneSignal) {
      return 'denied';
    }

    try {
      return await window.OneSignal.Notifications.permission;
    } catch (error) {
      console.error('Failed to get permission status:', error);
      return 'denied';
    }
  }

  async getPlayerId(): Promise<string | null> {
    if (!this.isInitialized || !window.OneSignal) {
      return null;
    }

    try {
      const playerId = await window.OneSignal.User.PushSubscription.id;
      return playerId;
    } catch (error) {
      console.error('Failed to get player ID:', error);
      return null;
    }
  }

  async setUserId(userId: number) {
    
    if (!this.isInitialized || !window.OneSignal) {
      return;
    }

    try {
      // Set external user ID for OneSignal
      await window.OneSignal.login(userId.toString());
      console.log('OneSignal user ID set:', userId);
    } catch (error) {
      console.error('Failed to set OneSignal user ID:', error);
    }
  }

  async setUserType(userType: 'customer' | 'provider') {
    this.userType = userType;
    
    // Reinitialize OneSignal with correct app ID
    if (this.isInitialized) {
      await this.initializeOneSignal();
    }
  }

  async getNotifications(userTimezone: number) {
    try {
      const service = this.userType === 'customer' 
        ? (await import('../services/customerServices/customerService')).customerService as CustomerServiceType
        : (await import('../services/partnerService/partnerService')).partnerService as PartnerServiceType;
      
      const result = await service.getNotificationsInfo(userTimezone);
      return result;
    } catch (error) {
      console.error('Failed to get notifications:', error);
      throw error;
    }
  }

  // Utility method to check if notifications are supported
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  // Utility method to check if service worker is supported
  isServiceWorkerSupported(): boolean {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator;
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;

