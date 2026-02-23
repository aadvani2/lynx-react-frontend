import React from "react";
import styles from "./MiniSearchCard.module.css";

interface MiniSearchCardProps {
  icon: string;
  iconAvif?: string;
  iconAlt: string;
  label: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function MiniSearchCard({
  icon,
  iconAvif,
  iconAlt,
  label,
  children,
  onClick,
  disabled = false
}: MiniSearchCardProps): React.ReactElement {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`${styles.miniSearchCard} ${disabled ? styles.disabled : ""}`}
      onClick={handleClick}
    >
      {iconAvif ? (
        <picture>
          <source srcSet={iconAvif} type="image/avif" />
          <img
            className={styles.miniIcon}
            src={icon}
            alt={iconAlt}
          />
        </picture>
      ) : (
        <img
          className={styles.miniIcon}
          src={icon}
          alt={iconAlt}
        />
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span className={styles.miniLabel}>
          {label}
        </span>
        {children}
      </div>
    </div>
  );
}
