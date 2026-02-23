// GoogleMapsLocationPicker.tsx (only the diffs from your file)
import { useEffect, useRef, useState, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import type { GoogleMapsLocationPickerProps } from "../../types/components";
import { GOOGLE_MAPS_CONFIG } from "../../config/maps";

const GOOGLE_KEY = GOOGLE_MAPS_CONFIG.API_KEY;

export default function GoogleMapsLocationPicker(props: GoogleMapsLocationPickerProps) {
  const { initialLocation = { lat: 32.776664, lng: -96.796988 }, onLocationChange, height = "300px", className = "" } = props;

  const mapRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  const geocodeLocation = useCallback((lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const comps = results[0].address_components ?? [];
        let address = "", city = "", state = "", zip_code = "", country = "";
        comps.forEach((c) => {
          const t = c.types;
          if (t.includes("street_number")) address = c.long_name + " ";
          else if (t.includes("route")) address += c.long_name;
          else if (t.includes("locality")) city = c.long_name;
          else if (t.includes("administrative_area_level_1")) state = c.short_name;
          else if (t.includes("postal_code")) zip_code = c.long_name;
          else if (t.includes("country")) country = c.short_name;
        });
        onLocationChange?.({ address: address.trim(), city, state, zip_code, country, latitude: lat, longitude: lng });
      }
    });
  }, [onLocationChange]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        if (!GOOGLE_KEY) throw new Error("VITE_GOOGLE_MAPS_API_KEY is missing.");

        const loader = new Loader({
          apiKey: GOOGLE_KEY,
          version: GOOGLE_MAPS_CONFIG.VERSION,
          libraries: GOOGLE_MAPS_CONFIG.LIBRARIES,
        });

        await loader.load();

        // Init map
        if (!mapRef.current) throw new Error("Map container not found.");
        const map = new google.maps.Map(mapRef.current, {
          center: initialLocation,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        // Draggable Advanced Marker
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: initialLocation,
          map,
          gmpDraggable: true,
          title: "Drag to adjust location",
        });
        marker.addListener("dragend", () => {
          const p = marker.position;
          if (p) geocodeLocation(Number((p as google.maps.LatLng).lat), Number((p as google.maps.LatLng).lng));
        });

        // Set up Google Places Autocomplete on the input
        if (autocompleteRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(autocompleteRef.current, {
            types: ['address'],
            componentRestrictions: { country: ['US'] }
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry?.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              const pos = { lat, lng };
              
              map.setCenter(pos);
              marker.position = pos;
              
              // Parse address components
              const comps = place.address_components ?? [];
              let address = "", city = "", state = "", zip_code = "", country = "";
              comps.forEach((c) => {
                const t = c.types;
                if (t.includes("street_number")) address = c.long_name + " ";
                else if (t.includes("route")) address += c.long_name;
                else if (t.includes("locality")) city = c.long_name;
                else if (t.includes("administrative_area_level_1")) state = c.short_name;
                else if (t.includes("postal_code")) zip_code = c.long_name;
                else if (t.includes("country")) country = c.short_name;
              });

              onLocationChange?.({ address: address.trim(), city, state, zip_code, country, latitude: lat, longitude: lng });
            }
          });
        }

        setIsLoading(false);
        // Initial reverse geocode
        geocodeLocation(initialLocation.lat, initialLocation.lng);
      } catch (e: Error | unknown) {
        console.error(e);
        setError((e as Error)?.message ?? "Failed to initialize Google Maps");
        setIsLoading(false);
      }
    })();
  }, [initialLocation, geocodeLocation]);

  return (
    <div className={`google-maps-location-picker ${className}`}>
      {/* Search input with form-floating pattern and Google Places Autocomplete */}
      <div className="form-floating mb-2 mb-md-4">
        <input 
          ref={autocompleteRef}
          type="text" 
          className="form-control pac-target-input" 
          name="businessAddress" 
          placeholder="Search Business Address" 
          id="businessAddressSearch" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoComplete="off" 
        />
        <label htmlFor="businessAddressSearch">Search Business Address</label>
      </div>

      {/* Map */}
      <div className="position-relative">
        <div
          ref={mapRef}
          style={{ width: "100%", height, border: "1px solid #ddd", borderRadius: "8px", background: "#f8f9fa" }}
        />
        {isLoading && <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light bg-opacity-75" style={{ borderRadius: 8 }}>Loading…</div>}
        {error && <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light bg-opacity-90 text-danger" style={{ borderRadius: 8 }}>{error}</div>}
      </div>
      {!isLoading && !error && <small className="text-muted d-block mt-2">Search an address above or drag the marker.</small>}
    </div>
  );
}
