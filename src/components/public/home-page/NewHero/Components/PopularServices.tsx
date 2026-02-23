import { useState, lazy, Suspense } from "react";
import { servicesService } from "../../../../../services/generalServices/servicesService";
import type { Subcategory } from "../../../../../types";

// Lazy load ServiceModal to reduce initial bundle size
const ServiceModal = lazy(() => import("../../../../public/ServiceModal/ServiceModal"));

interface PopularServicesProps {
  services?: string[];
}

// Map service names to their subcategory slugs
const serviceToSlugMap: Record<string, string> = {
  "roofing": "roofing",
  "painting": "interior-painting",
  "plumbing": "plumbing",
  "restoration": "water-restoration-pack-out-service",
  "hvac": "hvac",
  "flooring": "flooring"
};

const PopularServices = ({ services = ["Roofing", "Painting", "Plumbing", "Restoration", "HVAC", "Flooring"] }: PopularServicesProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<{ name: string; slug: string } | null>(null);
  const [subcategoryData, setSubcategoryData] = useState<{ success?: boolean; data?: Subcategory } | null>(null);

  const handleChipClick = async (service: string) => {
    const formattedService = service.toLowerCase();
    const subcategorySlug = serviceToSlugMap[formattedService] || formattedService.replace(/\s/g, "-");

    setSelectedService({ name: service, slug: subcategorySlug });

    try {
      // Call getServiceBySubcategory API
      const response = await servicesService.getServiceBySubcategory(subcategorySlug);
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

  // Convert selected service to Subcategory format expected by ServiceModal
  const convertServiceToSubcategory = (
    service: { name: string; slug: string } | null,
    apiData: { success?: boolean; data?: Subcategory } | null
  ): Subcategory | null => {
    // If we have API data, use it; otherwise fall back to basic conversion
    if (apiData && apiData.success && apiData.data) {
      return apiData.data;
    }

    // Fallback to basic conversion
    if (!service) return null;

    return {
      id: 0,
      title: service.name,
      slug: service.slug,
      image: "",
      services: [],
      services_titles: []
    };
  };

  return (
    <>
      <div className="hero__popular">
        <div className="hero__popular-title">Popular services</div>
        <div className="hero__chips">
          {services.map((c) => (
            <span
              key={c}
              className="chip"
              onClick={() => handleChipClick(c)}
              style={{ cursor: "pointer" }}
            >
              {c}
            </span>
          ))}
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
    </>
  );
};

export default PopularServices;
