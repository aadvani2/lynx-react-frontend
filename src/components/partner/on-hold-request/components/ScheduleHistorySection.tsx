import { useState, useEffect, useCallback } from 'react';
import { partnerService } from '../../../../services/partnerService/partnerService';
import type { ScheduleHistoryEntry } from '../../../../types/scheduleHistory';

const toOffsetDate = (iso: string, offsetHours: number): Date => {
	// Convert UTC ISO string to a Date shifted by +offsetHours
	const utcMs = Date.parse(iso);
	if (Number.isNaN(utcMs)) return new Date(iso); // fallback: let Date parse
	return new Date(utcMs + offsetHours * 60 * 60 * 1000);
};

const formatOffsetLabel = (offsetHours: number) => {
	const sign = offsetHours >= 0 ? '+' : '-';
	const abs = Math.abs(offsetHours);
	const hh = Math.floor(abs);
	const mm = Math.round((abs - hh) * 60);
	const hhStr = String(hh).padStart(2, '0');
	const mmStr = String(mm).padStart(2, '0');
	return `GMT${sign}${hhStr}:${mmStr}`;
};

const formatDateTime = (d: Date) => {
	// Keep neutral formatting (no locale assumptions)
	return d.toLocaleString(undefined, {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});
};

const ScheduleHistorySection = ({ requestId, show }: { requestId: number, show: boolean }) => {
	const [scheduleHistory, setScheduleHistory] = useState<ScheduleHistoryEntry[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [tzOffset, setTzOffset] = useState<number>(-(new Date().getTimezoneOffset()) / 60);

	const fetchScheduleHistory = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const payload = {
				request_id: requestId,
				// keep sending numeric offset as you already do; the server also returns `user_timezone`
				user_timezone: new Date().getTimezoneOffset() / -60,
			};

			const response = await partnerService.getScheduleRequestHistory(payload);

			if (response?.success && response.data) {
				const apiTz = typeof response.data.user_timezone === 'number' ? response.data.user_timezone : undefined;
				if (typeof apiTz === 'number' && Number.isFinite(apiTz)) {
					setTzOffset(apiTz);
				}

				const raw = Array.isArray(response.data.history) ? response.data.history
					: Array.isArray(response.data) ? response.data
						: [];

				if (!Array.isArray(raw) || raw.length === 0) {
					setScheduleHistory([]);
					setError('There is no history available for this request.');
					return;
				}

				// Sort newest -> oldest by created_at (fallback to updated_at, then id)
				const sorted = [...raw].sort((a: ScheduleHistoryEntry, b: ScheduleHistoryEntry) => {
					const aTs = Date.parse(a?.created_at ?? '') || Date.parse(a?.updated_at ?? '') || 0;
					const bTs = Date.parse(b?.created_at ?? '') || Date.parse(b?.updated_at ?? '') || 0;
					if (bTs !== aTs) return bTs - aTs;
					return (b?.id ?? 0) - (a?.id ?? 0);
				});

				// Map to your interface with safe coercions
				const mapped: ScheduleHistoryEntry[] = sorted.map((item: ScheduleHistoryEntry) => ({
					id: Number.isFinite(item?.id) ? item.id : Math.random(),
					request_id: Number.isFinite(item?.request_id) ? item.request_id : -1,
					sender: Number.isFinite(item?.sender) ? item.sender : -1,
					sender_type: typeof item?.sender_type === 'string' ? item.sender_type : 'unknown',
					receiver: Number.isFinite(item?.receiver) ? item.receiver : -1,
					receiver_type: typeof item?.receiver_type === 'string' ? item.receiver_type : 'unknown',
					new_schedule: typeof item?.new_schedule === 'string' ? item.new_schedule : '',
					is_accepted: Number.isFinite(item?.is_accepted) ? item.is_accepted : 0,
					final_status: typeof item?.final_status === 'string' ? item.final_status : 'unknown',
					notes: typeof item?.notes === 'string' ? item.notes : null,
					decline_reason: typeof item?.decline_reason === 'string' ? item.decline_reason : null,
					created_at: typeof item?.created_at === 'string' ? item.created_at : '',
					updated_at: typeof item?.updated_at === 'string' ? item.updated_at : '',
					sender_name: typeof item?.sender_name === 'string' ? item.sender_name : 'Unknown',
					receiver_name: typeof item?.receiver_name === 'string' ? item.receiver_name : 'Unknown',
				}));

				setScheduleHistory(mapped);
			} else {
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
	}, [requestId, setScheduleHistory, setLoading, setError, setTzOffset]);

	useEffect(() => {
		if (show && requestId) {
			fetchScheduleHistory();
		}
	}, [show, requestId, fetchScheduleHistory]);

	const getSenderBadge = (senderType: string, senderName: string) => {
		const isProvider = senderType?.toLowerCase() === 'provider';
		const badgeText = isProvider ? `Proposed by ${senderName}` : `Requested by ${senderName}`;
		const badgeClass = isProvider ? 'bg-primary' : 'bg-info';
		return <span className={`badge rounded-pill p-2 ${badgeClass}`}>{badgeText}</span>;
	};

	const getStatusBadge = (status: string) => {
		const s = (status || '').toLowerCase();
		const isDanger = s.includes('declin') || s.includes('reject') || s.includes('time') || s.includes('expire');
		const isPending = s.includes('pending');
		const cls = isDanger ? 'bg-danger' : isPending ? 'bg-warning text-dark' : 'bg-success';
		const icon = isDanger ? 'bi-x-circle' : isPending ? 'bi-hourglass-split' : 'bi-check-circle';

		return (
			<span className={`badge rounded-pill p-2 ${cls}`}>
				<i className={`bi ${icon} me-1`}></i>
				{status}
			</span>
		);
	};

	if (!show || !requestId) return null;

	return (
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
						scheduleHistory.map((item) => {
							const displayDate = item.new_schedule
								? formatDateTime(toOffsetDate(item.new_schedule, tzOffset))
								: 'N/A';

							return (
								<tr key={item.id}>
									<td>{item.sender_name}</td>
									<td>
										<time dateTime={item.new_schedule || ''}>{displayDate}</time>
										<div className="text-muted small">{formatOffsetLabel(tzOffset)}</div>
										<div className="mt-1">
											{getSenderBadge(item.sender_type, item.sender_name)}
										</div>
									</td>
									<td>{getStatusBadge(item.final_status)}</td>
									<td>
										{item.notes?.trim() ? item.notes : '—'}
										{item.decline_reason?.trim() && (
											<div className="text-muted small mt-1">
												<i className="bi bi-info-circle me-1"></i>
												{item.decline_reason}
											</div>
										)}
									</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
};

export default ScheduleHistorySection;
