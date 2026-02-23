import React, { useEffect, useState } from 'react';
import { partnerService } from '../../services/partnerService/partnerService';
import { PartnerRequestCard, RequestsPagination } from './common';
import type { BasePartnerRequest } from './common';

interface NewRequestsContentProps {
	setActivePage: (page: string) => void;
	onRequestClick?: (requestId: number, requestType?: string) => void;
}


interface NewRequest extends BasePartnerRequest {
	services_name: string;
	customer: {
		id: number;
		title: string;
		email?: string;
		phone?: string;
		name: string;
	};
	category: {
		id: number;
		title: string;
	};
	total: number;
}

const NewRequestsContent: React.FC<NewRequestsContentProps> = ({ setActivePage, onRequestClick }) => {
	const [newRequests, setNewRequests] = useState<NewRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState({
		current_page: 1,
		total: 0,
		per_page: 20,
		last_page: 1
	});

	const handleBackToDashboard = () => {
		setActivePage('dashboard');
	};

	// Handle request card click
	const handleRequestClick = async (requestId: number) => {
		if (onRequestClick) {
			// Use the parent component's handler to navigate to request details
			onRequestClick(requestId, "pending");
		}
	};

	// Handle page change
	const handlePageChange = async (page: number) => {
		if (page < 1 || page > pagination.last_page || page === pagination.current_page) {
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const payload = {
				employee_id: null as number | null,
				user_timezone: new Date().getTimezoneOffset() / -60,
				page: page,
			};

			const res = await partnerService.getPendingRequests(payload);

			if (res?.success) {
				const data = res.data;
				setNewRequests(data.requests || []);
				// Normalize pagination values to numbers to ensure type consistency
				// Use the requested page as fallback if API doesn't return current_page
				setPagination({
					current_page: Number(data.current_page ?? page),
					total: Number(data.total ?? 0),
					per_page: Number(data.per_page ?? 20),
					last_page: Number(data.last_page ?? 1)
				});
			} else {
				setError(res?.message || 'Failed to load new requests');
			}
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Failed to load new requests';
			setError(msg);
		} finally {
			setLoading(false);
		}
	};





	useEffect(() => {

		const fetchPending = async () => {
			setLoading(true);
			setError(null);
			try {
				const payload = {
					employee_id: null as number | null,
					user_timezone: new Date().getTimezoneOffset() / -60,
					page: 1,
				};

				const res = await partnerService.getPendingRequests(payload);

				if (res?.success) {
					const data = res.data;
					setNewRequests(data.requests || []);
					// Normalize pagination values to numbers to ensure type consistency
					setPagination({
						current_page: Number(data.current_page ?? 1),
						total: Number(data.total ?? 0),
						per_page: Number(data.per_page ?? 20),
						last_page: Number(data.last_page ?? 1)
					});
				} else {
					setError(res?.message || 'Failed to load new requests');
				}
			} catch (e) {
				const msg = e instanceof Error ? e.message : 'Failed to load new requests';
				setError(msg);
			} finally {
				setLoading(false);
			}
		};

		fetchPending();
	}, []);

	return (
		<div className="card">
			<div className="card-header p-3 d-flex align-items-center">
				<div className="d-flex align-items-center justify-content-between">
					<button
						className="btn btn-primary btn-sm rounded-pill"
						onClick={handleBackToDashboard}
					>
						<i className="uil uil-arrow-left" /> Back
					</button>
					&nbsp;&nbsp;
					<h4 className="card-title mb-0">New Requests</h4>
				</div>
			</div>
			<div className="card-body">

				{loading && (
					<div className="w-100 text-center">
						<div className="spinner-border text-primary" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
						<p className="mt-2">Loading new requests...</p>
					</div>
				)}

				{error && (
					<div className="alert alert-danger mt-3" role="alert">
						{error}
					</div>
				)}

				{!loading && !error && newRequests.length === 0 && (
					<div className="w-100 text-center">
						<i className="uil uil-stopwatch fs-1 text-muted"></i>
						<p className="mt-2">No new requests found.</p>
					</div>
				)}

				{!loading && !error && newRequests.length > 0 && (
					<ul className="nav nav-tabs nav-tabs-bg nav-tabs-shadow-lg d-flex justify-content-center nav-justified requests-list">
						{newRequests.map((request) => (
							<PartnerRequestCard
								key={request.id}
								request={request}
								onClick={handleRequestClick}
								requestType="pending"
								currentPage={pagination.current_page}
								statusBadgeClass="bg-process-request"
							/>
						))}
					</ul>
				)}

				{/* Pagination */}
				{!loading && !error && (
					<RequestsPagination
						currentPage={pagination.current_page}
						lastPage={pagination.last_page}
						perPage={pagination.per_page}
						total={pagination.total}
						onPageChange={handlePageChange}
						ariaLabel="New requests pagination"
					/>
				)}
			</div>
		</div>
	);
};

export default NewRequestsContent; 