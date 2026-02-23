import React from "react";
import { Link } from "react-router-dom";
import LogoIcon from "../../../assets/Icon/LOGO.svg";
import LogoWordmark from "../../../assets/Icon/Group.svg";

// Lynx logo component - LOGO.svg icon + Group.svg wordmark side by side
const LynxLogo = () => (
  <div className="d-flex align-items-center gap-2" style={{ height: '33px' }}>
    <img src={LogoIcon} alt="Lynx logo icon" className="flex-shrink-0" style={{ height: '27px', width: '56px' }} />
    <img src={LogoWordmark} alt="Lynx wordmark" className="flex-shrink-0" style={{ height: '33px', width: '69px' }} />
  </div>
);

// Footer link styles - using Bootstrap classes where possible
// Custom styles for font family and specific color kept inline
const footerLinkClassName = "text-decoration-none fw-medium";
const footerLinkStyle: React.CSSProperties = {
  color: "#1E4D5A",
  fontFamily: "Bricolage Grotesque, sans-serif",
  fontSize: 20,
};

export default function BookingFooter() {
  return (
    <footer className="w-100 bg-white pt-5 mt-5" style={{
      boxShadow: "0px -2px 4px rgba(39, 39, 39, 0.03)",
    }}>
      <div className="container mx-auto d-flex flex-column align-items-center">
        {/* Logo and links */}
        <div className="d-flex align-items-center flex-wrap justify-content-center mb-3" style={{ gap: 48 }}>
          <Link to="/" className="text-decoration-none d-flex align-items-center" aria-label="Lynx home">
            <LynxLogo />
          </Link>
          <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className={footerLinkClassName} style={footerLinkStyle}>Privacy Policy</Link>
          <Link to="/terms-of-use" target="_blank" rel="noopener noreferrer" className={footerLinkClassName} style={footerLinkStyle}>Terms of Use</Link>
          <Link to="/cookie-policy" target="_blank" rel="noopener noreferrer" className={footerLinkClassName} style={footerLinkStyle}>Cookie Policy</Link>
          <Link to="/privacy-request-form" target="_blank" rel="noopener noreferrer" className={footerLinkClassName} style={footerLinkStyle}>Privacy Request Form</Link>
          <Link to="/lynx-agreement" target="_blank" rel="noopener noreferrer" className={footerLinkClassName} style={footerLinkStyle}>LYNX Agreement</Link>
        </div>
        {/* Divider */}
        <div className="mx-auto mb-3 rounded" style={{
          width: "90%",
          height: 3,
          background: "#C8E9EF",
        }} />
        {/* Copyright */}
        <div className="mb-3" style={{
          color: "#1E4D5A",
          fontFamily: "Bricolage Grotesque, sans-serif",
          fontSize: 18,
        }}>
          ©2025 Lynx Connections, LLC | All rights reserved.
        </div>
      </div>
    </footer>
  );
}

