import React from 'react';
import styles from '../ServiceModal.module.css';
import DateTimePickerFigma from '../CustomDatetimepicker/DateTimePickerFigma';
import CheckmarkIcon from "../../../../assets/Icon/checkmark.svg";
import EllipseIcon from "../../../../assets/Icon/Ellipse 1.svg";
import { useServiceBookingStore } from '../../../../store/serviceBookingStore';

interface ServiceModalStep3SelectServiceTypeProps {
    isProviderOrEmployee: boolean;
}

const ServiceModalStep3SelectServiceType: React.FC<ServiceModalStep3SelectServiceTypeProps> = ({
    isProviderOrEmployee,
}) => {
    const {
        selectedServiceType,
        setSelectedServiceType,
        selectedScheduleTime,
        setSelectedScheduleTime,
        showDatePicker,
        setShowDatePicker,
    } = useServiceBookingStore();

    const handleDateTimeConfirm = (dateTime: string) => {
        setSelectedScheduleTime(dateTime);
        setShowDatePicker(false);
    };

    return (
        <div className={styles.iWantToGetServiceDoneWitParent}>
            <div className={styles.iWantTo}>I want to get service done within</div>
            <div className={styles.frameParent2}>
                <div
                    className={`${styles.serviceTypeCard} ${selectedServiceType === 'emergency' ? styles.selectedOption : ''} ${isProviderOrEmployee ? styles.disabledOption : ''}`}
                    onClick={isProviderOrEmployee ? undefined : () => setSelectedServiceType('emergency')}
                    style={{ cursor: isProviderOrEmployee ? 'not-allowed' : 'pointer' }}
                >
                    <img
                        className={styles.stepIcon}
                        alt=""
                        src={selectedServiceType === 'emergency' ? CheckmarkIcon : EllipseIcon}
                    />
                    <div className={styles.serviceTypeContent}>
                        <div className={styles.serviceTypeTitle}>Emergency Service (1-4 hours)</div>
                        <div className={styles.serviceTypeDescription}>Free</div>
                    </div>
                </div>
                <div
                    className={`${styles.serviceTypeCard} ${selectedServiceType === 'scheduled' ? styles.selectedOption : ''} ${isProviderOrEmployee ? styles.disabledOption : ''}`}
                    onClick={isProviderOrEmployee ? undefined : () => { setSelectedServiceType('scheduled'); setShowDatePicker(true); }}
                    style={{ cursor: isProviderOrEmployee ? 'not-allowed' : 'pointer' }}
                >
                    <img
                        className={styles.stepIcon}
                        alt=""
                        src={selectedServiceType === 'scheduled' ? CheckmarkIcon : EllipseIcon}
                    />
                    <div className={styles.serviceTypeContent}>
                        <div className={styles.serviceTypeTitle}>Scheduled Service</div>
                        <div className={styles.serviceTypeDescription}>Free</div>
                        {selectedScheduleTime && (
                            <div className={styles.serviceTypeDescription} aria-live="polite">
                                Scheduled for: {new Date(selectedScheduleTime).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showDatePicker && selectedServiceType === 'scheduled' && (
                <div className={styles.datetimePickerCard}>
                    <DateTimePickerFigma
                        isOpen={showDatePicker}
                        onClose={() => setShowDatePicker(false)}
                        onConfirm={handleDateTimeConfirm}
                    />
                </div>
            )}
        </div>
    );
};

export default ServiceModalStep3SelectServiceType;
