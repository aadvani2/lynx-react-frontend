import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAvailabilityStore } from '../../store/availabilityStore';
import { employeeService } from '../../services/employeeServices/employeeService';
import BackendImage from '../../components/common/BackendImage/BackendImage';
import userPlaceholder from '../../assets/Icon/user-placeholder.png';

interface SideMenuProps {
  setActivePage: (page: string) => void;
  activePage: string;
}

const SideMenu: React.FC<SideMenuProps> = ({ setActivePage, activePage }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { availability, setAvailability } = useAvailabilityStore();
  const [localAvailability, setLocalAvailability] = useState<boolean>(false);
  const [employeeImage, setEmployeeImage] = useState<string | null | undefined>(user?.image);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sideMenuRef = useRef<HTMLDivElement>(null);

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.name) {
      return user.name;
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Use part before @ as display name
    }
    return 'Employee';
  };

  // Get user email
  const getUserEmail = () => {
    return user?.email || 'No email available';
  };

  // Get availability dot color based on status
  const getAvailabilityDotColor = () => {
    return localAvailability ? '#28a745' : '#dc3545'; // Green for available, Red for unavailable
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  // Listen to global availability store changes
  useEffect(() => {
    setLocalAvailability(availability);
  }, [availability]);

  // Listen for availability change events from Dashboard
  useEffect(() => {
    const handleAvailabilityChange = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const newAvailability = customEvent.detail.availability;
      setLocalAvailability(newAvailability);
      setAvailability(newAvailability);
      // Refresh image when availability changes (dashboard data is refreshed)
      try {
        const response = await employeeService.getDashboardInfo();
        if (response?.success && response.data?.employee?.image) {
          setEmployeeImage(response.data.employee.image);
        }
      } catch (error) {
        console.error('Error refreshing employee image:', error);
      }
    };

    window.addEventListener('employeeAvailabilityChanged', handleAvailabilityChange);

    return () => {
      window.removeEventListener('employeeAvailabilityChanged', handleAvailabilityChange);
    };
  }, [setAvailability]);

  // Fetch availability status and image from dashboard API on mount
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await employeeService.getDashboardInfo();
        if (response?.success && response.data?.employee) {
          // Update availability
          if (response.data.employee.availability !== undefined) {
            const isAvailable = response.data.employee.availability === 1;
            setLocalAvailability(isAvailable);
            setAvailability(isAvailable); // Sync with global store
          }
          // Update image with presigned URL from API
          if (response.data.employee.image) {
            setEmployeeImage(response.data.employee.image);
          }
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
        // Default to unavailable if API fails
        setLocalAvailability(false);
        setAvailability(false);
      }
    };

    fetchAvailability();

    const handleClickOutside = (event: MouseEvent) => {
      if (sideMenuRef.current && !sideMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setAvailability, sideMenuRef]);

  return (
    <div className="col-auto mb-6">
      <div className="card my-account-sidebar" ref={sideMenuRef}>
        <div className="card-body">
          <div className="blockquote-details mb-3">
            <div
              className="profile-image-container rounded-circle"
              id="employee-availability"
              style={{ '--dot-color': getAvailabilityDotColor() } as React.CSSProperties}
            >
              <BackendImage
                src={employeeImage || user?.image}
                alt="Employee Profile"
                className="rounded-circle w-100 h-100 object-fit-cover"
                placeholderImage={userPlaceholder}
                placeholderText=""
              />
              <div className="availability-dot" />
            </div>
            <div className="info">
              <h5 className="mb-1">{getUserDisplayName()}</h5>
              <p className="mb-0">{getUserEmail()}</p>
            </div>
          </div>
          <hr className="my-3" />
          <button className={`sidebar-menu-open ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <span>Menu</span>
            <i className="uil uil-angle-right-b" />
          </button>
          <ul className={`my-account-menu ${isMenuOpen ? 'open' : ''}`} style={isMenuOpen ? { display: 'block' } : {}}>
            <li className={activePage === "dashboard" || activePage.startsWith("requests_") ? "active" : ""}>
              <Link
                to={"/employee/my-account?page=dashboard"}
                className="sidebarMenu"
                onClick={() => { setActivePage("dashboard"); navigate("/employee/my-account?page=dashboard"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-home" />
                </span>
                <span className="text">Dashboard</span>
              </Link>
            </li>
            <li className={activePage === "password_settings" ? "active" : ""}>
              <Link
                to={"/employee/my-account?page=password_settings"}
                className="sidebarMenu"
                onClick={() => { setActivePage("password_settings"); navigate("/employee/my-account?page=password_settings"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-padlock" />
                </span>
                <span className="text">Password Settings</span>
              </Link>
            </li>
            <li className={activePage === "notifications" ? "active" : ""}>
              <Link
                to={"/employee/my-account?page=notifications"}
                className="sidebarMenu"
                onClick={() => { setActivePage("notifications"); navigate("/employee/my-account?page=notifications"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-bell" />
                </span>
                <span className="text">Notifications</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
