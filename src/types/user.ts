// User-related Types

// User interface
export interface User {
  id: number;
  name: string;
  email: string;
  user_type: string;
  phone?: string; // optional phone if provided by backend
  created_at?: string;
  updated_at?: string;
  image?: string | null;
}
