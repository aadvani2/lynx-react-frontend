import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { servicesService } from "../../../services/generalServices/servicesService";
import type { ApiResponse, ResultItem } from "../types";

export function useBooking(
  apiResponse: ApiResponse | null,
  zipCode: string,
  searchState: { when?: "emergency" | "schedule"; date?: string } | null,
  onShowAuthModal?: (provider: ResultItem) => void
) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const handleBookService = async (provider: ResultItem) => {
    // First check if user is authenticated
    if (!isAuthenticated) {
      // If not authenticated, show auth modal with provider data
      if (onShowAuthModal) {
        onShowAuthModal(provider);
      }
      return;
    }

    await servicesService.storeSessionData({
      selected_provider_id: provider.id,
    });


    // If authenticated, navigate to returning-user page
    const bookingData = {
      service: apiResponse?.searchService || "",
      location: zipCode || "",
      when: searchState?.when || "emergency",
      scheduleDate: searchState?.when === "schedule" ? searchState?.date || "" : "",
      selectedProviderId: provider.id,
      selected_provider_id: provider.id,
      provider: {
        name: provider.name,
        distance: provider.distance,
        rating: provider.rating,
        reviews: provider.reviews,
        description: provider.description,
        image: provider.image,
        established: provider.established,
      },
      isNewUser: !isAuthenticated,
      isReturningUser: isAuthenticated && user?.user_type === 'customer',
      isEmergency: searchState?.when === "emergency",
      isScheduled: searchState?.when === "schedule",
    };

    navigate("/returning-user", {
      state: bookingData,
    });
  };

  const handleLynxChooseClick = async () => {
    try {
      // Call store_session_data API with the specified payload
      await servicesService.storeSessionData({
        selected_provider_id: "0"
      });

      // Prepare booking data similar to handleBookService but without provider
      const bookingData = {
        service: apiResponse?.searchService || "",
        location: zipCode || "",
        when: searchState?.when || "emergency",
        scheduleDate: searchState?.when === "schedule" ? searchState?.date || "" : "",
        selectedProviderId: 0,
        selected_provider_id: 0,
        isNewUser: !isAuthenticated,
        isReturningUser: isAuthenticated && user?.user_type === 'customer',
        isEmergency: searchState?.when === "emergency",
        isScheduled: searchState?.when === "schedule",
        lynxChoice: true, // Flag to indicate this was a "Let Lynx choose" selection
      };

      // Navigate to returning-user page
      navigate("/returning-user", {
        state: bookingData,
      });
    } catch (error) {
      console.error("Error calling store_session_data API:", error);
      // You could show an error message to the user here
    }
  };

  return { handleBookService, handleLynxChooseClick };
}
