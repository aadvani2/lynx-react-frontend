import React from 'react';

interface EmptyStateProps {
    onBack: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onBack }) => {
    return (
        <div className="col lynx-my_account position-relative overflow-hidden" id="loadView1">
            <div className="card mb-4">
                <div className="card-body text-center">
                    <p>No request details found.</p>
                    <button className="btn btn-primary" onClick={onBack}>
                        <i className="uil uil-arrow-left"></i> Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmptyState;
