import React from 'react';

interface ErrorStateProps {
    error: string;
    onBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onBack }) => {
    return (
        <div className="col lynx-my_account position-relative overflow-hidden" id="loadView1">
            <div className="card mb-4">
                <div className="card-header p-3 d-flex align-items-center justify-content-between">
                    <button className="btn btn-primary btn-sm rounded-pill" onClick={onBack}>
                        <i className="uil uil-arrow-left"></i> Back
                    </button>
                </div>
                <div className="card-body text-center">
                    <p className="text-danger">{error}</p>
                </div>
            </div>
        </div>
    );
};

export default ErrorState;
