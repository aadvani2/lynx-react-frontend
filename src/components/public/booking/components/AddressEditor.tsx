import { useJsApiLoader } from '@react-google-maps/api';
import React, { useState, useEffect, useCallback } from 'react';
import { GOOGLE_MAPS_CONFIG, MAP_CONFIG } from '../../../../config/maps';
import GoogleMapComponent from './GoogleMapComponent';
import AddressSearchComponent from './AddressSearchComponent';
import Swal from 'sweetalert2';

interface Address {
  id?: number;
  user_id?: number;
  type: string;
  block_no: string | null;
  full_address: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  street?: string | null;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface AddressEditorProps {
  isVisible: boolean;
  mode: 'add' | 'edit';
  initialData?: Address | null;
  onSave: (addressData: Address) => Promise<void>;
  onClose: () => void;
}

const AddressEditor: React.FC<AddressEditorProps> = ({
  isVisible,
  mode,
  initialData,
  onSave,
  onClose
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.API_KEY,
    libraries: GOOGLE_MAPS_CONFIG.LIBRARIES
  });

  const [formData, setFormData] = useState<Address>({
    type: 'home',
    block_no: null,
    full_address: '',
    zip_code: '',
    city: '',
    state: '',
    country: 'US',
    latitude: 32.775568,
    longitude: -96.795595
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [showFullForm, setShowFullForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data when component mounts or initialData changes
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData(initialData);
      setMarkerPos({ lat: initialData.latitude, lng: initialData.longitude });
      setShowFullForm(true);
    } else {
      // Reset form for add mode
      setFormData({
        type: 'home',
        block_no: null,
        full_address: '',
        zip_code: '',
        city: '',
        state: '',
        country: 'US',
        latitude: 32.775568,
        longitude: -96.795595
      });
      setMarkerPos(null);
      setShowFullForm(false);
    }
  }, [initialData, mode]);

