import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBackendImageUrl } from '../../../utils/urlUtils';
import AuthModal from '../../common/AuthModal';
import { useAuthStore } from '../../../store/authStore';
import { servicesService } from '../../../services/generalServices/servicesService';
import { updateSessionData, getSessionData } from '../../../utils/sessionDataManager';
import Swal from 'sweetalert2';

interface Provider {
  id: number;
  name: string;
  image: string;
  avg_rating: number | null;
  distance: string;
  bio: string;
  exp: string;
  service_partner_tier: string;
}

interface SearchResultsProps {
  providers?: Provider[];
  providerCount?: number;
  onClearResults?: () => void;
  searchService?: string;
  serviceSearchResponse?: {
    cat_id: number;
    subcat_id: number;
    sub_category: string;
    category?: string;
    service_tier_id: number;
    schedule_time: string;
    service_ids: string;
    service_titles: string;
    service_cat_slug: string;
    service_subcat_slug: string;
    main_category: string;
  };
}

const SearchResults: React.FC<SearchResultsProps> = ({ providers = [], onClearResults, searchService, serviceSearchResponse }) => {
  const { isAuthenticated } = useAuthStore(); // Get isAuthenticated from the auth store
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSearchButtonClick = () => {
    setIsSearchActive(!isSearchActive);
  };

  const handleClearProviderClick = () => {
    setSearchQuery("");
    setIsSearchActive(false);
  };

  // Real-time filtering as user types
  const filteredProviders = useMemo(() => {
    if (!searchQuery.trim()) {
      return providers;
    }

    const query = searchQuery.toLowerCase().trim();
    return providers.filter(provider => {
      if (!provider.name) return false;
      return provider.name.toLowerCase().includes(query);
    });
  }, [providers, searchQuery]);

  // Handle search input change with immediate filtering
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 0) {
      setIsSearchActive(true);
    } else {
      setIsSearchActive(false);
    }
  };

  // New reusable function
  const handleBookService = async (provider: Provider) => {
    if (!serviceSearchResponse) {
      console.error('No service search response available');
      return;
    }

    const category = serviceSearchResponse.service_cat_slug;
    const subcategory = serviceSearchResponse.service_subcat_slug;

    // Store navigation data for post-login redirect
    if (!isAuthenticated) {
      // Store necessary data in localStorage for after login navigation
      const bookingData = {
        category,
        subcategory,
        fromSearch: true,
        selectedProviderId: provider.id,
      };

      // Save to localStorage
      localStorage.setItem('pendingBookingData', JSON.stringify(bookingData));

      // Also store selected_provider_id in sessionData
      updateSessionData({
        selected_provider_id: provider.id.toString(),
      });

      // Show the auth modal
      setShowAuthModal(true);
      return;
    }

    try {
      // Call API to store session data
      await servicesService.storeSessionData({
        selected_provider_id: provider.id.toString(),
      });

      // Navigate to booking page on success
      navigate(`/book-service/${category}/${subcategory}`, {
        state: {
          fromSearch: true,
          selectedProviderId: provider.id,
        },
      });
    } catch (error) {
      console.error('🚀 ~ API Error:', error);

      // Show SweetAlert error modal
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text: 'Failed to start booking process. Please try again.',
        confirmButtonText: 'Okay',
        confirmButtonColor: '#0d6efd',
      });
    }
  };

  // Handle successful login and automatic navigation
  const handleLoginSuccess = async () => {
    // Close the auth modal
    setShowAuthModal(false);

    // Check if we have pending booking data
    const pendingBookingDataStr = localStorage.getItem('pendingBookingData');
    if (pendingBookingDataStr) {
      try {
        const bookingData = JSON.parse(pendingBookingDataStr);

        // Get the provider ID from sessionData
        const sessionData = getSessionData();
        const selectedProviderId = sessionData?.selected_provider_id;

        // Store the provider ID in the session via API
        await servicesService.storeSessionData({
          selected_provider_id: selectedProviderId,
        });

        // Navigate to the booking page
        navigate(`/book-service/${bookingData.category}/${bookingData.subcategory}`, {
          state: {
            fromSearch: bookingData.fromSearch,
            selectedProviderId: bookingData.selectedProviderId,
          },
        });

        // Clear the pending booking data
        localStorage.removeItem('pendingBookingData');
      } catch (error) {
        console.error('Error processing post-login booking:', error);
        Swal.fire({
          icon: 'error',
          title: 'Navigation Error',
          text: 'Failed to navigate to booking. Please try again.',
          confirmButtonText: 'Okay',
          confirmButtonColor: '#0d6efd',
        });
      }
    }
  };

  return (
    <section
      className="search-form-result"
      id="provider_list"
      style={{ marginTop: '-48px', position: 'relative', zIndex: 5 }}
    >
      <div className="container">
        <div className="bg-white rounded shadow-lg overflow-hidden">
          {/* Results Header */}
          <div className="bg-primary p-3 border-bottom border-primary">
            <div className="d-flex justify-content-between flex-wrap align-items-center gap-3">
              <div className="d-flex align-items-center gap-2 search-header-btn">
                <button
                  type="button"
                  className="btn btn-info rounded-pill btn-sm booking-btn"
                  onClick={() => console.log('Book service clicked')}
                >
                  Let Lynx choose the best Service Partner for you
                </button>
              </div>
              <div className="text-white">
                <div className={`d-flex gap-3 flex-md-nowrap flex-wrap align-items-center show-search-results justify-content-center justify-content-md-end position-relative ${isSearchActive ? 'active-provider-list' : ''}`}>
                  <div className="d-flex flex-wrap align-items-center show-results" style={{ display: isSearchActive ? 'none' : 'flex' }}>
                    Showing results for: &nbsp; <span className="fw-semibold" id="searchQueryDisplay"> {searchService}</span>
                  </div>
                  <div className="d-flex gap-3 flex-md-nowrap flex-wrap align-items-center">
                    <button
                      className="btn btn-sm btn-white gap-2 py-1 rounded-pill clear-result"
                      onClick={onClearResults}
                    >
                      Clear Results
                    </button>
                    <button
                      type="button"
                      id="searchProviderButton"
                      className="btn btn-sm btn-link text-white p-0 border-0 shadow-none"
                      onClick={handleSearchButtonClick}
                    >
                      <i className="uil uil-search fs-20" />
                    </button>
                    <div className="input-container provider-input-container d-flex align-items-center">
                      <input
                        id="provider-search"
                        type="text"
                        name="provider-name"
                        className="form-control-sm rounded-pill border-0 shadow-none providerNameSearch"
                        placeholder="Search provider"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onFocus={() => {
                          if (searchQuery.length > 0) {
                            setIsSearchActive(true);
                          }
                        }}
                        autoComplete="off"
                      />
                      <i className="clear-provider" id="clearProviderButton" style={{ cursor: 'pointer' }} onClick={handleClearProviderClick}>
                        <span className="badge bg-primary rounded-pill">X</span>
                      </i>
                      <i className="spinner-provider d-none" id="spinnerProviderButton">
                        <span className="spinner-border spinner-border-sm m-0" />
                      </i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3">
            <div className="row g-3" id="providerCards">
              {/* Dynamic provider cards */}
              {filteredProviders.map((provider) => (
                <div key={provider.id} className="col-12 col-sm-6 col-md-4 col-lg-2 provider-card" data-name={provider.name}>
                  <div className="card-inner card shadow-sm rounded overflow-hidden ">
                    {/* Card Front */}
                    <span className="info-card info-card-popover">
                      <img src="" alt="info-icon" />
                    </span>
                    <div className="hover-front card-front card-body d-flex flex-column justify-content-center align-items-center bg-white border-secondary p-3 h-100">
                      <div className="text-center w-100">
                        <span className="avatar bg-aqua bs-primary text-white w-11 mw-11 h-11 fs-17 mx-auto mb-3 object-fit-cover overflow-hidden">
                          <img src={getBackendImageUrl(provider.image)} alt="" className="w-100 h-100 object-fit-cover" />
                        </span>
                        <div className="align-items-center fw-bold d-flex text-body justify-content-center text-center w-100 mb-1">
                          {provider.name}
                        </div>
                        <div className="d-flex justify-content-center align-items-center mb-2">
                          <span className="text-secondary small" style={{ fontSize: 13 }}>
                            Not Enough Rating Yet <i className="uil uil-info-circle fs-12" />
                          </span>
                        </div>
                        <div className="d-flex justify-content-center align-items-center small text-secondary" style={{ fontSize: 13 }}>
                          <i className="fas fa-map-marker-alt me-1" /> {provider.distance}
                        </div>
                      </div>
                      <div className="mt-3 small text-secondary text-center">
                        <button
                          className="btn btn-primary w-100 text-white rounded-pill book-btn btn-sm"
                          onClick={() => handleBookService(provider)}
                        >
                          Book Service
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results Footer */}
          <div className="bg-light p-3 " style={{ background: '#E5EFF3 !important' }}>
            <div className="d-flex justify-content-between gap-2 flex-wrap align-items-center">
              <span className="text-secondary small" style={{ fontSize: 13 }} id="provider-count-text">
                {filteredProviders.length} service providers found
              </span>
            </div>
          </div>
        </div>
      </div>
      {showAuthModal && <AuthModal show={showAuthModal} onClose={() => setShowAuthModal(false)} onLoginSuccessNoRedirect={handleLoginSuccess} />}
    </section>
  );
};

export default SearchResults;
