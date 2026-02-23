import React from "react";
import AddIcon from "../../../../assets/Icon/addd.svg";
import BackendImage from "../../../../components/common/BackendImage/BackendImage";
import homeIcon from "/img/icons/lineal/home2.svg";
import workIcon from "/img/icons/lineal/briefcase.svg";
import locationIcon from "/img/icons/lineal/location.svg";
import checkmarkIcon from "../../../../assets/Icon/checkmark.svg";
import buildingIcon from "../../../../assets/Icon/building.svg";
import styles from "./ServiceAddressSection.module.css";

interface Address {
  id?: number;
  user_id?: number;
  type: string;
  full_address: string;
  block_no: string | null;
  street?: string | null;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface Provider {
  id: number;
  name: string;
  image: string;
  rating: number;
  review_count: number;
  distance: number;
  is_available: boolean;
  established?: string | number;
}

interface ServiceAddressSectionProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onAddNewAddress?: () => void;
  onAddressChange: (addressId: number) => void;
  onEditAddress?: (address: Address) => void;
  onDeleteAddress?: (addressId: number) => void;
  providers?: Provider[];
  showProviders?: boolean;
  showProviderLoader?: boolean;
  selectedProviderId?: number | null;
  onProviderClick?: (provider: Provider) => void;
  isUpdatingProviderId?: number | null;
  showNoProviderAlert?: boolean;
  noProviderMessage?: string;
  disableSelectedAddress?: boolean;
  imageFallback?: string;
}

const iconMap: Record<string, string> = {
  home: homeIcon,
  work: workIcon,
  other: locationIcon,
};

const resolveProviderImage = (provider: Provider): string => {
  const p = provider as unknown as {
    image?: string;
    logo?: string;
    profile_image?: string;
    company_logo?: string;
    image_url?: string;
    avatar?: string;
  };
  return (
    p.image ||
    p.logo ||
    p.profile_image ||
    p.company_logo ||
    p.image_url ||
    p.avatar ||
    ""
  );
};

