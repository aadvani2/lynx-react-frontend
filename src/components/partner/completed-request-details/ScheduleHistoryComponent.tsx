import React from 'react';
import { useCompletedRequestDetailsStore } from '../../../store/partnerStore/completedRequestDetailsStore';

// Utility functions moved outside component
const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return dateString;
  }
};

const getStatusBadge = (isAccepted: number) => {
  if (isAccepted === 1) {
    return (
      <span className="badge rounded-pill bg-success p-2">
        <i className="bi bi-check-circle me-1"></i>Accepted
      </span>
    );
  } else if (isAccepted === 0) {
    return (
      <span className="badge rounded-pill bg-danger p-2">
        <i className="bi bi-x-circle me-1"></i>Declined
      </span>
    );
  } else {
    return (
      <span className="badge rounded-pill bg-warning p-2">
        <i className="bi bi-clock me-1"></i>Pending
      </span>
    );
  }
};

const getSenderName = (senderType: string): string => {
  return senderType === 'customer' ? 'Customer' : 'Provider';
};

const ScheduleHistoryComponent: React.FC = () => {
  const {
    scheduleHistory: history,
    scheduleHistoryLoading: loading,
    scheduleHistoryError: error
  } = useCompletedRequestDetailsStore();


  return (
    <div className="mb-3" id="scheduleHistoryBtnData">
      <p className="fw-semibold mt-3 mb-1 text-secondary fs-sm">Propose Time Schedule History</p>
      <div className="card border rounded shadow-sm">
        <div className="card-body p-3">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Sender</th>
                  <th scope="col">Proposed Time</th>
                  <th scope="col">Status</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody className="fs-sm">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      <div className="w-100 text-center">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2 mb-0">Loading schedule history...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      <div className="alert alert-danger mb-0" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : !history || history.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-4">
                      <i className="bi bi-clock-history fs-1 mb-3 d-block"></i>
                      <p className="mb-0">No data available</p>
                    </td>
                  </tr>
                ) : (
                  history.map((entry) => (
                    <tr key={entry.id}>
                      <td>{getSenderName(entry.sender_type)}</td>
                      <td>
                        {formatDateTime(entry.new_schedule)}
                        <br />
                        <span className="badge bg-aqua text-dark">
                          Received from {getSenderName(entry.sender_type)}
                        </span>
                      </td>
                      <td>{getStatusBadge(entry.is_accepted)}</td>
                      <td>{entry.notes || 'No notes available'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleHistoryComponent;
