import type { FunctionComponent } from "react";
import styles from "./ServiceCard.module.css";
import LocationIcon from "../../../assets/Icon/location.png";
import StarIcon from "../../../assets/Icon/star.svg";
import CheckmarkIcon from "../../../assets/Icon/checkmark.svg";
import BuildingIcon from "../../../assets/Icon/building.svg";
import BackendImage from "../BackendImage/BackendImage";
// import EditIcon from '../../../assets/Icon/edit2.svg';

export interface ServiceCardProps {
  service?: string;
  provider?: string;
  image?: string;
  imageFallback?: string;
  imageFit?: 'cover' | 'contain';
  distance?: string;
  rating?: string;
  reviews?: string;
  vetted?: boolean;
  licensed?: boolean;
  established?: string;
  description?: string;
  showEditService?: boolean;
  onEditService?: () => void;
  hideMeta?: boolean;
}

const ServiceCard: FunctionComponent<ServiceCardProps> = ({
  service = "Plumbing",
  provider = "Blue Star Construction & Remodeling",
  image,
  imageFallback,
  imageFit = 'cover',
  distance = "6.39",
  rating = "4.7",
  vetted = true,
  licensed = true,
  established = "2015",
  // showEditService = true,
  // onEditService,
  hideMeta = false,
}) => {
 

  return (
    <div className={styles.serviceCard}>
      <BackendImage
        src={image}
        fallbackSrc={imageFallback}
        alt={service}
        className={`${styles.image} ${imageFit === 'contain' ? styles.imageContain : ''}`}
        placeholderText="No Image"
      />

      <div className={styles.serviceContent}>
        <div className={styles.serviceHeader}>
          <div className={styles.serviceTitle}>{service}</div>
          {/* {showEditService && (
            <button className={styles.editButton} onClick={onEditService}>
              <img src={EditIcon} alt="Edit" width={14} height={14} />
              Edit Service
            </button>
          )} */}
        </div>

        <div className={styles.providerName}>{provider}</div>

        {!hideMeta && (
          <>
            <div className={styles.metaRow}>
              <span className={styles.metaItem}>
                <img src={LocationIcon} alt="" width={16} height={16} />
                {distance} Miles away
              </span>
              <span className={styles.metaItem}>
                <img src={StarIcon} alt="" width={16} height={16} />
                {rating}
              </span>
            </div>

            <div className={styles.metaRow}>
              {vetted && (
                <span className={styles.metaItem}>
                  <img src={CheckmarkIcon} alt="" width={16} height={16} />
                  Vetted by Lynx
                </span>
              )}
              {licensed && (
                <span className={styles.metaItem}>
                  <img src={CheckmarkIcon} alt="" width={16} height={16} />
                  Licensed & Insured
                </span>
              )}
              <span className={styles.metaItem}>
                <img src={BuildingIcon} alt="" width={16} height={16} />
                Est. {established}
              </span>
            </div>
          </>
        )}
      
      </div>
    </div>
  );
};

export default ServiceCard;
