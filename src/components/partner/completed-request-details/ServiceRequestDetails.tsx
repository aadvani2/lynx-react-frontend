import React from 'react';

interface ServiceRequestDetailsProps {
  category: string;
  description: string;
  city: string;
  state: string;
  zipCode: string;
  contactPerson: string;
  phone: string;
  dialCode: string;
  address: string;
  countryCode: string;
  updatedAt: string;
}

const ServiceRequestDetails: React.FC<ServiceRequestDetailsProps> = ({
  category,
  description,
  city,
  state,
  zipCode,
  contactPerson,
  phone,
  dialCode,
  address,
  countryCode,
  updatedAt
}) => {
  const formatPhoneNumber = (phone: string) => {
    // Ensure phone number has at least 7 digits for formatting
    if (phone.length < 7) {
      return phone; 
    }
    return `(${phone.slice(0,3)}) ${phone.slice(3,6)}-${phone.slice(6)}`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Service Request Details */}
      <p className="fw-semibold mt-3 mb-1 text-secondary fs-sm">Service Request Details</p>
      <div className="card mb-3">
        <div className="card-body p-3">
          <div className="table-responsive">
            <table className="table table-borderless mb-0">
              <tbody>
                <tr className="border-bottom">
                  <th className="border-end">Requested services</th>
                  <td>{category} &gt; {description}</td>
                </tr>
                <tr className="border-bottom">
                  <th className="border-end">Additional Details</th>
                  <td>{description}</td>
                </tr>
                <tr>
                  <th className="border-end">Location</th>
                  <td>{city}, {state}, {zipCode}</td>
                </tr>
                <tr className="border-bottom border-top">
                  <th className="border-end">Contact</th>
                  <td>
                    {contactPerson}<br />
                    <a href={`tel:${dialCode}${phone}`}>
                      <i className="uil uil-phone"></i>{dialCode} {formatPhoneNumber(phone)}
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
                            {address || `${city}, ${state}, ${countryCode}`}
                            <div className="mt-2">
                              <a 
                                href={`https://maps.google.com/?q=${city},${state}`}
                                target="_blank"
                                className="btn rounded-pill btn-warning btn-sm"
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
                          <td></td>
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
      <div className="text-end text-muted mt-2 fs-sm" style={{fontSize: '0.9em'}}>
        Last updated on {formatDateTime(updatedAt)}
      </div>

      {/* Map Card (Hidden) */}
      <div className="card mb-3 mt-3 d-none" id="cardMapReq">
        <div className="card-body p-3">
          <div id="mapReqDetails" style={{height: '200px'}}></div>
        </div>
      </div>
    </>
  );
};

export default ServiceRequestDetails;
