import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";

import LogoIcon from "../../../assets/Icon/LOGO.webp";
import LogoIconAvif from "../../../assets/Icon/LOGO.avif";
import LogoGroup from "../../../assets/Icon/Group.svg";
import DownArrow from "../../../assets/Icon/DownArrow.svg"
import BurgerMenu from "../../../assets/Icon/burger-menu.svg";

import AboutUsDropdown from "../../../components/public/AboutUsDropdown/AboutUsDropdown";
import ServicesDropdown from "../../../components/public/ServicesDropdown/ServicesDropdown";

import { useAuthStore } from "../../../store/authStore";
import { servicesService } from "../../../services/generalServices/servicesService";

import MobileMenu from "./MobileMenu";

import "./Header.css";

interface ServiceCategory {
  id: number;
  title: string;
  slug: string;
  status?: string;
}

const LINKS = {
  home: "/",
  services: "/services",
  serviceArea: "/service-area",
  about: "/our-story",

  // Fixed links based on your actual routes
  professionals: "/professional",
  login: "/sign-in",
  join: "/signup",
  becomePro: "/professional",
};

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isAboutUsDropdownOpen, setIsAboutUsDropdownOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobileAboutUsOpen, setIsMobileAboutUsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const { isAuthenticated, logout, user } = useAuthStore();

  // Determine user role for menu filtering
  const isProvider = user?.user_type === 'provider';
  const isEmployee = user?.user_type === 'employee';
  const servicesDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const aboutUsDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load categories for mobile services menu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await servicesService.getServices();
        const fetched = response?.categories || [];
        const activeOnly = (fetched as ServiceCategory[]).filter(
          (cat) => !cat.status || cat.status === "active"
        );
        setServiceCategories(activeOnly);
      } catch (err) {
        console.error("Header: failed to load service categories", err);
        setServiceCategories([]);
      }
    };
    fetchCategories();
  }, []);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const loginDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle services dropdown with delay to prevent sticking
  const handleServicesMouseEnter = () => {
    if (servicesDropdownTimeoutRef.current) {
      clearTimeout(servicesDropdownTimeoutRef.current);
      servicesDropdownTimeoutRef.current = null;
    }
    setIsServicesDropdownOpen(true);
  };

  const handleServicesMouseLeave = () => {
    servicesDropdownTimeoutRef.current = setTimeout(() => {
      setIsServicesDropdownOpen(false);
    }, 150); // Small delay to allow mouse movement between elements
  };

  // Handle About Us dropdown with delay to prevent sticking
  const handleAboutUsMouseEnter = () => {
    if (aboutUsDropdownTimeoutRef.current) {
      clearTimeout(aboutUsDropdownTimeoutRef.current);
      aboutUsDropdownTimeoutRef.current = null;
    }
    setIsAboutUsDropdownOpen(true);
  };

  const handleAboutUsMouseLeave = () => {
    aboutUsDropdownTimeoutRef.current = setTimeout(() => {
      setIsAboutUsDropdownOpen(false);
    }, 150); // Small delay to allow mouse movement between elements
  };

  const handleLoginMouseEnter = () => {
    if (loginDropdownTimeoutRef.current) {
      clearTimeout(loginDropdownTimeoutRef.current);
      loginDropdownTimeoutRef.current = null;
    }
    setIsLoginDropdownOpen(true);
  };

  const handleLoginMouseLeave = () => {
    loginDropdownTimeoutRef.current = setTimeout(() => {
      setIsLoginDropdownOpen(false);
    }, 150);
  };

  useEffect(() => {
    const header = document.querySelector('.lynx-header');
    const onScroll = () => {
      header?.classList.toggle('is-stuck', window.scrollY > 2);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
    setIsMobileAboutUsOpen(false);
  };

  // Close mobile menu when clicking on the overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeMobileMenu();
    }
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Ensure account/login dropdowns are closed on auth or route change
  useEffect(() => {
    setIsAccountOpen(false);
    setIsLoginDropdownOpen(false);
  }, [isAuthenticated, location.pathname]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (servicesDropdownTimeoutRef.current) {
        clearTimeout(servicesDropdownTimeoutRef.current);
      }
      if (aboutUsDropdownTimeoutRef.current) {
        clearTimeout(aboutUsDropdownTimeoutRef.current);
      }
      if (loginDropdownTimeoutRef.current) {
        clearTimeout(loginDropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="lynx-header">
      <div className="header-inner container px-3 px-md-4 px-lg-5 ">
        <div className="d-flex align-items-center w-100 py-2 py-lg-0">
          {/* LEFT: Logo + Desktop Navigation */}
          <div className="d-flex align-items-center flex-grow-1">
            {/* Logo */}
            <Link
              className="d-flex align-items-center me-3 me-lg-4"
              to={LINKS.home}
              aria-label="Lynx home"
            >
              <picture>
                <source srcSet={LogoIconAvif} type="image/avif" />
                <img
                  className="logo-piece logo-img"
                  src={LogoIcon}
                  alt=""
                  loading="eager"
                  fetchPriority="high"
                  width="60"
                  height="60"
                />
              </picture>
              <img
                className="d-none d-xl-inline-block logo-wordmark logo-img ms-1"
                src={LogoGroup}
                alt="Lynx"
                loading="eager"
                fetchPriority="high"
                width="80"
                height="40"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="nav d-none d-lg-flex align-items-center "
              aria-label="Primary"
            >
              <Link className="nav-link px-2 px-xl-3" to={LINKS.home}>
                Home
              </Link>

              <div
                className="nav-item-dropdown px-2 px-xl-3"
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
              >
                <Link
                  className="nav-link has-caret d-flex align-items-center"
                  to={LINKS.services}
                >
                  Services{" "}
                  <img
                    src={DownArrow}
                    width={11}
                    className="ms-1"
                    alt="Dropdown arrow"
                  />
                </Link>

                <ServicesDropdown
                  isOpen={isServicesDropdownOpen}
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                />
              </div>

              <Link className="nav-link px-2 px-xl-3" to={LINKS.serviceArea}>
                Service Area
              </Link>

              <div
                className="nav-item-dropdown px-2 px-xl-3"
                onMouseEnter={handleAboutUsMouseEnter}
                onMouseLeave={handleAboutUsMouseLeave}
              >
                <Link
                  className="nav-link has-caret d-flex align-items-center"
                  to={LINKS.about}
                >
                  About Us{" "}
                  <img
                    src={DownArrow}
                    width={11}
                    className="ms-1"
                    alt="Dropdown arrow"
                  />
                </Link>

                <AboutUsDropdown
                  isOpen={isAboutUsDropdownOpen}
                  onMouseEnter={handleAboutUsMouseEnter}
                  onMouseLeave={handleAboutUsMouseLeave}
                />
              </div>

              <Link className="nav-link px-2 px-xl-3" to={LINKS.professionals}>
                Professionals
              </Link>
            </nav>
          </div>

          {/* RIGHT: Desktop Actions */}
          <div className="d-none d-lg-flex align-items-center ms-lg-3 ms-xl-4">
            <div className="actions d-flex align-items-center">
              {!isAuthenticated && (
                <>
                  <Link
                    className="link-pro me-2 me-xl-3 text-nowrap"
                    to={LINKS.becomePro}
                  >
                    Become A Pro
                  </Link>

                  <div
                    className="nav-item-dropdown me-2 me-xl-3"
                    onMouseEnter={handleLoginMouseEnter}
                    onMouseLeave={handleLoginMouseLeave}
                  >
                    <button
                      className="btn btn-outline-primary d-flex align-items-center text-nowrap"
                      onMouseEnter={handleLoginMouseEnter}
                      onClick={() => setIsLoginDropdownOpen((v) => !v)}
                      aria-haspopup="true"
                      aria-expanded={isLoginDropdownOpen}
                    >
                      Log In{" "}
                      <img
                        src={DownArrow}
                        width={11}
                        className="ms-1"
                        alt="Dropdown arrow"
                      />
                    </button>
                    {isLoginDropdownOpen && (
                      <div
                        className="account-dropdown"
                        role="menu"
                        onMouseEnter={handleLoginMouseEnter}
                        onMouseLeave={handleLoginMouseLeave}
                      >
                        <Link to="/sign-in/customer" className="dropdown-item">
                          Customer Login
                        </Link>
                        <Link to="/sign-in/partner" className="dropdown-item">
                          Partner Login
                        </Link>
                        <Link to="/sign-in/employee" className="dropdown-item">
                          Employee Login
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link
                    className="btn btn-warning text-nowrap"
                    to={LINKS.join}
                    aria-label="Join FREE"
                  >
                    Join FREE
                  </Link>
                </>
              )}

              {isAuthenticated && (
                <div className="nav-item-dropdown">
                  <button
                    className="nav-link has-caret d-flex align-items-center text-nowrap"
                    onClick={() => setIsAccountOpen((v) => !v)}
                    aria-haspopup="true"
                    aria-expanded={isAccountOpen}
                  >
                    My Account{" "}
                    <img
                      src={DownArrow}
                      width={11}
                      className="ms-1"
                      alt="Dropdown arrow"
                    />
                  </button>
                  {isAccountOpen && (
                    <div
                      className="account-dropdown"
                      role="menu"
                    >
                      {/* Dashboard - Show for all roles */}
                      <Link
                        role="menuitem"
                        to={isProvider ? "/professional/my-account?page=dashboard" : isEmployee ? "/employee/my-account?page=dashboard" : "/my-account?page=dashboard"}
                        className="dropdown-item"
                      >
                        Dashboard
                      </Link>

                      {/* Edit Profile - Show only for Provider/Partner */}
                      {isProvider && (
                        <Link
                          role="menuitem"
                          to="/professional/my-account?page=business_profile"
                          className="dropdown-item"
                        >
                          Edit Profile
                        </Link>
                      )}

                      {/* Customer-only menu items - Hide for Provider and Employee */}
                      {!isProvider && !isEmployee && (
                        <>
                          <Link
                            role="menuitem"
                            to="/my-account?page=my_requests"
                            className="dropdown-item"
                          >
                            My Requests
                          </Link>
                          <Link
                            role="menuitem"
                            to="/my-account?page=edit_profile"
                            className="dropdown-item"
                          >
                            Edit Profile
                          </Link>
                          <Link
                            role="menuitem"
                            to="/my-account?page=addresses"
                            className="dropdown-item"
                          >
                            Service Locations
                          </Link>
                          <Link
                            role="menuitem"
                            to="/my-account?page=notifications"
                            className="dropdown-item"
                          >
                            Notifications
                          </Link>
                          <Link
                            role="menuitem"
                            to="/my-account?page=settings"
                            className="dropdown-item"
                          >
                            Settings
                          </Link>
                        </>
                      )}

                      {/* Logout - Show for all roles */}
                      <button
                        className="account-logout dropdown-item"
                        onClick={async () => {
                          await logout();
                        }}
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="d-lg-none"> {/* Replaced col-auto with d-lg-none */}
            <button
              className="mobile-menu-btn"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <img src={BurgerMenu} width={40} alt="Menu" />
            </button>
          </div>
        </div>

      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        isServicesOpen={isMobileServicesOpen}
        isAboutUsOpen={isMobileAboutUsOpen}
        onToggleServices={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
        onToggleAboutUs={() => setIsMobileAboutUsOpen(!isMobileAboutUsOpen)}
        onOverlayClick={handleOverlayClick}
        closeMenu={closeMobileMenu}
        isAuthenticated={isAuthenticated}
        logout={logout}
        serviceCategories={serviceCategories}
        links={LINKS}
      />

    </header>
  );
};

export default Header;
