import type { FC } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ServicesDropdown.module.css";
import { servicesService } from "../../../services/generalServices/servicesService";

interface Subcategory {
  id: number;
  title: string;
  slug: string;
  status?: string;
}

interface Category {
  id: number;
  title: string;
  slug: string;
  status?: string;
  subcategories?: Subcategory[];
}

interface ServicesDropdownProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ServicesDropdown: FC<ServicesDropdownProps> = ({
  isOpen,
  onMouseEnter,
  onMouseLeave,
}) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  const handleSubcategoryClick = (
    categoryPath: string,
    subcategoryTitle: string,
    subcategorySlug?: string
  ) => {
    const category = categoryPath.split("/").pop();
    const slug = subcategorySlug || subcategoryTitle.toLowerCase().replace(/\s/g, "-");
    // Include subcategory slug in URL query params for URL-driven modal state
    const urlWithQuery = `${categoryPath}?subcategory=${encodeURIComponent(slug)}`;
    navigate(urlWithQuery, {
      state: {
        openModal: true,
        subcategoryTitle,
        subcategorySlug: slug,
        fromDropdown: true,
        category: category,
      },
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await servicesService.getServices();
        const fetchedCategories = response?.categories || [];

        const filteredCategories: Category[] = (fetchedCategories as Category[])
          .filter((cat) => !cat.status || cat.status === "active")
          .map((cat) => ({
            ...cat,
            subcategories: (cat.subcategories || []).filter(
              (sub) => !sub.status || sub.status === "active"
            ),
          }));

        setCategories(filteredCategories);
      } catch (error) {
        console.error("ServicesDropdown: failed to fetch categories", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div
      className={`${styles.servicesDropdown} ${isOpen ? styles.open : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.servicesDropdownCard}>
        <div className={styles.servicesDropdownInner}>
          {categories.map((category) => {
            const categoryPath = `/services/${category.slug}`;
            return (
              <div className={styles.servicesCol} key={category.id}>
                <div
                  className={styles.dropdownHeading}
                  onClick={() => handleSubcategoryClick(categoryPath, `${category.title} Services`)}
                >
                  {category.title}
                </div>
                <ul>
                  {(category.subcategories || []).map((sub) => (
                    <li
                      key={sub.id}
                      onClick={() =>
                        handleSubcategoryClick(categoryPath, sub.title, sub.slug)
                      }
                    >
                      <span>{sub.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServicesDropdown;
