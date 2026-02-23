import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { GOOGLE_MAPS_CONFIG, MAP_CONFIG, AUTOCOMPLETE_CONFIG } from '../../../../config/maps';
import { useServiceLocationsStore } from '../../../../store/serviceLocationsStore';
import { customerService } from '../../../../services/customerServices/customerService';

const mapContainerStyle = {
  width: '100%',
  height: '300px'
};

const AddressEditor: React.FC = () => {
  const { 
    isSaving, 
    editorMode: mode, 
    closeEditor: onClose,
    formData,
    setFormData,
    loadAddresses
  } = useServiceLocationsStore();
  
  // State to control whether to show full form or just search input
  const [showFullForm, setShowFullForm] = useState(false);
  
  // Show full form only after address selection
  useEffect(() => {
    if (formData.fullAddress && formData.fullAddress.trim() !== '') {
      setShowFullForm(true);
    } else {
      setShowFullForm(false);
    }
  }, [formData.fullAddress]);

  // Load address details when in edit mode
  useEffect(() => {
    const loadAddressDetails = async () => {
      if (mode === 'edit' && formData.id) {
        try {
          const response = await customerService.getAddressDetails({
            id: Number(formData.id),
            mode: 'edit'
          });
          
          if (response.success && response.data && response.data.address) {
            const addressData = response.data.address;
            setFormData({
              id: addressData.id,
              type: addressData.type || 'home',
              blockNo: addressData.block_no || '',
              fullAddress: addressData.full_address || '',
              zip: addressData.zip_code || '',
              city: addressData.city || '',
              state: addressData.state || '',
              country: addressData.country || '',
              lat: addressData.latitude,
              lng: addressData.longitude,
            });
            setShowFullForm(true);
          }
        } catch (error) {
          console.error('Error loading address details:', error);
        }
      }
    };

    loadAddressDetails();
  }, [mode, formData.id, setFormData]);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.API_KEY,
    libraries: GOOGLE_MAPS_CONFIG.LIBRARIES,
  });

  // Form data is now managed by Zustand store
  const { id, type, blockNo, fullAddress, zip, city, state, country, lat, lng } = formData;

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerPos = lat !== undefined && lng !== undefined ? ({ lat, lng } as google.maps.LatLngLiteral) : undefined;

  const onLoadMap = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmountMap = useCallback(() => {
    mapRef.current = null;
  }, []);

  const panTo = useCallback((plat: number, plng: number) => {
    const map = mapRef.current;
    if (map) {
      map.panTo({ lat: plat, lng: plng });
      map.setZoom(MAP_CONFIG.DEFAULT_ZOOM);
    }
  }, []);

  const onAutocompleteLoad = (auto: google.maps.places.Autocomplete) => {
    autocompleteRef.current = auto;
    // Request all necessary fields
    auto.setFields(['geometry', 'formatted_address', 'address_components', 'name', 'place_id']);
    auto.setTypes(AUTOCOMPLETE_CONFIG.TYPES as unknown as string[]);
    auto.setComponentRestrictions({ country: [AUTOCOMPLETE_CONFIG.COUNTRY_RESTRICTION] });
  };

  const extractAddressFromComponents = (components: google.maps.GeocoderAddressComponent[]) => {
    let c = city, s = state, z = zip, cy = country;
    components.forEach(component => {
      if (component.types.includes('locality')) c = component.long_name;
      if (component.types.includes('administrative_area_level_1')) s = component.short_name;
      if (component.types.includes('postal_code')) z = component.long_name;
      if (component.types.includes('country')) cy = component.short_name;
    });
    setFormData({ city: c, state: s, zip: z, country: cy });
  };

  // Helper function to handle address selection and form filling
  const handleAddressSelection = (lat: number, lng: number, fullAddress: string, addressComponents?: google.maps.GeocoderAddressComponent[]) => {
    setFormData({ lat, lng, fullAddress });
    
    if (addressComponents) {
      extractAddressFromComponents(addressComponents);
    }
    
    panTo(lat, lng);
    setShowFullForm(true);
  };

  const onPlaceChanged = () => {
    const auto = autocompleteRef.current;
    if (!auto) return;
    const place = auto.getPlace();
    
    const formattedAddress = place.formatted_address || place.name || '';
    
    if (!place.geometry || !place.geometry.location) {
      // Use Geocoder to get coordinates for the selected address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: formattedAddress }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const result = results[0];
          const newLat = result.geometry.location.lat();
          const newLng = result.geometry.location.lng();
          
          handleAddressSelection(newLat, newLng, formattedAddress, result.address_components || []);
        }
      });
      return;
    }
    
    const loc = place.geometry.location;
    const newLat = loc.lat();
    const newLng = loc.lng();
    
    handleAddressSelection(newLat, newLng, formattedAddress, place.address_components || []);
  };

  const onMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    
    const geocoder = new google.maps.Geocoder();
    const res = await geocoder.geocode({ location: { lat: newLat, lng: newLng } });
    if (res.results[0]) {
      const fullAddress = res.results[0].formatted_address;
      handleAddressSelection(newLat, newLng, fullAddress, res.results[0].address_components);
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      // Prepare the API payload
      const payload = {
        latitude: lat,
        longitude: lng,
        country: country,
        type: type,
        block_no: blockNo,
        full_address: fullAddress,
        zip_code: zip,
        city: city,
        state: state,
        id: id
      };

      // Call the API
      
      // Fix: Ensure id is a number or undefined, not string
      const fixedPayload = { ...payload, id: typeof payload.id === 'string' ? Number(payload.id) : payload.id };
      const response = await customerService.addAddress(fixedPayload);
      
      // If API call successful, show success modal and reload addresses
      if (response.success) {
        // Show success modal with auto-close
        Swal.fire({
          title: 'Success!',
          text: response.message || 'Address added successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0d6efd',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        
        // Reload addresses from server
        await loadAddresses();
        
        // Close editor
        onClose();
      }
      
    } catch (error) {
      console.error('Error saving address:', error);
      // Show error modal with auto-close
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add address. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="card mt-3" id="addressFormDiv">
      <div className="card-header p-3 d-flex align-items-center">
        <div>
          <h5 className="modal-title"> {mode === 'edit' ? 'Edit' : 'Add'}  Location</h5>
        </div>
      </div>
      <div className="card-body position-relative">
        <div className="address-closed-btn closed-btn-add-card">
          <button type="button" className=" m-0 p-0 " id="closedAddressForm" onClick={onClose} />
        </div>
        <div className="col-md-12 col-lg-12 col-xl-12" id="addressFields" data-method={mode}>
          <div className="row">
            <div className="col-md-12">
              <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
                <div className="form-floating mb-2 mb-md-4">
                  <input type="text" className="form-control pac-target-input" name="location" placeholder="" id="autocomplete" autoComplete="off" />
                  <label htmlFor="autocomplete">Search Address</label>
                </div>
              </Autocomplete>
              
              <div className="mb-3">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={markerPos || MAP_CONFIG.DEFAULT_CENTER}
                  zoom={MAP_CONFIG.DEFAULT_ZOOM}
                  onLoad={onLoadMap}
                  onUnmount={onUnmountMap}
                  onClick={onMapClick}
                  options={MAP_CONFIG.MAP_OPTIONS}
                >
                  {markerPos && <Marker position={markerPos} />}
                </GoogleMap>
              </div>
            </div>
          </div>
          {showFullForm && (
            <form id="addressForm" onSubmit={handleSubmit}>
              <input type="hidden" name="id" id="address_id" value={id ?? ''} />
              <input type="hidden" className="form-control" name="latitude" id="latitude" value={lat ?? ''} />
              <input type="hidden" className="form-control" name="longitude" id="longitude" value={lng ?? ''} />
              <input type="hidden" className="form-control" name="country" id="country" value={country} />
              <div className="row" id="addressDetails">
                <div className="col-md-8">
                  <div className="form-floating mb-2 mb-md-4">
                    <select className="form-select" name="type" id="address_type" value={type} onChange={(e) => setFormData({ type: e.target.value })}>
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                    <label htmlFor="address_type">Address</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-2 mb-md-4">
                    <input type="text" className="form-control" name="block_no" placeholder="Unit Number" id="block_no" value={blockNo} onChange={(e) => setFormData({ blockNo: e.target.value })} />
                    <label htmlFor="block_no">Unit Number</label>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating mb-2 mb-md-4">
                    <textarea className="form-control" name="full_address" placeholder="Address" id="address" value={fullAddress} onChange={(e) => setFormData({ fullAddress: e.target.value })} />
                    <label htmlFor="address">Address</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-2 mb-md-4">
                    <input type="text" className="form-control zip_code_val" name="zip_code" placeholder="Zip code" id="zip_code" value={zip} onChange={(e) => setFormData({ zip: e.target.value })} />
                    <label htmlFor="zip_code">Zip code</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-2 mb-md-4">
                    <input type="text" className="form-control" name="city" placeholder="City" id="city" value={city} onChange={(e) => setFormData({ city: e.target.value })} />
                    <label htmlFor="city">City</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-4">
                    <input type="text" className="form-control" name="state" placeholder="State" id="state" value={state} onChange={(e) => setFormData({ state: e.target.value })} />
                    <label htmlFor="state">State</label>
                  </div>
                </div>
                <div className="col-md-12 text-md-end">
                  <button type="submit" className="btn btn-primary rounded-pill btn-login" id="saveAddress" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressEditor;
