import React, { useState } from "react";
import type { SearchData } from "../../types";
// import { useLoadScript } from "@react-google-maps/api"; // No longer needed here
import ModalLocationSearch from "./ModalLocationSearch";
import { useAuthStore } from "../../../../store/authStore";
import { servicesService } from "../../../../services/generalServices/servicesService";
import { getSessionData, updateSessionData } from "../../../../utils/sessionDataManager";
import Swal from "sweetalert2";

interface ServiceDetailsModalProps {
  show: boolean;
  onClose: () => void;
  serviceData: any; // State data passed from navigation
  onSearch: (searchData: SearchData) => void;
}

export default function ServiceDetailsModal({
  show,
  onClose,
  serviceData,
  onSearch
}: ServiceDetailsModalProps): React.ReactElement {
  const [zipCode, setZipCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Get service data from localStorage for display
  const sessionData = getSessionData() || {};
  const selectedServiceTitles = sessionData.booked_services_title || [];
  const subCategory = sessionData.sub_category || "";
  const serviceType =
    sessionData.service_tier_id === 3 ? "scheduled" : "emergency";
  const scheduleTime = sessionData.schedule_time || "";

  const handleSearchTriggered = async (newZipCode: string, serviceTierId?: number) => {
    if (!newZipCode.trim()) {
      await Swal.fire({
        title: 'Zip Code Required',
        text: 'Please select a location that contains a zip code/postal code. This is necessary for our service.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#1e4d5a',
        customClass: {
          popup: 'swal2-popup swal2-modal swal2-show',
          container: 'swal2-container swal2-center swal2-backdrop-show',
          confirmButton: 'btn btn-primary rounded-pill'
        },
        buttonsStyling: false
      });
      return;
    }

    setZipCode(newZipCode);

    const sessionPayload = {
      zipcode: newZipCode,
      service_tier_id: serviceTierId,
    } as Parameters<typeof servicesService.storeSessionData>[0];

    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      // Pre-login flow: Save to localStorage only (no API call)
      updateSessionData(sessionPayload);
    } else {
      // Post-login flow: Call API
      servicesService.storeSessionData(sessionPayload).catch((error: unknown) => {
        console.error("Error storing session data:", error);
      });
    }

  };

  const handleSearch = async () => {
    if (!zipCode.trim()) {
      // alert("Please enter a zip code"); // Swal is now handled by handleSearchTriggered
      return;
    }

    setIsLoading(true);
    try {
      // Get detailed service data from localStorage
      const sessionData = getSessionData() || {};

      const selectedServiceTitles = sessionData.booked_services_title || [];
      const subCategory = sessionData.sub_category || '';
      const serviceTier = sessionData.service_tier_id || serviceData.serviceTier || 1;
      const scheduleTime = sessionData.schedule_time || serviceData.date || '';

      // Format service name like the example: "Home Staging > Occupied Home Staging"
      const serviceName = selectedServiceTitles.length === 1
        ? `${subCategory} > ${selectedServiceTitles[0]}`
        : `${subCategory} > ${selectedServiceTitles.join(', ')}`;

      const searchData: SearchData = {
        service: serviceName,
        service_id: serviceData.service_id || selectedServiceTitles[0] || '',
        zipCode: zipCode,
        serviceTier: serviceTier,
        date: scheduleTime
      };

      await onSearch(searchData);
      onClose(); // Close modal after successful search
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to search for providers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return <></>;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1e4d5a',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          Service Details
        </h2>

        {/* Selected Services */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            Selected Services:
          </h3>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <p style={{
              margin: '0 0 4px 0',
              fontWeight: '500',
              color: '#1e4d5a'
            }}>
              {subCategory}
            </p>
            {selectedServiceTitles.map((title: string, index: number) => (
              <p key={index} style={{
                margin: '4px 0',
                color: '#666',
                fontSize: '14px'
              }}>
                • {title}
              </p>
            ))}
          </div>
        </div>

        {/* Service Type */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            Service Type:
          </h3>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <p style={{
              margin: '0',
              color: '#1e4d5a',
              fontWeight: '500'
            }}>
              {serviceType === 'emergency' ? 'Emergency Service (1-4 hours)' : 'Scheduled Service'}
            </p>
            {serviceType === 'scheduled' && (
              <p style={{
                margin: '4px 0 0 0',
                color: '#666',
                fontSize: '14px'
              }}>
                Scheduled for: {scheduleTime}
              </p>
            )}
          </div>
        </div>

        {/* Zip Code Input */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            Enter Your Zip Code:
          </h3>

          <ModalLocationSearch
            // isLoaded={true} // No longer needed here, handled internally
            location={zipCode}
            onLocationChange={setZipCode}
            onZipCodeChange={setZipCode}
            onSearchTriggered={handleSearchTriggered}
            when={serviceType === "emergency" ? "emergency" : "later"}
          />
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#666',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSearch}
            disabled={isLoading || !zipCode.trim()}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#1e4d5a',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Searching...' : 'Search Providers'}
          </button>
        </div>
      </div>
    </div>
  );
}
