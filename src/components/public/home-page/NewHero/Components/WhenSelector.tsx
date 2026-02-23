import { useState, useEffect, lazy, Suspense } from "react";
import { servicesService } from "../../../../../services/generalServices/servicesService";
import { useAuthStore } from "../../../../../store/authStore";
import { updateSessionData } from "../../../../../utils/sessionDataManager";

const DateTimePicker = lazy(() => import("./DateTimePicker/DateTimePicker"));

interface WhenSelectorProps {
  when: "emergency" | "later" | null;
  onWhenChange: (value: "emergency" | "later") => void;
  onDateChange: (date: string) => void;
  onServiceDataUpdate: (updater: (prev: any) => any) => void;
  selectedDate?: string;
}

const WhenSelector = ({
  when,
  onWhenChange,
  onDateChange,
  onServiceDataUpdate,
  selectedDate: externalSelectedDate = ""
}: WhenSelectorProps) => {
  const [selectedDate, setSelectedDate] = useState(externalSelectedDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Sync with external selectedDate if it changes
  useEffect(() => {
    if (externalSelectedDate !== selectedDate) {
      setSelectedDate(externalSelectedDate);
    }
  }, [externalSelectedDate]);

  const handleWhenChange = async (value: "emergency" | "later") => {
    onWhenChange(value);
    if (value === "later") {
      // If switching from "emergency" to "later", open the picker
      setShowDatePicker(true);
    } else {
      setSelectedDate("");
      onDateChange("");
      setShowDatePicker(false); // Close picker if switching to emergency
    }

    onServiceDataUpdate((previous: any) => {
      if (!previous) return previous;

      return {
        ...previous,
        serviceTier: value === "emergency" ? "1" : "3",
        date: value === "emergency" ? "Now" : selectedDate
      };
    });

    // Call store_session_data API with service_tier_id
    // service_tier_id: 1 for emergency, 3 for schedule later
    const serviceTierId = value === "emergency" ? 1 : 3;
    const sessionPayload = {
      service_tier_id: serviceTierId,
      ...(value === "emergency" && { schedule_time: "Now" })
    } as Parameters<typeof servicesService.storeSessionData>[0];

    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      // Pre-login flow: Save to localStorage only (no API call)
      updateSessionData(sessionPayload);
    } else {
      // Post-login flow: Call API
      try {
        await servicesService.storeSessionData(sessionPayload);
      } catch (error) {
        console.error("Error storing session data:", error);
      }
    }
  };

  const handleDateTimeConfirm = (dateTime: string) => {
    setSelectedDate(dateTime);
    onDateChange(dateTime);
    setShowDatePicker(false); // Close picker after confirmation
    onServiceDataUpdate((previous: any) => {
      if (!previous) return previous;

      return {
        ...previous,
        date: dateTime
      };
    });
  };


  return (
    <div className="search__group search__group--when" style={{ position: "relative" }}>
      <span className="search__label">When</span>
      <div className="when">
        <label className="when__option">
          <input
            type="radio"
            name="when"
            value="emergency"
            checked={when === "emergency"}
            onChange={() => handleWhenChange("emergency")}
            className="when__radio"
          />
          <span className="when__ellipse" aria-hidden="true">
            {/* Checkmark icon for selected */}
            <svg className="when__check" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" fill="#1E4D5A" />
              <path d="M8 12.5l2.5 2.5 5.5-6" stroke="#F7EF6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Ellipse icon for not selected */}
            <svg className="when__ellipse-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#1E4D5A" strokeWidth="2" fill="none" />
            </svg>
          </span>
          <span className="when__text">Emergency (2–4 hours)</span>
        </label>

        <label
          className="when__option"
          onClick={(e) => {
            // If "Schedule later" is already selected, clicking anywhere on the label toggles the picker
            if (when === "later") {
              // Check if clicking on the radio button itself
              const target = e.target as HTMLElement;
              const isRadioButton = (target instanceof HTMLInputElement && target.type === 'radio') || target.closest('input[type="radio"]');
              if (!isRadioButton) {
                e.preventDefault();
                setShowDatePicker(!showDatePicker);
              }
            }
          }}
        >
          <input
            type="radio"
            name="when"
            value="later"
            checked={when === "later"}
            onChange={() => handleWhenChange("later")}
            className="when__radio"
          />
          <span className="when__ellipse" aria-hidden="true">
            {/* Checkmark icon for selected */}
            <svg className="when__check" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" fill="#1E4D5A" />
              <path d="M8 12.5l2.5 2.5 5.5-6" stroke="#F7EF6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Ellipse icon for not selected */}
            <svg className="when__ellipse-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#1E4D5A" strokeWidth="2" fill="none" />
            </svg>
          </span>
          <span className="when__text" style={{ cursor: when === "later" ? "pointer" : "default" }}>Standard</span>
        </label>
      </div>

      {/* Date Time Picker Dropdown */}
      {showDatePicker && when === "later" && (
        <Suspense fallback={null}>
          <DateTimePicker
            isOpen={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            onConfirm={handleDateTimeConfirm}
          />
        </Suspense>
      )}
    </div>
  );
};

export default WhenSelector;

