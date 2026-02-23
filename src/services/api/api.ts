import Swal from '../../lib/swal';
import { useAuthStore } from '../../store/authStore';
import { makeManagedRequest, /* generateRequestId */ } from './requestManager';

const BASE_URL: string = import.meta.env.VITE_API_BASE_URL as string;

// Handle token expired - logout and redirect to home
async function handleTokenExpired() {
  // Get auth store and logout
  const { logout } = useAuthStore.getState();
  await logout();

  // Clear auth storage (redundant but ensures cleanup)
  localStorage.removeItem('auth-storage');

  // Show token expired modal
  await Swal.fire({
    title: 'Session Expired',
    text: 'Your session has expired. Please log in again.',
    icon: 'warning',
    imageUrl: '',
    imageWidth: 77,
    imageHeight: 77,
    width: '500px',
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    timer: 3000,
    timerProgressBar: false
  });

  // Redirect to home page
  window.location.href = '/';
}

// Handle authentication failure
async function handleAuthenticationFailure() {
  // Get auth store and logout
  const { logout } = useAuthStore.getState();
  await logout();

  // Clear auth storage (redundant but ensures cleanup)
  localStorage.removeItem('auth-storage');

  // Show session expired modal without OK button
  Swal.fire({
    title: 'Session Expired',
    text: 'Your session has expired. Please log in again.',
    icon: 'warning',
    imageUrl: '',
    imageWidth: 77,
    imageHeight: 77,
    width: '500px',
    showConfirmButton: false,
    customClass: {
      popup: 'swal2-popup swal2-modal swal2-show',
      container: 'swal2-container swal2-center swal2-backdrop-show'
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
    timer: 3000,
    timerProgressBar: true
  });

  // Redirect to login page after modal
  setTimeout(() => {
    window.location.href = '/';
  }, 3000);
}
async function request(
  method: string,
  endpoint: string,
  body?: unknown,
  headers: Record<string, string> = {},
  abortController?: AbortController
) {
  const authStorage = localStorage.getItem("auth-storage");
  let token: string | null = null;

  if (authStorage) {
    try {
      const authData = JSON.parse(authStorage);
      token = authData.state?.token || null;
    } catch { }
  }

  // const requestId = generateRequestId();
  const fullUrl = `${BASE_URL}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  // if (import.meta.env.DEV) console.log(`[API] ${method} ${endpoint} [${requestId}]`);

  const res = await makeManagedRequest(method, fullUrl, body, requestHeaders, abortController);

  // 401 handling
  if (res.status === 401) {
    const isLoginRequest = endpoint === "/login" || endpoint.includes("/login");

    if (isLoginRequest) {
      // login forms expect a JSON error
      const data = await res.json().catch(() => ({
        success: false,
        message: "Invalid email or password. Please try again.",
      }));
      throw data;
    }

    // logout + redirect
    const { logout } = useAuthStore.getState();
    await logout();
    
    // Clear all auth-related storage (redundant but ensures cleanup)
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("authToken");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refreshToken");
    sessionStorage.clear();

    window.location.href = "/";
    // stop execution
    throw { success: false, message: "Unauthorized" };
  }

  const contentType = res.headers.get("Content-Type") || "";

  // non-ok handling
  if (!res.ok) {
    const errBody = contentType.includes("application/json")
      ? await res.json().catch(() => ({}))
      : { message: await res.text().catch(() => "") };

    if (errBody?.success === false && errBody?.code === "TOKEN_EXPIRED") {
      await handleTokenExpired();
      return { success: false, message: errBody.message || "Token has expired" };
    }

    if (errBody?.success === false && errBody?.message === "Authentication failed.") {
      await handleAuthenticationFailure();
      return { success: false, message: "Authentication failed" };
    }

    throw errBody;
  }

  // ok handling
  if (contentType.includes("application/json")) {
    const data = await res.json().catch(() => ({}));

    if (data?.success === false && data?.code === "TOKEN_EXPIRED") {
      await handleTokenExpired();
      return { success: false, message: data.message || "Token has expired" };
    }

    return data;
  }

  return res.text();
}


export const api = {
  get: (endpoint: string, headers?: Record<string, string>, abortController?: AbortController) =>
    request("GET", endpoint, undefined, headers, abortController),
  post: (endpoint: string, body: unknown, headers?: Record<string, string>, abortController?: AbortController) =>
    request("POST", endpoint, body, headers, abortController),
  put: (endpoint: string, body: unknown, headers?: Record<string, string>, abortController?: AbortController) =>
    request("PUT", endpoint, body, headers, abortController),
  delete: (endpoint: string, headers?: Record<string, string>, abortController?: AbortController) =>
    request("DELETE", endpoint, undefined, headers, abortController),
};
