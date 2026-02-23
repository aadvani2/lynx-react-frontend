import React from 'react';
import styles from '../ServiceModal.module.css';
import { useServiceBookingStore } from '../../../../store/serviceBookingStore';
import type { Service, Subcategory } from '../../../../types';
import BackendImage from '../../../../components/common/BackendImage/BackendImage';
// import PlaceholderImage from '../../../../assets/Icon/placeholder-image.svg'; // Removed as file not found

interface ServiceModalStep1SelectServicesProps {
    subcategory: Subcategory;
    isProviderOrEmployee: boolean;
}

const ServiceModalStep1SelectServices: React.FC<ServiceModalStep1SelectServicesProps> = ({
    subcategory,
    isProviderOrEmployee,
}) => {
    const { selectedServices, toggleService } = useServiceBookingStore();

    const handleServiceSelect = (serviceId: number) => {
        if (!isProviderOrEmployee) {
            toggleService(serviceId);
        }
    };

    return (
        <div className={styles.frameGroup}>
            <div className={styles.flooringParent}>
                <b className={styles.flooring}>{subcategory.title}</b>
                <div className={styles.pleaseSelectThe}>Please select the issue(s) you're facing from the list below.</div>
            </div>
            <div className={styles.browseServicesdefaultParent}>
                {subcategory.services.map((service: Service) => {
                    const isSelected = selectedServices.includes(service.id);
                    return (
                        <div
                            className={`${styles.browseServicesdefault} ${isSelected ? styles.selectedCard : ''}`}
                            key={service.id}
                            onClick={() => handleServiceSelect(service.id)}
                            style={{ cursor: isProviderOrEmployee ? 'not-allowed' : 'pointer' }}
                        >
                            <div className={styles.serviceImageContainer}>
                                {/* "Selected" badge OVER the image */}
                                {isSelected && (
                                    <div className={styles.selectedWrapper}>
                                        <span className={styles.selected}>Selected</span>
                                    </div>
                                )}

                                <BackendImage
                                    src={service.image}
                                    alt={service.title}
                                    className={styles.browseServicesdefaultChild}
                                    placeholderText="No Image"
                                />
                            </div>

                            <div className={styles.frameContainer}> {/* This acts as the content container */}
                                <div className={styles.textParent}> {/* This is for the title */}
                                    <b className={styles.text}>{service.title}</b>
                                </div>
                                <div className={styles.installationRepairUpgradesWrapper}> {/* This is for the description */}
                                    <div className={styles.installationRepairUpgrades}>{service.description || 'No description available'}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ServiceModalStep1SelectServices;
