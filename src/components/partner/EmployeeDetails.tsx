import React from 'react';
import { useEmployeeDetails } from '../../hooks/useEmployeeDetails';
import { useReviewsStore } from '../../store/reviewsStore';
import BackendImage from '../common/BackendImage/BackendImage';
import userPlaceholder from '../../assets/Icon/user-placeholder.png';

interface Employee {
  id: number;
  name: string;
  email: string;
  image: string | null;
  status: string;
  description: string;
  birth_date: string;
  phone: string;
  phone2?: string | null;
  availability: number;
  accepted_requests?: number;
  in_progress_requests?: number;
  completed_requests?: number;
  cancelled_requests?: number;
  rating_count?: number;
}

interface EmployeeDetailsProps {
  employee: Employee;
  setActivePage: (page: string) => void;
  onOpenAcceptedRequestsForEmployee: (employeeId: number) => void; // Added prop for accepted requests for a specific employee
  onOpenInProgressRequestsForEmployee: (employeeId: number) => void;
  onOpenCompletedRequestsForEmployee: (employeeId: number) => void;
  onOpenCancelledRequestsForEmployee: (employeeId: number) => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee, setActivePage, onOpenAcceptedRequestsForEmployee, onOpenInProgressRequestsForEmployee, onOpenCompletedRequestsForEmployee, onOpenCancelledRequestsForEmployee }) => {
  const { showReviews, setShowReviews } = useReviewsStore();
  
  const {
    isUpdatingAvailability,
    isUpdatingStatus,
    handleAvailabilityChange,
    handleStatusChange,
    handleOpenRequests,
  } = useEmployeeDetails(employee, setActivePage, onOpenAcceptedRequestsForEmployee, onOpenInProgressRequestsForEmployee, onOpenCompletedRequestsForEmployee, onOpenCancelledRequestsForEmployee); // Pass all new props to the hook

  const handleShowReviews = () => {
    setShowReviews(true);
  };


  return (
    <div className="card my-account-dashboard">
      <div className="card-header text-center p-2">
        <div style={{ width: "100px", height: "100px", margin: "0 auto 12px" }}>
          <BackendImage
            src={employee.image}
            alt={employee.name || 'Employee'}
            className="rounded-circle w-100 h-100 object-fit-cover"
            placeholderImage={userPlaceholder}
            placeholderText=""
          />
        </div>
        <h4 className="card-title mb-1">{employee.name}</h4>
        <div className="text-dark">
          {employee.email}<br />
          <div className="rating mt-1" style={{ fontSize: "20px", color: "gold" }}>
            {[...Array(5)].map((_, index) => (
              <span key={index}>☆</span>
            ))}
          </div>
        </div>
      </div>
      <div className="card-body p-2" id="empDetailBox">
        {showReviews ? (
          <div className="p-3">
            <div className="row align-items-center mb-5 position-relative zindex-1">
              <div className="col-md-12 d-flex justify-content-between align-items-center">
                <h2 className="display-6 mb-0">Ratings &amp; Reviews</h2>
               
              </div>
            </div>
            <div id="comments">
              <ol id="singlecomments" className="commentlist commentlist_v2">
                You have not received any reviews yet.
              </ol>
            </div>
          </div>
        ) : (
          <div className="col-12">
            <div className="alert d-none" id="responseMessage"></div>
            <div className="form-check form-switch form-switch-md d-flex justify-content-between align-items-center mb-3">
              <label className="form-check-label m-0" htmlFor="flexSwitchCheckDefault">Availability</label>
              <input
                className={`form-check-input employee-availability ${isUpdatingAvailability ? 'toggle-updating' : ''}`}
                data-id={employee.id}
                type="checkbox"
                id="flexSwitchCheckDefault"
                checked={employee.availability === 1}
                disabled={isUpdatingAvailability}
                onChange={(e) => {
                  // Prevent the checkbox from changing until confirmation
                  e.preventDefault();
                  handleAvailabilityChange(employee.id, e.target.checked);
                }}
              />
            </div>
            <hr className="my-3" />

            <label className="form-check-label fs-14 text-black-50" htmlFor="Description">Description</label><br />
            <span className="mt-1">{employee.description}</span>
            <hr className="mb-3 mt-3" />

            <p className="mt-1 mb-1">
              <i className="uil uil-calendar-alt"></i> <strong>DOB:</strong> {employee.birth_date}
            </p>

            <p className="mt-1 mb-1">
              <strong><i className="uil uil-phone"></i> Phone:</strong>
              <a href={`tel:${employee.phone}`}> {employee.phone}</a>
            </p>

            {employee.phone2 && (
              <p className="mt-1 mb-1">
                <strong><i className="uil uil-phone"></i> Phone 2:</strong>
                <a href={`tel:${employee.phone2}`}> {employee.phone2}</a>
              </p>
            )}

            <ul className="my-account-menu mt-3">
              <li>
                <a href="javascript:void(0);" onClick={() => handleOpenRequests('accepted')}>
                  <i className="uil uil-check-circle"></i>
                  <span>Accepted Requests ({employee.accepted_requests ?? 0})</span>
                  <span className="arrow"><i className="uil uil-angle-right-b"></i></span>
                </a>
              </li>
              <li>
                <a href="javascript:void(0);" onClick={() => handleOpenRequests('in process')}>
                  <i className="uil uil-chart-line"></i>
                  <span>In-Progress Requests ({employee.in_progress_requests ?? 0})</span>
                  <span className="arrow"><i className="uil uil-angle-right-b"></i></span>
                </a>
              </li>
              <li>
                <a href="javascript:void(0);" onClick={() => handleOpenRequests('completed')}>
                  <i className="uil uil-cloud-check"></i>
                  <span>Completed Requests ({employee.completed_requests ?? 0})</span>
                  <span className="arrow"><i className="uil uil-angle-right-b"></i></span>
                </a>
              </li>
              <li>
                <a href="javascript:void(0);" onClick={() => handleOpenRequests('cancelled')}>
                  <i className="uil uil-plus-circle rotate45"></i>
                  <span>Cancelled Requests ({employee.cancelled_requests ?? 0})</span>
                  <span className="arrow"><i className="uil uil-angle-right-b"></i></span>
                </a>
              </li>
              <li>
                <a href="javascript:void(0);" onClick={handleShowReviews}>
                  <i className="uil uil-star"></i>
                  <span>Rating &amp; Reviews ({employee.rating_count ?? 0})</span>
                  <span className="arrow"><i className="uil uil-angle-right-b"></i></span>
                </a>
              </li>
            </ul>

            <div className="form-check form-switch form-switch-md d-flex justify-content-between align-items-center mb-2 mt-2">
              <label className="form-check-label m-0" htmlFor="flexSwitchEmployee">
                Account Status
                <small className={`badge bg-${employee.status === 'active' ? 'green' : 'red'} rounded-pill`} id="empStatus">
                  {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                </small>
              </label>
              <input
                className="form-check-input employee-status"
                data-id={employee.id}
                type="checkbox"
                id="flexSwitchEmployee"
                checked={employee.status === 'active'}
                disabled={isUpdatingStatus}
                onChange={(e) => handleStatusChange(employee.id, e.target.checked)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails; 