import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebouncedSearch } from "../../../hooks/useDebouncedSearch";
import type { SearchSuggestion } from "../../../hooks/useSearchSuggestions";
import { servicesService } from "../../../services/generalServices/servicesService";
import { useAuthStore } from "../../../store/authStore";
import { getSessionData, updateSessionData } from "../../../utils/sessionDataManager";
import { swalFire } from "../../../lib/swalLazy";
import ServiceSearch from "../../public/home-page/NewHero/Components/ServiceSearch";
import WhenSelector from "../../public/home-page/NewHero/Components/WhenSelector";
import "./SearchForm.css";

const LocationSearchLoader = lazy(() => import("./LocationSearchLoader"));

interface SearchFormProps {
  zipCode: string;
  onZipCodeChange: (zipCode: string) => void;
  resetFormTrigger?: number;
  redirectOnSearch?: boolean; // Whether to redirect to /search after submission
  onSearchSuccess?: (searchData: {
    service: string;
    service_id: string;
    zipCode: string;
    serviceTier: number;
    date: string;
  }) => void; // Callback for when search is successful
}

const sanitizeZip = (value: string) => value.replace(/\D/g, "").slice(0, 5);

export default function SearchForm({
  zipCode,
  onZipCodeChange,
  resetFormTrigger,
  redirectOnSearch = true,
  onSearchSuccess
}: SearchFormProps) {
  const navigate = useNavigate();

  const [when, setWhen] = useState<"emergency" | "later" | null>(null);
  const [location, setLocation] = useState(zipCode);
  const [activateLocationSearch, setActivateLocationSearch] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const hydratedFromQuery = useRef(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Store selected service data for both authenticated and non-authenticated users
  const [selectedServiceData, setSelectedServiceData] = useState<{
    serviceId: string;
    serviceTitle: string;
    subCategory: string;
  } | null>(null);

  const {
    searchQuery,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    handleInputChange,
    setInputValueWithoutSearch,
    clearSuggestions,
    runSentenceSearch, // <-- ensure this is destructured
    loading,
  } = useDebouncedSearch(300);

  // Hydrate from URL query params first (preferred for shareable state)
  useEffect(() => {
    const serviceParam = searchParams.get("service") || "";
    const serviceIdParam = searchParams.get("service_id") || "";
    const locationParam = searchParams.get("location") || "";
    const whenParam = searchParams.get("when");
    const dateParam = searchParams.get("date") || "";

    const hasAny =
      !!serviceParam ||
      !!serviceIdParam ||
      !!locationParam ||
      !!whenParam ||
      !!dateParam;

    if (!hasAny) return;

    hydratedFromQuery.current = true;

    if (serviceParam) {
      setInputValueWithoutSearch(serviceParam);
    }

    if (serviceIdParam) {
      setSelectedServiceData({
        serviceId: serviceIdParam,
        serviceTitle: serviceParam || "",
        subCategory: "",
      });
    }

    if (locationParam) {
      setLocation(sanitizeZip(locationParam));
    }

    const normalizedWhen =
      whenParam === "schedule"
        ? "later"
        : whenParam === "emergency"
          ? "emergency"
          : null;
    setWhen(normalizedWhen);

    if (normalizedWhen === "later" && dateParam) {
      setSelectedDate(dateParam);
    }
  }, [searchParams, setInputValueWithoutSearch]);

  // Restore form fields from localStorage on page load (fallback when no URL params)
  useEffect(() => {
    if (hydratedFromQuery.current) return;

    // Use getSessionData which automatically checks expiration
    const sessionData = getSessionData();
    if (!sessionData) return;

    try {
      // Restore service name in search input
      const bookedServicesTitle = sessionData.booked_services_title || [];
      if (bookedServicesTitle.length > 0) {
        const serviceTitle = bookedServicesTitle[0];
        setInputValueWithoutSearch(serviceTitle);
      }

      // Restore location/zipcode
      if (sessionData.zipcode) {
        setLocation(sessionData.zipcode);
      }

      // Restore "when" selection (emergency or later)
      if (sessionData.service_tier_id) {
        const tier = sessionData.service_tier_id === 1 ? "emergency" : "later";
        setWhen(tier);
      }

      // Restore date/time if "Schedule later" was selected
      if (sessionData.schedule_time && sessionData.schedule_time !== "Now") {
        setSelectedDate(sessionData.schedule_time);
      }
    } catch (error) {
      console.error("Error restoring form from sessionData:", error);
    }
  }, [setInputValueWithoutSearch]);

  const handleSuggestionClick = async (suggestion: SearchSuggestion) => {
    // 1) If user clicks a sentence, run the sentence -> services flow.
    if (suggestion.type === "sentence") {
      const sentence = suggestion.text || "";

      // Optionally reflect the sentence in the input:
      setInputValueWithoutSearch(sentence);

      // Call /search?search=<sentence>&searchForm=service
      await runSentenceSearch(sentence);

      // Keep suggestions open, now populated with service-type items.
      setShowSuggestions(true);
      return;
    }

    // 2) If user clicks a service, do the existing booking/session logic.
    if (suggestion.type === "service") {
      // Show only the service title in the input field
      setInputValueWithoutSearch(suggestion.title || "");

      clearSuggestions();
      setShowSuggestions(false);

      const bookedServices = suggestion.service_id
        ? [Number(suggestion.service_id)]
        : undefined;
      const bookedServicesTitle = suggestion.title
        ? [suggestion.title]
        : undefined;

      // Store selected service data in component state for both auth and non-auth users
      setSelectedServiceData({
        serviceId: String(suggestion.service_id || ""),
        serviceTitle: suggestion.title || "",
        subCategory: suggestion.sub_category || "",
      });

      // Minimal payload - only these fields
      const sessionPayload = {
        sub_category: suggestion.sub_category,
        booked_services: bookedServices,
        booked_services_title: bookedServicesTitle,
      };

      // Save to sessionData if not authenticated
      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      if (!isAuthenticated) {
        updateSessionData(sessionPayload);
      } else {
        // Only call API if user is authenticated (post-login flow)
        try {
          await servicesService.storeSessionData(sessionPayload);
        } catch (error) {
          console.error("Error storing session data:", error);
        }
      }
    }
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate zip code/location
    const zipCodeValue = sanitizeZip(location);
    if (zipCodeValue.length !== 5) {
      await swalFire({
        title: 'Location Required',
        text: 'Please enter a valid zip code (5 digits) to search for service providers.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#1e4d5a',
        customClass: {
          popup: 'swal2-popup swal2-modal swal2-show',
          container: 'swal2-container swal2-center swal2-backdrop-show',
          confirmButton: 'btn btn-primary rounded-pill'
        },
        buttonsStyling: false
      });
      return;
    }

    // Fetch data from sessionData
    const sessionData = getSessionData() || {};

    // Extract data from sessionData (for non-authenticated users)
    const subCategory = sessionData.sub_category || "";
    const bookedServicesTitle = sessionData.booked_services_title || [];
    const bookedServices = sessionData.booked_services || [];
    const serviceTitleFromStorage = bookedServicesTitle.length > 0 ? bookedServicesTitle[0] : "";
    const serviceIdFromStorage = bookedServices.length > 0 ? String(bookedServices[0]) : "";
    const serviceTierId = sessionData.service_tier_id || (when === "emergency" ? 1 : when === "later" ? 3 : 1);
    const scheduleTime = sessionData.schedule_time || (when === "emergency" ? "Now" : when === "later" ? selectedDate : "");

    // Use component state data as fallback for authenticated users
    // Extract just the service name if serviceTitle already contains "Category > Service" format
    let rawServiceTitle = selectedServiceData?.serviceTitle || serviceTitleFromStorage;
    // If serviceTitle contains ">", extract just the service part (after the last ">")
    if (rawServiceTitle && rawServiceTitle.includes('>')) {
      const parts = rawServiceTitle.split('>').map(p => p.trim());
      rawServiceTitle = parts[parts.length - 1]; // Get the last part (service name)
    }
    const serviceTitle = rawServiceTitle;
    const serviceId = selectedServiceData?.serviceId || serviceIdFromStorage;
    const subCategoryFinal = selectedServiceData?.subCategory || subCategory;

    // Check if user typed a service directly in the input field
    const userInputService = searchQuery.trim();

    // Build service name - prioritize component state/localStorage data, but fall back to user input
    let serviceName = "";
    if (subCategoryFinal && serviceTitle) {
      // Check if serviceTitle already contains the category prefix to avoid duplication
      // If serviceTitle already has "Category > Service" format, extract just the service part
      if (serviceTitle.includes('>')) {
        const parts = serviceTitle.split('>').map(p => p.trim());
        // If the first part matches subCategoryFinal, serviceTitle already has the full format
        if (parts[0] === subCategoryFinal.trim()) {
          // serviceTitle already has the correct format, use it as-is
          serviceName = serviceTitle;
        } else {
          // serviceTitle has a different category, use the last part (service name) with subCategoryFinal
          const servicePart = parts[parts.length - 1];
          serviceName = `${subCategoryFinal} > ${servicePart}`;
        }
      } else {
        // serviceTitle doesn't have category prefix, combine with subCategoryFinal
        serviceName = `${subCategoryFinal} > ${serviceTitle}`;
      }
    } else if (serviceTitle) {
      // User selected a suggestion but no sub_category
      serviceName = serviceTitle;
    } else if (subCategoryFinal) {
      // Only sub_category available
      serviceName = subCategoryFinal;
    } else if (userInputService) {
      // User typed directly - use the input value
      serviceName = userInputService;
    }

    // Validate service selection: only show error if both localStorage and input are empty
    if (!serviceName || serviceName.trim() === "") {
      await swalFire({
        title: 'Service Required',
        text: 'Please enter a service before submitting.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#1e4d5a',
        customClass: {
          popup: 'swal2-popup swal2-modal swal2-show',
          container: 'swal2-container swal2-center swal2-backdrop-show',
          confirmButton: 'btn btn-primary rounded-pill'
        },
        buttonsStyling: false
      });
      return;
    }

    // Validate that user has selected Emergency or Scheduled
    if (!when) {
      await swalFire({
        title: 'Selection Required',
        text: 'Please select either Emergency or Scheduled before submitting.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#1e4d5a',
        customClass: {
          popup: 'swal2-popup swal2-modal swal2-show',
          container: 'swal2-container swal2-center swal2-backdrop-show',
          confirmButton: 'btn btn-primary rounded-pill'
        },
        buttonsStyling: false
      });
      return;
    }

    // Validate schedule time for "Schedule later" option
    if (serviceTierId === 3 && (!scheduleTime || scheduleTime === "")) {
      await swalFire({
        title: 'Date & Time Required',
        text: 'Please select a date and time for your scheduled service.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#1e4d5a',
        customClass: {
          popup: 'swal2-popup swal2-modal swal2-show',
          container: 'swal2-container swal2-center swal2-backdrop-show',
          confirmButton: 'btn btn-primary rounded-pill'
        },
        buttonsStyling: false
      });
      return;
    }

    onZipCodeChange(zipCodeValue);

    // Build query parameters for navigation and URL persistence
    const queryParams = new URLSearchParams();
    queryParams.set("service", serviceName);
    queryParams.set("location", zipCodeValue);
    if (serviceId) {
      queryParams.set("service_id", serviceId);
    }

    // Convert "when" value to match SearchResult expectations
    if (when === "later") {
      queryParams.set("when", "schedule");
    } else {
      queryParams.set("when", "emergency");
    }

    if (when === "later" && selectedDate) {
      queryParams.set("date", selectedDate);
    }

    // Persist URL state on the current page for shareability/bookmarks
    setSearchParams(queryParams, { replace: true });

    try {
      // Store session data before service search
      const sessionPayload = {
        service: serviceName,
        service_id: serviceId || "",
        zipCode: zipCodeValue,
        serviceTier: String(serviceTierId),
        date: scheduleTime,
      };
      // Check if user is authenticated before calling API
      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      if (!isAuthenticated) {
        updateSessionData(sessionPayload as any);
      } else {
        // Post-login flow: Call API
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await servicesService.storeSessionData(sessionPayload as any);
        } catch (error) {
          console.error("Error storing session data:", error);
          // Continue with search even if session storage fails
        }
      }

      // Call service_search API if callback is provided, otherwise call it directly
      if (onSearchSuccess) {
        // Pass search data to parent component for API call
        onSearchSuccess({
          service: serviceName,
          service_id: serviceId,
          zipCode: zipCodeValue,
          serviceTier: serviceTierId,
          date: scheduleTime,
        });
      } else {
        // Call API directly
        const response = await servicesService.serviceSearch({
          service: serviceName,
          service_id: serviceId || "",
          zipCode: zipCodeValue,
          serviceTier: String(serviceTierId),
          date: scheduleTime,
        });

        // Clear localStorage and component state after successful API call
        if (response && (response.success || response.data)) {
          // localStorage.removeItem("sessionData");

          // Reset form fields
          setInputValueWithoutSearch("");
          setLocation("");
          setSelectedServiceData(null);
          setWhen("emergency");
          setSelectedDate("");
          onZipCodeChange("");
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      // Continue with navigation even if API call fails
    }

    // Navigate to search results page with state if redirect is enabled
    if (redirectOnSearch) {
      navigate(`/search?${queryParams.toString()}`, {
        state: {
          service: serviceName,
          location: zipCodeValue,
          when: when === "later" ? "schedule" : when === "emergency" ? "emergency" : "",
          service_id: serviceId,
          serviceTier: serviceTierId,
          date: scheduleTime
        }
      });
    }
  }

  const handleLocationSelect = () => {
    // Callback for when location is selected
    // LocationSearch component handles the logic internally
  };

  const renderLocationInput = () => {
    if (activateLocationSearch) {
      return (
        <Suspense fallback={<div className="search__location-loading">Loading location…</div>}>
          <LocationSearchLoader
            location={location}
            onLocationChange={setLocation}
            onLocationSelect={handleLocationSelect}
            onZipCodeChange={onZipCodeChange}
            when={when}
          />
        </Suspense>
      );
    }

    return (
      <div className="search__group" style={{ position: "relative" }}>
        <label htmlFor="location-initial" className="search__label">Location</label>
        <input
          id="location-initial"
          className="search__input"
          value={location}
          onChange={(e) => {
            const sanitized = sanitizeZip(e.target.value);
            setLocation(sanitized);
            onZipCodeChange(sanitized);
          }}
          onFocus={() => setActivateLocationSearch(true)}
          placeholder="Zip code"
          aria-label="Location"
        />
      </div>
    );
  };

  useEffect(() => {
    if (!resetFormTrigger) return;

    setWhen(null);
    setSelectedDate("");
    setLocation("");
    setSelectedServiceData(null);
    onZipCodeChange("");
    setInputValueWithoutSearch("");
    clearSuggestions();
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [resetFormTrigger, clearSuggestions, setInputValueWithoutSearch, onZipCodeChange]);

  return (
    <form className="search" role="search" onSubmit={onSubmit} aria-label="Search professionals">
      {/* Service */}
      <div className="search__group">
        <ServiceSearch
          onSuggestionClick={handleSuggestionClick}
          searchQuery={searchQuery}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          handleInputChange={handleInputChange}
          loading={loading}
        />
      </div>
      <span className="search__divider" aria-hidden="true"></span>

      {/* Location */}
      <div className="search__group">
        {renderLocationInput()}
      </div>
      <span className="search__divider" aria-hidden="true"></span>

      {/* When */}
      <div className="search__group search__group--when">
        <WhenSelector
          when={when}
          onWhenChange={setWhen}
          onDateChange={setSelectedDate}
          onServiceDataUpdate={() => { }} // Dummy function to satisfy prop requirement
          selectedDate={selectedDate}
        />
      </div>

      {/* Search Icon */}
      <div className="search__icon">
        <button className="search-btn" aria-label="Search" type="submit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E4D5A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </form>
  );
}
