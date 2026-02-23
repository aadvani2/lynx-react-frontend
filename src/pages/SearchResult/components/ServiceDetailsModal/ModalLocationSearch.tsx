import { useRef, useState } from "react";
import { useLoadScript } from '@react-google-maps/api';
import Swal from 'sweetalert2';
import { useAuthStore } from "../../../../store/authStore";
import { servicesService } from "../../../../services/generalServices/servicesService";
import { updateSessionData } from "../../../../utils/sessionDataManager";

// Declare google for TS - This should ideally be in a global declaration file
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const google: any;

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

interface ModalLocationSearchProps {
  // isLoaded: boolean; // Managed internally now
  location: string;
  onLocationChange: (value: string) => void;
  onLocationSelect?: (suggestion: LocationSuggestion) => void;
  onZipCodeChange: (zipCode: string) => void;
  onSearchTriggered: (zipCode: string, serviceTierId?: number) => void;
  when: "emergency" | "later" | null;
}

const ModalLocationSearch = ({
  // isLoaded, // Managed internally now
  location,
  onLocationChange,
  onLocationSelect,
  onZipCodeChange,
  onSearchTriggered,
  when,
}: ModalLocationSearchProps) => {
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"]
  });

  const handleLocationChange = async (value: string) => {
    const truncatedValue = value.slice(0, 100);
    onLocationChange(truncatedValue);

    if (!isLoaded || truncatedValue.length < 2) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }

    try {
      const placesLibrary = await google.maps.importLibrary("places");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AutocompleteSuggestion = (placesLibrary as any).AutocompleteSuggestion;

      if (!AutocompleteSuggestion) {
        console.error("AutocompleteSuggestion is not available");
        setLocationSuggestions([]);
        setShowLocationSuggestions(false);
        return;
      }

      const request = {
        input: truncatedValue,
        includedPrimaryTypes: [
          "locality",
          "postal_code",
          "administrative_area_level_1",
          "country",
          "establishment",
        ],
      };

      const response =
        (await AutocompleteSuggestion.fetchAutocompleteSuggestions(
          request,
        )) as AutocompleteSuggestionResponse;

      if (response && response.suggestions && response.suggestions.length > 0) {
        const detailsPromises = response.suggestions.slice(0, 5).map(async (suggestion) => {
          try {
            const placeId = suggestion.placePrediction?.placeId;
            if (!placeId) {
              return {
                description:
                  suggestion.placePrediction?.text?.text ||
                  suggestion.placePrediction?.structuredFormat?.mainText?.text ||
                  "",
                zipCode: "",
                city: "",
                state: "",
                placeId: "",
              };
            }

            const placesService = new google.maps.places.PlacesService(
              document.createElement("div"),
            );

            return new Promise<LocationSuggestion>((resolve) => {
              placesService.getDetails(
                {
                  placeId,
                  fields: ["address_components", "formatted_address"],
                },
                (place: google.maps.places.PlaceResult | null, detailStatus: google.maps.places.PlacesServiceStatus) => {
                  if (
                    detailStatus === google.maps.places.PlacesServiceStatus.OK &&
                    place?.address_components
                  ) {
                    const comps = place.address_components;
                    let zipCode = "",
                      city = "",
                      state = "";

                    comps.forEach((c: google.maps.GeocoderAddressComponent) => {
                      const t = c.types;
                      if (t.includes("postal_code")) zipCode = c.long_name;
                      else if (t.includes("locality")) city = c.long_name;
                      else if (t.includes("administrative_area_level_1"))
                        state = c.short_name;
                    });

                    const displayText =
                      suggestion.placePrediction?.text?.text ||
                      suggestion.placePrediction?.structuredFormat?.mainText?.text ||
                      place.formatted_address ||
                      "";

                    resolve({
                      description: displayText,
                      zipCode: zipCode || "",
                      city: city || "",
                      state: state || "",
                      placeId,
                    });
                  } else {
                    const displayText =
                      suggestion.placePrediction?.text?.text ||
                      suggestion.placePrediction?.structuredFormat?.mainText?.text ||
                      "";
                    resolve({
                      description: displayText,
                      zipCode: "",
                      city: "",
                      state: "",
                      placeId,
                    });
                  }
                },
              );
            });
          } catch (error) {
            console.error("Error fetching place details:", error);
            return {
              description: suggestion.placePrediction?.text?.text || "",
              zipCode: "",
              city: "",
              state: "",
              placeId: suggestion.placePrediction?.placeId || "",
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
      console.error("Error fetching autocomplete suggestions:", error);
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationSelectInternal = async (suggestion: LocationSuggestion) => {
    // If no zip, try to fetch it using placeId, else trigger parent's Swal
    if (!suggestion.zipCode && suggestion.placeId) {
      const placesService = new google.maps.places.PlacesService(
        document.createElement("div"),
      );
      const zipCodePromise = new Promise<string | null>((resolve) => {
        placesService.getDetails(
          {
            placeId: suggestion.placeId,
            fields: ["address_components"],
          },
          (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              place?.address_components
            ) {
              const comps = place.address_components;
              let zipCode = "";
              comps.forEach((c: google.maps.GeocoderAddressComponent) => {
                const t = c.types;
                if (t.includes("postal_code")) zipCode = c.long_name;
              });
              resolve(zipCode || null);
            } else {
              resolve(null);
            }
          },
        );
      });

      const fetchedZipCode = await zipCodePromise;

      if (!fetchedZipCode) {
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
      } else {
        suggestion.zipCode = fetchedZipCode;
      }
    } else if (!suggestion.zipCode) {
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

    // At this point, we have a valid zip
    const inputValue = suggestion.zipCode || suggestion.description;
    onLocationChange(inputValue);
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);

    if (suggestion.zipCode) {
      onZipCodeChange(suggestion.zipCode);

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

      onSearchTriggered(suggestion.zipCode, serviceTierId); // Let parent handle search
    }

    if (onLocationSelect) {
      onLocationSelect(suggestion);
    }
  };

  return (
    <div
      className="search__group"
      style={{ position: "relative", width: "100%" }}
    >
      {/* Label is visually hidden but good for accessibility */}
      <label htmlFor="location" style={{ display: "none" }}>
        Location
      </label>
      <input
        ref={locationInputRef}
        id="location"
        name="location"
        type="text"
        placeholder="Enter zip code or location"
        value={location}
        onChange={(e) => handleLocationChange(e.target.value)}
        onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
        onFocus={() =>
          locationSuggestions.length > 0 && setShowLocationSuggestions(true)
        }
        maxLength={100}
        autoComplete="off"
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ddd", // Consistent with other modal elements
          fontSize: "16px",
          boxSizing: "border-box",
          outline: "none",
          transition: "border-color 0.2s ease-in-out",
        }}
        // Hover and Focus styles
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#b3b3b3"; // A slightly darker border on hover
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#ddd";
        }}

      />

      {showLocationSuggestions && locationSuggestions.length > 0 && (
        <div
          className="search__suggestions"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            background: "#fff",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.08)", // Subtle shadow
            borderRadius: "8px",
            border: "1px solid #e9ecef", // Light border
            marginTop: "4px",
            maxHeight: "260px",
            overflow: "hidden",
            zIndex: 2000,
          }}
        >
          <div
            className="search__suggestions-scroll"
            style={{
              width: "100%",
              overflowY: "auto",
              maxHeight: "260px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {locationSuggestions.map((suggestion, index) => {
              const displayText =
                suggestion.zipCode && suggestion.city && suggestion.state
                  ? `${suggestion.zipCode}, ${suggestion.city}, ${suggestion.state}`
                  : suggestion.description;

              return (
                <div
                  key={index}
                  className="search__suggestion-item"
                  onClick={() => handleLocationSelectInternal(suggestion)}
                  style={{
                    alignSelf: "stretch",
                    lineHeight: "20px",
                    fontWeight: 500,
                    cursor: "pointer",
                    padding: "8px 12px",
                    borderBottom: index < locationSuggestions.length - 1 ? "1px solid #f1f1f1" : "none", // Subtle separator
                    textAlign: "left",
                    color: "#1e4d5a", // Consistent text color
                    fontSize: "14px",
                    fontFamily:
                      "'Bricolage Grotesque', system-ui, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#edfcff"; // Light hover background
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

export default ModalLocationSearch;
