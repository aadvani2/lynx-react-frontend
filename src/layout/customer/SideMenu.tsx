import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCustomerDashboardStore } from '../../store/customerDashboardStore';
import BackendImage from '../../components/common/BackendImage/BackendImage';
import userPlaceholder from "../../assets/Icon/user-placeholder.png";

interface SideMenuProps {
  setActivePage: (page: string) => void;
  activePage: string;
}

const SideMenu: React.FC<SideMenuProps> = ({ setActivePage, activePage }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const sideMenuRef = useRef<HTMLDivElement>(null);

  const { rating: dashboardRating } = useCustomerDashboardStore();
  const effectiveRating = dashboardRating ?? 0;

  const handleBookService = () => {
    navigate('/services');
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sideMenuRef.current && !sideMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
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
            <div className="profile-image-container">
              <BackendImage
                src={user?.image}
                alt="Customer Profile"
                className="rounded-circle w-100 h-100 object-fit-cover"
                placeholderImage={userPlaceholder}
                placeholderText=""
              />
            </div>
            <div className="info">
              <h5 className="mb-1" id="customerName">{user?.name || '—'}</h5>
              <p className="mb-0">{user?.email || ''}</p>
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

                <span className="mt-1 ms-1">
                  ({effectiveRating ? effectiveRating.toFixed(1) : "0.0"})
                </span>
              </div>

            </div>
          </div>
          <hr className="my-3" />
          <div className="d-flex w-100 mb-3">
            <button
              className="btn btn-sm btn-primary rounded-pill profile-book-service mx-auto"
              onClick={handleBookService}
            >
              Book Service
            </button>
          </div>
          <button className={`sidebar-menu-open ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <span>Menu</span>
            <i className="uil uil-angle-right-b" />
          </button>
          <ul className={`my-account-menu ${isMenuOpen ? 'open' : ''}`} style={isMenuOpen ? { display: 'block' } : {}}>
            <li className={activePage === "dashboard" || activePage === "subscription_details" || activePage === "upgrade_subscription" || activePage.startsWith("requests_") ? "active" : ""}>
              <a
                href="javascript:void(0);"
                className="sidebarMenu"
                onClick={() => { setActivePage("dashboard"); navigate("/my-account?page=dashboard"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-home" />
                </span>
                <span className="text">Dashboard</span>
              </a>
            </li>
            <li className={activePage === "my_requests" ? "active" : ""}>
              <a
                href="javascript:void(0);"
                className="sidebarMenu"
                onClick={() => { setActivePage("my_requests"); navigate("/my-account?page=my_requests"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-stopwatch" />
                </span>
                <span className="text">My Requests</span>
              </a>
            </li>
            <li className={activePage === "edit_profile" ? "active" : ""}>
              <a
                href="javascript:void(0);"
                className="sidebarMenu"
                onClick={() => { setActivePage("edit_profile"); navigate("/my-account?page=edit_profile"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-user" />
                </span>
                <span className="text">Edit Profile</span>
              </a>
            </li>
            <li className={activePage === "password_settings" ? "active" : ""}>
              <a
                href="javascript:void(0);"
                className="sidebarMenu"
                onClick={() => { setActivePage("password_settings"); navigate("/my-account?page=password_settings"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-padlock" />
                </span>
                <span className="text">Password Settings</span>
              </a>
            </li>
            {/* <li className={activePage === "save_cards" ? "active" : ""}>
              <a
                href="javascript:void(0);"
                className="sidebarMenu"
                onClick={() => setActivePage("save_cards")}
              >
                <span className="icon">
                  <i className="uil uil-credit-card" />
                </span>
                <span className="text">Saved Cards</span>
              </a>
            </li> */}
            <li className={activePage === "addresses" ? "active" : ""}>
              <a
                href="javascript:void(0);"
                className="sidebarMenu"
                onClick={() => { setActivePage("addresses"); navigate("/my-account?page=addresses"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-map-marker" />
                </span>
                <span className="text">Service Locations</span>
              </a>
            </li>
            {/* <li className={activePage === "transaction_history" ? "active" : ""}>
              <a
                href="javascript:void(0);"
                className="sidebarMenu"
                onClick={() => setActivePage("transaction_history")}
              >
                <span className="icon">
                  <i className="uil uil-history" />
                </span>
                <span className="text">Transaction History</span>
              </a>
            </li> */}
            <li className={activePage === "contact_information" ? "active" : ""}>
              <a
                href="javascript:void(0);"
                className="sidebarMenu"
                onClick={() => { setActivePage("contact_information"); navigate("/my-account?page=contact_information"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-envelope" />
                </span>
                <span className="text">Contact Us</span>
              </a>
            </li>
            <li className={activePage === "notifications" ? "active" : ""}>
              <a
                href="javascript:void(0);"
                className="sidebarMenu"
                onClick={() => { setActivePage("notifications"); navigate("/my-account?page=notifications"); setIsMenuOpen(false); }}
              >
                <span className="icon">
                  <i className="uil uil-bell" />
                </span>
                <span className="text">Notifications</span>
              </a>
            </li>
            <li className={activePage === "referrals" ? "active" : ""}>
              <a
                href="javascript:void(0);"
                className="sidebarMenu"
                onClick={() => { setActivePage("referrals"); navigate("/my-account?page=referrals"); setIsMenuOpen(false); }}
              >
                <span className="icon"><i className="uil uil-user-arrows" /></span>
                <span className="text"> My Referrals</span>
              </a>
            </li>
            <li className={activePage === "settings" ? "active" : ""}>
              <a
                href="javascript:void(0);"
                className="sidebarMenu"
                onClick={() => { setActivePage("settings"); navigate("/my-account?page=settings"); }}
              >
                <span className="icon">
                  <i className="uil uil-setting" />
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