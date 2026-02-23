import type { FC } from "react";
import { Link } from "react-router-dom";
import "./AboutUsDropdown.css";

interface AboutUsDropdownProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const AboutUsDropdown: FC<AboutUsDropdownProps> = ({
  isOpen,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className={`about-us-dropdown ${isOpen ? "open" : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="about-us-dropdown-inner">
        <Link to="/our-story" className="about-us-dropdown-item">
          Our Story
        </Link>
        <Link to="/our-partners" className="about-us-dropdown-item">
          Our Partners
        </Link>
        <Link to="/blogs" className="about-us-dropdown-item">
          Our Blogs
        </Link>
      </div>
    </div>
  );
};

export default AboutUsDropdown;

