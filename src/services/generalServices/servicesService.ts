import { api } from "../api/api";
import { GENERAL_ENDPOINTS } from "../apiEndpoints/general";
import type { ServiceCategory } from "../../types/services";
import { withRequestCache } from "../../utils/requestCache";

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as ApiError).response === 'object' &&
    (error as ApiError).response !== null &&
    'data' in (error as ApiError).response! &&
    typeof (error as ApiError).response!.data === 'object' &&
    (error as ApiError).response!.data !== null &&
    'message' in (error as ApiError).response!.data!
  );
}

interface LimitedServiceResponse {
  success: boolean;
  categories: ServiceCategory[];
}

// Internal implementation of getServices (fetching from API)
const getServicesImpl = async (): Promise<LimitedServiceResponse> => {
  try {
    // Call the API endpoint to fetch services
    const response = await api.get(GENERAL_ENDPOINTS.PUBLIC_SERVICES);

    // The API response structure is: { success, data: { categories } }
    // We need to transform it to: { success, categories }
    const fullData = response?.data || response;

    // Check if data exists and has categories
    if (!fullData || !fullData.categories) {
      throw new Error('Invalid response structure from API');
    }

    // Return only success and categories with selected fields
    return {
      success: true,
      categories: fullData.categories.map((category: ServiceCategory) => ({
        id: category.id,
        title: category.title,
        slug: category.slug,
        description: category.description,
        image: category.image,
        status: category.status,
        color: category.color, // Include color property
        display_order: category.display_order, // Include display_order
        subcategories: category.subcategories?.map((subcategory) => ({
          id: subcategory.id,
          title: subcategory.title,
          slug: subcategory.slug,
          image: subcategory.image,
          description: subcategory.description
        }))
      }))
    };
  } catch (error: unknown) {
    console.error('Error in getServices:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch services';
    throw new Error(errorMessage);
  }
};

// Wrap getServices with request deduplication and caching (5 minutes expiration)
const getServicesCached = withRequestCache(getServicesImpl, {
  expireDuration: 5 * 60 * 1000, // 5 minutes
});

export const servicesService = {
  // Get all services with limited data (with caching and deduplication)
  getServices: getServicesCached,

  // Get services by category (dynamic)
  getServicesByCategory: async (category: string): Promise<any> => {
    try {
      const response = await api.get(GENERAL_ENDPOINTS.SERVICES_BY_CATEGORY(category));
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      } else {
        throw new Error(`Failed to fetch ${category} services`);
      }
    }
  },

  // Get service details by subcategory title
  getServiceBySubcategory: async (subcategoryTitle: string): Promise<any> => {
    try {
      const response = await api.get(GENERAL_ENDPOINTS.PUBLIC_SERVICE_BY_SUBCATEGORY(subcategoryTitle));
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      else {
        throw new Error('Failed to fetch service details');
      }
    }
  },

  // Get service tier information
  getServiceTier: async (): Promise<any> => {
    try {
      const response = await api.post(GENERAL_ENDPOINTS.GET_SERVICE_TIER, {});
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      else {
        throw new Error('Failed to fetch service tier information');
      }
    }
  },

  // Store session data
  storeSessionData: async (sessionData: {
    cat_id?: number;
    subcat_id?: number;
    sub_category?: string;
    booked_services?: number[];
    booked_services_title?: string[];
    schedule_time?: string;
    service_tier?: string | number;
    service_tier_id?: number;
    service_address_id?: string;
    selected_provider_id?: string;
    service_address?: {
      latitude: number;
      longitude: number;
      state: string;
    };
    service_id?: string;
    zipcode?: string;
    description?: string;
    followupQAs?: Array<{ question: string; answer: string }>;
    summary?: string;
    suspectedIssue?: string;
    structuredDetails?: Record<string, any>;
    user_timezone?: number;
  }): Promise<any> => {
    try {
      // Import timezone helper
      const { getUserTimezoneOffset } = await import('../../utils/timezoneHelper');
      
      // If schedule_time is provided but user_timezone is not, add it automatically
      const payload = { ...sessionData };
      if (payload.schedule_time && payload.schedule_time !== 'Now' && payload.schedule_time !== 'now' && !payload.user_timezone) {
        payload.user_timezone = getUserTimezoneOffset();
      }
      
      const response = await api.post(GENERAL_ENDPOINTS.STORE_SESSION_DATA, {
        sessionData: payload
      });
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      else {
        throw new Error('Failed to store session data');
      }
    }
  },

  // Select address
  selectAddress: async (): Promise<any> => {
    try {
      const response = await api.post(GENERAL_ENDPOINTS.SELECT_ADDRESS, {});
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      else {
        throw new Error('Failed to select address');
      }
    }
  },

  // Area confirmation
  areaConfirmation: async (firstRequestId?: number): Promise<any> => {
    try {
      const payload = firstRequestId ? { first_request_id: firstRequestId } : {};
      const response = await api.post(GENERAL_ENDPOINTS.AREA_CONFIRMATION, payload);
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      else {
        throw new Error('Failed to confirm area');
      }
    }
  },

  // Contact information
  contactInformation: async (data: {
    service: string;
    category: string;
  }): Promise<any> => {
    try {
      const response = await api.post(GENERAL_ENDPOINTS.CONTACT_INFORMATION, data);
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      else {
        throw new Error('Failed to submit contact information');
      }
    }
  },

  // Get blogs
  getBlogs: async (tag?: string): Promise<any> => {
    try {
      const url = tag ? `${GENERAL_ENDPOINTS.BLOGS}?tag=${encodeURIComponent(tag)}` : GENERAL_ENDPOINTS.BLOGS;
      const response = await api.get(url);
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      else {
        throw new Error('Failed to fetch blogs');
      }
    }
  },

  // Get blogs by slug (category)
  getBlogsBySlug: async (slug: string): Promise<any> => {
    try {
      const url = GENERAL_ENDPOINTS.BLOG_BY_SLUG(slug);
      const response = await api.get(url);
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error)
        ? error.response?.data?.message || error.message
        : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      } else {
        throw new Error('Failed to fetch blogs');
      }
    }
  },

  // Get blog by slug
  getBlogBySlug: async (slug: string): Promise<any> => {
    try {
      const response = await api.get(GENERAL_ENDPOINTS.BLOG_BY_SLUG(slug));
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      else {
        throw new Error('Failed to fetch blog');
      }
    }
  },

  // Search blogs
  searchBlogs: async (searchTerm: string): Promise<any> => {
    try {
      const url = `${GENERAL_ENDPOINTS.BLOG_SEARCH}?search=${encodeURIComponent(searchTerm)}`;
      const response = await api.get(url);
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      else {
        throw new Error('Failed to search blogs');
      }
    }
  },

  // Add request API
  addRequest: async (data: {
    contact_person: string;
    phone: string;
    dial_code: string;
    country_code: string;
    user_timezone: number;
    description: string;
    files: File[];
    paymentMethodCard?: string;
    first_request_id?: number;
  }): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append('contact_person', data.contact_person);
      formData.append('phone', data.phone);
      formData.append('dial_code', data.dial_code);
      formData.append('country_code', data.country_code);
      formData.append('user_timezone', data.user_timezone.toString());
      formData.append('description', data.description);

      // Append payment method card if provided
      if (data.paymentMethodCard) {
        formData.append('paymentMethodCard', data.paymentMethodCard);
      }

      // Append first_request_id if provided
      if (data.first_request_id) {
        formData.append('first_request_id', data.first_request_id.toString());
      }

      // Append files
      data.files.forEach((file) => {
        formData.append('files[]', file);
      });

      const response = await api.post(GENERAL_ENDPOINTS.ADD_REQUEST, formData);
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      else {
        throw new Error('Failed to submit request');
      }
    }
  },

  // Search service suggestions
  searchServiceSuggestions: async (query: string): Promise<any> => {
    try {
      const url = `${GENERAL_ENDPOINTS.SEARCH_SERVICE_SUGGESTION}?q=${encodeURIComponent(query)}&searchForm=service`;
      const response = await api.get(url);
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      else {
        throw new Error('Failed to fetch search suggestions');
      }
    }
  },

  // Search service
  searchService: async (searchText: string): Promise<any> => {
    try {
      const url = `${GENERAL_ENDPOINTS.SEARCH_SERVICE}?search=${encodeURIComponent(searchText)}&searchForm=service`;
      const response = await api.get(url);
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      else {
        throw new Error('Failed to search service');
      }
    }
  },

  // Service search with zip code
  serviceSearch: async (data: {
    service: string;
    service_id: string;
    zipCode: string;
    serviceTier: string;
    date: string;
    user_timezone?: number; // Optional timezone offset in hours
  }): Promise<any> => {
    try {
      // Import timezone helper
      const { getUserTimezoneOffset } = await import('../../utils/timezoneHelper');
      
      // Get user's timezone if not provided
      const userTimezone = data.user_timezone ?? getUserTimezoneOffset();
      
      // Format date properly: ensure it's in "YYYY-MM-DD HH:mm" format (user's local time)
      let formattedDate = data.date;
      if (data.date && data.date !== 'Now' && data.date !== 'now') {
        try {
          // Parse the date string - it might be in various formats
          let dateObj: Date;
          
          // Check if it's already in "YYYY-MM-DD HH:mm" format
          const dateTimeFormat = /^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{2})/;
          const match = data.date.match(dateTimeFormat);
          
          if (match) {
            // Already in correct format, parse it as local time
            const year = parseInt(match[1], 10);
            const month = parseInt(match[2], 10) - 1; // JavaScript months are 0-indexed
            const day = parseInt(match[3], 10);
            const hours = parseInt(match[4], 10);
            const minutes = parseInt(match[5], 10);
            dateObj = new Date(year, month, day, hours, minutes, 0);
          } else {
            // Try parsing as Date object
            dateObj = new Date(data.date);
          }
          
          if (!isNaN(dateObj.getTime())) {
            // Format as "YYYY-MM-DD HH:mm" in user's local timezone
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
          }
        } catch (e) {
          // If parsing fails, use original date string
          console.warn('Failed to parse date, using original format:', e);
        }
      }
      
      const payload = {
        service: data.service,
        service_id: data.service_id,
        zipCode: data.zipCode,
        serviceTier: data.serviceTier,
        date: formattedDate,
        user_timezone: userTimezone
      };
      
      const response = await api.post(GENERAL_ENDPOINTS.SERVICE_SEARCH, payload);
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      else {
        throw new Error('Failed to search service with zip code');
      }
    }
  },

  // Sequential API calls: storeSessionData -> areaConfirmation
  handleAddressSelection: async (addressData: {
    service_address_id: string;
    service_address: {
      latitude: number;
      longitude: number;
      state: string;
    };
  }): Promise<any> => {
    try {
      // Step 1: Call store_session_data API
      const storeResponse = await servicesService.storeSessionData({
        service_address_id: addressData.service_address_id,
        service_address: addressData.service_address
      });

      if (!storeResponse?.data?.success) {
        throw new Error(storeResponse?.data?.message || 'Failed to store session data');
      }

      // Get first_request_id from response
      const firstRequestId = storeResponse.data.first_request_id;
      if (!firstRequestId) {
        throw new Error('No first_request_id received from store_session_data API');
      }

      // Step 2: Call area-confirmation API with first_request_id
      const areaResponse = await servicesService.areaConfirmation(firstRequestId);

      if (!areaResponse?.data?.success) {
        throw new Error(areaResponse?.data?.message || 'Failed to confirm area');
      }

      // Return both responses or just the area confirmation response
      return {
        storeSessionData: storeResponse.data,
        areaConfirmation: areaResponse.data,
        firstRequestId: firstRequestId
      };

    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      else {
        throw new Error('Failed to handle address selection');
      }
    }
  },

  // Get partners (service partner tiers with their partners)
  getPartners: async (): Promise<any> => {
    try {
      const response = await api.get(GENERAL_ENDPOINTS.GET_PARTNERS);
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      else {
        throw new Error('Failed to fetch partners');
      }
    }
  },

  // Get static page content
  getPageContent: async (pageType: 'privacy-policy' | 'terms-of-use' | 'cookie-policy' | 'lynx-agreement' | 'cancellation-policy-customer' | 'cancellation-policy-provider'): Promise<any> => {
    try {
      let endpoint = '';
      switch (pageType) {
        case 'privacy-policy':
          endpoint = GENERAL_ENDPOINTS.PRIVACY_POLICY;
          break;
        case 'terms-of-use':
          endpoint = GENERAL_ENDPOINTS.TERMS_OF_SERVICE;
          break;
        case 'cookie-policy':
          endpoint = GENERAL_ENDPOINTS.COOKIE_POLICY;
          break;
        case 'lynx-agreement':
          endpoint = GENERAL_ENDPOINTS.LYNX_AGREEMENT;
          break;
        case 'cancellation-policy-customer':
          endpoint = GENERAL_ENDPOINTS.CANCELLATION_POLICY_CUSTOMER;
          break;
        case 'cancellation-policy-provider':
          endpoint = GENERAL_ENDPOINTS.CANCELLATION_POLICY_PROVIDER;
          break;
        default:
          throw new Error('Invalid page type');
      }
      const response = await api.get(endpoint);
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      else {
        throw new Error('Failed to fetch page content');
      }
    }
  },

  // Get FAQs
  getFAQs: async (): Promise<any> => {
    try {
      const response = await api.get(GENERAL_ENDPOINTS.FAQS);
      return response;
    } catch (error: unknown) {
      const errorMessage = isApiError(error) ? error.response?.data?.message || error.message : (error as Error).message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      else {
        throw new Error('Failed to fetch FAQs');
      }
    }
  },
};
