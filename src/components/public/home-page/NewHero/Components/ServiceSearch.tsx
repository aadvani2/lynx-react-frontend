import { useRef } from "react";
import type { SearchSuggestion } from "../../../../../hooks/useSearchSuggestions";

interface ServiceSearchProps {
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
  searchQuery: string;
  suggestions: SearchSuggestion[];
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  handleInputChange: (value: string) => void;
  loading?: boolean;
}

const ServiceSearch = ({
  onSuggestionClick,
  searchQuery,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  handleInputChange,
  loading = false
}: ServiceSearchProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // We now use ALL suggestions (sentence + service)
  const hasSuggestions = suggestions.length > 0;

  return (
    <div className="search__group" style={{ position: "relative" }}>
      <label htmlFor="service" className="search__label">
        What do you need help with
      </label>
      <input
        ref={searchInputRef}
        id="service"
        name="service"
        type="search"
        placeholder="Search Service"
        className="search__input"
        value={searchQuery}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => {
          if (hasSuggestions) {
            setShowSuggestions(true);
          }
        }}
        autoComplete="off"
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="search__suggestions"
        >
          {loading ? (
            <div
              style={{
                padding: "40px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px"
              }}
            >
              <div className="spinner-border text-primary" role="status" style={{ width: "2rem", height: "2rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p style={{ 
                margin: 0, 
                color: "#6B7280", 
                fontSize: "14px",
                fontFamily: "Inter"
              }}>
                Searching...
              </p>
            </div>
          ) : hasSuggestions ? (
            <div
              className="search__suggestions-scroll"
              style={{
                paddingTop: "40px",
                paddingBottom: "24px",
                paddingLeft: "16px",
                paddingRight: "16px",
                overflowY: "auto",
                maxHeight: "400px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                textAlign: "left"
              }}
            >
              {suggestions.map((suggestion, index) => {
              const isSentence = suggestion.type === "sentence";
              const titleText = isSentence
                ? suggestion.text || ""
                : suggestion.title || "";

              // Clean up metaText - only show if we have valid category info
              let metaText = "";
              if (!isSentence) {
                const subCategory = suggestion.sub_category?.trim() || "";
                const category = suggestion.category?.trim() || "";
                
                // Only show metaText if we have at least one valid category
                if (subCategory && category && subCategory !== category) {
                  metaText = `${subCategory} • ${category}`;
                } else if (subCategory) {
                  metaText = subCategory;
                } else if (category) {
                  metaText = category;
                }
              }

              return (
                <div
                  key={index}
                  className="search__suggestion-item"
                  onClick={() => onSuggestionClick(suggestion)}
                  style={{
                    cursor: "pointer",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    transition: "all 0.2s ease",
                    textAlign: "left",
                    border: isSentence 
                      ? "1px solid #E5E7EB" 
                      : "1px solid #D1FAE5",
                    backgroundColor: isSentence ? "#FFFFFF" : "#F0FDF4",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isSentence 
                      ? "#F9FAFB" 
                      : "#ECFDF5";
                    e.currentTarget.style.borderColor = isSentence 
                      ? "#D1D5DB" 
                      : "#86EFAC";
                    e.currentTarget.style.transform = "translateX(2px)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isSentence 
                      ? "#FFFFFF" 
                      : "#F0FDF4";
                    e.currentTarget.style.borderColor = isSentence 
                      ? "#E5E7EB" 
                      : "#D1FAE5";
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Icon indicator */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "2px"
                    }}
                  >
                    {isSentence ? (
                      // Search icon for sentences (shows more options)
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#1E4D5A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                    ) : (
                      // Checkmark icon for services (selectable)
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Badge/Label */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        marginBottom: "6px"
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "10px",
                          fontFamily: "Inter",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          backgroundColor: isSentence 
                            ? "#E5E7EB" 
                            : "#D1FAE5",
                          color: isSentence 
                            ? "#6B7280" 
                            : "#059669"
                        }}
                      >
                        {isSentence ? "Search" : "Service"}
                      </span>
                    </div>

                    {/* Main title / sentence text */}
                    <div
                      style={{
                        color: "#1E4D5A",
                        fontSize: "14px",
                        fontFamily: "Bricolage Grotesque",
                        fontWeight: "500",
                        lineHeight: "20px",
                        wordWrap: "break-word",
                        textAlign: "left",
                        marginBottom: isSentence ? "4px" : "6px"
                      }}
                    >
                      {titleText}
                    </div>

                    {/* For sentence type, show a hint label */}
                    {isSentence && (
                      <div
                        style={{
                          color: "#6B7280",
                          fontSize: "12px",
                          fontFamily: "Inter",
                          fontWeight: 400,
                          lineHeight: "16px",
                          wordWrap: "break-word",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#6B7280"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4" />
                          <path d="M12 8h.01" />
                        </svg>
                        <span>Click to see related services</span>
                      </div>
                    )}

                    {/* For service type, show category/subcategory */}
                    {!isSentence && metaText && (
                      <div
                        style={{
                          color: "#6B7280",
                          fontSize: "12px",
                          fontFamily: "Inter",
                          fontWeight: 400,
                          lineHeight: "16px",
                          wordWrap: "break-word",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                      
                        <span style={{ color: "#6B7280" }}>{metaText}</span>
                      </div>
                    )}
                  </div>

                  {/* Action indicator arrow */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: "16px",
                      height: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "2px",
                      opacity: 0.6
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isSentence ? "#1E4D5A" : "#10B981"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            })}
            </div>
          ) : searchQuery.trim().length >= 3 ? (
            <div
              style={{
                padding: "40px 24px",
                textAlign: "center",
                color: "#6B7280",
                fontSize: "14px",
                fontFamily: "Inter"
              }}
            >
              No suggestions found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ServiceSearch;

