import { useState, useEffect, lazy, Suspense } from "react";
import HeroSection from "../../components/public/home-page/HeroSection/HeroSection";
import { useAuthStore } from "../../store/authStore";
import { clearSessionData } from "../../utils/sessionDataManager";
import LoadingComponent from "../../components/common/LoadingComponent";
import DeferredComponent from "../../components/common/DeferredComponent";

// Lazy load below-the-fold components - loaded after first paint to improve TBT
const PopularCategories = lazy(() => import("../../components/public/home-page/PopularCategories/PopularCategories"));
const HowItWorks = lazy(() => import("../../components/public/home-page/HowItWorks"));
const WhyChoose = lazy(() => import("../../components/public/home-page/WhyChoose"));
const Testimonials = lazy(() => import("../../components/public/home-page/Testimonials"));
const BrowseAllServices = lazy(() => import("../../components/BrowseAllServices"));
const CTA = lazy(() => import("../../components/public/home-page/CTA"));

const HomePage = () => {
  const [resetFormTrigger] = useState(0);
  const [zipCode, setZipCode] = useState('');
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
      const hasSessionData = localStorage.getItem('sessionData');
      if (hasSessionData) {
        clearSessionData();
    }
  }, [isAuthenticated]);

  const handleZipCodeChange = (newZipCode: string) => {
    setZipCode(newZipCode);
  };

  // Scroll to top when page loads/refreshes
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      try {
        window.scrollTo({ top: 0, behavior: "auto" });
      } catch {
        // Fallback for older browsers
        window.scrollTo(0, 0);
      }
    }
  }, []);

  // TEMPORARILY HIDDEN: normalizeSearchResults function
  // Normalizes the search results data structure from API response
  // Handles different response formats and extracts providers, count, request data, and service name
  /*
  const normalizeSearchResults = (results: SearchResultsData | null): SearchResultsData | null => {
    if (!results) return null;

    const possibleData = (results as any)?.data;
    const base = possibleData && typeof possibleData === "object" && !Array.isArray(possibleData)
      ? possibleData
      : results;

    const providers = (base as any)?.providers
      ?? (possibleData as any)?.providers
      ?? (results as any)?.providers
      ?? [];

    const providerCount = (base as any)?.providerCount
      ?? (possibleData as any)?.providerCount
      ?? providers.length;

    const requestData = (base as any)?.requestData
      ?? (possibleData as any)?.requestData
      ?? (results as any)?.requestData
      ?? null;

    const searchServiceValue = (base as any)?.searchService
      ?? (results as any)?.searchService
      ?? (base as any)?.service
      ?? (requestData as any)?.service_titles
      ?? (requestData as any)?.serviceTitles
      ?? "";

    return {
      ...results,
      ...base,
      providers,
      providerCount,
      requestData,
      searchService: searchServiceValue,
      success: (results as any)?.success ?? (base as any)?.success ?? true,
      message: (results as any)?.message ?? (base as any)?.message,
    };
  };
  */

  // TEMPORARILY HIDDEN: handleSearchSuccess function
  // Callback function called when search is successful
  // Processes results, shows SearchResults component if providers found, or NoProvidersNotice if none found
  // Also handles scrolling to results section
  /*
  const handleSearchSuccess = (rawResults: SearchResultsData) => {
    const results = normalizeSearchResults(rawResults);

    if (!results) {
      setShowSearchResults(false);
      setShowNoProviders(false);
      return;
    }

    if (results.success === false && results.message === "No nearby service providers found for the requested time.") {
      setShowNoProviders(true);
      setShowSearchResults(false);
      return;
    }

    setShowNoProviders(false);
    setShowSearchResults(true);
    setSearchResultsData(results);
    // Scroll to results section
    const resultsSection = document.getElementById('provider_list');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  */

  // TEMPORARILY HIDDEN: handleClearResults function
  // Clears search results and resets the search form
  // Called when user clicks "Clear" or "Back to search" button
  /*
  const handleClearResults = () => {
    setShowSearchResults(false);
    setShowNoProviders(false);
    setResetFormTrigger(prev => prev + 1); // Increment to trigger form reset
    setZipCode(''); // Clear zip code on results clear
  };
  */

  return (
    <main className="homepage">
      {/* Hero section - critical, load immediately (above the fold) */}
      <HeroSection
        resetFormTrigger={resetFormTrigger}
        zipCode={zipCode}
        onZipCodeChange={handleZipCodeChange}
      />
      {/* Below-the-fold sections - deferred until after first paint to improve TBT */}
      <Suspense fallback={<LoadingComponent />}>
        <DeferredComponent
          component={PopularCategories}
          fallback={<LoadingComponent />}
          delay={100}
          rootMargin="200px"
        />
      </Suspense>
      <Suspense fallback={<LoadingComponent />}>
        <DeferredComponent
          component={HowItWorks}
          fallback={<LoadingComponent />}
          delay={150}
          rootMargin="200px"
        />
      </Suspense>
      <Suspense fallback={<LoadingComponent />}>
        <DeferredComponent
          component={WhyChoose}
          fallback={<LoadingComponent />}
          delay={200}
          rootMargin="200px"
        />
      </Suspense>
      <Suspense fallback={<LoadingComponent />}>
        <DeferredComponent
          component={Testimonials}
          fallback={<LoadingComponent />}
          delay={250}
          rootMargin="200px"
        />
      </Suspense>
      <Suspense fallback={<LoadingComponent />}>
        <DeferredComponent
          component={BrowseAllServices}
          fallback={<LoadingComponent />}
          delay={300}
          rootMargin="200px"
        />
      </Suspense>
      <Suspense fallback={<LoadingComponent />}>
        <DeferredComponent
          component={CTA}
          fallback={<LoadingComponent />}
          delay={350}
          rootMargin="200px"
        />
      </Suspense>
    </main>
  );
};

export default HomePage;
