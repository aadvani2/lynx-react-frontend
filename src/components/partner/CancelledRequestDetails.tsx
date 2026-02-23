import React, { useEffect } from 'react';
import { useCancelledRequestDetailsStore } from '../../store/partnerStore/cancelledRequestDetailsStore';
import { RequestHeader } from './accepted-request-details';
import BackendImage from '../common/BackendImage/BackendImage';

interface CancelledRequestDetailsProps {
    setActivePage: (page: string) => void;
}

const CancelledRequestDetails: React.FC<CancelledRequestDetailsProps> = ({
    setActivePage
}) => {
    const {
        requestDetails,
        loading,
        error,
        fetchRequestDetails
    } = useCancelledRequestDetailsStore();

    const request = requestDetails?.request;

    // Fetch request details when component mounts
    useEffect(() => {
        // Check both sessionStorage keys for compatibility
        const requestId = sessionStorage.getItem('selectedRequestId') || sessionStorage.getItem('selectedCancelledRequestId');
        if (requestId) {
            const parsedId = parseInt(requestId, 10);
            if (!isNaN(parsedId) && parsedId > 0) {
                fetchRequestDetails(parsedId);
            }
        }
    }, [fetchRequestDetails]);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleBackToCancelledRequests = () => {
        setActivePage("cancelled-requests");
    };

    if (loading) {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="w-100 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
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
                        Error loading request details: {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="alert alert-warning" role="alert">
                        No request details found.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: '#f0f9fb' }}>
            <RequestHeader
                requestId={request.request_id}
                onBackClick={handleBackToCancelledRequests}
            />

            <div className="row mt-4">
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
                            <div className="d-flex align-items-center">
                                <BackendImage
                                    src={requestDetails.status_icon}
                                    alt="Status Icon"
                                    className="img-fluid w-10 h-10"
                                />
                                <div className="ms-3 me-2">
                                    {requestDetails.message}
                                </div>
                            </div>
                        </div>
                    </div>



                </div>
                <div className="col-lg-6">
                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <div className="text-end text-muted fs-sm" style={{ fontSize: '0.9em' }}>
                                Last updated on {new Date(request.updated_at).toLocaleDateString('en-US', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <p className="fw-semibold mt-3 mb-1 text-secondary fs-sm">Service Request Details</p>
                            <div className="table-responsive">
                                <table className="table table-borderless mb-0">
                                    <tbody>
                                        <tr className="border-bottom">
                                            <th className="border-end">Requested services</th>
                                            <td>{typeof request.category === 'object' ? (request.category as { title?: string })?.title : request.category} {">"} {request.services_name}</td>
                                        </tr>
                                        <tr className="border-bottom">
                                            <th className="border-end">Additional Details</th>
                                            <td>{request.description || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th className="border-end">Location</th>
                                            <td>{request.city}, {request.state}, {request.zip_code}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CancelledRequestDetails;
