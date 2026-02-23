import styles from "../BrowseAllServicesNew.module.css";
import type { ServiceItem } from "../types";
import BackendImage from "../../../../components/common/BackendImage/BackendImage";

interface ServiceCardProps {
  service: ServiceItem;
  onServiceClick?: (service: ServiceItem) => void;
}

export const ServiceCard = ({ service, onServiceClick }: ServiceCardProps) => {
  const handleClick = () => {
    if (onServiceClick) {
      onServiceClick(service);
    }
  };

  return (
    <div className={styles.browseServicesdefault} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className={styles.imageContainer}>
        <BackendImage
          src={service.img}
          alt={service.name}
          className={styles.browseServicesdefaultChild}
        />
      </div>
      
      <div className={styles.plumbingParent}>
        <b className={styles.browseAllServices}>{service.name}</b>
        <div className={styles.installationRepairUpgradesWrapper}>
          <div 
            className={`${styles.installationRepairUpgrades} ${styles.twoLineEllipsis}`}
          >
            {service.desc || 'No description available'}
          </div>
        </div>
      </div>
    </div>
  );
};
