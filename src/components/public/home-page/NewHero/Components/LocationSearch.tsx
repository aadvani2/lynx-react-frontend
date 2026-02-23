import { useRef, useState } from "react";
import { useAuthStore } from "../../../../../store/authStore";
import { servicesService } from "../../../../../services/generalServices/servicesService";
import { updateSessionData } from "../../../../../utils/sessionDataManager";
import { swalFire } from "../../../../../lib/swalLazy";

interface LocationSuggestion {
  description: string;
  zipCode: string;
  city: string;
  state: string;
  placeId: string;
}

interface AutocompleteSuggestionResponse {
  suggestions: Array<{
    placePrediction?: {
      placeId?: string;
      text?: {
        text?: string;
      };
      structuredFormat?: {
        mainText?: {
          text?: string;
        };
      };
    };
  }>;
}

interface LocationSearchProps {
  isLoaded: boolean;
  location: string;
  onLocationChange: (value: string) => void;
  onLocationSelect: (suggestion: LocationSuggestion) => void;
  onZipCodeChange: (zipCode: string) => void;
  when: "emergency" | "later" | null;
  servicesService: typeof servicesService;
  inputClassName?: string;
}

const LocationSearch = ({
  isLoaded,
  location,
  onLocationChange,
  onLocationSelect,
  onZipCodeChange,
  when,
  servicesService,
  inputClassName
}: LocationSearchProps) => {
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const handleLocationChange = async (value: string) => {
    const truncatedValue = value.slice(0, 100);
    onLocationChange(truncatedValue);

    if (!isLoaded || truncatedValue.length < 2) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }

    try {
      // Use new AutocompleteSuggestion API (replaces deprecated AutocompleteService)
      const placesLibrary = await google.maps.importLibrary('places');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AutocompleteSuggestion = (placesLibrary as any).AutocompleteSuggestion;

      if (!AutocompleteSuggestion) {
        console.error('AutocompleteSuggestion is not available');
        setLocationSuggestions([]);
        setShowLocationSuggestions(false);
        return;
      }

      const request = {
        input: truncatedValue,
        // Removed includedRegionCodes to allow worldwide search
        includedPrimaryTypes: ['locality', 'postal_code', 'administrative_area_level_1', 'country', 'establishment']
      };

      const response = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request) as AutocompleteSuggestionResponse;

      if (response && response.suggestions && response.suggestions.length > 0) {
        const detailsPromises = response.suggestions.slice(0, 5).map(async (suggestion) => {
          try {
            // Fetch place details using the new Places API
            const placeId = suggestion.placePrediction?.placeId;
            if (!placeId) {
              return {
                description: suggestion.placePrediction?.text?.text || suggestion.placePrediction?.structuredFormat?.mainText?.text || '',
                zipCode: '',
                city: '',
                state: '',
                placeId: ''
              };
            }

            // Use Places API (New) to get place details
            const placesService = new google.maps.places.PlacesService(document.createElement('div'));

            return new Promise<LocationSuggestion>((resolve) => {
              placesService.getDetails(
                {
                  placeId: placeId,
                  fields: ['address_components', 'formatted_address']
                },
                (place, detailStatus) => {
                  if (detailStatus === google.maps.places.PlacesServiceStatus.OK && place?.address_components) {
                    const comps = place.address_components;
                    let zipCode = '', city = '', state = '';

                    comps.forEach((c) => {
                      const t = c.types;
                      if (t.includes('postal_code')) zipCode = c.long_name;
                      else if (t.includes('locality')) city = c.long_name;
                      else if (t.includes('administrative_area_level_1')) state = c.short_name;
                    });

                    const displayText = suggestion.placePrediction?.text?.text ||
                      suggestion.placePrediction?.structuredFormat?.mainText?.text ||
                      place.formatted_address || '';

                    resolve({
                      description: displayText,
                      zipCode: zipCode || '',
                      city: city || '',
                      state: state || '',
                      placeId: placeId
                    });
                  } else {
                    const displayText = suggestion.placePrediction?.text?.text ||
                      suggestion.placePrediction?.structuredFormat?.mainText?.text || '';
                    resolve({
                      description: displayText,
                      zipCode: '',
                      city: '',
                      state: '',
                      placeId: placeId
                    });
                  }
                }
              );
            });
          } catch (error) {
            console.error('Error fetching place details:', error);
            return {
              description: suggestion.placePrediction?.text?.text || '',
              zipCode: '',
              city: '',
              state: '',
              placeId: suggestion.placePrediction?.placeId || ''
            };
          }
        });

        const results = await Promise.all(detailsPromises);
        setLocationSuggestions(results);
        setShowLocationSuggestions(results.length > 0);
      } else {
        setLocationSuggestions([]);
        setShowLocationSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationSelectInternal = async (suggestion: LocationSuggestion) => {
    // Check if zip code exists, if not show warning modal
    if (!suggestion.zipCode && suggestion.placeId) {
      // Try to fetch zip code from place details first
      const placesService = new google.maps.places.PlacesService(document.createElement('div'));
      const zipCodePromise = new Promise<string | null>((resolve) => {
        placesService.getDetails(
          {
            placeId: suggestion.placeId,
            fields: ['address_components']
          },
          (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place?.address_components) {
              const comps = place.address_components;
              let zipCode = '';
              comps.forEach((c) => {
                const t = c.types;
                if (t.includes('postal_code')) zipCode = c.long_name;
              });
              resolve(zipCode || null);
            } else {
              resolve(null);
            }
          }
        );
      });

      const fetchedZipCode = await zipCodePromise;

      if (!fetchedZipCode) {
        // Show Swal modal warning about zip code requirement
        await swalFire({
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
        return; // Don't proceed with selection
      } else {
        // Update suggestion with fetched zip code
        suggestion.zipCode = fetchedZipCode;
      }
    } else if (!suggestion.zipCode) {
      // No zip code and no placeId to fetch from
      await swalFire({
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
      return; // Don't proceed with selection
    }

    // Only store zip code in the input field
    const inputValue = suggestion.zipCode || suggestion.description;
    onLocationChange(inputValue);
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);

    if (suggestion.zipCode) {
      onZipCodeChange(suggestion.zipCode);

      // Store and send zip code and service_tier_id
      // service_tier_id: 1 for emergency, 3 for schedule later
      const serviceTierId = when === "emergency" ? 1 : 3;
      const sessionPayload = {
        zipcode: suggestion.zipCode,
        service_tier_id: serviceTierId
      } as Parameters<typeof servicesService.storeSessionData>[0];

      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      if (!isAuthenticated) {
        // Pre-login flow: Save to localStorage only (no API call)
        updateSessionData(sessionPayload);
      } else {
        // Post-login flow: Call API
        servicesService.storeSessionData(sessionPayload).catch((error: unknown) => {
          console.error('Error storing session data:', error);
        });
      }
    }
    // Note: Zip code validation is already handled at the beginning of this function
    // If we reach here, the suggestion has a valid zip code

    onLocationSelect(suggestion);
  };

  return (
    <div className="search__group" style={{ position: "relative" }}>
      <label htmlFor="location" className="search__label">Location</label>
      <input
        ref={locationInputRef}
        id="location"
        name="location"
        type="text"
        placeholder="Zip code"
        className={`search__input ${inputClassName || ""}`}
        value={location}
        onChange={(e) => handleLocationChange(e.target.value)}
        onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
        onFocus={() => locationSuggestions.length > 0 && setShowLocationSuggestions(true)}
        maxLength={100}
        autoComplete="off"
      />

      {/* Location Suggestions Dropdown */}
      {showLocationSuggestions && locationSuggestions.length > 0 && (
        <div
          className="location-search__suggestions"
          style={{
            width: "150%",
            minWidth: "300px",
            maxWidth: "500px",
            left: "50%",
            transform: "translateX(-50%)"
          }}
        >
          <div
            className="location-search__suggestions-scroll"
          >
            {locationSuggestions.map((suggestion, index) => {
              const displayText = suggestion.zipCode && suggestion.city && suggestion.state
                ? `${suggestion.zipCode}, ${suggestion.city}, ${suggestion.state}`
                : suggestion.description;

              return (
                <div
                  key={index}
                  className="search__suggestion-item"
                  onClick={() => handleLocationSelectInternal(suggestion)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#edfcff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {displayText}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;

