import React from 'react';
import styles from './RequestActionButtons.module.css';
import { format } from 'date-fns';

interface RequestActionButtonsProps {
  timestampText: string;
  schedule_time: string;
  noteText?: string;
  proposedBy?: 'partner' | 'customer'; // Who proposed this time
  onPropose?: () => void;
  onAccept?: () => void;
  onHistory?: () => void;
}

const RequestActionButtons: React.FC<RequestActionButtonsProps> = ({
  timestampText,
  schedule_time,
  noteText,
  proposedBy = 'partner', // Default to partner for backward compatibility
  onPropose,
  onAccept,
  // onHistory,
}) => {
  // Determine messaging based on who proposed
  const isPartnerProposal = proposedBy === 'partner';
  const senderLabel = isPartnerProposal ? 'Service Partner' : 'You';
  const senderIcon = isPartnerProposal ? 'uil uil-user-circle' : 'uil uil-user-check';
  const messageText = isPartnerProposal
    ? 'The service partner proposed the following time and is waiting for your acceptance.'
    : 'You proposed the following time and are waiting for the service partner to accept.';

  return (
    <div className={styles.actionButtonsContainer}>
      {/* Sender Badge */}
      <div className={styles.senderBadge}>
        <i className={senderIcon}></i>
        <span>Proposed by {senderLabel}</span>
      </div>

      <p className={styles.messageText}>
        {messageText}
      </p>

      {/* Info Cards Section */}
      <div className={styles.infoCardsContainer}>

        {/* Proposed Time Card */}
        <div className={styles.infoCard}>
          <div className={styles.infoCardIcon}>
            <i className="uil uil-message"></i>
          </div>
          <div className={styles.infoCardContent}>
            <span className={styles.infoCardLabel}>Proposed On</span>
            <span className={styles.infoCardValue}>{timestampText}</span>
          </div>
        </div>

        {/* Scheduled Time Card */}
        <div className={`${styles.infoCard} ${styles.infoCardHighlight}`}>
          <div className={styles.infoCardIcon}>
            <i className="uil uil-calendar-alt"></i>
          </div>
          <div className={styles.infoCardContent}>
            <span className={styles.infoCardLabel}>Scheduled Time</span>
            <span className={styles.infoCardValue}>
              {schedule_time ? format(new Date(schedule_time as string), "MMMM do, yyyy hh:mm a") : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Note Section */}
      {noteText && (
        <div className={styles.noteContainer}>
          <div className={styles.noteIcon}>
            <i className="uil uil-comment-alt-notes"></i>
          </div>
          <div className={styles.noteContent}>
            <span className={styles.noteLabel}>
              {isPartnerProposal ? 'Partner\'s Message:' : 'Your Message:'}
            </span>
            <p className={styles.noteText}>{noteText}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.buttonGroup}>
        {onPropose && (
          <button
            className={`${styles.button} ${styles.buttonOutlinePrimary}`}
            onClick={onPropose}
            aria-label="Propose new time"
          >
            <i className="bi bi-clock-history"></i>
            <span>Propose New Time</span>
          </button>
        )}

        {onAccept && (
          <button
            className={`${styles.button} ${styles.buttonOutlineSuccess}`}
            onClick={onAccept}
            aria-label="Accept proposed time"
          >
            <i className="bi bi-check-circle"></i>
            <span>Accept</span>
          </button>
        )}

        {/* {onHistory && (
          <button
            className={`${styles.button} ${styles.buttonOutlinePrimary}`}
            onClick={onHistory}
          >
            <i className="bi bi-clock-history me-1"></i> History
          </button>
        )} */}
      </div>
    </div>
  );
};

export default RequestActionButtons;
