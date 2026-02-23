import React, { useState, useEffect } from 'react';
import { partnerService } from '../../services/partnerService/partnerService';

interface ScheduleHistorySectionProps {
	show: boolean;
	requestId?: number;
}

interface ScheduleHistoryItem {
	id: number;
	sender: string;
	proposed_time: string;
	status: string;
	notes: string;
	badge_type: 'received' | 'proposed';
}


const ScheduleHistorySection: React.FC<ScheduleHistorySectionProps> = ({
	show,
	requestId
}) => {
	// State management
	const [scheduleHistory, setScheduleHistory] = useState<ScheduleHistoryItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Call API when component becomes visible
	useEffect(() => {
		if (show && requestId) {
			const fetchScheduleHistory = async () => {
				try {
					setLoading(true);
					setError(null);

					const payload = {
						request_id: requestId,
						user_timezone: new Date().getTimezoneOffset() / -60
					};

					const response = await partnerService.getScheduleRequestHistory(payload);

					if (response?.success && response.data) {
						// Check if history array exists and has data
						const historyArray = response.data.history || response.data;

						if (Array.isArray(historyArray) && historyArray.length > 0) {
							// Transform API response to match our interface
							const historyData = historyArray.map((item: Record<string, unknown>) => ({
								id: typeof item.id === 'number' ? item.id : Math.random(),
								sender: typeof item.sender === 'string' ? item.sender : 'Unknown',
								proposed_time: typeof item.proposed_time === 'string' ? item.proposed_time :
									typeof item.proposedTime === 'string' ? item.proposedTime : 'N/A',
								status: typeof item.status === 'string' ? item.status : 'Unknown',
								notes: typeof item.notes === 'string' ? item.notes :
									typeof item.message === 'string' ? item.message : 'No notes',
								badge_type: typeof item.badge_type === 'string' ?
									(item.badge_type as 'received' | 'proposed') :
									(typeof item.sender === 'string' && item.sender === 'You' ? 'proposed' : 'received')
							}));
							setScheduleHistory(historyData);
						} else {
							// Empty history - show user-friendly message
							setScheduleHistory([]);
							setError('There is no history available for this request.');
						}
					} else {
						// API call failed
						setError('Failed to load schedule history');
						setScheduleHistory([]);
					}
				} catch (error) {
					console.error('Error fetching schedule history:', error);
					setError('Failed to load schedule history');
					setScheduleHistory([]);
				} finally {
					setLoading(false);
				}
			};

			fetchScheduleHistory();
		}
	}, [show, requestId]);

	const getStatusBadge = (status: string) => {
		const isDeclined = status.toLowerCase().includes('declined') || status.toLowerCase().includes('timed out');
		return (
			<span className={`badge rounded-pill p-2 ${isDeclined ? 'bg-danger' : 'bg-success'}`}>
				<i className={`bi ${isDeclined ? 'bi-x-circle' : 'bi-check-circle'} me-1`}></i>
				{status}
			</span>
		);
	};

	const getSenderBadge = (badgeType: 'received' | 'proposed', sender: string) => {
		if (badgeType === 'received') {
			return (
				<span className="badge bg-aqua text-dark">
					Received from {sender}
				</span>
			);
		} else {
			return (
				<span className="badge bg-primary text-white">
					Proposed to {sender}
				</span>
			);
		}
	};

	if (!show) return null;

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
											<p className="mt-2 text-muted">Loading schedule history...</p>
										</td>
									</tr>
								) : error ? (
									<tr>
										<td colSpan={4} className="text-center py-4">
											<div className={`alert ${error.includes('no history') ? 'alert-info' : 'alert-warning'} mb-0`} role="alert">
												<i className={`uil ${error.includes('no history') ? 'uil-info-circle' : 'uil-exclamation-triangle'} me-2`}></i>
												{error}
											</div>
										</td>
									</tr>
								) : scheduleHistory.length === 0 ? (
									<tr>
										<td colSpan={4} className="text-center py-4">
											<div className="alert alert-info mb-0" role="alert">
												<i className="uil uil-info-circle me-2"></i>
												There is no history available for this request.
											</div>
										</td>
									</tr>
								) : (
									scheduleHistory.map((item) => (
										<tr key={item.id}>
											<td>{item.sender}</td>
											<td>
												{item.proposed_time}
												<br />
												{getSenderBadge(item.badge_type, item.sender)}
											</td>
											<td>{getStatusBadge(item.status)}</td>
											<td>{item.notes}</td>
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

export default ScheduleHistorySection;
