// src/services/employeeService.ts
import { api } from "../api/api";
import { EMPLOYEE_ENDPOINTS } from "../apiEndpoints/employee";
import type { RequestDetailsBody } from '../../types/employee/request-details';

interface RequestBody {
  employee_id: number | string | null;
  user_timezone: number;
  page: number;
}

interface VerifyArrivalBody {
  code: string;
  request_id: number;
}

export const employeeService = {
  
  // Availability
  setAvailability: (payload: { availability: number; member_id: number }) => 
    api.post(EMPLOYEE_ENDPOINTS.AVAILABILITY, payload),
  
  // Dashboard
  getDashboardInfo: () => 
    api.get(EMPLOYEE_ENDPOINTS.DASHBOARD_INFO),
  
  // Requests - POST with body
  getAcceptedRequests: (body: RequestBody) => 
    api.post(EMPLOYEE_ENDPOINTS.ACCEPTED_REQUESTS, body),
  
  getInProgressRequests: (body: RequestBody) => 
    api.post(EMPLOYEE_ENDPOINTS.IN_PROGRESS_REQUESTS, body),
  
  getCompletedRequests: (body: RequestBody) => 
    api.post(EMPLOYEE_ENDPOINTS.COMPLETED_REQUESTS, body),
  
  getCancelledRequests: (body: RequestBody) => 
    api.post(EMPLOYEE_ENDPOINTS.CANCELLED_REQUESTS, body),
  
  // Request Details
  getRequestDetails: (body: RequestDetailsBody) => 
    api.post(EMPLOYEE_ENDPOINTS.REQUEST_DETAILS, body),
  
  // Verification
  verifyArrival: (body: VerifyArrivalBody) => 
    api.post(EMPLOYEE_ENDPOINTS.VERIFY_ARRIVAL, body),

  // Notifications
  getNotifications: (user_timezone: number) =>
    api.get(`${EMPLOYEE_ENDPOINTS.NOTIFICATIONS}?user_timezone=${encodeURIComponent(user_timezone)}`),
};