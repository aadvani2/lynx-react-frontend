import React from 'react';

interface ServiceRequestDetailsCardProps {
  requestedServices: string;
  additionalDetails: string;
  location: string;
}

const ServiceRequestDetailsCard: React.FC<ServiceRequestDetailsCardProps> = ({
  requestedServices,
  additionalDetails,
  location,
}) => {
  return (
    <div className="table-responsive">
      <table className="table table-borderless mb-0">
        <tbody>
          <tr className="border-bottom">
            <th className="border-end">Requested services</th>
            <td>{requestedServices}</td>
          </tr>
          <tr className="border-bottom">
            <th className="border-end">Additional Details</th>
            <td>{additionalDetails}</td>
          </tr>
          <tr>
            <th className="border-end">Location</th>
            <td>{location}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ServiceRequestDetailsCard;
