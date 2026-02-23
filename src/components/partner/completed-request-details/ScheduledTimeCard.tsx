import React from 'react';

interface ScheduledTimeCardProps {
  updatedAt: string;
  onToggleHistory?: () => void;
  showHistory?: boolean;
  label?: string;
}

const ScheduledTimeCard: React.FC<ScheduledTimeCardProps> = ({
  updatedAt,
  onToggleHistory,
  showHistory = false,
  label = 'Scheduled time'
}) => {
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
    <div className="card bg-soft-blue mb-3 position-relative">
      <div className="card-body text-center p-3">
        {/* History Button Top-Right */}
        <button
          type="button"
          className="btn btn-link position-absolute top-0 end-0 m-2 text-primary p-0 border-0"
          title={showHistory ? "Hide History" : "View History"}
          id="scheduleHistoryBtn"
          onClick={onToggleHistory}
        >
          <i className={`uil ${showHistory ? 'uil-eye-slash' : 'uil-history'}`}></i> 
          {showHistory ? 'Hide History' : 'History'}
        </button>

        <div className="row justify-content-center">
          <div className="col-auto">
          <p className="mb-2">{label}</p>
            <p className="fw-semibold mb-0">
              <i className="uil uil-calendar-alt"></i>
              {formatDateTime(updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledTimeCard;
