// Contact Form Types

// Contact form submission payload based on the HTML form fields
export interface ContactSubmitPayload {
  fname: string;           // First Name
  lname: string;           // Last Name 
  email: string;           // Email
  department: string;      // User type: "Homeowner/Renter" | "Business Owner/Manager" | "Service Professional/Contractor" | "Other"
  message: string;         // Message content
  recaptcha_token?: string; // Optional recaptcha token
}

// Contact form API response
export interface ContactSubmitResponse {
  success: boolean;
  message: string;
  data?: {
    id?: string;
    submitted_at?: string;
  };
}

// Error response structure  
export interface ContactSubmitError {
  success: false;
  message: string;
  errors?: Array<{
    type: string;
    msg: string;
    path: string;
    location: string;
  }>;
} 