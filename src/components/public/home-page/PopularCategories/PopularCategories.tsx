import { useState, lazy, Suspense, type RefObject } from "react";
import ScrollAnimation from "../ScrollAnimation";
import styles from "./PopularCategories.module.css";
import { useInViewImage, transparentPlaceholder } from "../useInViewImage";
import { servicesService } from "../../../../services/generalServices/servicesService";
import type { Subcategory } from "../../../../types";

// Lazy load ServiceModal to reduce initial bundle size
const ServiceModal = lazy(() => import("../../../public/ServiceModal/ServiceModal"));

/* ----------------------------- analytics ----------------------------- */
declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/* ----------------------------- fallbacks ----------------------------- */
import CleaningImg from "../../../../assets/images/deep-cleaning.jpg";
import LandscapingImg from "../../../../assets/images/Landscaping.webp";
import RoofingImg from "../../../../assets/images/Roofing.jpg";
import PaintingImg from "../../../../assets/images/Painting.jpg";
import PlumbingImg from "../../../../assets/images/Plumbing.jpg";
import ElectricalImg from "../../../../assets/images/Electrical.jpg";
import HVACImg from "../../../../assets/images/HVAC.jpg";
import MovingImg from "../../../../assets/images/furniture-assembly.webp";

/* ----------------------------- AVIF assets ----------------------------- */
/* LCP */
import MovingAvif276 from "../../../../assets/images/avif/furniture-assembly-276w.avif";
import MovingAvif360 from "../../../../assets/images/avif/furniture-assembly-360w.avif";

/* Non-LCP */
import LandscapingAvif276 from "../../../../assets/images/avif/Landscaping-276w.avif";
import LandscapingAvif360 from "../../../../assets/images/avif/Landscaping-360w.avif";

import PlumbingAvif276 from "../../../../assets/images/avif/Plumbing-276w.avif";
import PlumbingAvif360 from "../../../../assets/images/avif/Plumbing-360w.avif";

import ElectricalAvif276 from "../../../../assets/images/avif/Electrical-276w.avif";
import ElectricalAvif360 from "../../../../assets/images/avif/Electrical-360w.avif";

import RoofingAvif276 from "../../../../assets/images/avif/Roofing-276w.avif";
import RoofingAvif360 from "../../../../assets/images/avif/Roofing-360w.avif";

import PaintingAvif276 from "../../../../assets/images/avif/Painting-276w.avif";
import PaintingAvif360 from "../../../../assets/images/avif/Painting-360w.avif";

import CleaningAvif276 from "../../../../assets/images/avif/deep-cleaning-276w.avif";
import CleaningAvif360 from "../../../../assets/images/avif/deep-cleaning-360w.avif";

import HVACAvif276 from "../../../../assets/images/avif/HVAC-276w.avif";
import HVACAvif360 from "../../../../assets/images/avif/HVAC-360w.avif";

/* ----------------------------- types ----------------------------- */
interface CategoryCard {
  id: string;
  title: string;
  image: string;
  avifSrcSet: string;
  route: string;
  alt: string;
  serviceCount?: number;
  proCount?: number;
}

/* ----------------------------- data ----------------------------- */
const categories: CategoryCard[] = [
  {
    id: "moving",
    title: "Moving",
    image: MovingImg,
    avifSrcSet: `${MovingAvif276} 276w, ${MovingAvif360} 360w`,
    route: "/services/other",
    alt: "Moving service photo",
  },
  {
    id: "landscaping",
    title: "Landscaping",
    image: LandscapingImg,
    avifSrcSet: `${LandscapingAvif276} 276w, ${LandscapingAvif360} 360w`,
    route: "/services/lawn-garden",
    alt: "Landscaping service photo",
  },
  {
    id: "plumbing",
    title: "Plumbing",
    image: PlumbingImg,
    avifSrcSet: `${PlumbingAvif276} 276w, ${PlumbingAvif360} 360w`,
    route: "/services/indoor",
    alt: "Plumbing service photo",
  },
  {
    id: "electrical",
    title: "Electrical",
    image: ElectricalImg,
    avifSrcSet: `${ElectricalAvif276} 276w, ${ElectricalAvif360} 360w`,
    route: "/services/indoor",
    alt: "Electrical service photo",
  },
  {
    id: "roofing",
    title: "Roofing",
    image: RoofingImg,
    avifSrcSet: `${RoofingAvif276} 276w, ${RoofingAvif360} 360w`,
    route: "/services/exterior",
    alt: "Roofing service photo",
  },
  {
    id: "painting",
    title: "Painting",
    image: PaintingImg,
    avifSrcSet: `${PaintingAvif276} 276w, ${PaintingAvif360} 360w`,
    route: "/services/indoor",
    alt: "Painting service photo",
  },
  {
    id: "cleaning",
    title: "Cleaning",
    image: CleaningImg,
    avifSrcSet: `${CleaningAvif276} 276w, ${CleaningAvif360} 360w`,
    route: "/services/restoration-cleaning",
    alt: "Cleaning service photo",
  },
  {
    id: "hvac",
    title: "HVAC",
    image: HVACImg,
    avifSrcSet: `${HVACAvif276} 276w, ${HVACAvif360} 360w`,
    route: "/services/indoor",
    alt: "HVAC service photo",
  },
];

