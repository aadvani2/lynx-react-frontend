// Utility Types

// Device Information Types
export interface DeviceInfo {
  device_type: string;
  device_name: string;
  device_info: string;
  device_language: string;
  device_timezone: string;
  device_country: string;
  device_unique_id: string;
  device_app_version_name: string;
  device_app_version_code: string;
  screen_resolution: string;
  user_agent: string;
  platform: string;
  cookie_enabled: boolean;
  online_status: boolean;
  connection_type?: string;
  memory_info?: {
    total: number;
    used: number;
    available: number;
  };
}


