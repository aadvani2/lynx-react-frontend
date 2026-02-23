// src/components/common/requestDetails/RequestProgressBar/RequestProgressBar.tsx
import React from 'react';
import styles from './RequestProgressBar.module.css';

interface RequestProgressBarProps {
  currentStatus: string;
}

const RequestProgressBar: React.FC<RequestProgressBarProps> = ({ currentStatus }) => {
  const steps = [
    { key: 'request_sent', label: 'Request Sent' },
    { key: 'request_accepted', label: 'Request Accepted' },
    { key: 'arrived_at_location', label: 'Arrived at Location' },
    { key: 'completed', label: 'Completed' },
  ];

  const statusStepMap: Record<string, number> = {
    pending: 0,
    requested: 0,
    request_sent: 0,

    accepted: 1,
    request_accepted: 1,
    on_hold: 1,
    cancelled: 1, // cancel stops visually at "Request Accepted"

    in_process: 2,
    'in process': 2, // Handle space-separated version
    arrived_at_location: 2,

    completed: 3,
    done: 3,
  };

  const normalizedStatus = (currentStatus || '').toLowerCase().trim();
  const isCancelled = normalizedStatus === 'cancelled';

  const activeIndex =
    statusStepMap[normalizedStatus] !== undefined
      ? statusStepMap[normalizedStatus]
      : 0;

  // how much of the line is filled (0 → first step, 3 → last step)
  const maxIndex = steps.length - 1;
  const progressPercent = (activeIndex / maxIndex) * 100;

  return (
    <div 
      className={styles.wrapper}
      style={{
        ['--progress-percent' as string]: `${progressPercent}`
      }}
    >
      {/* base line */}
      <div className={styles.track} />
      {/* filled line according to status */}
      <div
        className={[
          styles.activeTrack,
          isCancelled ? styles.activeTrackCancelled : '',
        ]
          .filter(Boolean)
          .join(' ')}
      />

      <div className={styles.steps}>
        {steps.map((step, index) => {
          let isDone = index <= activeIndex;
          let isCancelledStep = false;

          // cancelled: last step shows red cross, not done
          if (isCancelled && index === steps.length - 1) {
            isDone = false;
            isCancelledStep = true;
          }

          return (
            <div
              key={step.key}
              className={[
                styles.step,
                isDone ? styles.stepDone : '',
                isCancelledStep ? styles.stepCancelled : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className={styles.iconWrapper}>
                {isCancelledStep ? (
                  <span className={styles.cancelIcon}>×</span>
                ) : (
                  <span className={styles.dot} />
                )}
              </div>
              <span className={styles.label}>
                {isCancelledStep ? 'Cancelled' : step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RequestProgressBar;
