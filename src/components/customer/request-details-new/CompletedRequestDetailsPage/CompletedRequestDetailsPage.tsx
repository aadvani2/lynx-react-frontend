import React, { useState } from 'react';
import { useRequestDetails } from '../../../../hooks/useRequestDetails';
import styles from './CompletedRequestDetailsPage.module.css';
import type { RequestDetailsData } from '../../../../store/requestDetailsStore';
import RequestProgressBar from '../../../common/requestDetails/RequestProgressBar/RequestProgressBar';
import RequestSummaryCard from '../../../common/requestDetails/RequestSummaryCard/RequestSummaryCard';
import ProviderInfoCard from '../../../common/requestDetails/ProviderInfoCard/ProviderInfoCard';
import ScheduledTimeCard from '../../../common/requestDetails/ScheduledTimeCard/ScheduledTimeCard';
import HelpContactCard from '../../../common/requestDetails/HelpContactCard/HelpContactCard';
import RateServiceModal from '../../../common/RateServiceModal/RateServiceModal';
import { customerService } from '../../../../services/customerServices/customerService';
import Swal from '../../../../lib/swal';
import ArrowLeftIcon from "../../../../assets/Icon/arrow left.svg";
import LoadingComponent from '../../../common/LoadingComponent';

interface CompletedRequestDetailsPageProps {
    setActivePage: (page: string) => void;
    requestId: number;
    currentPage: number;
}

const CompletedRequestDetailsPage: React.FC<CompletedRequestDetailsPageProps> = ({
    setActivePage,
    requestId,
    currentPage
}) => {
    const requestType = 'completed';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const { requestDetails, loading, error } = useRequestDetails(requestId, requestType, currentPage) as { requestDetails: RequestDetailsData, loading: boolean, error: string };

    const handleRateServiceClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleModalSubmit = async (rating: number, feedback: string) => {
        try {
            if (rating === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: 'Please provide a rating.',
                    showConfirmButton: false,
                });
                return;
            }

            if (feedback.trim() === '') {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: 'Please provide your feedback.',
                    showConfirmButton: false,
                });
                return;
            }

            setIsSubmittingFeedback(true);
            // Here you would typically send this data to your backend
            await customerService.submitFeedback({ rating, request_id: String(requestId), feedback });
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Feedback submitted successfully!',
                showConfirmButton: false,
            });
            setActivePage('my_requests'); // Navigate to the main requests list
            handleModalClose();
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            Swal.fire({
                icon: 'error',
                title: 'Submission Error',
                text: 'Failed to submit feedback. Please try again.',
                showConfirmButton: false,
            });
            // Handle error (e.g., show an error message to the user)
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    if (loading) { return (<LoadingComponent />); }

    if (error) {
        return (
            <div className={styles.body}>
                <p>Error: {error}</p>
                <button onClick={() => setActivePage('my_requests')}>Back to Requests</button>
            </div>
        );
    }

    const request = requestDetails?.data?.request;
    const buttons = requestDetails?.data?.buttons;
    const shouldShowRatingButton = buttons?.btn_feedback !== 1;

    if (!request) {
        return (
            <div className={styles.body}>
                <p>No request details available.</p>
                <button onClick={() => setActivePage('my_requests')}>Back to Requests</button>
            </div>
        );
    }

    return (
        <div className={styles.body}>
            <div className="container">
                {/* Top bar: Back + progress */}
                <div
                    className={`d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3 mb-7 ${styles.buttonParent}`}
                >
                    <div
                        className={`${styles.button} ${styles.backButtonHover}`}
                        onClick={() => setActivePage('my_requests')}
                    >
                        <img
                            className={styles.iconarrowLeft}
                            alt="Back"
                            src={ArrowLeftIcon}
                        />
                        <b className={styles.bodyButton}>Back</b>
                    </div>
                    <div className="flex-grow-1 w-100">
                        <RequestProgressBar currentStatus={request.status || 'completed'} />
                    </div>
                </div>

                {/* Provider on top for <1800px */}
                <div className={styles.providerTop}>
                    <ProviderInfoCard
                        sub_category_name={request.sub_category_name || 'N/A'}
                        handshake_provider_name={request.provider?.name || 'N/A'}
                        status_message={request?.status_message || ''}
                        email={request?.provider?.email}
                        dial_code={request?.provider?.dial_code}
                        phone={request?.provider?.phone}
                        showContactInfo={true}
                        providerImage={request.provider?.image}
                    />
                </div>

                {/* Main grid */}
                <div className={`row g-3 g-lg-4 ${styles.frameContainer}`}>
                    {/* LEFT column */}
                    <div className={`col-12 ${styles.mainColLeft}`}>
                        <div className={styles.frameDiv}>
                            <RequestSummaryCard
                                schedule_msg={request.schedule_msg || ''}
                                request_id={String(request.request_id || '')}
                                updated_at={request.updated_at || ''}
                                services_name={request.services_name || ''}
                                description={request.description || ''}
                                city={request.city || ''}
                                state={request.state || ''}
                                zip_code={request.zip_code || ''}
                                contact_person={request.contact_person || ''}
                                phone={request.phone || ''}
                                dial_code={request.dial_code || ''}
                                full_address={request.full_address || ''}
                                files={request.files || ''}
                                RequestSummaryHeader="Service Completed"
                            />

                            {/* Buttons under summary on ≥1800px */}
                            <div className={`${styles.buttonGroup} ${styles.buttonGroupTop}`}>
                                <div
                                    className={styles.button2}
                                    onClick={() => setActivePage('my_requests')}
                                >
                                    <b className={styles.bodyRequestSent}>Back to Requests</b>
                                </div>
                                {shouldShowRatingButton && (
                                    <div
                                        className={styles.rateServiceButton}
                                        onClick={handleRateServiceClick}
                                    >
                                        <b className={styles.rateServiceButtonText}>Rate Service</b>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT column */}
                    <div className={`col-12 ${styles.mainColRight}`}>
                        <div className={styles.bookingServiceInfo}>
                            {/* Provider only visible here on ≥1800px */}
                            <div className={styles.providerRightOnly}>
                                <ProviderInfoCard
                                    sub_category_name={request.sub_category_name || 'N/A'}
                                    handshake_provider_name={request.provider?.name || 'N/A'}
                                    status_message={request?.status_message || ''}
                                    email={request?.provider?.email}
                                    dial_code={request?.provider?.dial_code}
                                    phone={request?.provider?.phone}
                                    showContactInfo={true}
                                    providerImage={request.provider?.image}
                                />
                            </div>

                            <ScheduledTimeCard
                                schedule_time={request.schedule_time || ''}
                                service_tier={request.service_tier || ''}
                            />

                            <HelpContactCard />
                        </div>
                    </div>
                </div>

                {/* Bottom buttons for <1800px */}
                <div className={`${styles.buttonGroup} ${styles.buttonGroupBottom}`}>
                    <div
                        className={styles.button2}
                        onClick={() => setActivePage('my_requests')}
                    >
                        <b className={styles.bodyRequestSent}>Back to Requests</b>
                    </div>
                    {shouldShowRatingButton && (
                        <div
                            className={styles.rateServiceButton}
                            onClick={handleRateServiceClick}
                        >
                            <b className={styles.rateServiceButtonText}>Rate Service</b>
                        </div>
                    )}
                </div>
            </div>

            <RateServiceModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                requestId={String(requestId)}
                isSubmitting={isSubmittingFeedback}
            />
        </div>
    );

};

export default CompletedRequestDetailsPage;
