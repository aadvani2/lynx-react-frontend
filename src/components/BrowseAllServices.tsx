import { useMemo, useState, useEffect, lazy, Suspense } from "react";
import "./BrowseAllServices.css";
import { servicesService } from "../services/generalServices/servicesService";
import type { Subcategory } from "../types";
import LoadingComponent from "./common/LoadingComponent";
import BackendImage from "./common/BackendImage/BackendImage";

// Lazy load ServiceModal to reduce initial bundle size
const ServiceModal = lazy(() => import("./public/ServiceModal/ServiceModal"));

interface ServiceItem {
  name: string
  desc: string
  img: string
  tags: string[]
  route: string
  categorySlug?: string // Add category slug for redirect
}

export default function BrowseAllServices() {
  const [tags, setTags] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [subcategoryData, setSubcategoryData] = useState<{ success?: boolean; data?: Subcategory } | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MAX_CARDS = 8;
  const [visibleCount, setVisibleCount] = useState(MAX_CARDS);

  // Fetch services from API (similar to ServicesGrid)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await servicesService.getServices();

        if (!response || !response.categories) {
          throw new Error('Failed to fetch services or invalid response structure');
        }

        // Extract all services from all categories (subcategories are the actual services)
        const extractedServices: ServiceItem[] = response.categories.flatMap(category => {
          // Use category description as fallback
          const categoryDescription = (category.description && String(category.description).trim()) || '';
          
          return category.subcategories?.map(subcategory => {
            // Try to get description from subcategory first, fallback to category description
            const subcategoryDescription = (subcategory as { description?: string | null }).description?.trim() || '';
            const finalDescription = subcategoryDescription || categoryDescription;
            
            const serviceItem = {
              name: subcategory.title || 'Unknown Service',
              desc: finalDescription,
              img: subcategory.image || '',
              tags: [category.title], // Assign category title as a tag for filtering
              route: subcategory.slug || '',
              categorySlug: category.slug // Store category slug for redirect
            };
            
            return serviceItem;
          }) || [];
        });

        // Extract category titles for tags
        const categoryTitles = response.categories.map((cat) => cat.title).filter(Boolean);
        setTags(categoryTitles);
        if (categoryTitles.length > 0) {
          setActiveTag((prev) => (prev && categoryTitles.includes(prev) ? prev : categoryTitles[0]));
        }

        setServices(extractedServices);
      } catch (err) {
        console.error("BrowseAllServices: Error fetching services:", err);
        setError(err instanceof Error ? err.message : "Failed to load services. Please try again later.");
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []); // Fetch once on mount

  const filtered = useMemo(() => {
    if (!activeTag) return services;
    return services.filter(s => s.tags.includes(activeTag));
  }, [activeTag, services]);

  // Reset visible count when switching tags
  useEffect(() => {
    setVisibleCount(MAX_CARDS);
  }, [activeTag]);

  const visible = filtered.slice(0, visibleCount);
  const hasMoreServices = filtered.length > visibleCount;

  const handleViewMore = () => {
    setVisibleCount((prev) => Math.min(prev + MAX_CARDS, filtered.length));
  };

  const handleServiceClick = async (service: ServiceItem) => {
    setSelectedService(service);

    try {
      // Call getServiceBySubcategory API
      // The route from API is already a slug, so use it directly
      const response = await servicesService.getServiceBySubcategory(service.route);
      setSubcategoryData(response);
    } catch (error) {
      console.error("Error fetching subcategory data:", error);
      // Still show the modal even if API fails
      setSubcategoryData(null);
    } finally {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
    setSubcategoryData(null);
  };

  // Convert ServiceItem to Subcategory format expected by ServiceModal
  const convertServiceToSubcategory = (service: ServiceItem | null, apiData: { success?: boolean; data?: Subcategory } | null): Subcategory | null => {
    // If we have API data, use it; otherwise fall back to basic conversion
    if (apiData && apiData.success && apiData.data) {
      // Use the API response data directly if it matches the expected format
      return apiData.data;
    }

    // Fallback to basic conversion from ServiceItem
    if (!service) return null;

    return {
      id: 0, // We don't have an ID from ServiceItem
      title: service.name,
      slug: service.route,
      image: service.img,
      services: [], // Empty array since ServiceItem doesn't have sub-services
      services_titles: []
    };
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="browse-all-services-parent" aria-labelledby="browse-all-title">
        <div className="browse-all-services-content">
          <LoadingComponent />
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="browse-all-services-parent" aria-labelledby="browse-all-title">
        <div className="browse-all-services-content">
          <div>Error: {error || 'Failed to load services. Please try again later.'}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="browse-all-services-parent" aria-labelledby="browse-all-title">
      <div className="browse-all-services-content">
        <b id="browse-all-title" className="browse-all-services">Browse All Services</b>

        <div className="frame-parent">
          <div className="frame-group">
            <div className="frame-container" role="tablist" aria-label="Service categories">
              {tags.map(tag => (
                <button
                  key={tag}
                  role="tab"
                  aria-selected={activeTag === tag}
                  className={`tag ${activeTag === tag ? "active" : ""}`}
                  onClick={() => {
                    setActiveTag(tag)
                  }}
                  type="button"
                >
                  <div className="indoor">{tag}</div>
                </button>
              ))}
            </div>

            <div className="browse-servicesdefault-parent">
              {visible.length > 0 ? visible.map(s => (
                <div
                  className="browse-servicesdefault"
                  key={s.name}
                  onClick={() => handleServiceClick(s)}
                  style={{ cursor: 'pointer' }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleServiceClick(s);
                    }
                  }}
                >
                  <BackendImage src={s.img} alt={s.name} className="browse-servicesdefault-child " />
                  <div className="plumbing-parent">
                    <b className="browse-all-services">{s.name}</b>
                    <div className="installation-repair-upgrades-wrapper">
                      <div className="installation-repair-upgrades">{s.desc || "No description"}</div>
                    </div>
                  </div>
                </div>
              )) : <div className={"my-16 text-center alert w-100"}>No services available right now.</div>}
            </div>
          </div>

          {hasMoreServices && (
            <button 
              className="button button-link" 
              onClick={handleViewMore}
              type="button"
            >
              <div className="indoor">View More</div>
            </button>
          )}
        </div>

        {showModal && (
          <Suspense fallback={null}>
            <ServiceModal
              show={showModal}
              onClose={handleCloseModal}
              subcategory={convertServiceToSubcategory(selectedService, subcategoryData)}
            />
          </Suspense>
        )}
      </div>
    </section>
  );
}

