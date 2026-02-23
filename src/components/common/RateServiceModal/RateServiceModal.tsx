import React, { useState } from 'react';
import styles from './RateServiceModal.module.css';

interface RateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
  requestId: string;
  isSubmitting: boolean;
}

const RateServiceModal: React.FC<RateServiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  requestId,
  isSubmitting,
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, feedback);
    setRating(0);
    setFeedback('');
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalDialog}>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h5 className={styles.modalTitle}>Rate</h5>
              <button type="button" className="btn-close" onClick={onClose} data-bs-dismiss="modal"></button>
            </div>
            <div className={styles.modalBody}>
              <p>How did you liked our service?</p>
              <div className={styles.starRating}>
                {[5, 4, 3, 2, 1].map((star) => (
                  <React.Fragment key={star}>
                    <input
                      type="radio"
                      name="rating"
                      id={`star${star}`}
                      value={star}
                      checked={rating === star}
                      onChange={() => setRating(star)}
                    />
                    <label htmlFor={`star${star}`} onClick={() => setRating(star)}>&#9733;</label>
                  </React.Fragment>
                ))}
              </div>
              <input type="hidden" name="request_id" value={requestId} />
              <textarea
                name="feedback"
                className="form-control"
                placeholder="Write your feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
            </div>
            <div className={styles.modalFooter}>
              <button id="submit-complete-request" type="submit" className="btn rounded-pill btn-primary text-white" disabled={isSubmitting}>Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RateServiceModal;
