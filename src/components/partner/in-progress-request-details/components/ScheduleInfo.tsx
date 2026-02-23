import React from 'react';

interface ScheduleInfoProps {
    createdAt: string;
    onHistoryClick: () => void;
    historyLoading: boolean;
    label?: string;
}

const ScheduleInfo: React.FC<ScheduleInfoProps> = ({ createdAt, onHistoryClick, historyLoading, label = 'Scheduled time' }) => {
    return (
        <div className="card bg-soft-blue mb-3 position-relative">
            <div className="card-body text-center p-3">
                <button
                    type="button"
                    className="btn btn-link position-absolute top-0 end-0 m-2 text-primary p-0 border-0 bg-transparent"
                    title="View History"
                    onClick={onHistoryClick}
                    disabled={historyLoading}
                >
                    <i className="uil uil-history"></i> History
                    {historyLoading && <span className="spinner-border spinner-border-sm ms-1" role="status"></span>}
                </button>

                <div className="row justify-content-center">
                    <div className="col-auto">
                        <p className="mb-2">{label}</p>
                        <p className="fw-semibold mb-0">
                            <i className="uil uil-calendar-alt"></i>
                            {new Date(createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleInfo;