const categoryToSubcategoryMap: Record<string, string> = {
  moving: "moving",
  landscaping: "landscaping-design-and-maintenance",
  plumbing: "plumbing",
  electrical: "electrical",
  roofing: "roofing",
  painting: "interior-painting",
  cleaning: "water-restoration-pack-out-service",
  hvac: "hvac",
};

/* ----------------------------- component ----------------------------- */
function PopularCategories() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ name: string; slug: string } | null>(null);
  const [subcategoryData, setSubcategoryData] = useState<{ success?: boolean; data?: Subcategory } | null>(null);
  const [modalKey, setModalKey] = useState(0); // Force remount when changing services

  const handleCategoryClick = async (category: CategoryCard) => {
    window.dataLayer?.push({ event: "category_click", category: category.id });

    const slug = categoryToSubcategoryMap[category.id] || category.id;
    const newCategory = { name: category.title, slug };

    // Update all state at once - key change forces remount
    setModalKey(prev => prev + 1);
    setSelectedCategory(newCategory);
    setSubcategoryData(null); // Clear old data while loading

    try {
      // Call getServiceBySubcategory API
      const response = await servicesService.getServiceBySubcategory(slug);
      setSubcategoryData(response);
    } catch (error) {
      console.error("Error fetching subcategory data:", error);
      setSubcategoryData(null);
    }
    
    // Ensure modal is visible
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setSubcategoryData(null);
  };

  // Convert selected category to Subcategory format expected by ServiceModal
  const convertCategoryToSubcategory = (
    category: { name: string; slug: string } | null,
    apiData: { success?: boolean; data?: Subcategory } | null
  ): Subcategory | null => {
    // If we have API data, use it; otherwise fall back to basic conversion
    if (apiData && apiData.success && apiData.data) {
      return apiData.data;
    }

    // Fallback to basic conversion
    if (!category) return null;

    return {
      id: 0,
      title: category.name,
      slug: category.slug,
      image: "",
      services: [],
      services_titles: []
    };
  };

  const LCPCategoryCard = ({ category }: { category: CategoryCard }) => {
    const lcpSizes = "(max-width: 768px) 360px, 276px";

    return (
      <div
        className={styles["popular-category-card"]}
        onClick={() => handleCategoryClick(category)}
        style={{ cursor: "pointer" }}
      >
        <picture>
          <source
            type="image/avif"
            srcSet={category.avifSrcSet}
            sizes={lcpSizes}
          />
          <img
            src={category.image}
            sizes={lcpSizes}
            alt={category.alt}
            className={styles["popular-category-card__image"]}
            width={276}
            height={200}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            data-lcp="true"
          />
        </picture>
        <div className={styles["popular-category-card__content"]}>
          <h3 className={styles["popular-category-card__title"]}>
            {category.title}
          </h3>
        </div>
      </div>
    );
  };

  const CategoryCardItem = ({ category }: { category: CategoryCard }) => {
    const { ref, isInView } = useInViewImage();
    const src = isInView ? category.image : transparentPlaceholder;

    const sizes = "276px";

    return (
      <div
        className={styles["popular-category-card"]}
        onClick={() => handleCategoryClick(category)}
        style={{ cursor: "pointer" }}
      >
        <picture>
          <source
            type="image/avif"
            srcSet={category.avifSrcSet}
            sizes={sizes}
          />
          <img
            ref={ref as RefObject<HTMLImageElement>}
            src={src}
            sizes={sizes}
            alt={category.alt}
            className={styles["popular-category-card__image"]}
            width={276}
            height={200}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        </picture>
        <div className={styles["popular-category-card__content"]}>
          <h3 className={styles["popular-category-card__title"]}>
            {category.title}
          </h3>
        </div>
      </div>
    );
  };

  return (
    <section
      className={styles["popular-categories"]}
      aria-labelledby="popular-categories-heading"
    >
      <div
        className={`${styles["popular-categories__container"]} ${styles["popular-categories--figma"]}`}
      >
        <ScrollAnimation>
          <h2
            id="popular-categories-heading"
            className={`${styles["popular-categories__title"]} ${styles["popular-categories__title--figma"]}`}
          >
            Popular services
          </h2>
        </ScrollAnimation>

        <div
          className={`${styles["popular-categories__grid"]} ${styles["popular-categories__grid--figma"]}`}
        >
          <LCPCategoryCard category={categories[0]} />

          {categories.slice(1).map((category) => (
            <ScrollAnimation key={category.id}>
              <CategoryCardItem category={category} />
            </ScrollAnimation>
          ))}
        </div>
      </div>

      {showModal && selectedCategory && (
        <Suspense fallback={null}>
          <ServiceModal
            key={`${selectedCategory.slug}-${modalKey}`}
            show={showModal}
            onClose={handleCloseModal}
            subcategory={convertCategoryToSubcategory(selectedCategory, subcategoryData)}
          />
        </Suspense>
      )}
    </section>
  );
}

export default PopularCategories;
