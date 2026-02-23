import { useJsApiLoader, type Libraries } from '@react-google-maps/api';
import { GOOGLE_MAPS_CONFIG } from '../../config/maps';

import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useManageServiceTiers } from '../../hooks/useManageServiceTiers';
import { useUpdateLocation } from '../../hooks/useUpdateLocation';
import { useServiceTiersStore } from '../../store/serviceTiersStore';
import { useServiceTiersMap } from '../../hooks/useServiceTiersMap';
import LocationSection from './serviceTiers/LocationSection';
import MapSection from './serviceTiers/MapSection';
import AddressSection from './serviceTiers/AddressSection';
import RadiusSection from './serviceTiers/RadiusSection';
import type { ServiceRadiusItem } from '../../hooks/useManageServiceTiers'; // Import ServiceRadiusItem as a type

// Extend Window interface for global functions
declare global {
  interface Window {
    openDashboard?: () => void;
    validateRadius?: (element: HTMLInputElement) => void;
  }
}

interface ServiceTiersLocationContentProps {
  setActivePage: (page: string) => void;
}

const GOOGLE_MAPS_LIBRARIES: Libraries = ['places', 'marker'];

function ServiceTiersLocationContent({ setActivePage }: ServiceTiersLocationContentProps) {
  // API data fetching
  const { data: apiData, loading, error, refetch } = useManageServiceTiers(5.5);

  // Update location API
  const { updateLocation, loading: updateLoading, error: updateError, reset: resetUpdate } = useUpdateLocation();

  // Store state
  const { setApiData, setLoading, setError, setRadiusValues } = useServiceTiersStore();

  // Map functionality
  const {
    onLoadMap,
    onUnmountMap,
    onAutocompleteLoad,
    onPlaceChanged
  } = useServiceTiersMap();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  // Update store with API data and local locationData state
  useEffect(() => {
    setApiData(apiData);
    setLoading(loading);
    setError(error);

    if (apiData?.service_radius && Array.isArray(apiData.service_radius)) {
      const emergencyRadius = apiData.service_radius.find(
        (tier: ServiceRadiusItem) => tier.tier_title === "Emergency Service (1-4 Hrs)"
      )?.radius;
      const scheduledRadius = apiData.service_radius.find(
        (tier: ServiceRadiusItem) => tier.tier_title === "Scheduled Service"
      )?.radius;

      setRadiusValues({
        emergency: emergencyRadius !== undefined ? emergencyRadius : '' as number | '',
        scheduled: scheduledRadius !== undefined ? scheduledRadius : '' as number | '',
      });

      // Set marker position from API data if available
      if (apiData.latitude && apiData.longitude) {
        const { setMarkerPos } = useServiceTiersStore.getState();
        setMarkerPos({
          lat: apiData.latitude,
          lng: apiData.longitude
        });
      }
    }
  }, [apiData, loading, error, setApiData, setLoading, setError, setRadiusValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get the latest data from the store
      const storeData = useServiceTiersStore.getState();
      const currentApiData = storeData.apiData;

      // Prepare the data for the API call
      const updateData = {
        location: currentApiData?.address || '',
        latitude: currentApiData?.latitude || 0,
        longitude: currentApiData?.longitude || 0,
        country: currentApiData?.country || '',
        address: currentApiData?.address || '',
        unit_number: storeData.unitNumber,
        zip_code: currentApiData?.zip_code || '',
        city: currentApiData?.city || '',
        state: currentApiData?.state || '',
        switchRange: storeData.selectedUnit,
        service_radius: [
          {
            tier_title: "Emergency Service (1-4 Hrs)",
            tier_id: 1,
            is_available: 1,
            radius: typeof storeData.radiusValues.emergency === 'number' ? storeData.radiusValues.emergency : 0
          },
          {
            tier_title: "Scheduled Service",
            tier_id: 3,
            is_available: 1,
            radius: typeof storeData.radiusValues.scheduled === 'number' ? storeData.radiusValues.scheduled : 0
          }
        ]
      };

      const response = await updateLocation(updateData);
      refetch();

      Swal.fire({
        title: 'Success!',
        text: response?.message || 'Location and service tiers updated successfully.',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Failed to update location:', error);
      // Error is already handled by the hook and displayed in the UI
    }
  };

  return (
    <div className="col lynx-my_account position-relative overflow-hidden" id="loadView1">
      <div className={`loader-main-v2 ${loading ? '' : 'd-none'}`}>
        <span className="loader-v2"> </span>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={refetch}
          >
            Retry
          </button>
        </div>
      )}

      {updateError && (
        <div className="alert alert-danger" role="alert">
          <strong>Update Error:</strong> {updateError}
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={resetUpdate}
          >
            Dismiss
          </button>
        </div>
      )}


      <div id="loadView">
        <div className="card">
          <div className="card-header p-3 d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between">
              <button className="btn btn-primary btn-sm rounded-pill" onClick={() => setActivePage('dashboard')}>
                <i className="uil uil-arrow-left" /> Back
              </button>
              &nbsp;&nbsp;
              <h4 className="card-title mb-0">Manage Location &amp; Service Tiers</h4>
            </div>
          </div>
          <div className="card-body">
            <form className="text-start" id="form-location-details" onSubmit={handleSubmit}>
              <input type="hidden" name="_token" defaultValue="2FQ80c50GBaZcRrqC5jf7kutne70kPRlBtf9OaPo" autoComplete="off" />

              {/* Location Search Section */}
              <LocationSection
                isLoaded={isLoaded}
                onAutocompleteLoad={onAutocompleteLoad}
                onPlaceChanged={onPlaceChanged}
              />

              {/* Map Section */}
              <MapSection
                isLoaded={isLoaded}
                onLoadMap={onLoadMap}
                onUnmountMap={onUnmountMap}
              />

              {/* Hidden form fields */}
              <input type="hidden" name="latitude" value={apiData?.latitude || 0} />
              <input type="hidden" name="longitude" value={apiData?.longitude || 0} />
              <input type="hidden" name="country" value={apiData?.country || ''} />

              {/* Address Details Section */}
              <AddressSection />

              {/* Radius Details Section */}
              <RadiusSection />

              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill btn-login"
                  id="submit-location-details"
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Schedule Modal */}
        <div className="modal fade" id="scheduleModal" tabIndex={-1} role="dialog" aria-labelledby="manageScheduleModel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content position-relative">
              <div className="modal-body">
                <div id="scheduleModalBody" />
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceTiersLocationContent;
