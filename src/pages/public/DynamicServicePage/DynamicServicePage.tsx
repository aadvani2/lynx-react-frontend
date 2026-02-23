import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, useSearchParams } from 'react-router-dom';
import styles from './DynamicServicePage.module.css';
import { servicesService } from '../../../services/generalServices/servicesService';
import ServiceModal from '../../../components/public/ServiceModal/ServiceModal';
import BackendImage from '../../../components/common/BackendImage/BackendImage';
import LoadingComponent from '../../../components/common/LoadingComponent';

interface Service {
  id: number;
  title: string;
  slug: string;
  image: string;
  description: string;
}

interface Subcategory {
  description: string;
  id: number;
  title: string;
  slug: string;
  image: string;
  services: Service[];
  services_titles: string[];
}

interface Category {
  id: number;
  title: string;
  slug: string;
}

interface ServicesResponse {
  success: boolean;
  data?: {
    page: string;
    seo_title: string;
    seo_desc: string;
    menu: string;
    category: Category;
    subcategories: Subcategory[];
  };
  message?: string;
}

const DynamicServicePage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const processedLocationKey = useRef<string | null>(null); // Ref to store the location.key that has been processed
  const processedUrlSubcategory = useRef<string | null>(null); // Ref to store the last processed subcategory slug from URL
  const isSettingUrlParamRef = useRef(false); // Ref to track when we're programmatically setting URL params

  const handleCardClick = useCallback(async (subcategory: Subcategory) => {
    // Open modal immediately with existing subcategory data
    setSelectedSubcategory(subcategory);
    setShowModal(true);
    setError(null);
    
    // Mark that we're setting the URL param ourselves
    isSettingUrlParamRef.current = true;
    processedUrlSubcategory.current = subcategory.slug;
    
    // Update URL params
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('subcategory', subcategory.slug);
      return next;
    }, { replace: true });

    // Fetch additional details in the background (if needed)
    // This allows the modal to open immediately while data loads
    try {
      const response = await servicesService.getServiceBySubcategory(subcategory.slug);
      if (response?.success && response.data) {
        // Update with fetched data (may have more complete service list)
        setSelectedSubcategory(response.data);
      } else {
        // If fetch fails, modal is already open with existing data
        console.warn(`Failed to fetch additional details for ${subcategory.title}:`, response?.message);
      }
    } catch (err: unknown) {
      // If fetch fails, modal is already open with existing data
      console.warn(`Error fetching additional details for ${subcategory.title}:`, err);
    } finally {
      // Reset the flag after a short delay to allow useEffect to skip
      setTimeout(() => {
        isSettingUrlParamRef.current = false;
      }, 100);
    }
  }, [setSearchParams]);

  const closeModal = () => {
    setShowModal(false);
    setSelectedSubcategory(null);
    // Remove subcategory from URL params when modal closes
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('subcategory');
      return next;
    }, { replace: true });
  };

  useEffect(() => {
    // Reset processed refs when category changes
    processedLocationKey.current = null;
    processedUrlSubcategory.current = null;

    const fetchServices = async () => {
      if (!category) {
        setError('Invalid service category');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response: ServicesResponse = await servicesService.getServicesByCategory(category);

        if (response?.success && response.data) {
          setSubcategories(response.data.subcategories || []);
          setCategoryData(response.data.category);
        } else {
          setError(response?.message || `Failed to fetch ${category} services`);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch aborted');
        } else if (err instanceof Error) {
          console.error(`Error fetching ${category} services:`, err);
          setError(`Failed to load ${category} services. Please try again.`);
        } else {
          console.error(`An unknown error occurred while fetching ${category} services.`);
          setError(`Failed to load ${category} services due to an unknown error. Please try again.`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [category]);

  useEffect(() => {
    // Only attempt to open modal if subcategories are loaded and not loading
    if (subcategories.length > 0 && !loading) {
      const { openModal, subcategoryTitle, subcategorySlug, fromDropdown } = (location.state || {}) as {
        openModal?: boolean;
        subcategoryTitle?: string;
        subcategorySlug?: string;
        fromDropdown?: boolean;
      };

      // Priority 1: Check location.state (existing flow from dropdown)
      // Only process if this location.key hasn't been processed yet
      if (location.key !== processedLocationKey.current && openModal && fromDropdown && subcategoryTitle) {
        let matchedSubcategory: Subcategory | undefined;

        if (subcategorySlug) {
          matchedSubcategory = subcategories.find((sub) => sub.slug === subcategorySlug);
        }

        if (!matchedSubcategory) {
          matchedSubcategory = subcategories.find((sub) => sub.title === subcategoryTitle);
        }

        if (matchedSubcategory) {
          handleCardClick(matchedSubcategory);
          processedLocationKey.current = location.key; // Store the processed location key
          return; // Exit early if state-based flow succeeded
        }
      }

      // Priority 2: Check URL query params (for direct URL access or refresh)
      // Process URL params if they haven't been processed yet for this URL
      const subcategorySlugFromUrl = searchParams.get('subcategory');
      if (subcategorySlugFromUrl) {
        const decodedSlug = decodeURIComponent(subcategorySlugFromUrl);

        // Skip if we're currently setting the URL param ourselves (prevents duplicate API calls)
        if (isSettingUrlParamRef.current) {
          return;
        }

        // Only process if this URL subcategory hasn't been processed yet
        // or if the URL changed (different subcategory in URL)
        if (processedUrlSubcategory.current !== decodedSlug) {
          const matchedSubcategory = subcategories.find((sub) => sub.slug === decodedSlug);

          if (matchedSubcategory) {
            handleCardClick(matchedSubcategory);
            processedUrlSubcategory.current = decodedSlug; // Track the processed URL subcategory
            // Mark this location.key as processed if it hasn't been yet
            if (location.key && processedLocationKey.current !== location.key) {
              processedLocationKey.current = location.key;
            }
          }
        }
      } else {
        // If there's no subcategory in URL, reset the processed URL subcategory ref
        // This allows processing again if user navigates back to a URL with subcategory
        processedUrlSubcategory.current = null;
      }
    }
  }, [subcategories, loading, location.state, location.key, searchParams, handleCardClick]);

  return (
    <div className={styles.indoorParent}>
      <b className={styles.indoor}>{categoryData?.title || 'Services'}</b>
      {loading ? (
        <LoadingComponent />
      ) :
        <div className={styles.frameWrapper}>
          <div className={styles.frameContainer}>
            <div className={styles.browseServicesdefaultParent}>
              {error ? (
                <div className={styles.indoorParent}>
                  <div className="alert alert-warning" role="alert">
                    <i className="uil uil-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                </div>
              ) : subcategories.length > 0 ? (
                subcategories.map((subcategory) => {
                  return (
                    <div
                      key={subcategory.id}
                      className={styles.browseServicesdefault}
                      onClick={() => handleCardClick(subcategory)}
                    >
                      <BackendImage
                        src={subcategory.image}
                        alt={subcategory.title}
                        className={styles.browseServicesdefaultChild}
                        placeholderText="No Image"
                      />
                      <div className={styles.plumbingParent}>
                        <b className={styles.indoor}>{subcategory.title}</b>
                        <div className={styles.installationRepairUpgradesWrapper}>
                          <div className={styles.installationRepairUpgrades}>
                            {subcategory.description || 'No description available'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className={styles.indoorParent}>
                  <div className="alert alert-info" role="alert">
                    <i className="uil uil-info-circle me-2"></i>
                    No {category} services available at the moment.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      }
      {showModal && selectedSubcategory && (
        <ServiceModal
          show={showModal}
          onClose={closeModal}
          subcategory={selectedSubcategory}
        />
      )}
    </div>
  );
};

export default DynamicServicePage;
