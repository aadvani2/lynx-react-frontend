// Customer-specific API endpoints
export const CUSTOMER_ENDPOINTS = {
  
  // Profile
  GET_EDIT_PROFILE_INFO: '/get-info/edit-profile',
  UPDATE_PROFILE: '/update-profile',

  // Subscription
  SUBSCRIPTION_DETAILS: '/subscribe-details',
  GET_MY_SUBSCRIPTION: '/get-info/my_subscription',
  UPGRADE_PRICING_LIST: '/upgrade-pricing-list',

  // Requests
  GET_ALL_REQUESTS: '/get-requests/all',
  GET_REQUESTS_ACCEPTED: '/get-requests/accepted',
  GET_REQUESTS_ON_HOLD: '/get-requests/on%20hold',
  GET_REQUESTS_IN_PROCESS: '/get-requests/in%20process',
  GET_REQUESTS_COMPLETED: '/get-requests/completed',
  GET_REQUESTS_CANCELLED: '/get-requests/cancelled',
  GET_REQUESTS_PENDING: '/get-requests/pending',
  GET_REQUEST_DETAILS: '/get-request-details',
  REFRESH_PROGRESS: '/refresh-progress',
  SCHEDULE_REQUEST_HISTORY: '/schedule-request-history',
  CANCEL_REQUEST: '/cancel-request',
  ACCEPT_DECLINE_REQUEST: '/accept-decline-request',

  // Payments
  GET_SAVED_CARDS: '/get-info/save_cards',
  SAVE_CARD: '/save-card',
  SET_DEFAULT_CARD: '/set-default-card',
  DELETE_CARD: '/delete-card',

  // Notifications
  GET_NOTIFICATIONS: '/get-info/notifications',

  // Settings
  GET_SETTINGS: '/get-info/settings',

  // Addresses
  GET_ADDRESSES: '/get-info/addresses',
  ADD_ADDRESS: '/add-address',
  DELETE_ADDRESS: '/delete-address',
  ADDRESS_DETAILS: '/address-details',

  // Transactions
  GET_TRANSACTION_HISTORY: '/get-info/transaction_history',
  
  // Referrals
  GET_MY_REFERRALS: '/get-my-referrals',
  SUBMIT_FEEDBACK: '/submit-feedback',
  NEW_PURPOSE_ADD: '/new-purpose-add',
} as const;
