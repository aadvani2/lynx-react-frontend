import { useCallback, useEffect, useRef, useState, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./BrowseAllServicesNew.module.css";
import { CategoryFilter, ServicesGrid } from "./Components";
import { servicesService } from "../../../services/generalServices/servicesService";
import type { ServiceItem } from "./types";
import type { Subcategory } from "../../../types";

// Lazy load ServiceModal to reduce initial bundle size
const ServiceModal = lazy(() => import("../ServiceModal/ServiceModal"));

export default function BrowseAllServicesNew() {
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [subcategoryData, setSubcategoryData] = useState<{ success?: boolean; data?: Subcategory } | null>(null);
  const [visibleServices, setVisibleServices] = useState<ServiceItem[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const skipAutoOpenRef = useRef(false);

  // Fetch categories for badges
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await servicesService.getServices();
        const titles = response?.categories?.map((cat) => cat.title).filter(Boolean) || [];
        setCategories(titles);
        if (titles.length > 0) {
          setActiveCategory((prev) => (prev && titles.includes(prev) ? prev : titles[0]));
        }
      } catch (error) {
        console.error("BrowseAllServicesNew: failed to fetch categories", error);
        setCategories([]);
        // keep activeCategory as-is to avoid breaking filtering; ServicesGrid will show empty state
      }
    };

    fetchCategories();
  }, []);

  const handleServiceClick = useCallback(async (service: ServiceItem) => {
    skipAutoOpenRef.current = false;
    setSelectedService(service);

    try {
      // Call getServiceBySubcategory API
      const response = await servicesService.getServiceBySubcategory(service.route);
      setSubcategoryData(response);
    } catch (error) {
      console.error("Error fetching subcategory data:", error);
      // Still show the modal even if API fails
      setSubcategoryData(null);
    } finally {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("subcategory", service.route || "");
        return next;
      }, { replace: true });
      setShowModal(true);
    }
  }, [setSearchParams]);

  const handleCloseModal = () => {
    skipAutoOpenRef.current = true;
    setShowModal(false);
    setSelectedService(null);
    setSubcategoryData(null);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("subcategory");
      return next;
    }, { replace: true });
  };

  useEffect(() => {
    const slug = searchParams.get("subcategory");
    if (skipAutoOpenRef.current) {
      if (!slug) {
        skipAutoOpenRef.current = false;
      }
      return;
    }
    if (!slug || showModal || visibleServices.length === 0) return;

    const matched = visibleServices.find((svc) => svc.route === slug);
    if (matched) {
      handleServiceClick(matched);
    }
  }, [searchParams, visibleServices, showModal, handleServiceClick]);

  // Convert ServiceItem to Subcategory format expected by ServiceModal
  const convertServiceToSubcategory = (
    service: ServiceItem | null,
    apiData: { success?: boolean; data?: Subcategory } | null
  ) => {
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

  return (
    <div className={styles.browseAllServicesParent}>
      <b className={styles.browseAllServices}>Browse All Services</b>
      <div className={styles.frameWrapper}>
        <div className={styles.frameParent}>
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
          <ServicesGrid
            activeCategory={activeCategory}
            onServiceClick={handleServiceClick}
            onServicesLoaded={setVisibleServices}
          />
        </div>
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
  );
}