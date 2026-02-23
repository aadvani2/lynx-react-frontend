// Partner-specific API endpoints
export const PARTNER_ENDPOINTS = {
  // Availability
  PROFESSIONAL_AVAILABILITY: '/professional/availability',
  
  // Dashboard info
  PROFESSIONAL_DASHBOARD_INFO: '/professional/get-info/dashboard',
  
  // Pending requests
  PROFESSIONAL_PENDING_REQUESTS: '/professional/get-requests/pending',
  
  // Accepted requests
  PROFESSIONAL_ACCEPTED_REQUESTS: '/professional/get-requests/accepted',
  
  // On hold requests (in progress)
  PROFESSIONAL_ON_HOLD_REQUESTS: '/professional/get-requests/on%20hold',
  
  // In process requests
  PROFESSIONAL_IN_PROCESS_REQUESTS: '/professional/get-requests/in%20process',
  
  // Completed requests
  PROFESSIONAL_COMPLETED_REQUESTS: '/professional/get-requests/completed',
  
  // Cancelled requests
  PROFESSIONAL_CANCELLED_REQUESTS: '/professional/get-requests/cancelled',
  
  // Manage employees info
  PROFESSIONAL_MANAGE_EMPLOYEES_INFO: '/professional/get-info/manage_employees',
  
  // Manage availability info
  PROFESSIONAL_MANAGE_AVAILABILITY: '/professional/get-info/manage_availability',
  
  // Manage service tiers info
  PROFESSIONAL_MANAGE_SERVICE_TIERS: '/professional/get-info/manage_service_tiers',
  
  // Manage services info
  PROFESSIONAL_MANAGE_SERVICES: '/professional/get-info/manage_services',
  
  // Set services info
  PROFESSIONAL_SET_SERVICES_INFO: '/professional/set-services-info',
  
  // Update service tiers
  PROFESSIONAL_UPDATE_SERVICE_TIERS: '/professional/update-service-tiers',
  
  // Service tier schedule
  PROFESSIONAL_GET_SERVICE_TIER_SCHEDULE: '/professional/get-service-tier-schedule',
  
  // Update service tier schedule
  PROFESSIONAL_UPDATE_SERVICE_TIER_SCHEDULE: '/professional/update-service-tier-schedule',
  
  // Get service tier notification schedule
  PROFESSIONAL_GET_SERVICE_TIER_NOTIFY_SCHEDULE: '/professional/get-service-tier-notify-schedule',
  
  // Update service tier notification schedule
  PROFESSIONAL_UPDATE_SERVICE_TIER_NOTIFY_SCHEDULE: '/professional/update-service-tier-notify-schedule',
  
  // Add new employee
  PROFESSIONAL_ADD_EMPLOYEE: '/professional/add-new-employee',
  
  // Get employee details
  PROFESSIONAL_EMPLOYEE_DETAILS: '/professional/employee-details',
  
  // Employee availability
  PROFESSIONAL_EMPLOYEE_AVAILABILITY: '/professional/employee/availability',
  
  // Employee status
  PROFESSIONAL_EMPLOYEE_STATUS: '/professional/employee/status',
  
  // Delete employee
  PROFESSIONAL_DELETE_EMPLOYEE: '/professional/delete-employee',
  
  // Business profile info
  PROFESSIONAL_BUSINESS_PROFILE_INFO: '/professional/get-info/business_profile',
  
  // Update company profile
  PROFESSIONAL_UPDATE_COMPANY_PROFILE: '/professional/update-company-profile',
  
  // Notifications
  PROFESSIONAL_NOTIFICATIONS: '/professional/get-info/notifications',
  
  // Settings
  PROFESSIONAL_SETTINGS: '/professional/get-info/settings',
  
  // Get request details
  PROFESSIONAL_GET_REQUEST_DETAILS: '/professional/get-request-details',
  
  // Propose new time
  PROFESSIONAL_NEW_PURPOSE_ADD: '/professional/new-purpose-add',
  
  // Schedule request history
  PROFESSIONAL_SCHEDULE_REQUEST_HISTORY: '/professional/schedule-request-history',
  
  // Accept request
  PROFESSIONAL_ACCEPT_REQUEST: '/professional/accept-request',
  
  // Accept/Decline request
  PROFESSIONAL_ACCEPT_DECLINE_REQUEST: '/professional/accept-decline-request',
  
  // Get employees
  PROFESSIONAL_EMPLOYEES: '/professional/employees',
  
  // Assign employee
  PROFESSIONAL_ASSIGN_EMPLOYEE: '/professional/assign-employee',
  
  // Verify arrival
  PROFESSIONAL_VERIFY_ARRIVAL: '/professional/verify-arrival_code',
  
  // Cancel assignment
  PROFESSIONAL_CANCEL_ASSIGNMENT: '/professional/cancel-assignment',
  
  // Complete request
  PROFESSIONAL_COMPLETE_REQUEST: '/professional/complete-request',
  
  // Update location
  PROFESSIONAL_UPDATE_LOCATION: '/professional/update-location',
  
  // Update request counter
  PROFESSIONAL_UPDATE_REQUEST_COUNTER: '/professional/updateRequestCounter',

  // Change Tier Info
  CHANGE_TIER_INFO: '/professional/get-info/changeTier',

  // Service Partner Tiers
  SERVICE_PARTNER_TIERS: '/api/service-partner-tiers',

  // Update Tier
  PROFESSIONAL_UPDATE_TIER: '/professional/update-tier',
  
  // Accept Policy
  PROFESSIONAL_ACCEPT_POLICY: '/professional/accept-policy',
  
  // Add Documents
  PROFESSIONAL_ADD_DOCUMENTS: '/professional/add-documents',
  
  // Get Documents
  PROFESSIONAL_GET_DOCUMENTS: '/professional/documents',
  
  // Delete Document
  PROFESSIONAL_DELETE_DOCUMENT: '/professional/delete-document',
  
  // Download Document
  PROFESSIONAL_DOWNLOAD_DOCUMENT: '/professional/documents/download',
  
  // Submit Onboarding Form
  PROFESSIONAL_SUBMIT_ONBOARDING: '/professional/onboarding',
} as const; 