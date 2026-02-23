// Device information detection utility
import type { DeviceInfo } from '../types/auth';

// Detect browser name and version
const getBrowserInfo = (): string => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome')) {
    const version = userAgent.match(/Chrome\/(\d+)/)?.[1] || '';
    return `Chrome ${version}`;
  } else if (userAgent.includes('Firefox')) {
    const version = userAgent.match(/Firefox\/(\d+)/)?.[1] || '';
    return `Firefox ${version}`;
  } else if (userAgent.includes('Safari')) {
    const version = userAgent.match(/Version\/(\d+)/)?.[1] || '';
    return `Safari ${version}`;
  } else if (userAgent.includes('Edge')) {
    const version = userAgent.match(/Edge\/(\d+)/)?.[1] || '';
    return `Edge ${version}`;
  } else if (userAgent.includes('Opera')) {
    const version = userAgent.match(/Opera\/(\d+)/)?.[1] || '';
    return `Opera ${version}`;
  }
  
  return 'Unknown Browser';
};

// Detect operating system
const getOperatingSystem = (): string => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Windows')) {
    if (userAgent.includes('Windows NT 10.0')) return 'Windows 10/11';
    if (userAgent.includes('Windows NT 6.3')) return 'Windows 8.1';
    if (userAgent.includes('Windows NT 6.2')) return 'Windows 8';
    if (userAgent.includes('Windows NT 6.1')) return 'Windows 7';
    return 'Windows';
  } else if (userAgent.includes('Mac')) {
    if (userAgent.includes('Mac OS X 10_15')) return 'macOS Catalina';
    if (userAgent.includes('Mac OS X 10_14')) return 'macOS Mojave';
    if (userAgent.includes('Mac OS X 10_13')) return 'macOS High Sierra';
    return 'macOS';
  } else if (userAgent.includes('Linux')) {
    return 'Linux';
  } else if (userAgent.includes('Android')) {
    const version = userAgent.match(/Android (\d+)/)?.[1] || '';
    return `Android ${version}`;
  } else if (userAgent.includes('iOS')) {
    const version = userAgent.match(/OS (\d+)/)?.[1] || '';
    return `iOS ${version}`;
  }
  
  return 'Unknown OS';
};

// Detect device type
const getDeviceType = (): string => {
  const userAgent = navigator.userAgent;
  
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return 'mobile';
  } else if (/iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent)) {
    return 'tablet';
  }
  
  return 'desktop';
};

// Generate unique device ID
const generateDeviceId = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
    const fingerprint = canvas.toDataURL();
    return btoa(fingerprint).substring(0, 20);
  }
  return `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get connection information
const getConnectionInfo = (): string | undefined => {
  if ('connection' in navigator) {
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string; type?: string } }).connection;
    if (connection) {
      return connection.effectiveType || connection.type;
    }
  }
  return undefined;
};

// Get memory information (if available)
const getMemoryInfo = () => {
  if ('memory' in performance) {
    const memory = (performance as Performance & { memory?: { totalJSHeapSize: number; usedJSHeapSize: number } }).memory;
    if (memory) {
      return {
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        used: Math.round(memory.usedJSHeapSize / 1048576),   // MB
        available: Math.round((memory.totalJSHeapSize - memory.usedJSHeapSize) / 1048576) // MB
      };
    }
  }
  return undefined;
};

// Get country from browser language or timezone
const getCountryFromBrowser = (): string => {
  // Try to get country from language
  const language = navigator.language || 'en-US';
  const countryMatch = language.match(/-([A-Z]{2})$/);
  if (countryMatch) {
    return countryMatch[1];
  }
  
  // Try to get country from timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezone.includes('America/New_York') || timezone.includes('America/Chicago') || 
      timezone.includes('America/Denver') || timezone.includes('America/Los_Angeles')) {
    return 'US';
  } else if (timezone.includes('Europe/')) {
    return 'EU';
  } else if (timezone.includes('Asia/')) {
    return 'AS';
  } else if (timezone.includes('Africa/')) {
    return 'AF';
  } else if (timezone.includes('Australia/')) {
    return 'AU';
  }
  
  // Default fallback
  return 'US';
};

// Main function to collect device information
export const getDeviceInformation = (): DeviceInfo => {
  return {
    device_type: getDeviceType(),
    device_name: getBrowserInfo(),
    device_info: getOperatingSystem(),
    device_language: navigator.language || 'en-US',
    device_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    device_country: getCountryFromBrowser(),
    device_unique_id: generateDeviceId(),
    device_app_version_name: '1.0.0',
    device_app_version_code: '1',
    screen_resolution: `${screen.width}x${screen.height}`,
    user_agent: navigator.userAgent,
    platform: navigator.platform,
    cookie_enabled: navigator.cookieEnabled,
    online_status: navigator.onLine,
    connection_type: getConnectionInfo(),
    memory_info: getMemoryInfo(),
  };
};

// Function to get device info as JSON string (for API compatibility)
export const getDeviceInfoJson = (): string => {
  const deviceInfo = getDeviceInformation();
  return JSON.stringify(deviceInfo);
}; 