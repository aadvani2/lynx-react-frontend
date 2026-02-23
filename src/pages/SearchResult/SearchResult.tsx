import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "./SearchResult.css";
import { ServiceCard, SearchBarRow, EmptyState, ServiceDetailsModal } from "./components";
import { useSearchLogic, useResults, useBooking } from "./hooks";
import AuthModal from "../../components/common/AuthModal";
import type { SearchData, ResultItem } from "./types";
import { servicesService } from "../../services/generalServices/servicesService";
import { getSessionData, clearSessionData } from "../../utils/sessionDataManager";
import { useAuthStore } from "../../store/authStore";

interface ServiceModalData {
  service: string;
  location: string;
  service_id?: string;
  zipCode?: string;
  serviceTier?: number;
  date?: string;
}

interface LocalStorageSessionData {
  service_id?: string;
  service_tier_id?: number;
  schedule_time?: string;
}

export default function SearchResult(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [providerSearchQuery, setProviderSearchQuery] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);
  const [serviceModalData, setServiceModalData] = useState<ServiceModalData | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<ResultItem | null>(null); // Store selected provider for post-login navigation
  const [categoryImageFallback, setCategoryImageFallback] = useState<string>("");
  const hasCalledApisOnLoadRef = useRef(false);

  // Extract search parameters from location state
  const rawSearchState = location.state as {
    service?: string;
    location?: string;
    when?: "emergency" | "schedule";
    date?: string;
    service_id?: string;
    serviceTier?: number;
  } | null;

  // Derive searchState from location.state or URL params if state is null
  const searchState = React.useMemo(() => {
    // If location.state exists, use it
    if (rawSearchState) {
      return rawSearchState;
    }

    // Otherwise, derive from URL params
    const serviceParam = searchParams.get("service") || "";
    const serviceIdParam = searchParams.get("service_id") || "";
    const locationParam = searchParams.get("location") || "";
    const whenParam = searchParams.get("when");
    const dateParam = searchParams.get("date") || "";

    // Only return derived state if we have meaningful params
    if (serviceParam || serviceIdParam || locationParam || whenParam || dateParam) {
      // Determine service tier from when param
      const serviceTier = whenParam === "schedule" ? 3 : (whenParam === "emergency" ? 1 : undefined);
      
      // Decode date param (URLSearchParams decodes %2B to +, we need to convert + back to space)
      const date = whenParam === "schedule" && dateParam 
        ? dateParam.replace(/\+/g, ' ') 
        : (whenParam === "emergency" ? "Now" : dateParam || "");

      return {
        service: serviceParam,
        location: locationParam,
        when: (whenParam as "emergency" | "schedule") || undefined,
        date: date,
        service_id: serviceIdParam,
        serviceTier: serviceTier,
      };
    }

    return null;
  }, [rawSearchState, searchParams]);


  const { apiResponse, performSearch, loading } = useSearchLogic(() => setProviderSearchQuery(""));
  const results = useResults(apiResponse, providerSearchQuery, categoryImageFallback);

  const handleShowAuthModal = (provider: ResultItem) => {
    setSelectedProvider(provider);
    setShowAuthModal(true);
  };

  const { handleBookService, handleLynxChooseClick } = useBooking(apiResponse, zipCode, searchState, handleShowAuthModal);

  // Check if coming from ServiceModal and show modal
  useEffect(() => {
    const searchState = location.state as ServiceModalData | null;
    // Detect ServiceModal navigation by checking if location is empty and we have service data
    if (searchState && searchState.service && searchState.location === '' && !apiResponse) {
      setServiceModalData(searchState);
      setShowServiceModal(true);
    }
  }, [location.state, apiResponse]);

  // Load category image as a fallback for provider cards (when provider image is missing)
  useEffect(() => {
    const loadCategoryImage = async () => {
      const requestData = apiResponse?.requestData as Record<string, unknown> | undefined;
      const catId = requestData?.cat_id;

      if (!catId) {
        setCategoryImageFallback("");
        return;
      }

      try {
        const services = await servicesService.getServices();
        const categories = services?.categories || [];
        const category = categories.find((c: { id: number }) => String(c.id) === String(catId));
        const image = category?.image || "";
        setCategoryImageFallback(image);
      } catch (error) {
        console.error("Failed to load category image for fallback:", error);
        setCategoryImageFallback("");
      }
    };

    loadCategoryImage();
  }, [apiResponse]);

  // On page load/reload: Parse URL params and call APIs if params exist (e.g., from ServiceModal)
  useEffect(() => {
    // Only run once on initial load, and only if we haven't called APIs yet
    if (hasCalledApisOnLoadRef.current) return;

    // If apiResponse already exists, search has been performed, don't call again
    if (apiResponse) {
      hasCalledApisOnLoadRef.current = true;
      return;
    }

    // If location.state exists, let useSearchLogic handle it (navigation scenario)
    // Only handle URL params when location.state is null (page reload or ServiceModal scenario)
    if (location.state) {
      hasCalledApisOnLoadRef.current = true;
      return;
    }

    // Parse URL parameters
    const serviceParam = searchParams.get("service") || "";
    const serviceIdParam = searchParams.get("service_id") || "";
    const locationParam = searchParams.get("location") || "";
    const whenParam = searchParams.get("when");
    const dateParam = searchParams.get("date") || "";

    // Check if we have any params - if not, don't call APIs
    const hasParams = !!(
      serviceParam ||
      serviceIdParam ||
      locationParam ||
      whenParam ||
      dateParam
    );

    if (!hasParams) {
      hasCalledApisOnLoadRef.current = true;
      return;
    }

    // Mark as called immediately to prevent duplicate calls
    hasCalledApisOnLoadRef.current = true;

    // Set zipCode from location param
    if (locationParam) {
      setZipCode(locationParam);
    }

    // Determine service tier from when param
    const serviceTierId = whenParam === "schedule" ? 3 : 1;
    // Decode date param (URLSearchParams decodes %2B to +, we need to convert + back to space)
    const scheduleTime = whenParam === "schedule" && dateParam 
      ? dateParam.replace(/\+/g, ' ') 
      : (whenParam === "emergency" ? "Now" : "");

    // Build payload for store_session_data API
    const sessionPayload = {
      service_id: serviceIdParam || "",
      zipcode: locationParam,
      service_tier_id: serviceTierId,
      ...(scheduleTime && scheduleTime !== "Now" && { schedule_time: scheduleTime }),
    };

    // Call APIs
    const callApis = async () => {
      try {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        
        // Call store_session_data API
        if (isAuthenticated) {
          try {
            await servicesService.storeSessionData(sessionPayload);
          } catch (error) {
            console.error("Error storing session data:", error);
          }
        }

        // Call service_search API
        if (serviceParam && locationParam) {
          await performSearch({
            service: serviceParam,
            service_id: serviceIdParam || "",
            zipCode: locationParam,
            serviceTier: serviceTierId,
            date: scheduleTime,
          });
        }
      } catch (error) {
        console.error("Error calling APIs on page load:", error);
      }
    };

    callApis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, apiResponse]);

  // Handle search success callback (for manual searches and modal searches)
  const handleSearchSuccess = async (searchData: SearchData) => {
    try {
      await performSearch(searchData);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // Handle search from ServiceDetailsModal
  const handleModalSearch = async (searchData: SearchData) => {
    await handleSearchSuccess(searchData);
  };

  // Handle successful login from AuthModal
  const handleLoginSuccess = async () => {
    // Close the auth modal
    setShowAuthModal(false);

    const storedSessionData = getSessionData();
    let localStoragePayload: LocalStorageSessionData = {};
    if (storedSessionData) {
      localStoragePayload = storedSessionData;
    }

    const payload = {
      selected_provider_id: selectedProvider?.id,
      service_id: searchState?.service_id || localStoragePayload.service_id || "", // Prioritize searchState, then localStorage
      service_tier_id: searchState?.serviceTier || localStoragePayload.service_tier_id, // Prioritize searchState, then localStorage
      schedule_time: searchState?.date || localStoragePayload.schedule_time, // Prioritize searchState, then localStorage
      ...localStoragePayload, // Merge remaining payload from localStorage
    };

    await servicesService.storeSessionData(payload);

    // Clear sessionData after successful session data storage
    clearSessionData();

    // Navigate to returning-user page with provider data
    const bookingData = {
      service: apiResponse?.searchService || "",
      location: zipCode || "",
      when: searchState?.when || "emergency",
      scheduleDate: searchState?.when === "schedule" ? searchState?.date || "" : "",
      selectedProviderId: selectedProvider?.id,
      selected_provider_id: selectedProvider?.id,
      provider: selectedProvider ? {
        name: selectedProvider.name,
        distance: selectedProvider.distance,
        rating: selectedProvider.rating,
        reviews: selectedProvider.reviews,
        description: selectedProvider.description,
        image: selectedProvider.image,
        established: selectedProvider.established,
      } : undefined,
      isNewUser: false,
      isReturningUser: true,
      isEmergency: searchState?.when === "emergency",
      isScheduled: searchState?.when === "schedule",
    };


    navigate("/returning-user", {
      state: bookingData,
    });
  };

  return (
    <div className="body">
      <div className="body-inner position-relative">

        {/* Loader overlay */}
        {loading && (
          <div className="loader-main-v2" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
            <span className="loader-v2"></span>
          </div>
        )}

        <SearchBarRow
          zipCode={zipCode}
          onZipCodeChange={setZipCode}
          onSearchSuccess={handleSearchSuccess}
          providerSearchQuery={providerSearchQuery}
          onProviderSearchChange={setProviderSearchQuery}
          onLynxChooseClick={handleLynxChooseClick}
          hasProviders={results.length > 0}
        />

        <div className="pro-listing-parent">
          {results.length > 0 ? (
            <div className="service-list">
              {results.map((r, idx) => (
                <ServiceCard
                  key={idx}
                  id={r.id}
                  image={r.image}
                  imageFallback={categoryImageFallback}
                  name={r.name}
                  distance={r.distance}
                  rating={r.rating}
                  reviews={r.reviews}
                  description={r.description}
                  established={r.established}
                  onBookService={handleBookService}
                />
              ))}
            </div>
          ) : (
            <EmptyState hasSearched={!!apiResponse} />
          )}
        </div>
        {/* <div className="load-more-container">
          <button className="load-more-btn">Load More</button>
        </div> */}
      </div>

      {/* Service Details Modal */}
      {serviceModalData && (
        <ServiceDetailsModal
          show={showServiceModal}
          onClose={() => setShowServiceModal(false)}
          serviceData={serviceModalData}
          onSearch={handleModalSearch}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccessNoRedirect={handleLoginSuccess}
      />
    </div>
  );
}
