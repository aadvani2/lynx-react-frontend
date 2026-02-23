import React from 'react';
import type { RequestDetailsData } from '../../../store/requestDetailsStore';

interface TransactionDetailsProps {
  requestDetails: RequestDetailsData | null;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ requestDetails }) => {
  return (
    <div className="row">
      <p className="fw-semibold mt-3 mb-1 text-secondary fs-sm">Transaction Details</p>
      <div className="col-xxl-6">
        <div className="card mb-3">
          <div className="card-body p-3">
            <div className="table-responsive">
              <table className="table table-borderless mb-0">
                <tbody>
                  <tr className="border-bottom">
                    <th className="border-end">Transaction ID</th>
                    <td>{requestDetails?.data?.request?.token || 'N/A'}</td>
                  </tr>
                  <tr className="border-bottom">
                    <th className="border-end">Amount</th>
                    <td>${requestDetails?.data?.request?.total?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr className="border-bottom">
                    <th className="border-end">Payable Amount</th>
                    <td>${requestDetails?.data?.request?.payable_amount?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr className="border-bottom">
                    <th className="border-end">Note</th>
                    <td>Payment for request #{requestDetails?.data?.request?.request_id}</td>
                  </tr>
                  <tr className="border-bottom">
                    <th className="border-end">Date</th>
                    <td>
                      {requestDetails?.data?.request?.payment_at ? 
                        new Date(requestDetails.data.request.payment_at).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails; 