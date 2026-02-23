export const GENERAL_ENDPOINTS = {
  // Public Content
  PUBLIC_SERVICES: '/services',
  PUBLIC_SERVICE_DETAILS: (id: string) => `/public/services/${id}`,
  PUBLIC_PARTNERS: '/public/partners',
  PUBLIC_PARTNER_DETAILS: (id: string) => `/public/partners/${id}`,
  // Dynamic service endpoint
  SERVICES_BY_CATEGORY: (category: string) => `/services/${category}`,
  
  // Service subcategory details
  PUBLIC_SERVICE_BY_SUBCATEGORY: (subcategoryTitle: string) => `/services/${subcategoryTitle}`,
  
  // Service tiers
  GET_SERVICE_TIER: '/get_service_tier',
  STORE_SESSION_DATA: '/store_session_data',
  SELECT_ADDRESS: '/select-address',
  AREA_CONFIRMATION: '/area-confirmation',
  CONTACT_INFORMATION: '/contact-information',
  ADD_REQUEST: '/add-request',
  
  // Static Content
  FAQS: '/faqs',
  TERMS_OF_SERVICE: '/terms-of-use',
  PRIVACY_POLICY: '/privacy-policy',
  COOKIE_POLICY: '/cookie-policy',
  LYNX_AGREEMENT: '/lynx-agreement',
  CANCELLATION_POLICY_CUSTOMER: '/cancellation-policy-customer',
  CANCELLATION_POLICY_PROVIDER: '/cancellation-policy-provider',
  
  // Blogs
  BLOGS: '/blogs',
  BLOG_BY_SLUG: (slug: string) => `/blogs/${slug}`,
  BLOG_SEARCH: '/blog_search',
  
  // Contact
  CONTACT_SUBMIT: '/contact-submit',

  // Privacy Requests
  DATA_DELETION_SUBMIT: '/dataDeletionSubmit',

  // Conversations
  CONVERSATION_LIST: '/conversation-list',
  JOIN_CHANNEL: '/join-channel',
  PROFESSIONAL_JOIN_CHANNEL: '/professional/join-channel',
  TWILIO_TOKEN: '/twilio-token-generate',

  // Search Suggestions
  SEARCH_SERVICE_SUGGESTION: '/search-service-suggestion',
  
  // Search Service
  SEARCH_SERVICE: '/search',

  // Service Search with Zip Code
  SERVICE_SEARCH: '/service_search',

  // Email Subscribe
  EMAIL_SUBSCRIBE: '/email-subscribe',
  
  // Partners
  GET_PARTNERS: '/get_partners',

  // AI Chat Assistant
  AI_CHAT: '/api/chat',
  AI_INTAKE_CHAT: '/api/chat/intake',
  
} as const;
