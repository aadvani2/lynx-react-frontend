import React from 'react';
import type { RequestDetailsData } from '../../../store/requestDetailsStore';
import { getProgressClass, getProgressFillStyle } from '../../../utils/requestDetailsUtils';

interface ProgressTrackerProps {
  requestDetails: RequestDetailsData | null;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ requestDetails }) => {
  // Get progress data from the API response
  const progressStartTime = requestDetails?.progressStartTime;
  const requestStatus = requestDetails?.request_status;

  // Calculate progress percentage for pending requests
  const getProgressPercentage = () => {
    if (requestStatus !== 'pending' || !progressStartTime) return 0;
    
    const now = Date.now();
    const startTime = new Date(progressStartTime + 'Z').getTime();
    const elapsed = (now - startTime) / 1000; // elapsed time in seconds
    
    // Calculate percentage based on elapsed time (assuming 10 minutes = 100%)
    const maxDuration = 600; // 10 minutes in seconds
    return Math.min(100, Math.max(0, (elapsed / maxDuration) * 100));
  };

  const progressPercentage = getProgressPercentage();

  return (
    <div className="pt-3 work-progress">
      {/* Progress Bar for Pending Requests */}
      {requestStatus === 'pending' && (
        <div className="card mb-3">
          <div className="card-body p-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h6 className="mb-0">Request Progress</h6>
              <span className="badge bg-primary">{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="progress" style={{ height: '8px' }}>
              <div 
                className="progress-bar bg-primary" 
                role="progressbar" 
                style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
            <small className="text-muted mt-1 d-block">
              {progressPercentage < 100 
                ? 'We are working on finding the best service partner for your request...'
                : 'Request processing completed'
              }
            </small>
          </div>
        </div>
      )}

      {/* Mobile Vertical Progress - matches Laravel commit */}
      <div className="pt-3 work-progress work-progress-v2">
        <div className="d-flex align-items-center">
          <div className="d-flex flex-grow-1 flex-shrink-1 justify-content-between main-progress-box">
          <div 
            className={`work-progress-tracking ${getProgressClass('finding', requestStatus || '')}`}
            id="findingProvider"
          >
            <span className="is-complete" />
            <div className="d-flex justify-content-center align-items-center gap-1">
              {requestStatus === 'on hold' ? 'Request On Hold' : 'Finding Service Partner'}
            </div>
          </div>
           
           <div 
             className={`work-progress-tracking ${getProgressClass('accepted', requestDetails?.request_status || '')}`}
             id="broadcastProgress"
             style={getProgressFillStyle('accepted', requestDetails?.request_status || '')}
           >
             <span className="progressbar-wrap"></span>
             <span className="is-complete" />
             <div className="d-flex justify-content-center align-items-center gap-1">
               Request Accepted
             </div>
           </div>
           
           <div 
             className={`work-progress-tracking ${getProgressClass('arrived', requestDetails?.request_status || '')}`}
             id="underProgress"
             style={getProgressFillStyle('arrived', requestDetails?.request_status || '')}
           >
             <span className="progressbar-wrap"></span>
             <span className="is-complete" />
             <div className="d-flex justify-content-center align-items-center gap-1">
               Arrived at Location
             </div>
           </div>
           
           <div 
             className={`work-progress-tracking ${getProgressClass('completed', requestDetails?.request_status || '')}`}
             id={requestDetails?.request_status?.toLowerCase() === 'cancelled' ? 'cancelProgress' : 'completeProgress'}
             style={getProgressFillStyle('completed', requestDetails?.request_status || '')}
           >
             <span className="progressbar-wrap"></span>
             <span className="is-complete" />
             <div className="d-flex justify-content-center align-items-center gap-1">
               {requestDetails?.request_status?.toLowerCase() === 'cancelled' ? 'Cancelled' : 'Completed'}
             </div>
           </div>
          </div>
        </div>
      </div>
      {/* mobile vertical progress End */}
    </div>
  );
};

export default ProgressTracker; 