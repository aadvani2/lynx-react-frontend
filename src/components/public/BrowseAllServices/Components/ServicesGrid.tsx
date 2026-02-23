import { useState, useEffect } from "react";
import styles from "../BrowseAllServicesNew.module.css";
import { ServiceCard } from "./ServiceCard";
import type { ServiceItem } from "../types";
import { servicesService } from "../../../../services/generalServices/servicesService";
import LoadingComponent from "../../../common/LoadingComponent";

interface ServicesGridProps {
  activeCategory: string;
  onServiceClick?: (service: ServiceItem) => void;
  onServicesLoaded?: (services: ServiceItem[]) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ activeCategory, onServiceClick, onServicesLoaded }) => {
  const [filteredServices, setFilteredServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services and filter when activeCategory changes
  useEffect(() => {
    const fetchAndFilterServices = async () => {
      try {
        setIsLoading(true);
        setError(null); // Clear previous errors
        const response = await servicesService.getServices();

        // Check if the request was successful and response structure is valid
        if (!response || !response.categories) {
          throw new Error('Failed to fetch services or invalid response structure');
        }

        // Safely extract all services from all categories (subcategories are the actual services here)
        const extractedServices: ServiceItem[] = response.categories.flatMap(category => {
          return (
            category.subcategories?.map(subcategory => ({
              name: subcategory.title || 'Unknown Service',
              desc: subcategory.description || '',
              img: subcategory.image || '',
              tags: [category.title], // Assign category title as a tag for filtering
              route: subcategory.slug || ''
            })) || []
          )
        }
        );

        // Filter services based on the current activeCategory
        const filtered = extractedServices.filter(service =>
          service.tags && service.tags.includes(activeCategory)
        );
        setFilteredServices(filtered);
        if (onServicesLoaded) {
          onServicesLoaded(filtered);
        }

      } catch (err) {
        console.error("ServicesGrid: Detailed error in fetchAndFilterServices:", err);
        setError(err instanceof Error ? err.message : "Failed to load services. Please try again later.");
        setFilteredServices([]); // Clear services on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFilterServices();
  }, [activeCategory, onServicesLoaded]); // Dependency on activeCategory ensures re-fetch and re-filter

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <div>Error: {error || 'Failed to load services. Please try again later.'}</div>;
  }

  if (filteredServices.length === 0) {
    return <div className={"my-16 alert"}>No services available right now.</div>;
  }

  return (
    <div className={styles.frameContainer}>
      <div className={styles.browseServicesdefaultParent}>
        {filteredServices.map((service) => (
          <ServiceCard key={service.name} service={service} onServiceClick={onServiceClick} />
        ))}
      </div>
    </div>
  );
};
