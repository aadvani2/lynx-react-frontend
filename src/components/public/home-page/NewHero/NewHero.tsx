import CheckmarkIcon from "../../../../assets/Icon/checkmark.svg";
import SearchForm from "../../../common/SearchBar/SearchForm";
// PopularServices is currently unused; keep commented until needed
// import PopularServices from "./Components/PopularServices";
// import ApiIntakeAssistant from "./Components/ApiIntakeAssistant/ApiIntakeAssistant";
import "./NewHero.css";

import { useAuthStore } from "../../../../store/authStore";

interface NewHeroProps {
  zipCode: string;
  onZipCodeChange: (zipCode: string) => void;
  resetFormTrigger?: number;
}

export default function NewHero({
  zipCode,
  onZipCodeChange,
  resetFormTrigger,
}: NewHeroProps) {
  const { user, isAuthenticated } = useAuthStore();
  const userRole = user?.user_type;
  // const [activeTab, _setActiveTab] = useState<"manual" | "api">("manual");

  return (
    <section className="hero">
      {/* Trust badge 
      <div className="hero__trust">
        <div className="hero__stars" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <img key={i} src={StarIcon} alt="" width="16" height="16" />
          ))}
        </div>
        <span className="hero__trust-text">Trusted by 500,000+ customers</span>
      </div>*/}

      {/* Heading */}
      <h1 className="hero__title">
        Find trusted home
        <br />
        service professionals
      </h1>

      {/* Subline */}
      <div className="hero__subline">
        <span className="hero__badge" aria-hidden="true">
          <img
            src={CheckmarkIcon}
            alt=""
            width="20"
            height="20"
            className="hero__checkmark"
            loading="eager"
            fetchPriority="high"
          />
        </span>
        <span>Quickly connect with licensed, vetted experts</span>
      </div>

      {/* Search */}
      {(!isAuthenticated ||
        (isAuthenticated &&
          userRole !== "provider" &&
          userRole !== "employee")) && (
          <>
            <div className="hero__search">
              <SearchForm
                zipCode={zipCode}
                onZipCodeChange={onZipCodeChange}
                resetFormTrigger={resetFormTrigger}
                redirectOnSearch={true}
              />

              {/* Temporarily hidden - Tab buttons */}
              {/* <div className="hero__tabs" role="tablist" aria-label="Search type">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "manual"}
                className={`hero__tab ${activeTab === "manual" ? "hero__tab--active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("manual");
                }}
              >
                Manual Search
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "api"}
                className={`hero__tab ${activeTab === "api" ? "hero__tab--active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("api");
                }}
              >
                API Assistant
              </button>
            </div> */}
              {/* <div className="hero__search-panel" role="tabpanel">
              {activeTab === "manual" && (
                <SearchForm
                  zipCode={zipCode}
                  onZipCodeChange={onZipCodeChange}
                  resetFormTrigger={resetFormTrigger}
                  redirectOnSearch={true}
                />
              )}
              {activeTab === "api" && (
                <ApiIntakeAssistant
                  zipCode={zipCode}
                  onZipCodeChange={onZipCodeChange}
                />
              )}
            </div> */}
            </div>

            {/* <PopularServices />*/}
          </>
        )}
    </section>
  );
}
