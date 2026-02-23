import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useAvailabilityStore } from "../../store/availabilityStore";
import { usePartnerDashboardStore } from '../../store/partnerDashboardStore';
import BackendImage from '../../components/common/BackendImage/BackendImage';
import userPlaceholder from '../../assets/Icon/user-placeholder.png';
import { useNavigate } from "react-router-dom";

interface SideMenuProps {
  setActivePage: (page: string) => void;
  activePage: string;
}

const SideMenu = ({ setActivePage, activePage }: SideMenuProps) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sideMenuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const availability = useAvailabilityStore((s) => s.availability);
  const { rating: dashboardRating, servicePartnerTierName } = usePartnerDashboardStore();
  const effectiveRating = dashboardRating ?? 0;

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(prev => !prev);
    // Keep menu open on mobile when toggling dropdown
    if (!isMenuOpen) {
      setIsMenuOpen(true);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
    // Close sub-menu if main menu is closed
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.name) {
      return user.name;
    }
    if (user?.email) {
      return user.email.split("@")[0]; // Use part before @ as display name
    }
    return "Partner";
  };

  // Get user email
  const getUserEmail = () => {
    return user?.email || "No email available";
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.bootstrap?.Tooltip) {
      const tooltipTriggerList = Array.from(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      tooltipTriggerList.forEach((el) => {
        // @ts-expect-error - Tooltip may not be typed correctly
        new window.bootstrap.Tooltip(el);
      });
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (sideMenuRef.current && !sideMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sideMenuRef]);
    

  return (
    <div className="col-auto mb-6">
      <div className="card my-account-sidebar" ref={sideMenuRef}>
        <div className="card-body">
          <div className="blockquote-details mb-3">
            <div
              className="profile-image-container"
              id="provider-availability"
              style={
                {
                  "--dot-color": availability ? "#28a745" : "#dc3545",
                } as React.CSSProperties
              }
            >
              <BackendImage
                src={user?.image}
                alt="Partner Profile"
                className="rounded-circle w-100 h-100 object-fit-cover"
                placeholderImage={userPlaceholder}
                placeholderText=""
              />
              <div className="availability-dot"></div>
            </div>
            <div className="info">
              <h5 className="mb-1" id="partnerName">
                {getUserDisplayName()}
              </h5>
              <p className="mb-0">{getUserEmail()}</p>
              <div className="d-flex align-items-center mt-1">
                <span className="badge bg-dark rounded-pill">
                  {servicePartnerTierName || "N/A"}
                </span>
                <span
                  className="sidebarMenu ms-1"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-title="Edit/Update your partnership level"
                  data-page="changeTier"
                  style={{ cursor: "pointer" }}
                  data-title="changeTier"
                  onClick={() => { setActivePage("changeTier"); navigate("/professional/my-account?page=changeTier"); }}
                >
                  <i className="uil uil-edit-alt"></i>
                </span>
              </div>
              <div className="fs-sm star-rating feedback pointer-none d-flex align-items-center">
                {[1, 2, 3, 4, 5].map((starIndex) => (
                  <label
                    key={starIndex}
                    htmlFor={`star${starIndex}`}
                    style={{
                      color: starIndex <= effectiveRating ? "#ffc107" : "#e0e0e0",
                      fontSize: "18px",
                      marginRight: "2px"
                    }}
                  >
                  </label>
                ))}
                <span className="mt-2 ms-1">
                  ({effectiveRating ? effectiveRating.toFixed(1) : "0.0"})
                </span>
              </div>
            </div>
          </div>
          <hr className="my-3" />
          <button className={`sidebar-menu-open ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <span>Menu</span> <i className="uil uil-angle-right-b"></i>
          </button>
          <ul className={`my-account-menu ${isMenuOpen ? 'open' : ''}`} style={isMenuOpen ? { display: 'block' } : {}}>
            <li className={activePage === "dashboard" ? "active" : ""}>
              <a
                href="#"
                className="sidebarMenu"
                data-page="dashboard"
                data-title="Dashboard"
                onClick={() => { setActivePage("dashboard"); navigate("/professional/my-account?page=dashboard"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-home"></i>
                </span>
                <span className="text">Dashboard</span>
              </a>
            </li>
            <li className={activePage === "new-requests" ? "active" : ""}>
              <a
                href="#"
                className="sidebarMenu"
                data-page="new-requests"
                data-title="Requests"
                onClick={() => { setActivePage("new-requests"); navigate("/professional/my-account?page=new-requests"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-stopwatch"></i>
                </span>
                <span className="text">New Requests</span>
                {/* <span className="d-flex ms-auto">
                  <span className="badge bg-red rounded-pill" id="newRequestCounter">1</span>
                </span> */}
              </a>
            </li>
            <li className={activePage === "manage_employees" ? "active" : ""}>
              <a
                href="#"
                className="sidebarMenu"
                data-page="manage_employees"
                data-title="Manage Employees"
                onClick={() => { setActivePage("manage_employees"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-user-circle"></i>
                </span>
                <span className="text">Employees</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="toggle-sub-menu"
                onClick={handleDropdownToggle}
                style={{ cursor: 'pointer' }}
              >
                <span className="icon">
                  <i className="uil uil-map-marker-edit"></i>
                </span>
                <span className="text">Service Tiers & Availability</span>
                <span className="icon arrow">
                  <i className={`uil uil-angle-right-b ${isDropdownOpen ? 'rotated' : ''}`} style={{ 
                    transform: isDropdownOpen ? 'rotate(-90deg)' : 'rotate(90deg)',
                    transition: 'transform 0.3s ease'
                  }}></i>
                </span>
              </a>
              <ul
                className={`sidebar-menu-inner ${isDropdownOpen ? "show" : ""}`}
                style={{ display: isDropdownOpen ? "block" : "none" }}
              >
                <li
                  className={
                    activePage === "manage_service_tiers" ? "active" : ""
                  }
                >
                  <a
                    href="#"
                    className="toggle-sub-menu sidebarMenu"
                    data-page="manage_service_tiers"
                    data-title="Manage Service Tiers"
                    onClick={() => { setActivePage("manage_service_tiers"); navigate("/professional/my-account?page=manage_service_tiers"); setIsMenuOpen(false); setIsDropdownOpen(false); }}
                  >
                    <span className="text">Location & Service Tiers</span>
                  </a>
                </li>
                <li
                  className={
                    activePage === "manage_availability" ? "active" : ""
                  }
                >
                  <a
                    href="#"
                    className="toggle-sub-menu sidebarMenu"
                    data-page="manage_availability"
                    data-title="Manage Availability Schedule"
                    onClick={() => { setActivePage("manage_availability"); navigate("/professional/my-account?page=manage_availability"); setIsMenuOpen(false); setIsDropdownOpen(false); }}
                  >
                    <span className="text">Availability Schedule</span>
                  </a>
                </li>
              </ul>
            </li>
            <li className={activePage === "manage_services" ? "active" : ""}>
              <a
                href="#"
                className="sidebarMenu"
                data-page="manage_services"
                data-title="Add/Modify Services"
                onClick={() => { setActivePage("manage_services"); navigate("/professional/my-account?page=manage_services"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-wrench"></i>
                </span>
                <span className="text">Add/Modify Services</span>
              </a>
            </li>
            <li className={activePage === "business_profile" ? "active" : ""}>
              <a
                href="#"
                className="sidebarMenu"
                data-page="business_profile"
                data-title="Business Profile"
                onClick={() => { setActivePage("business_profile"); navigate("/professional/my-account?page=business_profile"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-user-circle"></i>
                </span>
                <span className="text">Business Profile</span>
              </a>
            </li>
            <li className={activePage === "password_settings" ? "active" : ""}>
              <a
                href="#"
                className="sidebarMenu"
                data-page="password_settings"
                data-title="Password Settings"
                onClick={() => { setActivePage("password_settings"); navigate("/professional/my-account?page=password_settings"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-lock"></i>
                </span>
                <span className="text">Password Settings</span>
              </a>
            </li>
            <li
              className={activePage === "contact_information" ? "active" : ""}
            >
              <a
                href="#"
                className="sidebarMenu"
                data-page="contact_information"
                data-title="Contact Information"
                onClick={() => { setActivePage("contact_information"); navigate("/professional/my-account?page=contact_information"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-envelope-alt"></i>
                </span>
                <span className="text">Contact Information</span>
              </a>
            </li>
            <li className={activePage === "notifications" ? "active" : ""}>
              <a
                href="#"
                className="sidebarMenu"
                data-page="notifications"
                data-title="Notifications"
                onClick={() => { setActivePage("notifications"); navigate("/professional/my-account?page=notifications"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-bell"></i>
                </span>
                <span className="text">Notifications</span>
              </a>
            </li>
            <li className={activePage === "settings" ? "active" : ""}>
              <a
                href="#"
                className="sidebarMenu"
                data-page="settings"
                data-title="Settings"
                onClick={() => { setActivePage("settings"); navigate("/professional/my-account?page=settings"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-setting"></i>
                </span>
                <span className="text">Settings</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
