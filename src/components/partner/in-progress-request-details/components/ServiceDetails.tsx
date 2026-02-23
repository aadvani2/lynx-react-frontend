import React from 'react';
import type { Request } from '../types';

interface ServiceDetailsProps {
    request: Request;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ request }) => {
    return (
        <>
            <p className="fw-semibold mt-3 mb-1 text-secondary fs-sm">Service Request Details</p>
            <div className="card mb-3">
                <div className="card-body p-3">
                    <div className="table-responsive">
                        <table className="table table-borderless mb-0">
                            <tbody>
                                <tr className="border-bottom">
                                    <th className="border-end">Requested services</th>
                                    <td>{String(request.category)} &gt; {request.services_name}</td>
                                </tr>
                                <tr className="border-bottom">
                                    <th className="border-end">Additional Details</th>
                                    <td>{request.description}</td>
                                </tr>
                                <tr>
                                    <th className="border-end">Location</th>
                                    <td>{request.address || `${request.city}, ${request.state} ${request.zip_code}`}</td>
                                </tr>
                                <tr className="border-bottom border-top">
                                    <th className="border-end">Contact</th>
                                    <td>
                                        {request.customer.name}<br />
                                        <a href={`tel:${request.customer.dial_code}${request.customer.phone}`}>
                                            <i className="uil uil-phone"></i>{request.customer.dial_code} ({request.customer.phone.slice(0, 3)}) {request.customer.phone.slice(3, 6)}-{request.customer.phone.slice(6)}
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
                                                    <td>{request.address || `${request.city}, ${request.state}, United States, ${request.zip_code}`}
                                                        <div className="mt-2">
                                                            <a
                                                                href="https://maps.google.com/?q=32.775568,-96.795595"
                                                                target="_blank"
                                                                className="btn rounded-pill btn-warning btn-sm"
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
                                                    <td>{request.address || 'N/A'}</td>
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
        </>
    );
};

export default ServiceDetails;
