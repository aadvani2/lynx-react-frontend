import React from "react";
import SearchForm from "../../../../components/common/SearchBar/SearchForm";
import MiniSearchCard from "../MiniSearchCard/MiniSearchCard";
import searchIcon from "../../../../assets/Icon/Search.svg";
import logoIcon from "../../../../assets/Icon/LOGO.webp";
import logoIconAvif from "../../../../assets/Icon/LOGO.avif";
import styles from "./SearchBarRow.module.css"; // Import the CSS module

interface SearchBarRowProps {
  zipCode: string;
  onZipCodeChange: (zipCode: string) => void;
  onSearchSuccess: (searchData: {
    service: string;
    service_id: string;
    zipCode: string;
    serviceTier: number;
    date: string;
  }) => void;
  providerSearchQuery: string;
  onProviderSearchChange: (query: string) => void;
  onLynxChooseClick?: () => void;
  hasProviders: boolean;
}

export default function SearchBarRow({
  zipCode,
  onZipCodeChange,
  onSearchSuccess,
  providerSearchQuery,
  onProviderSearchChange,
  onLynxChooseClick,
  hasProviders
}: SearchBarRowProps): React.ReactElement {
  return (
    <div className={styles.searchBarRow}>
      <div className={styles.searchFormContainer}>
        <div className={styles.searchResultSearchForm}>
          <SearchForm
            zipCode={zipCode}
            onZipCodeChange={onZipCodeChange}
            redirectOnSearch={false}
            onSearchSuccess={onSearchSuccess}
          />
        </div>
      </div>
      <div className={styles.miniCardsContainer}>
        <MiniSearchCard
          icon={searchIcon}
          iconAlt="Search"
          label="Search provider"
        >
          <input
            className={styles.miniInput}
            type="text"
            value={providerSearchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onProviderSearchChange(e.target.value)}
            placeholder="Enter name"
            autoComplete="off"
          />
        </MiniSearchCard>

        <MiniSearchCard
          icon={logoIcon}
          iconAvif={logoIconAvif}
          iconAlt="Lynx Logo"
          label=""
          onClick={onLynxChooseClick}
          disabled={!hasProviders}
        >
          <span className={styles.lynxChooseText}>
            Let Lynx <br />choose for you
          </span>
        </MiniSearchCard>
      </div>
    </div>
  );
}
