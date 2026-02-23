import React from "react";

interface EmptyStateProps {
  hasSearched: boolean;
}

export default function EmptyState({ hasSearched }: EmptyStateProps): React.ReactElement {
  if (hasSearched) {
    return (
      <div style={{
        textAlign: "center",
        padding: "60px 20px",
        color: "#666",
        fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
      }}>
        <div style={{ fontSize: 18, marginBottom: 8 }}>No providers found</div>
        <div style={{ fontSize: 14 }}>Try adjusting your search criteria</div>
      </div>
    );
  }

  return (
    <div style={{
      textAlign: "center",
      padding: "60px 20px",
      color: "#666",
      fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    }}>
      <div style={{ fontSize: 18, marginBottom: 8 }}>Search for service providers</div>
      <div style={{ fontSize: 14 }}>Use the search form above to find providers in your area</div>
    </div>
  );
}