const ServiceAddressSection: React.FC<ServiceAddressSectionProps> = ({
  addresses,
  selectedAddress,
  onAddNewAddress,
  onAddressChange,
  onEditAddress,
  onDeleteAddress,
  providers = [],
  showProviders = false,
  showProviderLoader = false,
  selectedProviderId = null,
  onProviderClick,
  isUpdatingProviderId = null,
  showNoProviderAlert = false,
  noProviderMessage,
  disableSelectedAddress = false,
  imageFallback,
}) => {
  return (
    <section className="service-address-section" style={{ marginBottom: '24px' }}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Service Address</h2>
        <div className={styles.sectionActions}>
          <button type="button" className={styles.pillBtn} onClick={onAddNewAddress}>
            <img src={AddIcon} alt="" />
            Add New
          </button>
        </div>
      </div>

      <div className={styles.addressList}>
        {addresses.length > 0 ? (
          addresses.map((address, idx) => {
            const isSelected = selectedAddress?.id === address.id;
            return (
              <div key={address.id ?? `address-${idx}`} >
                <div
                  className={`${styles.addressCard} ${isSelected ? styles.addressCardActive : ""}`}
                  onClick={() => {
                    if (disableSelectedAddress && isSelected) return;
                    if (address.id) onAddressChange(address.id);
                  }}
                  style={{
                    cursor: disableSelectedAddress && isSelected ? 'not-allowed' : 'pointer',
                    opacity: disableSelectedAddress && isSelected ? 0.7 : 1
                  }}
                >
                  <div className={styles.addressIcon}>
                    <img src={iconMap[address.type]} alt={address.type} width={20} />
                  </div>

                  <div className={styles.addressDetails}>
                    <div className={styles.addressType}>
                      {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                    </div>
                    <div className={styles.addressText}>{address.full_address}</div>
                  </div>

                  <div className={styles.addressActions}>
                    <span
                      className="edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditAddress?.(address);
                      }}
                    >
                      Edit
                    </span>
                    <span
                      className="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (address.id) {
                          onDeleteAddress?.(address.id);
                        }
                      }}
                    >
                      Delete
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`${styles.addressCheck} ${isSelected ? styles.addressCardActiveCheck : ""}`}
                    aria-pressed={isSelected}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (disableSelectedAddress && isSelected) return;
                      if (address.id) onAddressChange(address.id);
                    }}
                  />
                </div>

                {/* Provider list directly under the selected address */}
                {isSelected && (
                  <div className="provider-list p-5 border border-top-0 rounded mb-10">
                    <div className={styles.sectionHeader} style={{ marginBottom: '8px' }}>
                      <h3 className={styles.sectionTitle} style={{ fontSize: '18px' }}>Available Partners In This Area.</h3>
                    </div>
                    {showProviders && providers.length > 0 ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                        {providers.map((provider) => {
                          const isProviderSelected = selectedProviderId === provider.id;
                          const isUpdating = isUpdatingProviderId === provider.id;
                          const resolvedImage = resolveProviderImage(provider) || imageFallback || "";
                          return (
                            <button
                              key={provider.id}
                              type="button"
                              onClick={() => onProviderClick?.(provider)}
                              style={{
                                border: isProviderSelected ? '2px solid #2563eb' : '1px solid #e5e7eb',
                                borderRadius: '12px',
                                padding: '12px',
                                textAlign: 'left',
                                background: '#fff',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                cursor: isUpdating ? 'not-allowed' : 'pointer',
                                opacity: isUpdating ? 0.75 : 1
                              }}
                              disabled={isUpdating}
                            >
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <BackendImage
                                  src={resolvedImage}
                                  fallbackSrc={imageFallback}
                                  alt={provider.name}
                                  className="w-10 h-10 rounded-full object-fit-cover"
                                />
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                                    {provider.name}
                                    {isProviderSelected && (
                                      <span style={{ marginLeft: 8, fontSize: 12, color: '#2563eb', background: '#dbeafe', padding: '2px 8px', borderRadius: '999px' }}>
                                        Selected provider
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: 13, color: '#6b7280' }}>
                                    <span>⭐ {typeof provider.rating === 'number' ? provider.rating.toFixed(2) : Number(provider.rating || 0).toFixed(2)}</span>
                                    <span>• {typeof provider.distance === 'number' ? provider.distance.toFixed(1) : Number(provider.distance || 0).toFixed(1)} Miles away</span>
                                  </div>
                                                                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', fontSize: 12, color: '#1e4d5a', marginTop: 6 }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                      <img src={checkmarkIcon} alt="" width={14} height={14} />
                                      Vetted by Lynx
                                    </span>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                      <img src={checkmarkIcon} alt="" width={14} height={14} />
                                      Licensed &amp; Insured
                                    </span>
                                    {provider.established ? (
                                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                        <img src={buildingIcon} alt="" width={14} height={14} />
                                        Est. {provider.established}
                                      </span>
                                    ) : null}
                                  </div>
  <div style={{ fontSize: 12, color: provider.is_available ? '#16a34a' : '#ef4444', marginTop: 4 }}>
                                    {provider.is_available ? 'Available now' : 'Currently unavailable'}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : showProviderLoader ? (
                      <div className="alert alert-info mt-3 mb-0">
                        <i className="uil uil-spinner-alt me-2"></i>
                        Loading providers for this address...
                      </div>
                    ) : showNoProviderAlert ? (
                      <div className="alert alert-warning mt-3 mb-0">
                        <i className="uil uil-exclamation-triangle me-2"></i>
                        {noProviderMessage || 'No nearby service providers found for the requested time. Please select another address.'}
                      </div>
                    ) : (
                      <div className="alert alert-secondary mt-3 mb-0">
                        <i className="uil uil-info-circle me-2"></i>
                        No providers to display for this address.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="alert alert-warning">
            <i className="uil uil-location-point me-3 fs-20"></i>
            <span className="fw-bold">No addresses found. Please add one.</span>
          </p>
        )}
      </div>

    </section>
  );
};

export default ServiceAddressSection;
