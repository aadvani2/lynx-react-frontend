import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { servicesService } from "../../../services/generalServices/servicesService";
import type { ApiResponse, SearchData } from "../types";
import Swal from "sweetalert2";

export function useSearchLogic(onClearProviderSearch?: () => void) {
  const location = useLocation();
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const hasAutoSearchedRef = useRef(false);

  // Auto-search function for when coming from dashboard
  const performSearch = useCallback(async (searchData: SearchData) => {
    setLoading(true);
    try {
      const response = await servicesService.serviceSearch({
        service: searchData.service,
        service_id: searchData.service_id,
        zipCode: searchData.zipCode,
        serviceTier: String(searchData.serviceTier),
        date: searchData.date,
      });

      // Check for specific error message about no nearby providers
      if (response && !response.success && response.message === "No nearby service providers found for the requested time.") {
        // Clear previous results and provider search when no providers are found
        setApiResponse(null);
        onClearProviderSearch?.();
        // Show Swal modal for this specific error
        Swal.fire({
          icon: 'info',
          title: 'No Providers Available',
          text: 'No nearby service providers found for the requested time. Please try a different time or location.',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-primary rounded-pill px-4'
          }
        });
        return response;
      }

      // Clear results if API fails or returns no providers
      if (!response || !response.success || !response.providers || response.providers.length === 0) {
        setApiResponse(null);
        onClearProviderSearch?.();
      } else {
        // Store API response data only when there are actual providers
        setApiResponse(response);
        // localStorage.removeItem("sessionData");
      }

      return response;
    } catch (error: unknown) {
      console.error("Search error:", error);

      // Clear previous results and provider search when there's an error
      setApiResponse(null);
      onClearProviderSearch?.();

      // Check if the error message is the specific "no providers" message
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage === "No nearby service providers found for the requested time.") {
        // Show Swal modal for this specific error
        Swal.fire({
          icon: 'info',
          title: 'No Providers Available',
          text: 'No nearby service providers found for the requested time. Please try a different time or location.',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-primary rounded-pill px-4'
          }
        });
        // Return a mock response to prevent further error propagation
        return { success: false, message: errorMessage };
      }

      throw error;
    } finally {
      setLoading(false);
    }
  }, [onClearProviderSearch]);

  // Auto-search when coming from dashboard with state data (but not from ServiceModal)
  useEffect(() => {
    const searchState = location.state as {
      service?: string;
      location?: string;
      when?: string;
      service_id?: string;
      serviceTier?: number;
      date?: string;
      fromServiceModal?: boolean;
    } | null;

    // Don't auto-search if coming from ServiceModal - let the modal handle the search
    if (searchState && searchState.service && !searchState.fromServiceModal && !apiResponse && !hasAutoSearchedRef.current) {
      hasAutoSearchedRef.current = true;
      const searchData: SearchData = {
        service: searchState.service,
        service_id: searchState.service_id || "",
        zipCode: searchState.location || "",
        serviceTier: searchState.serviceTier || 1,
        date: searchState.date || "",
      };

      performSearch(searchData).catch(error => {
        console.error("Auto-search error:", error);
      });
    }
  }, [location.state, apiResponse, performSearch]);

  return {
    apiResponse,
    performSearch,
    loading,
  };
}
