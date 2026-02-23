import React from 'react';
import type { RequestDetailsData } from '../../../store/requestDetailsStore';

interface ServiceDetailsTableProps {
  requestDetails: RequestDetailsData | null;
}

const ServiceDetailsTable: React.FC<ServiceDetailsTableProps> = ({ requestDetails }) => {
  return (
    <>
      <p className="fw-semibold mb-1 text-secondary fs-sm">Service Request Details</p>
      <div className="card mb-3">
        <div className="card-body p-3">
          <div className="table-responsive">
            <table className="table table-borderless mb-0">
              <tbody>
                <tr className="border-bottom">
                  <th className="border-end">Requested services</th>
                  <td>Service ID: {requestDetails?.data?.request?.service_id || 'N/A'}</td>
                </tr>
                <tr className="border-bottom">
                  <th className="border-end">Additional Details</th>
                  <td>{requestDetails?.data?.request?.description || 'N/A'}</td>
                </tr>
                <tr>
                  <th className="border-end">Location</th>
                  <td>
                    {requestDetails?.data?.request?.city}, {requestDetails?.data?.request?.state}, {requestDetails?.data?.request?.zip_code}
                  </td>
                </tr>
                <tr className="border-bottom border-top">
                  <th className="border-end">Contact</th>
                  <td>
                    {requestDetails?.data?.request?.contact_person || 'N/A'}<br />
                    <a href={`tel:${requestDetails?.data?.request?.dial_code}${requestDetails?.data?.request?.phone}`}>
                      <i className="uil uil-phone" />
                      {requestDetails?.data?.request?.dial_code} {requestDetails?.data?.request?.phone}
                    </a>
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
                            {requestDetails?.data?.request?.full_address || 'N/A'}
                            <div className="mt-2">
                              <a 
                                href={`https://maps.google.com/?q=${requestDetails?.latitude},${requestDetails?.longitude}`} 
                                target="_blank" 
                                className="btn btn-warning rounded-pill btn-sm"
                                rel="noopener noreferrer"
                              >
                                <i className="uil uil-location-arrow" />&nbsp;&nbsp;Get Direction
                              </a>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-bottom">
                          <th className="border-end">Block No</th>
                          <td>{requestDetails?.data?.request?.block_no || ''}</td>
                        </tr>
                        <tr className="border-bottom">
                          <th className="border-end">Street</th>
                          <td>{requestDetails?.data?.request?.street || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th className="border-end">Type</th>
                          <td>{requestDetails?.data?.request?.address_type || 'N/A'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                {/* <tr className="border-bottom border-top">
                  <th className="border-end">Payment Status</th>
                  <td>{requestDetails?.data?.request?.payment_status || 'N/A'}</td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetailsTable; 