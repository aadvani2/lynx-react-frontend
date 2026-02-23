import React from "react";
import styles from "../BrowseAllServicesNew.module.css";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className={styles.frameGroup}>
      {categories.map(category => (
        <div 
          key={category}
          className={category === activeCategory ? styles.indoorWrapper : styles.tag}
          onClick={() => {
            setActiveCategory(category);
          }}
          role="button"
          tabIndex={0}
          aria-pressed={category === activeCategory}
          aria-label={`Filter by ${category}`}
        >
          <div className={styles.indoor}>{category}</div>
        </div>
      ))}
    </div>
  );
};
