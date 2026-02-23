import React from 'react';
import type { RequestDetailsData } from '../../../store/requestDetailsStore';
import styles from './ScheduleHistory.module.css';

interface ScheduleCardProps {
  requestDetails: RequestDetailsData | null;
  onShowHistory?: () => void;
  isHistoryVisible?: boolean;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ 
  requestDetails, 
  onShowHistory, 
  isHistoryVisible = false 
}) => {
  const handleHistoryClick = () => {
    if (onShowHistory) {
      onShowHistory();
    }
  };

  return (
    <div className="card bg-soft-blue mb-3 position-relative">
      <div className="card-body text-center p-3">
        <button
          className={`btn btn-link position-absolute top-0 end-0 m-2 text-primary p-0 border-0 bg-transparent ${styles.historyButton}`}
          title={isHistoryVisible ? "Hide History" : "View History"}
          onClick={handleHistoryClick}
          style={{ textDecoration: 'none' }}
        >
          <i className="uil uil-history" /> 
          {isHistoryVisible ? 'History' : 'History'}
        </button>
        <div className="row justify-content-center">
          <div className="col-auto">
            <p className="mb-2">Scheduled time</p>
            <p className="fw-semibold mb-0">
              <i className="uil uil-calendar-alt" />
              {requestDetails?.data?.request?.schedule_time ?
                new Date(requestDetails.data.request.schedule_time).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
