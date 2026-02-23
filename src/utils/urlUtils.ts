/**
 * Utility functions for handling URLs and image paths
 */

/**
 * Gets the full backend URL for a given image path
 * @param imagePath - The image path (can be relative or absolute)
 * @returns The full URL for the image
 */
export const getBackendImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as-is
  if (/^(https?:|data:|blob:)/i.test(imagePath)) {
    return imagePath;
  }
  
  // Get the backend base URL (allow separate asset host)
  const baseUrl = import.meta.env.VITE_ASSET_BASE_URL || import.meta.env.VITE_API_BASE_URL || '';
  
  // Handle different image path formats
  let cleanPath = imagePath;
  
  // If path starts with 'images/', prepend '/storage/'
  if (imagePath.startsWith('images/')) {
    cleanPath = `/storage/${imagePath}`;
  }
  // If path starts with 'categories/' or 'subcategories/', prepend '/storage/images/'
  else if (imagePath.startsWith('categories/') || imagePath.startsWith('subcategories/')) {
    cleanPath = `/storage/images/${imagePath}`;
  }
  // If path already starts with '/storage/', use as-is
  else if (imagePath.startsWith('/storage/')) {
    cleanPath = imagePath;
  }
  // If path starts with 'storage/' (without leading slash), add leading slash
  else if (imagePath.startsWith('storage/')) {
    cleanPath = `/${imagePath}`;
  }
  // For other relative paths, ensure they start with '/'
  else {
    cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  }
  
  return `${baseUrl}${cleanPath}`;
};

/**
 * Gets the full backend URL for a given file path
 * @param filePath - The file path (can be relative or absolute)
 * @returns The full URL for the file
 */
export const getBackendFileUrl = (filePath: string | null | undefined): string => {
  return getBackendImageUrl(filePath);
};

/**
 * Gets the full backend URL for a given asset path
 * @param assetPath - The asset path (can be relative or absolute)
 * @returns The full URL for the asset
 */
export const getBackendAssetUrl = (assetPath: string | null | undefined): string => {
  return getBackendImageUrl(assetPath);
};

/**
 * Gets the backend base URL from environment variables
 * @returns The backend base URL
 */
export const getBackendBaseUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL || '';
};

/**
 * Gets the current origin (protocol + hostname + port) of the frontend
 * @returns The current origin
 */
export const getCurrentOrigin = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

/**
 * Logs origin information to the console
 * This helps debug CORS issues by showing what origin the frontend is using
 */
export const logOriginInfo = (): void => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    const apiBaseUrl = getBackendBaseUrl();
    
    console.group('🌐 Origin Information');
    console.log('Current Frontend Origin:', origin);
    console.log('Protocol:', protocol);
    console.log('Hostname:', hostname);
    console.log('Port:', port || '(default)');
    console.log('Backend API Base URL:', apiBaseUrl);
    console.log('---');
    console.log('Note: CORS allowed origins are configured on the backend server.');
    console.log('If you see CORS errors, ensure the backend allows:', origin);
    console.groupEnd();
  } else {
    console.warn('Origin info not available (not in browser environment)');
  }
};

/**
 * Prints allowed origins list (if available from backend)
 * This function attempts to fetch allowed origins from a backend endpoint
 * Note: This endpoint may not exist - it's optional
 */
export const printAllowedOrigins = async (): Promise<void> => {
  try {
    const { api } = await import('../services/api/api');
    const response = await api.get('/api/config/cors-origins');
    
    console.group('✅ Allowed CORS Origins (from backend)');
    if (Array.isArray(response.origins)) {
      response.origins.forEach((origin: string, index: number) => {
        console.log(`${index + 1}. ${origin}`);
      });
    } else if (response.allowedOrigins) {
      response.allowedOrigins.forEach((origin: string, index: number) => {
        console.log(`${index + 1}. ${origin}`);
      });
    } else {
      console.log('Response:', response);
    }
    console.groupEnd();
  } catch (error) {
    console.group('⚠️ Could not fetch allowed origins from backend');
    console.log('This endpoint may not exist. CORS origins are typically configured on the backend server.');
    console.log('Error:', error);
    console.groupEnd();
    
    // Still log current origin
    logOriginInfo();
  }
};
