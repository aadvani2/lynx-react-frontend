import React, { useState } from 'react';

interface CompleteRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    requestId: number;
    onSubmit: (rating: number, feedback: string) => void;
    loading: boolean;
}

const CompleteRequestModal: React.FC<CompleteRequestModalProps> = ({
    isOpen,
    onClose,
    requestId,
    onSubmit,
    loading
}) => {
    const [rating, setRating] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating > 0) {
            onSubmit(rating, feedback);
        }
    };

    const handleClose = () => {
        setRating(0);
        setFeedback('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
            <div 
                className="modal-backdrop fade show" 
                style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    zIndex: 1040
                }}
            ></div>
            <div className="modal-dialog modal-dialog-centered" style={{ zIndex: 1050 }}>
                <div className="modal-content">
                    <div className="modal-header border-0 d-flex align-items-center position-relative">
                        <h5 className="modal-title">Complete Request</h5>
                        <button 
                            type="button" 
                            className="" 
                            onClick={handleClose}
                            disabled={loading}
                            style={{
                                position: 'absolute',
                                top: '0.7rem',
                                right: '0.7rem',
                                width: '1.8rem',
                                height: '1.8rem',
                                fontSize: '1.5rem',
                                lineHeight: '1',
                                color: '#333',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: loading ? 0.5 : 1
                            }}
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body text-center">
                            <p>Rate customer to complete this request</p>
                            <div className="star-rating mb-3">
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <React.Fragment key={star}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            id={`star${star}`}
                                            value={star}
                                            checked={rating === star}
                                            onChange={() => setRating(star)}
                                            disabled={loading}
                                            style={{ display: 'none' }}
                                        />
                                        <label
                                            htmlFor={`star${star}`}
                                            className={`star-label ${rating >= star ? 'active' : ''}`}
                                            style={{
                                                fontSize: '2rem',
                                                color: rating >= star ? '#ffc107' : '#e4e5e9',
                                                cursor: loading ? 'not-allowed' : 'pointer',
                                                margin: '0 2px'
                                            }}
                                       />
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
                                disabled={loading}
                                rows={3}
                            />
                        </div>
                        <div className="modal-footer d-flex justify-content-center">
                            <button
                                type="submit"
                                className="btn rounded-pill btn-primary text-white"
                                disabled={loading || rating === 0}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Completing...
                                    </>
                                ) : (
                                    'Complete Request'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompleteRequestModal;
