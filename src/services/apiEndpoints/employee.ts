// Employee-specific API endpoints
export const EMPLOYEE_ENDPOINTS = {
  // Availability
  AVAILABILITY: '/professional/employee/availability',
  // Dashboard
  DASHBOARD_INFO: '/employee/get-info/dashboard',
  // Requests
  ACCEPTED_REQUESTS: '/employee/get-requests/accepted',
  IN_PROGRESS_REQUESTS: '/employee/get-requests/in%20process',
  COMPLETED_REQUESTS: '/employee/get-requests/completed',
  CANCELLED_REQUESTS: '/employee/get-requests/cancelled',
  // Request Details
  REQUEST_DETAILS: '/employee/get-request-details',
  // Verification
  VERIFY_ARRIVAL: '/professional/verify-arrival_code',
  // Notifications
  NOTIFICATIONS: '/employee/get-info/notifications',
} as const; 