  // Map event handlers
  const onLoadMap = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmountMap = useCallback(() => {
    setMap(null);
  }, []);

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const pos = { lat, lng };
      setMarkerPos(pos);
      setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
      
      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: pos }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          const place = results[0];
          const comps = place.address_components || [];
          let address = '', city = '', state = '', zip_code = '', country = '';
          
          comps.forEach((c) => {
            const t = c.types;
            if (t.includes('street_number')) address = c.long_name + ' ';
            else if (t.includes('route')) address += c.long_name;
            else if (t.includes('locality')) city = c.long_name;
            else if (t.includes('administrative_area_level_1')) state = c.short_name;
            else if (t.includes('postal_code')) zip_code = c.long_name;
            else if (t.includes('country')) country = c.short_name;
          });
          
          setFormData(prev => ({
            ...prev,
            full_address: place.formatted_address || '',
            city,
            state,
            zip_code,
            country
          }));
          setShowFullForm(true);
        }
      });
    }
  }, []);

  const onAutocompleteLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const pos = { lat, lng };
        
        setMarkerPos(pos);
        map?.setCenter(pos);
        
        // Parse address components
        const comps = place.address_components || [];
        let address = '', city = '', state = '', zip_code = '', country = '';
        
        comps.forEach((c) => {
          const t = c.types;
          if (t.includes('street_number')) address = c.long_name + ' ';
          else if (t.includes('route')) address += c.long_name;
          else if (t.includes('locality')) city = c.long_name;
          else if (t.includes('administrative_area_level_1')) state = c.short_name;
          else if (t.includes('postal_code')) zip_code = c.long_name;
          else if (t.includes('country')) country = c.short_name;
        });
        
        setFormData(prev => ({
          ...prev,
          full_address: place.formatted_address || '',
          city,
          state,
          zip_code,
          country,
          latitude: lat,
          longitude: lng
        }));
        setShowFullForm(true);
      }
    }
  }, [autocomplete, map]);

  // Form input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form validation
  const validateForm = () => {
    if (!formData.full_address.trim()) {
      return 'Please select an address from the map or search';
    }
    if (!formData.city.trim()) {
      return 'City is required';
    }
    if (!formData.state.trim()) {
      return 'State is required';
    }
    if (!formData.zip_code.trim()) {
      return 'Zip code is required';
    }
    return null;
  };

  // Save address handler
  const handleSaveAddress = async () => {
    const validationError = validateForm();
    if (validationError) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: validationError,
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      
      Swal.fire({
        icon: 'success',
        title: 'Address Saved',
        text: `Your address has been ${mode === 'edit' ? 'updated' : 'saved'} successfully`,
        timer: 2000,
        showConfirmButton: false
      });

      onClose();
    } catch (error) {
      console.error('Error saving address:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save address. Please try again.',
        timer: 3000,
        showConfirmButton: false
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="" id="addressFormDiv" style={{ display: 'block' }}>
      <div className="row">
        <div className="col-lg-8 offset-lg-2 mt-2" id="addressFields" data-method={mode}>
          <div className="border-light-gray rounded px-3">
            <div className="row">
              <div className="col-md-12">
                <h4 className="mt-2 mb-3">{mode === 'edit' ? 'Modify Address' : 'Add New Address'}</h4>
                {isLoaded ? (
                  <>
                    <AddressSearchComponent
                      onAutocompleteLoad={onAutocompleteLoad}
                      onPlaceChanged={onPlaceChanged}
                    />
                    
                    <div className="form-floating mb-3">
                      <GoogleMapComponent
                        center={markerPos || MAP_CONFIG.DEFAULT_CENTER}
                        zoom={MAP_CONFIG.DEFAULT_ZOOM}
                        markerPosition={markerPos}
                        onMapLoad={onLoadMap}
                        onMapUnmount={onUnmountMap}
                        onMapClick={onMapClick}
                        mapContainerStyle={{
                          width: '100%',
                          height: '250px',
                          border: '1px solid #dee2e6',
                          borderRadius: '0.375rem'
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading maps...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading Google Maps...</p>
                  </div>
                )}
              </div>
            </div>

            <form id="addressForm">
              <input type="hidden" name="_token" defaultValue="0lInRQ80bcnfYas9rGM4c9w9A3fSCIn1g1t9pHJ8" autoComplete="off" />
              <input type="hidden" className="form-control" name="latitude" id="latitude" value={formData.latitude} />
              <input type="hidden" className="form-control" name="longitude" id="longitude" value={formData.longitude} />
              <input type="hidden" className="form-control" name="country" id="country" value={formData.country} />
              
              <div className={`row ${showFullForm ? '' : 'd-none'}`} id="addressDetails">
                <div className="col-md-8">
                  <input type="hidden" className="form-control" name="id" id="address_id" value={formData.id || ""} />
                  <div className="form-floating mb-3">
                    <select 
                      className="form-select" 
                      name="type" 
                      id="address_type" 
                      value={formData.type} 
                      onChange={handleInputChange}
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                    <label htmlFor="address_type">Address</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <input 
                      type="text" 
                      className="form-control" 
                      name="block_no" 
                      placeholder="Unit Number" 
                      id="block_no" 
                      value={formData.block_no || ''} 
                      onChange={handleInputChange} 
                    />
                    <label htmlFor="block_no">Unit Number</label>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating mb-3">
                    <textarea 
                      className="form-control" 
                      name="full_address" 
                      placeholder="Address" 
                      id="address" 
                      value={formData.full_address} 
                      onChange={handleInputChange} 
                    />
                    <label htmlFor="address">Address</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <input 
                      type="text" 
                      className="form-control zip_code_val" 
                      name="zip_code" 
                      placeholder="Zip code" 
                      id="zip_code" 
                      value={formData.zip_code} 
                      onChange={handleInputChange} 
                    />
                    <label htmlFor="zip_code">Zip code</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <input 
                      type="text" 
                      className="form-control" 
                      name="city" 
                      placeholder="City" 
                      id="city" 
                      value={formData.city} 
                      onChange={handleInputChange} 
                    />
                    <label htmlFor="city">City</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <input 
                      type="text" 
                      className="form-control" 
                      name="state" 
                      placeholder="State" 
                      id="state" 
                      value={formData.state} 
                      onChange={handleInputChange} 
                    />
                    <label htmlFor="state">State</label>
                  </div>
                </div>
              </div>
            </form>

            <button 
              type="button" 
              className={`btn btn-primary rounded-pill ${showFullForm ? 'mb-3' : 'd-none mb-3'}`} 
              id="saveAddressBtn" 
              onClick={handleSaveAddress}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : (mode === 'edit' ? 'Update' : 'Save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressEditor;
