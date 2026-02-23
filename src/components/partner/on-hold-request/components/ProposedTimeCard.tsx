import React from 'react';

interface ProposedTimeCardProps {
  headerMessage: string;
  newScheduleDate: string;
  noteText?: string;
  buttons: {
    onPropose?: () => void | Promise<void>;
    onAccept?: () => void | Promise<void>;
    onDecline?: () => void | Promise<void>;
    onHistory?: () => void | Promise<void>;
  };
}

const ProposedTimeCard: React.FC<ProposedTimeCardProps> = ({ headerMessage, newScheduleDate, noteText, buttons }) => {
  return (
    <>
      <p className="mb-2">
        {headerMessage}
      </p>
      <p className="fw-semibold mb-0">
        <i className="uil uil-calendar-alt"></i>
        {newScheduleDate}
      </p>
      {noteText && <p className="text-secondary mb-1">Message: {noteText}</p>}
      <div className="btn-group mt-2 request-btn-group" role="group">
        {buttons.onPropose && (
            <button
              className="btn btn-outline-primary"
              id="proposeAnotherTimeBtn"
              onClick={buttons.onPropose}
            >
              <i className="bi bi-clock-history me-1"></i> Propose New Time
            </button>
          )}
          {buttons.onAccept && (
            <button
              className="btn btn-outline-success"
              id="acceptBtn"
              onClick={buttons.onAccept}
            >
              <i className="bi bi-check-circle me-1"></i> Accept
            </button>
          )}
          {buttons.onDecline && (
            <button
              className="btn btn-outline-danger"
              id="declineBtn"
              onClick={buttons.onDecline}
            >
              <i className="bi bi-x-circle me-1"></i> Decline
            </button>
          )}
          {buttons.onHistory && (
            <button
              className="btn btn-outline-primary"
              id="scheduleHistoryBtn"
              onClick={buttons.onHistory}
            >
              <i className="bi bi-clock-history me-1"></i> History
            </button>
          )}
        </div>
    </>
  );
};

export default ProposedTimeCard;
