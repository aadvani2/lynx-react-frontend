import React from "react";
import locationIcon from "../../../../assets/Icon/location.png";
import starIcon from "../../../../assets/Icon/star.svg";
import checkmarkIcon from "../../../../assets/Icon/checkmark.svg";
import BackendImage from "../../../../components/common/BackendImage/BackendImage";
import type { ResultItem } from "../../types";
import styles from "./ServiceCard.module.css";

interface ServiceCardProps extends ResultItem {
  imageFallback?: string;
  onBookService: (provider: ResultItem) => Promise<void> | void;
}

export default function ServiceCard({
  id,
  image,
  name,
  distance,
  rating,
  reviews,
  description,
  established,
  imageFallback,
  onBookService,
}: ServiceCardProps): React.ReactElement {
  const provider: ResultItem = {
    id,
    name,
    distance,
    rating,
    reviews,
    description,
    image,
    established,
  };

  return (
    <div className={styles.serviceCard}>
      <BackendImage
        src={image}
        fallbackSrc={imageFallback}
        alt={name}
        className={styles.serviceImg}
        loading="eager"
      />
      <div className={styles.serviceRightSection}>
        <div className={styles.serviceInfo}>
          <div className={styles.serviceTitle}>{name}</div>
          <div className={styles.serviceMetaRow}>
            <span className={styles.serviceMeta}>
              <img src={locationIcon} alt="" className={styles.serviceIcon} />
              <b>{distance}</b> Miles away
            </span>
            <span className={styles.serviceMeta}>
              <img src={starIcon} alt="" className={styles.serviceIcon} />
              <b>{rating}</b>
            </span>
          </div>
          <div className={styles.serviceMetaRow}>
            <span className={styles.serviceMeta}>
              <img src={checkmarkIcon} alt="" className={styles.serviceIcon} />
              Vetted by Lynx
            </span>
            <span className={styles.serviceMeta}>
              <img src={checkmarkIcon} alt="" className={styles.serviceIcon} />
              Licensed & Insured
            </span>
            <span className={styles.serviceMeta}>
              <img src={checkmarkIcon} alt="" className={styles.serviceIcon} />
              Est. {established}
            </span>
          </div>
          <div className={styles.serviceDesc}>
            {description ? description : <span className="text-muted">No description available</span>} <span className={styles.serviceMore}>{/* See More */}</span>
          </div>
        </div>
        <button className={styles.serviceBtn} onClick={() => onBookService(provider)}>
          Book Service
        </button>
      </div>
    </div>
  );
}
