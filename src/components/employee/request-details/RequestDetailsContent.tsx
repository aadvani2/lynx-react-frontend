import React, { useState, useEffect } from 'react';
import { employeeService } from '../../../services/employeeServices/employeeService';
import { getBackendImageUrl } from '../../../utils/urlUtils';
import VerifyArrivalModal from './components/VerifyArrivalModal';
import type { RequestDetailsResponse } from '../../../types/employee/requests';

interface RequestDetailsContentProps {
  requestId: number;
  requestType: string;
  currentPage: number;
  onBack: () => void;
}

const RequestDetailsContent: React.FC<RequestDetailsContentProps> = ({
  requestId,
  requestType,
  currentPage,
  onBack
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestDetails, setRequestDetails] = useState<RequestDetailsResponse['data'] | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // Handle verification modal
  const handleVerifyArrival = () => {
    setShowVerifyModal(true);
  };

  // Close verification modal
  const closeVerifyModal = () => {
    setShowVerifyModal(false);
  };

  // Handle verification success
  const handleVerificationSuccess = () => {
    console.log('Verification successful');
    // You can add success handling here (e.g., show toast, update UI, etc.)
  };


  // Fetch request details
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const requestBody = {
          id: requestId,
          type: requestType,
          user_timezone: 5.5,
          currentPage: currentPage
        };
        
        const response = await employeeService.getRequestDetails(requestBody) as RequestDetailsResponse;
        
        if (response?.success && response.data) {
          setRequestDetails(response.data);
        } else {
          setError('Failed to fetch request details');
        }
      } catch (error) {
        console.error('Error fetching request details:', error);
        setError('Failed to fetch request details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestDetails();
  }, [requestId, requestType, currentPage]);


  if (isLoading) {
    return (
      <div id="loadView">
        <div className="card">
          <div className="card-header p-3 d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between">
              <button className="btn btn-primary btn-sm rounded-pill" onClick={onBack}>
                <i className="uil uil-arrow-left"></i>Back
              </button>
              &nbsp;&nbsp;<h4 className="card-title mb-0">Request Details</h4>
            </div>
          </div>
          <div className="card-body">
            <div className="w-100 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading request details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="loadView">
        <div className="card">
          <div className="card-header p-3 d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between">
              <button className="btn btn-primary btn-sm rounded-pill" onClick={onBack}>
                <i className="uil uil-arrow-left"></i>Back
              </button>
              &nbsp;&nbsp;<h4 className="card-title mb-0">Request Details</h4>
            </div>
          </div>
          <div className="card-body">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!requestDetails) {
    return (
      <div id="loadView">
        <div className="card">
          <div className="card-header p-3 d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between">
              <button className="btn btn-primary btn-sm rounded-pill" onClick={onBack}>
                <i className="uil uil-arrow-left"></i>Back
              </button>
              &nbsp;&nbsp;<h4 className="card-title mb-0">Request Details</h4>
            </div>
          </div>
          <div className="card-body">
            <div className="w-100 text-center">
              <p>No request details found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const scheduleLabel = String(requestDetails.request.service_tier_tag || '').toLowerCase() === 'emergency'
    ? 'Emergency Time'
    : 'Scheduled time';

  return (
    <div id="loadView">
      <div className="card">
        <div className="card-header p-3 d-flex align-items-center justify-content-between">
          <a href="javascript:;" className="btn btn-primary btn-sm rounded-pill" onClick={onBack}>
            <i className="uil uil-arrow-left"></i> Back
          </a>
          <h4 className="card-title mb-0">Request #{requestDetails.request.id}</h4>
        </div>
        <div className="card-body p-3">
          {/* Request Type Section */}
          <div className="mb-3 service-tier-tag">
            <u className="text-bold">Request Type: </u>
            <b>Emergency Service</b>
          </div>

          {/* Status Card */}
          <div className="card mb-3">
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <img 
                  src={getBackendImageUrl(requestDetails.status_icon)} 
                  alt="Status Icon" 
                  width="32" 
                  height="32"
                />
                <div className="ms-3">
                  Request has been accepted by {requestDetails.request.provider?.name || 'Service Provider'} company. Following employee will reach out to you.
                </div>
                <button className="btn btn-primary rounded-pill ms-auto btn-sm" id="callToAction" data-rid={requestDetails.request.id}>
                  On My Way <i className="uil uil-rocket px-1" style={{ fontSize: '15px' }}></i>
                </button>
              </div>
              <hr className="mt-2 mb-2" />
              <div className="d-flex align-items-center">
                <img 
                  src={getBackendImageUrl("/storage/images/members/46/m9ENbc61qORYG6F1kNAv.webp")}
                  className="img-fluid rounded-circle" 
                  alt="Employee Image"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <div className="ms-3">
                  <div className="fw-semibold">william Deo</div>
                  <div className="text-body fs-sm link-email">{requestDetails.request.provider?.email || 'No email provided'}</div>
                  {requestDetails.request.provider?.phone && (
                    <>
                      <div className="text-body fs-sm">
                        <i className="uil uil-phone"></i>
                        <a href={`tel:${requestDetails.request.provider.dial_code || ''}${requestDetails.request.provider.phone}`}>
                          {requestDetails.request.provider.dial_code || ''} ({requestDetails.request.provider.phone.slice(0, 3)}) {requestDetails.request.provider.phone.slice(3, 6)}-{requestDetails.request.provider.phone.slice(6)}
                        </a>
                      </div>
                      <div className="text-body fs-sm">
                        <i className="uil uil-phone"></i>
                        <a href={`tel:${requestDetails.request.provider.dial_code || ''}${requestDetails.request.provider.phone}`}>
                          {requestDetails.request.provider.dial_code || ''} ({requestDetails.request.provider.phone.slice(0, 3)}) {requestDetails.request.provider.phone.slice(3, 6)}-{requestDetails.request.provider.phone.slice(6)}
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar Section - Only show for pending requests */}
          {requestDetails.request.status === 'pending' && requestDetails.request.progress_percentage !== undefined && (
            <div className="card mb-3">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6 className="mb-0">Request Progress</h6>
                  <span className="badge bg-primary">{requestDetails.request.progress_percentage.toFixed(1)}%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: `${Math.min(100, Math.max(0, requestDetails.request.progress_percentage))}%` }}
                    aria-valuenow={requestDetails.request.progress_percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
                <small className="text-muted mt-1 d-block">
                  {requestDetails.request.progress_percentage < 100 
                    ? 'We are working on finding the best service partner for your request...'
                    : 'Request processing completed'
                  }
                </small>
              </div>
            </div>
          )}

          {/* Scheduled Time Section */}
          <div className="card bg-soft-blue mb-3 position-relative">
            <div className="card-body text-center p-3">
              <div className="row justify-content-center">
                <div className="col-auto">
                  <p className="mb-2">{scheduleLabel}</p>
                  <p className="fw-semibold mb-0">
                    <i className="uil uil-calendar-alt"></i>
                    19 Sep 2025 10:56 AM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Alert */}
          <div className="alert alert-warning d-flex justify-content-between align-items-center pt-1 pb-1">
            <span>Verify when reached at location</span>
            <button className="btn btn-link" onClick={handleVerifyArrival}>
              VERIFY
            </button>
          </div>

          {/* Service Request Details */}
          <p className="fw-semibold mt-3 mb-1 text-secondary fs-sm">Service Request Details</p>
          <div className="card mb-3">
            <div className="card-body p-3">
              <div className="table-responsive">
                <table className="table table-borderless mb-0">
                  <tbody>
                    <tr className="border-bottom">
                      <th className="border-end">Requested services</th>
                      <td>{requestDetails.request.category?.title || 'Service'} &gt; Furniture Assembly &gt; {requestDetails.request.description}</td>
                    </tr>
                    <tr className="border-bottom">
                      <th className="border-end">Additional Details</th>
                      <td>{requestDetails.request.description}</td>
                    </tr>
                    <tr>
                      <th className="border-end">Location</th>
                      <td>{requestDetails.request.city || 'N/A'}, {requestDetails.request.state || 'N/A'}, {requestDetails.request.zip_code || 'N/A'}</td>
                    </tr>
                    <tr className="border-bottom border-top">
                      <th className="border-end">Contact</th>
                      <td>
                        {requestDetails.request.customer?.name || 'No name provided'}<br />
                        {requestDetails.request.customer?.phone && (
                          <a href={`tel:${requestDetails.request.customer.dial_code || ''}${requestDetails.request.customer.phone}`}>
                            <i className="uil uil-phone"></i>{requestDetails.request.customer.dial_code || ''} ({requestDetails.request.customer.phone.slice(0, 3)}) {requestDetails.request.customer.phone.slice(3, 6)}-{requestDetails.request.customer.phone.slice(6)}
                          </a>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th className="border-end">Address</th>
                      <td className="p-0">
                        <table className="table table-borderless m-0">
                          <tbody>
                            <tr className="border-bottom">
                              <th className="border-end">Address</th>
                              <td>
                                {requestDetails.request.address || `Government District, Canton St, ${requestDetails.request.city || 'N/A'}, United States, ${requestDetails.request.zip_code || 'N/A'}`}
                                <div className="mt-2">
                                  <a 
                                    href="https://maps.google.com/?q=32.775568,-96.795595"
                                    target="_blank" 
                                    className="btn btn-warning rounded-pill btn-sm"
                                    rel="noopener noreferrer"
                                  >
                                    <i className="uil uil-location-arrow"></i>&nbsp;&nbsp;Get Direction
                                  </a>
                                </div>
                              </td>
                            </tr>
                            <tr className="border-bottom">
                              <th className="border-end">Block No</th>
                              <td></td>
                            </tr>
                            <tr className="border-bottom">
                              <th className="border-end">Street</th>
                              <td>Canton St</td>
                            </tr>
                            <tr>
                              <th className="border-end">Type</th>
                              <td>Home</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-end text-muted mt-2 fs-sm" style={{ fontSize: '0.9em' }}>
            Last updated on {requestDetails.request.updated_at ? new Date(requestDetails.request.updated_at).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }) : 'N/A'}
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-center gap-2 mt-3">
            {/* Add any additional action buttons here */}
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      <VerifyArrivalModal
        isOpen={showVerifyModal}
        onClose={closeVerifyModal}
        requestId={requestDetails?.request.id || 0}
        onSuccess={handleVerificationSuccess}
      />
    </div>
  );
};

export default RequestDetailsContent;
