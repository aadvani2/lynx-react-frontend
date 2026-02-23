import React, { useEffect, useState } from 'react';
import { partnerService } from '../../services/partnerService/partnerService';
import Swal from 'sweetalert2';
import RequestAttachments from './RequestAttachments';
import RequestMap from './RequestMap';
import ProposeTimeModal from '../common/ProposeTimeModal';
import BackendImage from '../common/BackendImage/BackendImage';
import { getUserTimezoneOffset } from '../../utils/timezoneHelper';

interface RequestDetailsContentProps {
    setActivePage: (page: string) => void;
    requestId?: number;
    requestType?: string;
}

interface RequestDetails {
    request: {
        services_name: string;
        id: number;
        request_id: number;
        status: string;
        duration: number;
        customer: {
            name: string;
            email: string;
            phone: string;
            dial_code: string;
            country_code: string;
            profile_image?: string; // Added profile_image
        };
        category: string;
        description: string;
        address: string;
        city: string;
        state: string;
        zip_code: string;
        contact_person: string;
        phone: string;
        dial_code: string;
        country_code: string;
        created_at: string;
        updated_at: string;
        files?: string; // <-- Add files property
        service_tier_tag: string; // Add service_tier_tag
        schedule_time: string; // Add schedule_time
    };
    type: string;
    currentPage: number;
    request_duration: string;
    user_timezone: number;
    status_icon: string;
    message: string;
    cancel_alert_message: string;
    channel_name: string;
    buttons: string[];
    hold_req_msg: string;
}

