import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Swal from 'sweetalert2';
import { employeeService } from '../../services/employeeServices/employeeService';
import { useAvailabilityStore } from '../../store/availabilityStore';
import LoadingComponent from '../common/LoadingComponent';
import { Link } from 'react-router-dom';

interface DashboardContentProps {
  setActivePage: (page: string) => void;
}

interface DashboardData {
  employee?: {
    id: number;
    availability: number;
  };
  dashboard?: {
    accepted: number;
    completed: number;
    in_process: number;
    cancelled: number;
  };
}

const DashboardContent: React.FC<DashboardContentProps> = ({ setActivePage }) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const { setAvailability } = useAvailabilityStore();

  const MEMBER_ID = dashboardData.employee?.id || 64;

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoadingDashboard(true);
      const response = await employeeService.getDashboardInfo();

      if (response?.success && response.data) {
        setDashboardData(response.data);

        if (response.data.employee?.availability !== undefined) {
          const available = response.data.employee.availability === 1;
          setIsAvailable(available);
          setAvailability(available);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoadingDashboard(false);
    }
  }, [setAvailability]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const dashboardCounts = useMemo(() => ({
    accepted: dashboardData.dashboard?.accepted || 0,
    inProcess: dashboardData.dashboard?.in_process || 0,
    completed: dashboardData.dashboard?.completed || 0,
    cancelled: dashboardData.dashboard?.cancelled || 0,
  }), [dashboardData.dashboard]);

  const handleConfirmAvailability = useCallback(async (newAvailability: boolean) => {
    setIsLoading(true);
    try {
      const payload = { availability: newAvailability ? 1 : 0, member_id: MEMBER_ID };
      const response = await employeeService.setAvailability(payload);

      if (response?.success) {
        setIsAvailable(newAvailability);
        await fetchDashboardData();

        window.dispatchEvent(new CustomEvent('employeeAvailabilityChanged', {
          detail: { availability: newAvailability },
        }));

        await Swal.fire({
          title: 'Success!',
          text: "Employee's availability status changed successfully.",
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error(response?.message || 'Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      await Swal.fire({
        title: 'Error',
        text: 'Failed to update availability status. Please try again.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setIsLoading(false);
    }
  }, [MEMBER_ID, fetchDashboardData]);

  const handleAvailabilityToggle = useCallback(async () => {
    if (!MEMBER_ID) {
      await Swal.fire({
        title: 'Error',
        text: 'Employee information not loaded yet. Please wait or refresh the page.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const newAvailability = !isAvailable;
    const message = isAvailable
      ? "Do you want to change the availability status? You won't be able to receive any requests if you are not available."
      : "Are you sure you want to make yourself available? You will start receiving new request notifications if you are available.";

    const result = await Swal.fire({
      title: "Change Availability",
      text: message,
      icon: "warning",
      confirmButtonText: "Yes, change it!",
    });

    if (result.isConfirmed) {
      await handleConfirmAvailability(newAvailability);
    }
  }, [MEMBER_ID, isAvailable, handleConfirmAvailability]);

  const openRequests = useCallback((status: string) => {
    const statusMap: Record<string, string> = {
      'accepted': 'requests_accepted',
      'in process': 'requests_in process',
      'completed': 'requests_completed',
      'cancelled': 'requests_cancelled',
    };
    setActivePage(statusMap[status] || 'dashboard');
  }, [setActivePage]);

  return (
    <div className="card my-account-dashboard">
      <div className="card-body">
        <div className="alert d-none" id="responseMessage" />

        {isLoadingDashboard ? (
          <LoadingComponent />
        ) : (
          <>
            <div className="form-check form-switch form-switch-md">
              <label className="h4 form-check-label m-0" htmlFor="flexSwitchCheckDefault">
                Availability
              </label>
              <input
                className="form-check-input employee-availability"
                data-id={MEMBER_ID}
                type="checkbox"
                id="flexSwitchCheckDefault"
                checked={isAvailable}
                onChange={handleAvailabilityToggle}
                disabled={isLoading || isLoadingDashboard}
              />
            </div>
            <hr className="my-3" />
            <h6>Request Summary</h6>
            <ul className="my-account-menu two-columns row-gap-2">
              <li className="mb-0">
                <Link to="" onClick={() => openRequests('accepted')}>
                  <span className="icon">
                    <i className="uil uil-check-circle" />
                  </span>
                  <span className="text">Accepted Requests ({dashboardCounts.accepted || 0})</span>
                </Link>
              </li>
              <li className="mb-0">
                <Link to="" onClick={() => openRequests('in process')}>
                  <span className="icon">
                    <i className="uil uil-chart-line" />
                  </span>
                  <span className="text">In-Progress Requests ({dashboardCounts.inProcess || 0})</span>
                </Link>
              </li>
              <li className="mb-0">
                <Link to="" onClick={() => openRequests('completed')}>
                  <span className="icon">
                    <i className="uil uil-cloud-check" />
                  </span>
                  <span className="text">Completed Requests ({dashboardCounts.completed || 0})</span>
                </Link>
              </li>
              <li className="mb-0">
                <Link to="" onClick={() => openRequests('cancelled')}>
                  <span className="icon rotate45">
                    <i className="uil uil-plus-circle" />
                  </span>
                  <span className="text">Cancelled Requests ({dashboardCounts.cancelled || 0})</span>
                </Link>
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
