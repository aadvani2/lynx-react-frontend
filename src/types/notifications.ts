export interface NotificationItem {
  id: number;
  user_id: number;
  user_type: string;
  is_general: number;
  request_id: number;
  message: string;
  created_at: string;
  updated_at: string;
  title?: string;
  description?: string;
  read?: boolean;
  is_read?: boolean;
  [key: string]: unknown;
}
