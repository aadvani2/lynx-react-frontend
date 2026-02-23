import React, { useState, useRef, useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { partnerService } from '../../services/partnerService/partnerService';
import { customerService } from '../../services/customerServices/customerService';
import Swal from 'sweetalert2';
import { addModalCloseIconStyles, modalCloseIconConfigs } from '../../utils/modalCloseIcon';
import { getUserTimezoneOffset } from '../../utils/timezoneHelper';

interface ProposeTimeModalProps {
	show: boolean;
	onClose: () => void;
	requestId?: number;
	isCustomer?: boolean; // Add this line
	onSubmit: (data: { message: string; purpose_time: string }, setActivePage?: (page: string) => void) => void;
	setActivePage?: (page: string) => void; // Add this line
}

const ProposeTimeModal: React.FC<ProposeTimeModalProps> = ({
	show,
	onClose,
	requestId,
	isCustomer, // Add this line
	onSubmit,
	setActivePage // Add this line
}) => {
	const [formData, setFormData] = useState({
		message: '',
		purpose_time: ''
	});
	const [loading, setLoading] = useState(false); // State for loading
	const dateTimeRef = useRef<HTMLInputElement>(null);
	const flatpickrInstance = useRef<flatpickr.Instance | null>(null);


	// Manage modal close icon styles
	useEffect(() => {
		let cleanup: (() => void) | undefined;

		if (show) {
			// Apply custom modal close icon styles when modal opens
			cleanup = addModalCloseIconStyles({
				...modalCloseIconConfigs.default,
				className: 'btn-close'
			});
		}

		// Cleanup function to remove styles when modal closes or component unmounts
		return () => {
			if (cleanup) {
				cleanup();
			}
		};
	}, [show]);

	// Initialize Flatpickr when modal opens
	useEffect(() => {
		if (show && dateTimeRef.current) {
			// Destroy existing instance if it exists
			if (flatpickrInstance.current) {
				flatpickrInstance.current.destroy();
			}

			// Initialize new Flatpickr instance
			flatpickrInstance.current = flatpickr(dateTimeRef.current, {
				enableTime: true,
				dateFormat: "Y-m-d h:i K",
				time_24hr: false,
				minDate: "today",
				minuteIncrement: 15,
				// Append calendar to document.body to avoid positioning issues inside modals
				// This prevents the calendar from being affected by modal transforms, overflow, or scrolling
				appendTo: document.body,
				// Manually position the calendar correctly when it opens
				// This ensures accurate positioning in production when modal is scrolled
				// Since calendar uses position: fixed, we position relative to viewport (getBoundingClientRect)
				onOpen: (_selectedDates, _dateStr, instance) => {
					if (!dateTimeRef.current || !instance.calendarContainer) return;
					
					const calendar = instance.calendarContainer;
					
					// Wait for next frame to ensure calendar is rendered and we can get its dimensions
					requestAnimationFrame(() => {
						if (!dateTimeRef.current || !calendar) return;
						
						// Get fresh input position in case of scroll
						const currentInputRect = dateTimeRef.current.getBoundingClientRect();
						const calendarWidth = calendar.offsetWidth || 300;
						const calendarHeight = calendar.offsetHeight || 350;
						const viewportWidth = window.innerWidth;
						const viewportHeight = window.innerHeight;
						
						// Default: position directly below input with 5px gap
						let top = currentInputRect.bottom + 5;
						let left = currentInputRect.left;
						
						// Adjust if calendar would overflow right edge
						if (left + calendarWidth > viewportWidth) {
							// Align to right edge of input instead
							left = currentInputRect.right - calendarWidth;
							// Ensure minimum margin from viewport edge
							if (left < 10) left = 10;
						}
						
						// Adjust if calendar would overflow bottom edge
						if (top + calendarHeight > viewportHeight) {
							// Position above input instead
							top = currentInputRect.top - calendarHeight - 5;
							// Ensure minimum margin from viewport top
							if (top < 10) top = 10;
						}
						
						// Apply calculated position (fixed positioning is relative to viewport)
						calendar.style.top = `${top}px`;
						calendar.style.left = `${left}px`;
						calendar.style.right = 'auto';
						// Ensure z-index is above modal (modal backdrop: 1050, modal: 1050, calendar: 1060)
						calendar.style.zIndex = '1060';
					});
				},
				onChange: function (_, dateStr) {
					setFormData(prev => ({
						...prev,
						purpose_time: dateStr
					}));
				}
			});
		}

		// Cleanup when modal closes
		return () => {
			if (flatpickrInstance.current) {
				flatpickrInstance.current.destroy();
				flatpickrInstance.current = null;
			}
		};
	}, [show]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.message || !formData.purpose_time) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Please fill in all fields.',
				timer: 3000,
				timerProgressBar: true,
				showConfirmButton: false,
			});
			return;
		}
		setLoading(true);

		try {
			// Prepare API payload
			const payload = {
				request_id: requestId || 0,
				receiver: "1", // Changed to string
				user_timezone: getUserTimezoneOffset(),
				message: formData.message,
				purpose_time: formData.purpose_time
			};

			// Call the appropriate API based on isCustomer prop
			let response;
			if (isCustomer) {
				response = await customerService.newPurposeAdd(payload);
			} else {
				response = await partnerService.proposeNewTime(payload);
			}

			if (response?.success) {
				// Show success message
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'New time proposed successfully!',
					timer: 3000,
					timerProgressBar: true,
					showConfirmButton: false,

				});

				// Call updateRequestCounter API
				// await partnerService.updateRequestCounter({
				// 	success: true,
				// 	data: {
				// 		requestCounter: {
				// 			total_new_request: 0
				// 		}
				// 	}
				// });

				// Call the original onSubmit callback if provided, safely handle setActivePage
				if (onSubmit) {
					onSubmit(formData, setActivePage);
				}

				// Reset form and close modal
				setFormData({ message: '', purpose_time: '' });
				onClose();
			} else {
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: response?.message,
					timer: 3000,
					timerProgressBar: true,
					showConfirmButton: false,
				});
				throw new Error(response?.message || 'Failed to propose new time');
			}
		} catch (error) {
			console.error('Error proposing new time:', error);
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Failed to propose new time. Please try again.',
				timer: 3000,
				timerProgressBar: true,
				showConfirmButton: false,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		// Reset form when closing
		setFormData({ message: '', purpose_time: '' });
		// Cleanup Flatpickr
		if (flatpickrInstance.current) {
			flatpickrInstance.current.destroy();
			flatpickrInstance.current = null;
		}
		onClose();
	};

	if (!show) return null;

	return (
		<>
			{/* Modal */}
			<div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1} aria-labelledby="proposeAnotherTimeModalLabel" aria-hidden="false">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<form onSubmit={handleSubmit}>
							<div className=" border-0 d-flex align-item-center" style={{ padding: '1.5rem' }}>
								<h5 className="modal-title">Propose New Time</h5>
								<button type="button" className="btn-close" onClick={handleClose}></button>
							</div>
							<div className="modal-body">
								<div className="mb-2 mb-md-4">
									<label className="mb-1">Message</label>
									<input type="hidden" name="request_id" value={requestId} />
									<input type="hidden" name="receiver" value="1" />
									<input type="hidden" name="user_timezone" value={getUserTimezoneOffset()} />
									<textarea
										name="message"
										className="form-control"
										placeholder="Write your message"
										value={formData.message}
										onChange={handleInputChange}
										required
									></textarea>
								</div>
								<div className="">
									<label className="mb-1">Propose New DateTime</label>
									<input
										ref={dateTimeRef}
										type="text"
										className="form-control flatpickr-input"
										name="purpose_time"
										placeholder="Select Date and Time"
										readOnly
										required
									/>
								</div>
							</div>
							<div className="modal-footer">
								<div className="text-center">
									<button type="submit" className="btn rounded-pill btn-primary text-white" disabled={loading}>
										{loading ? (
											<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
										) : (
											'Submit'
										)}
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>

			{/* Modal Backdrop */}
			<div className="modal-backdrop fade show" onClick={handleClose}></div>
		</>
	);
};

export default ProposeTimeModal;
