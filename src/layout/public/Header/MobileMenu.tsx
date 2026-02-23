import { Link } from "react-router-dom";

interface ServiceCategory {
  id: number;
  title: string;
  slug: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  isServicesOpen: boolean;
  isAboutUsOpen: boolean;
  onToggleServices: () => void;
  onToggleAboutUs: () => void;
  onOverlayClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  closeMenu: () => void;
  isAuthenticated: boolean;
  logout: () => void;
  serviceCategories: ServiceCategory[];
  links: {
    home: string;
    serviceArea: string;
    about: string;
    professionals: string;
    login: string;
    join: string;
    becomePro: string;
  };
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  isServicesOpen,
  isAboutUsOpen,
  onToggleServices,
  onToggleAboutUs,
  onOverlayClick,
  closeMenu,
  isAuthenticated,
  logout,
  serviceCategories,
  links,
}) => {
  return (
    <div
      className={`mobile-menu d-lg-none ${isOpen ? 'open' : ''}`}
      onClick={onOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      <div className="mobile-menu-content d-flex flex-column h-100">
        <nav className="mobile-nav nav flex-column px-4 pt-4" aria-label="Mobile navigation">
          <Link className="mobile-nav-link nav-link fw-semibold text-body border-bottom py-3 px-0" to={links.home} onClick={closeMenu}>
            Home
          </Link>
          <div className="mobile-nav-dropdown">
            <button
              className="mobile-nav-link mobile-nav-link-dropdown nav-link fw-semibold text-body border-bottom py-3 px-0 w-100 d-flex align-items-center justify-content-between"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleServices();
              }}
              aria-expanded={isServicesOpen}
            >
              Services <span className={`mobile-caret ${isServicesOpen ? 'open' : ''}`} aria-hidden="true"></span>
            </button>
            {isServicesOpen && (
              <div className="mobile-nav-dropdown-menu ps-3">
                {serviceCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    className="mobile-nav-dropdown-item nav-link py-2 px-0 text-body border-bottom"
                    to={`/services/${cat.slug}`}
                    onClick={closeMenu}
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link className="mobile-nav-link nav-link fw-semibold text-body border-bottom py-3 px-0" to={links.serviceArea} onClick={closeMenu}>
            Service Area
          </Link>
          <div className="mobile-nav-dropdown">
            <button
              className="mobile-nav-link mobile-nav-link-dropdown nav-link fw-semibold text-body border-bottom py-3 px-0 w-100 d-flex align-items-center justify-content-between"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleAboutUs();
              }}
              aria-expanded={isAboutUsOpen}
            >
              About Us <span className={`mobile-caret ${isAboutUsOpen ? 'open' : ''}`} aria-hidden="true"></span>
            </button>
            {isAboutUsOpen && (
              <div className="mobile-nav-dropdown-menu ps-3">
                <Link className="mobile-nav-dropdown-item nav-link py-2 px-0 text-body border-bottom" to="/our-story" onClick={closeMenu}>
                  Our Story
                </Link>
                <Link className="mobile-nav-dropdown-item nav-link py-2 px-0 text-body border-bottom" to="/our-partners" onClick={closeMenu}>
                  Our Partners
                </Link>
                <Link className="mobile-nav-dropdown-item nav-link py-2 px-0 text-body border-bottom" to="/blogs" onClick={closeMenu}>
                  Our Blogs
                </Link>
              </div>
            )}
          </div>
          <Link className="mobile-nav-link nav-link fw-semibold text-body py-3 px-0" to={links.professionals} onClick={closeMenu}>
            Professionals
          </Link>
        </nav>

        <div className="mobile-actions d-flex flex-column gap-3 px-4 pb-5">
          <Link className="mobile-link-pro btn btn-outline-primary w-100 fw-bold" to={links.becomePro} onClick={closeMenu}>Become A Pro</Link>
          {!isAuthenticated && (
            <>
              <Link className="mobile-btn btn btn-outline-primary w-100" to={links.login} onClick={closeMenu}>Log In</Link>
              <Link className="mobile-btn btn btn-warning w-100 text-primary fw-bold" to={links.join} onClick={closeMenu}>Join FREE</Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <Link className="mobile-btn btn btn-outline-primary w-100" to="/my-account?page=dashboard" onClick={closeMenu}>My Account</Link>
              <button
                className="mobile-btn btn btn-primary w-100"
                type="button"
                onClick={async () => {
                  await logout();
                  closeMenu();
                }}
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
