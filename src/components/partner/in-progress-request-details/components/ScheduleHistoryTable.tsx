import React from 'react';
import type { ScheduleHistoryEntry } from '../../../../types/scheduleHistory';

interface ScheduleHistoryTableProps {
    historyData: ScheduleHistoryEntry[];
    loading: boolean;
    error: string | null;
}

const ScheduleHistoryTable: React.FC<ScheduleHistoryTableProps> = ({ historyData, loading, error }) => {
    const formatScheduleTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusBadge = (isAccepted: number, finalStatus: string) => {
        if (isAccepted === 1) {
            return <span className="badge rounded-pill bg-success p-2"><i className="bi bi-check-circle me-1"></i>Accepted</span>;
        } else if (finalStatus === 'rejected') {
            return <span className="badge rounded-pill bg-danger p-2"><i className="bi bi-x-circle me-1"></i>Rejected</span>;
        } else {
            return <span className="badge rounded-pill bg-warning p-2"><i className="bi bi-clock me-1"></i>Pending</span>;
        }
    };

    const getSenderInfo = (entry: ScheduleHistoryEntry) => {
        const senderType = entry.sender_type === 'customer' ? 'Customer' : 'Provider';
        return (
            <div>
                {senderType}
                <br />
                <span className="badge bg-aqua text-dark">Received from {senderType}</span>
            </div>
        );
    };

    return (
        <div className="mb-3" id="scheduleHistoryBtnData">
            <p className="fw-semibold mt-3 mb-1 text-secondary fs-sm">Propose Time Schedule History</p>
            <div className="card border rounded shadow-sm">
                <div className="card-body p-3">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">Sender</th>
                                    <th scope="col">Proposed Time</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="fs-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="mt-2 text-muted mb-0">Loading schedule history...</p>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4">
                                            <div className="alert alert-warning mb-0" role="alert">
                                                <i className="bi bi-exclamation-triangle me-2"></i>
                                                {error}
                                            </div>
                                        </td>
                                    </tr>
                                ) : historyData.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4">
                                            <i className="bi bi-inbox fs-1 text-muted"></i>
                                            <p className="mt-2 text-muted mb-0">No schedule history found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    historyData.map((entry) => (
                                        <tr key={entry.id}>
                                            <td>{getSenderInfo(entry)}</td>
                                            <td>{formatScheduleTime(entry.new_schedule)}</td>
                                            <td>{getStatusBadge(entry.is_accepted, entry.final_status)}</td>
                                            <td>{entry.notes || 'No notes provided'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleHistoryTable;