const RequestDetailsContent: React.FC<RequestDetailsContentProps> = ({
    setActivePage,
    requestId,
    requestType = "pending"
}) => {
    const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showProposeTimeModal, setShowProposeTimeModal] = useState(false);

    const handleBackToRequests = () => {
        setActivePage('new-requests');
    };

    const handleProposeTimeClick = () => {
        setShowProposeTimeModal(true);
    };

    const handleCloseModal = () => {
        setShowProposeTimeModal(false);
    };

    const handleProposeTimeSubmit = async (
        data: { message: string; purpose_time: string },
        setActivePage: (page: string) => void
    ) => {
        // Handle form submission here
        console.log('Propose time data:', data);
        sessionStorage.setItem('selectedRequestId', (requestId || 0).toString());
        setActivePage("on-hold-request-details");
    };

    const handleAcceptClick = () => {
        // Add custom CSS for close button
        const style = document.createElement('style');
        style.textContent = `
			.swal2-close {
				font-family: "Unicons", "Arial", sans-serif !important;
				font-size: 0 !important;
				position: absolute !important;
				top: 0.7rem !important;
				right: 0.7rem !important;
				width: 1.8rem !important;
				height: 1.8rem !important;
				border: none !important;
				border-radius: 50% !important;
				background: none !important;
				color: #333 !important;
				display: flex !important;
				justify-content: center !important;
				align-items: center !important;
				cursor: pointer !important;
				transition: background 0.2s ease-in-out !important;
			}
			.swal2-close:before {
				content: "×" !important;
				font-size: 1.2rem !important;
				font-weight: bold !important;
				line-height: 1 !important;
			}
			.swal2-close:hover {
				background: rgba(0, 0, 0, 0.15) !important;
			}
		`;
        document.head.appendChild(style);

        Swal.fire({
            imageUrl: '',
            imageWidth: 77,
            imageHeight: 77,
            title: 'Accept Request',
            html: 'Are you sure you want to accept this request?',
            showCancelButton: false,
            showDenyButton: false,
            confirmButtonText: 'Yes, accept it!',
            customClass: {
                confirmButton: 'swal2-confirm btn btn-primary rounded-pill w-20'
            }
        }).then(async (result) => {
            // Clean up the style element
            document.head.removeChild(style);

            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Accepting...',
                    allowOutsideClick: false, // Prevent closing by clicking outside
                    allowEscapeKey: false,   // Prevent closing by Escape key
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                try {
                    const payload = {
                        request_id: requestId || 0,
                        is_accepted: 1
                    };

                    const response = await partnerService.acceptRequest(payload);

                    if (response?.success) {
                        sessionStorage.setItem('selectedRequestId', (requestId || 0).toString());

                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'Request accepted successfully!',
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true
                        }).then(() => {
                            setActivePage("accepted-request-details");
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: response?.message || 'Failed to accept request. Please try again.',
                            confirmButtonText: 'OK',
                            customClass: {
                                confirmButton: 'btn btn-danger rounded-pill'
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error accepting request:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'An error occurred while accepting the request. Please try again.',
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'btn btn-danger rounded-pill'
                        }
                    });
                } finally {
                    Swal.close(); // Close the loading modal
                }
            }
        });
    };

    const handleDeclineClick = () => {
        // Add custom CSS for close button
        const style = document.createElement('style');
        style.textContent = `
			.swal2-close {
				font-family: "Unicons", "Arial", sans-serif !important;
				font-size: 0 !important;
				position: absolute !important;
				top: 0.7rem !important;
				right: 0.7rem !important;
				width: 1.8rem !important;
				height: 1.8rem !important;
				border: none !important;
				border-radius: 50% !important;
				background: none !important;
				color: #333 !important;
				display: flex !important;
				justify-content: center !important;
				align-items: center !important;
				cursor: pointer !important;
				transition: background 0.2s ease-in-out !important;
			}
			.swal2-close:before {
				content: "×" !important;
				font-size: 1.2rem !important;
				font-weight: bold !important;
				line-height: 1 !important;
			}
			.swal2-close:hover {
				background: rgba(0, 0, 0, 0.15) !important;
			}
			.swal2-html-container textarea {
				width: 100% !important;
				padding: 0.5rem !important;
				border: 1px solid #ddd !important;
				border-radius: 0.375rem !important;
				font-size: 0.875rem !important;
				resize: vertical !important;
				min-height: 80px !important;
			}
		`;
        document.head.appendChild(style);

        Swal.fire({
            title: 'Decline Request',
            html: `
				<p style="margin-bottom: 1rem;">Are you sure you want to decline this request? This action cannot be undone.</p>
				<textarea id="declineReason" placeholder="Write reason" rows="4" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.375rem; font-size: 0.875rem; resize: vertical; min-height: 80px;"></textarea>
				<div id="validationMessage" style="color: red; font-size: 0.875rem; margin-top: 0.5rem; display: none;">This field is required!</div>
			`,
            showCancelButton: false,
            showDenyButton: false,
            confirmButtonText: 'Decline',
            customClass: {
                confirmButton: 'swal2-confirm btn btn-danger rounded-pill'
            },
            preConfirm: () => {
                const declineReason = (document.getElementById('declineReason') as HTMLTextAreaElement)?.value;
                const validationMessage = document.getElementById('validationMessage');

                if (!declineReason || declineReason.trim() === '') {
                    if (validationMessage) {
                        validationMessage.style.display = 'block';
                    }
                    return false;
                } else {
                    if (validationMessage) {
                        validationMessage.style.display = 'none';
                    }
                }
                return declineReason;
            }
        }).then(async (result) => {
            // Clean up the style element
            document.head.removeChild(style);

            if (result.isConfirmed) {
                try {

                    const payload = {
                        request_id: request.id.toString(),
                        is_accepted: 2,
                        decline_reason: result.value,
                        receiver: "1"
                    };

                    const response = await partnerService.acceptDeclineRequest(payload);

                    if (response?.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'Request declined successfully!',
                            showConfirmButton: false,
                            timer: 2000, // Auto close after 2 seconds
                            timerProgressBar: true
                        }).then(() => {
                            // Navigate to new requests page
                            setActivePage('new-requests');
                        });
                        console.log('Decline response:', response);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: response?.message || 'Failed to decline request. Please try again.',
                            confirmButtonText: 'OK',
                            customClass: {
                                confirmButton: 'btn btn-danger rounded-pill'
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error declining request:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'An error occurred while declining the request. Please try again.',
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'btn btn-danger rounded-pill'
                        }
                    });
                }
            }
        });
    };

    // Timeout functionality

    const formatDate = (dateString: string) => {
        if (!dateString) return "-- / -- / ----";
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };


    useEffect(() => {
        const fetchRequestDetails = async () => {
            if (!requestId) {
                setError('No request ID provided');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const payload = {
                    id: requestId,
                    type: requestType,
                    user_timezone: getUserTimezoneOffset(),
                    currentPage: 1
                };

                const response = await partnerService.getRequestDetails(payload);

                if (response?.success) {
                    setRequestDetails(response.data);
                } else {
                    setError(response?.message || 'Failed to load request details');
                }
            } catch (error) {
                console.error('Error getting request details:', error);
                setError('Failed to load request details');
            } finally {
                setLoading(false);
            }
        };

        fetchRequestDetails();
    }, [requestId, requestType]);

    // Initialize timeout on component mount
    useEffect(() => {
        // Cleanup on unmount
        return () => {
        };
    }, []);

    if (loading) {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="w-100 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading request details...</p>
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
                        onClick={handleBackToRequests}
                    >
                        <i className="uil uil-arrow-left" /> Back to Requests
                    </button>
                </div>
            </div>
        );
    }

    if (!requestDetails) {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="alert alert-warning" role="alert">
                        No request details found.
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handleBackToRequests}
                    >
                        <i className="uil uil-arrow-left" /> Back to Requests
                    </button>
                </div>
            </div>
        );
    }

    const { request } = requestDetails;

    // Parse files from API response
    let attachmentFiles: string[] = [];
    try {
        const filesRaw = requestDetails?.request?.files;
        if (filesRaw) {
            attachmentFiles = JSON.parse(filesRaw);
        }
    } catch (error) {
        console.error('Error parsing files:', error);
        attachmentFiles = [];
    }

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: '#f0f9fb' }}>
            {/* Back button and Request # title */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <button className="btn btn-primary btn-sm rounded-pill" onClick={handleBackToRequests}>
                    <i className="uil uil-arrow-left"></i> Back
                </button>
                <h4 className="card-title mb-0">Request #{request.request_id}</h4>
            </div>

            <div className="row">
                {/* Left Column (col-lg-6) */}
                <div className="col-lg-6">
                    {/* Card 1: Request Status & Details */}
                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <div className="mb-3">
                                <u className="text-bold">Request Type: </u>
                                <b>{request.service_tier_tag}</b>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <div className="d-flex align-items-start ">
                                <div className=" me-4 flex-shrink-0 d-flex align-items-center justify-content-center" >
                                    <BackendImage
                                        src={requestDetails.status_icon}
                                        alt="Status Icon"
                                        className=" w-10 h-10"
                                    />
                                </div>
                                <div className="">
                                    <div className="mb-3">
                                        {requestDetails.message}
                                    </div>

                                </div>
                            </div>
                            <button className="btn btn-primary rounded-pill d-flex gap-2 btn-sm viewchat w-100" id="viewchat" data-rid={request.id} data-request-status={request.status} data-channel={requestDetails.channel_name}>
                                Start Chat <i className="uil uil-comment-alt-lines" style={{ fontSize: '15px' }}></i>
                            </button>
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
                                            <td>{request.category} &gt; {request.services_name}</td>
                                        </tr>
                                        <tr className="border-bottom">
                                            <th className="border-end">Additional Details</th>
                                            <td>{request.description}</td>
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

                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <div className="text-end text-muted mt-2 fs-sm" style={{ fontSize: '0.9em' }}>
                                Last updated on {formatDate(request.updated_at)}
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Attachments */}
                    {attachmentFiles.length > 0 &&
                        <div className="card mb-3">
                            <div className="card-body p-3">
                                <p className="fw-semibold mb-1 text-secondary fs-sm">Attachments</p>
                                <RequestAttachments files={attachmentFiles} />
                            </div>
                        </div>
                    }
                    {/* Card 3: Action Buttons (Left Column Specific - Back to Requests / Cancel Assignment) */}
                    {/* <div className="card mb-3"> 
                         <div className="card-body p-3 d-flex justify-content-start gap-2">
                            <button className="btn btn-outline-primary rounded-pill" onClick={handleBackToRequests}>
                                Back to Requests
                            </button>
                            <button className="btn btn-danger rounded-pill" onClick={handleDeclineClick} data-id={request.id} data-receiver_id="1">
                                Cancel Assignment
                            </button>
                        </div>
                    </div> */}


                </div>

                {/* Right Column (col-lg-6) */}
                <div className="col-lg-6">
                    {/* Card 4: Scheduled Time */}
                    <div className="card mb-3">
                        <div className="card-body p-3 text-center">
                            <p className="mb-2 text-break">Customer requested the following time.</p>
                            {request.service_tier_tag === "Emergency" ? (
                                <>
                                    <span className="d-none d-sm-inline">Emergency Time: </span>
                                    <span className="d-sm-none">Emergency Time: </span>
                                </>
                            ) : (
                                <>
                                    <span className="d-none d-sm-inline">Scheduled Time: </span>
                                    <span className="d-sm-none">Scheduled Time: </span>
                                </>
                            )}
                            <p className="fw-semibold mb-3 text-break">
                                <i className="uil uil-calendar-alt"></i>
                                {formatDate(request.schedule_time)}
                            </p>
                            <div className="d-flex flex-column flex-sm-row flex-wrap gap-2 mt-2 justify-content-center" role="group">
                                <button className="btn btn-outline-primary flex-fill flex-xl-grow-0" id="proposeAnotherTimeBtn" onClick={handleProposeTimeClick}>
                                    <i className="bi bi-clock-history me-1"></i> <span className="d-none d-sm-inline">Propose New Time</span><span className="d-sm-none">Propose Time</span>
                                </button>
                                <button className="btn btn-outline-success flex-fill flex-xl-grow-0" id="acceptBtn" data-id={request.id} onClick={handleAcceptClick}>
                                    <i className="bi bi-check-circle me-1"></i> Accept
                                </button>
                                <button className="btn btn-outline-danger flex-fill flex-xl-grow-0" id="declineBtn" data-id={request.id} data-receiver_id="1" onClick={handleDeclineClick}>
                                    <i className="bi bi-x-circle me-1"></i> Decline
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 6: Map */}
                    <div className="card mb-3 mt-3" id="cardMapReq">
                        <div className="card-body p-3">
                            <RequestMap
                                address={request.address}
                                city={request.city}
                                state={request.state}
                                zipCode={request.zip_code}
                            />
                        </div>
                    </div>

                    {/* Card 7: Help (Contact Info) */}
                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <p className="fw-semibold mb-1 text-secondary fs-sm">Need help? We’ve got your back!</p>
                            <ul className="list-unstyled">
                                <li><i className="uil uil-phone me-2"></i> +18774115969</li>
                                <li><i className="uil uil-envelope me-2"></i> <a href="mailto:hello@connectwithlynx.com">hello@connectwithlynx.com</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Propose New Time Modal */}
            <ProposeTimeModal
                show={showProposeTimeModal}
                onClose={handleCloseModal}
                requestId={requestId}
                onSubmit={(data, setActivePageCb) => {
                    // Call the original onSubmit, but ensure setActivePage is provided safely
                    // If setActivePageCb is not provided, fallback to setActivePage from props
                    if (setActivePageCb) {
                        handleProposeTimeSubmit(data, setActivePageCb);
                    } else {
                        handleProposeTimeSubmit(data, setActivePage);
                    }
                }}
                setActivePage={setActivePage}
            />
        </div>
    );
};

export default RequestDetailsContent;
