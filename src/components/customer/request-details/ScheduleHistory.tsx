import React from 'react';
import type { RequestDetailsData } from '../../../store/requestDetailsStore';
import type { ScheduleHistoryResponse, ScheduleHistoryEntry } from '../../../types/scheduleHistory';
import styles from './ScheduleHistory.module.css';

interface ScheduleHistoryProps {
  requestDetails: RequestDetailsData | null;
  historyData: ScheduleHistoryResponse | null;
  loading: boolean;
  error: string | null;
  isVisible: boolean;
}

const ScheduleHistory: React.FC<ScheduleHistoryProps> = ({
  historyData,
  loading,
  error,
  isVisible
}) => {
  // Helper function to get status badge based on final_status and is_accepted
  // Matching Laravel: request_history.blade.php lines 18-27
  const getStatusBadge = (entry: ScheduleHistoryEntry) => {
    // Check if notes is 'Auto timed out' - Laravel sets final_status to 'timed_out' in this case
    let finalStatus = entry.final_status;
    if (entry.notes === 'Auto timed out') {
      finalStatus = 'timed_out';
    }

    if (finalStatus === 'pending') {
      return (
        <span className="badge rounded-pill bg-warning text-dark p-2">
          <i className="bi bi-hourglass-split me-1" />
          Waiting
        </span>
      );
    } else if (finalStatus === 'accepted') {
      return (
        <span className="badge rounded-pill bg-success p-2">
          <i className="bi bi-check-circle me-1" />
          Accepted
        </span>
      );
    } else if (finalStatus === 'rejected') {
      return (
        <span className="badge rounded-pill bg-danger p-2">
          <i className="bi bi-x-circle me-1" />
          Declined
        </span>
      );
    } else if (finalStatus === 'timed_out') {
      return (
        <span className="badge rounded-pill bg-danger p-2">
          <i className="bi bi-x-circle me-1" />
          Timed Out
        </span>
      );
    } else {
      return (
        <span className="badge bg-secondary">
          Unknown
        </span>
      );
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  // Helper function to get sender name
  // Matching Laravel: Shows "You" if sender_type is customer, otherwise shows sender_name from API
  const getSenderName = (entry: ScheduleHistoryEntry) => {
    if (entry.sender_type === 'customer') {
      return 'You';
    } else {
      // Use sender_name from API response (already computed in Node.js backend)
      return entry.sender_name || 'Unknown';
    }
  };

  // Extract history entries from API response
  const getHistoryEntries = (): ScheduleHistoryEntry[] => {
    if (!historyData?.data?.historys) return [];
    return historyData.data.historys;
  };

  const historyEntries = getHistoryEntries();

  return (
    <div
      className={`mb-3 ${styles.historyContainer} ${isVisible ? styles.show : styles.hide}`}
      id="scheduleHistoryBtnData"
    >
      <p className="fw-semibold mt-3 mb-1 text-secondary fs-sm">Propose Time Schedule History</p>

      <div className="card border rounded shadow-sm historyCard">
        <div className="card-body p-3">
          {loading && (
            <div className="text-center py-4">
              <div className={`spinner-border text-primary ${styles.loadingSpinner}`} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 mb-0">Loading schedule history...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="uil uil-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className={`table-responsive ${styles.tableContent}`}>
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
                  {historyEntries.length > 0 ? (
                    historyEntries.map((entry: ScheduleHistoryEntry, index: number) => (
                      <tr
                        key={entry.id}
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          animation: 'fadeInUp 0.4s ease-out forwards'
                        }}
                      >
                        <td>
                          {getSenderName(entry)}
                        </td>
                        <td>
                          {formatDate(entry.new_schedule)}
                          <br />
                          {entry.sender_type === 'customer' ? (
                            <span className="badge bg-primary text-white">
                              Proposed to {entry.receiver_name || 'Provider'}
                            </span>
                          ) : (
                            <span className="badge bg-info text-dark">
                              Received from {entry.sender_name || 'Provider'}
                            </span>
                          )}
                        </td>
                        <td>
                          {getStatusBadge(entry)}
                        </td>
                        <td>
                          {entry.notes || 'No notes available'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">
                        <i className="bi bi-info-circle me-2"></i>
                        No schedule history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ScheduleHistory;
