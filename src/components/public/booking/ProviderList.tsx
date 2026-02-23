import React, { useState, useMemo } from 'react';
import { useAddressSelectionStore } from '../../../store/addressSelectionStore';

// Helper function to get full image URL
const getImageUrl = (imagePath: string) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return `${baseUrl}/storage/${imagePath}`;
};

interface Provider {
  id: number;
  name: string;
  rating: number;
  review_count: number;
  distance: number;
  image: string;
  is_available: boolean;
  services: string;
  service_radius: string;
}

interface ProviderListProps {
  providers: Provider[];
  onSearch: (query: string) => void;
  onContinueFlow: () => void;
  onBookService: (providerId: number) => Promise<void>;
  onResetServiceBooking?: (resetFn: () => void) => void;
}

const ProviderList: React.FC<ProviderListProps> = ({
  providers,
  onSearch,
  onContinueFlow,
  onBookService,
  onResetServiceBooking
}) => {
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const { isSearchActive, setIsSearchActive } = useAddressSelectionStore();
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Expose reset function to parent component
  React.useEffect(() => {
    if (onResetServiceBooking) {
      onResetServiceBooking(() => {
        setSelectedProviderId(null);
      });
    }
  }, [onResetServiceBooking]);

  const handleSearchButtonClick = () => {
    setIsSearchActive(!isSearchActive);
  };

  const handleClearProviderClick = () => {
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

  return (
    <>
      <div className="mt-3" id="providerListDiv">
        <div className="container px-0 search-form-result-inner">
          <div className="bg-white rounded shadow-lg overflow-hidden">
            {/* Results Header */}
            <div className="bg-primary p-3 border-bottom border-primary">
              <div className="d-flex justify-content-between flex-wrap align-items-center gap-3">
                <div className="d-flex align-items-center gap-2 search-header-btn">
                  <button
                    type="button"
                    className="btn btn-info rounded-pill btn-sm booking-btn"
                    id="continueFlow"
                    onClick={onContinueFlow}
                  >
                    Let Lynx choose the best Service Partner for you
                  </button>
                </div>
                <div className="text-white">
                  <div className={`d-flex gap-3 flex-md-nowrap flex-wrap align-items-center show-search-results show-search-results-appliance justify-content-center justify-content-md-end position-relative ${isSearchActive ? 'active-provider-list' : ''}`}>
                    <div className="d-flex gap-3 flex-md-nowrap flex-wrap align-items-center">
                      <button
                        type="button"
                        id="searchProviderButton2"
                        className="btn btn-sm btn-link text-white p-0 border-0 shadow-none"
                        onClick={handleSearchButtonClick}
                      >
                        <i className="uil uil-search fs-20" />
                      </button>
                      <div className="input-container provider-input-container d-flex align-items-center">
                        <input
                          type="text"
                          name="provider-name"
                          className="form-control-sm rounded-pill border-0 shadow-none providerNameSearch"
                          placeholder="Search provider"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            onSearch(e.target.value);
                          }}
                          required
                        />
                        <i
                          className="clear-provider"
                          id="clearProviderButton"
                          onClick={() => {
                            setSearchQuery("");
                            onSearch("");
                            handleClearProviderClick();
                          }}
                          style={{ cursor: 'pointer' }}
                        >
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
                {filteredProviders.map((provider) => (
                    <div key={provider.id} className="col-12 col-sm-6 col-md-4 col-lg-2 provider-card" data-name={provider.name}>
                      <div className={`card-inner card shadow-sm rounded overflow-hidden ${!provider.is_available ? 'disabled-provider' : ''}`}>
                        <span className="info-card info-card-popover" data-content={`
                      <div class="modern-info-card ${!provider.is_available ? 'disabled-provider' : ''}">
                        <div class="modern-header">
                          <div class="modern-logo">
                            <span class="avatar bg-primary text-white w-7 mw-7 h-7 fs-12 object-fit-cover overflow-hidden">
                              <img src="${getImageUrl(provider.image)}" alt="" class="w-100 h-100 object-fit-cover">
                            </span>
                            <div class="modern-logo-inner">
                              <span class="modern-company">${provider.name}</span>
                              <div class="modern-rating-item">${provider.rating.toFixed(1)} (${provider.review_count} reviews)</div>
                            </div>
                          </div>
                          <div class="overflow-hidden modern-header-shap">
                            <div class="divider text-light mx-n2">
                              <span class="shap-popover"></span>
                            </div>
                          </div>
                        </div>
                        <div class="modern-body">
                          <div class="modern-details">
                            <div class="modern-detail-item">
                              <span class="modern-icon modern-icon-licensed"></span>
                              <span>Licensed & Insured</span>
                            </div>
                            <div class="modern-detail-item">
                              <span class="modern-icon modern-icon-vetted"></span>
                              <span>Vetted by Lynx</span>
                            </div>
                          </div>
                          <div class="modern-footer-inner">
                            <strong>Service Radius:</strong>
                            <div class="d-flex w-100 modern-tag">
                              <span>${provider.service_radius}</span>
                            </div>
                          </div>
                        </div>
                        <div class="modern-footer">
                          <div class="modern-bio">
                            <strong>Services:</strong><br>
                            ${provider.services}
                          </div>
                        </div>
                      </div>
                    `}>
                          <img src="" alt="info-icon" />
                        </span>
                        <div className="hover-front card-front card-body d-flex flex-column justify-content-center align-items-center bg-white border-secondary p-3 h-100">
                          <div className="text-center">
                            <span className="avatar bg-aqua bs-primary text-white w-11 mw-11 h-11 fs-17 mx-auto mb-3 object-fit-cover overflow-hidden">
                              <img src={getImageUrl(provider.image)} alt={provider.name} className="w-100 h-100 object-fit-cover" />
                            </span>
                            <div className="align-items-center fw-bold d-flex text-body justify-content-center text-center w-100 mb-1">
                              {provider.name}
                            </div>
                            <div className="d-flex justify-content-center align-items-center mb-2">
                              <span className="text-secondary small" style={{ fontSize: 13 }}>
                                {provider.rating.toFixed(1)} ({provider.review_count} reviews) <i className="uil uil-info-circle fs-12" />
                              </span>
                            </div>
                            <div className="d-flex justify-content-center align-items-center small text-secondary" style={{ fontSize: 13 }}>
                              <i className="fas fa-map-marker-alt me-1" /> {provider.distance.toFixed(1)} miles away
                            </div>
                          </div>
                          <div className="mt-3 small text-secondary text-center">
                            {provider.is_available ? (
                              <button
                                className="btn btn-primary w-100 text-white rounded-pill book-btn btn-sm providerSelection"
                                data-pid={provider.id}
                                onClick={async () => {
                                  setSelectedProviderId(provider.id);
                                  try {
                                    await onBookService(provider.id);
                                    // If API call is successful, the button text will show "Selected"
                                  } catch {
                                    // If API call fails, reset the selection
                                    setSelectedProviderId(null);
                                  }
                                }}
                              >
                                {selectedProviderId === provider.id ? 'Selected' : 'Book Service'}
                              </button>
                            ) : (
                              <span>Unavailable for the selected time</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Results Footer */}
            <div className="bg-light p-3" style={{ background: '#E5EFF3 !important' }}>
              <div className="d-flex justify-content-between gap-2 flex-wrap align-items-center">
                <span className="text-secondary small" style={{ fontSize: 13 }} id="provider-count-text">
                  {providers.length} service providers found
                </span>
              </div>
            </div>


          </div>
        </div>
      </div>
    </>

  );
};

export default ProviderList;
