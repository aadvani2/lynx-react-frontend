import { useCallback } from 'react';
import { useServiceBookingStore } from '../../../../store/serviceBookingStore';
import { useJsApiLoader } from '@react-google-maps/api';
import LocationSearch from '../../home-page/NewHero/Components/LocationSearch';
import { GOOGLE_MAPS_CONFIG } from '../../../../config/maps';
import { servicesService } from '../../../../services/generalServices/servicesService';
import styles from './ServiceModalStep2SelectAddress.module.css'; // Import Step 2 specific styles

interface LocationSuggestion {
    description: string;
    zipCode: string;
    city: string;
    state: string;
    placeId: string;
    latLng?: { lat: number; lng: number };
}

const ServiceModalStep2SelectAddress = () => {
    const {
        location: locationFromStore,
        // Removed zipCode: zipCodeFromStore,
        setLocation,
        setZipCode,
        setLatLng,
        selectedServiceType
    } = useServiceBookingStore();

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_CONFIG.API_KEY,
        libraries: GOOGLE_MAPS_CONFIG.LIBRARIES
    });

    const handleLocationSelect = useCallback(async (suggestion: LocationSuggestion) => {
        setLocation(suggestion.description);
        setZipCode(suggestion.zipCode || null); // Changed null to null

        // Fetch lat/lng if placeId is available
        if (suggestion.placeId && isLoaded) {
            try {
                const placesService = new google.maps.places.PlacesService(document.createElement('div'));
                placesService.getDetails(
                    {
                        placeId: suggestion.placeId,
                        fields: ['geometry']
                    },
                    (place, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
                            setLatLng({
                                lat: place.geometry.location.lat(),
                                lng: place.geometry.location.lng()
                            });
                        } else {
                            console.error('Error fetching place geometry:', status);
                            setLatLng(null);
                        }
                    }
                );
            } catch (error) {
                console.error('Error initializing PlacesService:', error);
                setLatLng(null);
            }
        } else {
            setLatLng(null);
        }
    }, [isLoaded, setLocation, setZipCode, setLatLng]);

    const onZipCodeChange = useCallback((zip: string | null) => { // Changed null to null
        setZipCode(zip);
    }, [setZipCode]);

    const whenPropOrValue = selectedServiceType === 'scheduled' ? 'later' : (selectedServiceType === 'emergency' ? 'emergency' : null); // Changed null to undefined

    return (
        <div className={styles.stepTwoContainer}>
            <div className={styles.stepTwoPanel}>
                <div className={styles.stepTwoHeader}>
                    <h3 className={styles.stepTwoTitle}>Choose Service Location</h3>
                </div>

                <LocationSearch
                    isLoaded={isLoaded}
                    location={locationFromStore}
                    onLocationChange={setLocation}
                    onLocationSelect={handleLocationSelect}
                    onZipCodeChange={onZipCodeChange}
                    when={whenPropOrValue}
                    servicesService={servicesService}
                    inputClassName="border p-5 rounded-3"
                />
            </div>
        </div>
    );
};

export default ServiceModalStep2SelectAddress;
