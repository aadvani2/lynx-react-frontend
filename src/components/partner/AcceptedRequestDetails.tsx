import React, { useEffect, useState } from 'react';
import { useAcceptedRequestDetailsStore } from '../../store/partnerStore/acceptedRequestDetailsStore';
import {
    RequestHeader,
    ProviderInfoCard,
    AssignEmployeeAlert,
    AssignEmployeeModal,
    ScheduledTimeCard,
    VerifyArrivalAlert,
    VerifyArrivalModal,
    ServiceRequestDetails,
    ActionButtons,
    ScheduleHistoryComponent,
    CancelAssignmentModal
} from './accepted-request-details';
import RequestAttachments from './RequestAttachments';

interface AcceptedRequestDetailsProps {
    setActivePage: (page: string) => void;
}

const AcceptedRequestDetails: React.FC<AcceptedRequestDetailsProps> = ({
    setActivePage
}) => {
    const {
        requestDetails,
        loading,
        error,
        fetchRequestDetails,
        fetchScheduleHistory,
        requestDetails: requestDetailsData
    } = useAcceptedRequestDetailsStore();

    const request = requestDetailsData?.request;
    const provider = request?.provider;
    const member = request?.member || null;

    const displayPerson = member || provider;

    const name = displayPerson?.name || "";
    const email = displayPerson?.email || "";
    const phone = displayPerson?.phone || "";
    const dialCode = displayPerson?.dial_code || "";
    const image = displayPerson?.image || "";

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isVerifyArrivalModalOpen, setIsVerifyArrivalModalOpen] = useState(false);
    const [isCancelAssignmentModalOpen, setIsCancelAssignmentModalOpen] = useState(false);
    const [showScheduleHistory, setShowScheduleHistory] = useState(false);

    // Fetch request details when component mounts
    useEffect(() => {
        const requestId = sessionStorage.getItem('selectedRequestId');
        if (requestId) {
            fetchRequestDetails(parseInt(requestId));
        }
    }, [fetchRequestDetails]);


    const handleBackToAcceptedRequests = () => {
        setActivePage("accepted-requests");
    };

    const handleAssignEmployeeClick = () => {
        setIsAssignModalOpen(true);
    };

    const handleCloseAssignModal = () => {
        setIsAssignModalOpen(false);
    };

    const handleVerifyArrivalClick = () => {
        setIsVerifyArrivalModalOpen(true);
    };

    const handleCloseVerifyArrivalModal = () => {
        setIsVerifyArrivalModalOpen(false);
    };

    const handleVerifyArrivalSuccess = async () => {
        // Refresh request details after successful verification
        if (request?.id) {
            await fetchRequestDetails(request.id);

            sessionStorage.setItem('selectedRequestId', request?.id.toString());
            setActivePage("in-progress-request-details");

        }
    };

    const handleCancelAssignmentClick = () => {
        setIsCancelAssignmentModalOpen(true);
    };

    const handleCloseCancelAssignmentModal = () => {
        setIsCancelAssignmentModalOpen(false);
    };

    const handleCancelAssignmentSuccess = async () => {
        // Refresh request details after successful cancellation
        if (request?.id) {
            await fetchRequestDetails(request.id);
        }
    };

    const handleAssignEmployee = async () => {
        try {
            // Refresh request details after successful assignment
            if (request?.id) {
                await fetchRequestDetails(request.id);
            }
        } catch (error) {
            console.error('Error refreshing request details after assignment:', error);
        }
    };

    const handleToggleScheduleHistory = () => {
        if (!showScheduleHistory && request?.id) {
            // Only fetch data when showing history for the first time
            fetchScheduleHistory(request.id, 5.5);
        }
        setShowScheduleHistory(!showScheduleHistory);
    };

    if (loading) {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="w-100 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading accepted request details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handleBackToAcceptedRequests}
                    >
                        <i className="uil uil-arrow-left" /> Back
                    </button>
                </div>
            </div>
        );
    }


    // request is now available directly from the hook
    if (!request) {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="alert alert-warning" role="alert">
                        No request details found.
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handleBackToAcceptedRequests}
                    >
                        <i className="uil uil-arrow-left" /> Back
                    </button>
                </div>
            </div>
        );
    }

    const scheduleLabel = String(request.service_tier_tag || '').toLowerCase() === 'emergency'
        ? 'Emergency Time'
        : 'Scheduled time';

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: '#f0f9fb' }}>
            <RequestHeader
                requestId={request.request_id}
                onBackClick={handleBackToAcceptedRequests}
            />

            <div className="row">
                <div className="col-lg-6">
                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <div className="mb-3 service-tier-tag">
                                <u className="text-bold">Request Type: </u>
                                <b>{request.service_tier_tag}</b>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <ProviderInfoCard
                                statusIcon={requestDetails?.status_icon || ''}
                                providerName={name}
                                providerEmail={email}
                                providerPhone={phone}
                                providerDialCode={dialCode}
                                providerImage={image}
                                providerAltPhone={phone}
                                providerAltDialCode={dialCode}
                                channelName={requestDetails?.channel_name || ''}
                                message={requestDetails?.message || ''}
                            />
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <ServiceRequestDetails
                                category={request.category}
                                services_name={request.services_name}
                                description={request.description}
                                city={request.city}
                                state={request.state}
                                zipCode={request.zip_code}
                                contactPerson={request.contact_person}
                                phone={request.phone}
                                dialCode={request.dial_code}
                                address={request.address}
                                countryCode={request.country_code}
                                updatedAt={request.updated_at}
                            />
                        </div>
                    </div>

                    {/* Attachments */}
                    {(() => {
                        let attachmentFiles: string[] = [];
                        try {
                            const filesRaw = request.files;
                            if (filesRaw) {
                                attachmentFiles = JSON.parse(filesRaw);
                            }
                        } catch (error) {
                            console.error('Error parsing files:', error);
                            attachmentFiles = [];
                        }
                        
                        return attachmentFiles.length > 0 ? (
                            <div className="card mb-3">
                                <div className="card-body p-3">
                                    <p className="fw-semibold mb-1 text-secondary fs-sm">Attachments</p>
                                    <RequestAttachments files={attachmentFiles} />
                                </div>
                            </div>
                        ) : null;
                    })()}

                </div>
                <div className="col-lg-6">
                    {!member &&
                        <div className="card mb-3">
                            <div className="card-body p-3">
                                <AssignEmployeeAlert onAssignClick={handleAssignEmployeeClick} />
                            </div>
                        </div>
                    }
                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <ScheduledTimeCard
                                updatedAt={request.schedule_time}
                                onToggleHistory={handleToggleScheduleHistory}
                                showHistory={showScheduleHistory}
                                label={scheduleLabel}
                            />
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <VerifyArrivalAlert onVerifyClick={handleVerifyArrivalClick} />
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <ActionButtons onCancelAssignmentClick={handleCancelAssignmentClick} />
                        </div>
                    </div>

                    {showScheduleHistory && (
                        <div className="card mb-3">
                            <div className="card-body p-3">
                                <ScheduleHistoryComponent />
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Assign Employee Modal */}
            <AssignEmployeeModal
                isOpen={isAssignModalOpen}
                onClose={handleCloseAssignModal}
                requestId={request?.id || 0}
                onAssignEmployee={handleAssignEmployee}
            />

            {/* Verify Arrival Modal */}
            <VerifyArrivalModal
                isOpen={isVerifyArrivalModalOpen}
                onClose={handleCloseVerifyArrivalModal}
                requestId={request?.id || 0}
                onVerifySuccess={handleVerifyArrivalSuccess}
            />

            {/* Cancel Assignment Modal */}
            <CancelAssignmentModal
                isOpen={isCancelAssignmentModalOpen}
                onClose={handleCloseCancelAssignmentModal}
                requestId={request?.id || 0}
                onCancelSuccess={handleCancelAssignmentSuccess}
                setActivePage={setActivePage}
                redirectTo="accepted-requests"
            />
        </div>
    );
};

export default AcceptedRequestDetails;
