import { useState } from "react";
import "./DateTimePicker.css";
import { servicesService } from "../../../../../../services/generalServices/servicesService";
import { useAuthStore } from "../../../../../../store/authStore";
import { updateSessionData } from "../../../../../../utils/sessionDataManager";
import DatePicker from "../DatePicker/DatePicker";
import ScrollableTimeDisplay from "../ScrollableTimeDisplay/ScrollableTimeDisplay";
import PeriodWheel from "../PeriodWheel/PeriodWheel";

interface DateTimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dateTime: string) => void;
}

export default function DateTimePicker({ isOpen, onClose, onConfirm }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hours, setHours] = useState(3);
  const [minutes, setMinutes] = useState(15);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  if (!isOpen) return null;

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleConfirm = async () => {
    if (!selectedDate) return;

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");

    // Format time in 12-hour format with AM/PM
    const hourStr = String(hours).padStart(2, "0");
    const minuteStr = String(minutes).padStart(2, "0");
    const scheduleTime = `${year}-${month}-${day} ${hourStr}:${minuteStr} ${period}`;

    // Format for onConfirm callback (keep existing format for backward compatibility)
    let hour24 = hours;
    if (period === "PM" && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === "AM" && hours === 12) {
      hour24 = 0;
    }
    const hour24Str = String(hour24).padStart(2, "0");
    const dateTimeString = `${year}-${month}-${day} ${hour24Str}:${minuteStr}`;

    onConfirm(dateTimeString);

    // Call store_session_data API with schedule_time
    // Use 24-hour format (dateTimeString) instead of 12-hour format (scheduleTime)
    const sessionPayload = {
      schedule_time: dateTimeString
    } as Parameters<typeof servicesService.storeSessionData>[0];

    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      // Pre-login flow: Save to localStorage only (no API call)
      updateSessionData({ schedule_time: scheduleTime });
    } else {
      // Post-login flow: Call API
      try {
        await servicesService.storeSessionData(sessionPayload);
      } catch (error) {
        console.error("Error storing session data:", error);
      }
    }

    onClose();
  };


  return (
    <>
      <div className="datetime-picker-overlay" onClick={onClose} />
      <div className="datetime-picker-modal" onClick={(e) => e.stopPropagation()}>
        {/* Date Selection */}
        <DatePicker
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />

        {/* Time Selection */}
        <div className="datetime-picker-section datetime-picker-time-section">
          <b className="datetime-picker-title">Select Time</b>
          <div className="datetime-picker-time-container">
            <div className="datetime-picker-time-wrapper">
              {/* Hours with scrollable display */}
              <div className="datetime-picker-time-group-bg">
                <button
                  type="button"
                  className="datetime-picker-time-btn-circle"
                  onClick={() => setHours(hours === 1 ? 12 : hours - 1)}
                >
                  <b className="datetime-picker-time-btn-text">-</b>
                </button>
                <ScrollableTimeDisplay
                  values={Array.from({ length: 12 }, (_, i) => i + 1)}
                  selectedValue={hours}
                  onValueChange={setHours}
                  formatValue={(val) => String(val).padStart(2, "0")}
                />
                <button
                  type="button"
                  className="datetime-picker-time-btn-circle"
                  onClick={() => setHours(hours === 12 ? 1 : hours + 1)}
                >
                  <b className="datetime-picker-time-btn-text">+</b>
                </button>
              </div>

              <div className="datetime-picker-time-separator">:</div>

              {/* Minutes with scrollable display */}
              <div className="datetime-picker-time-group-bg">
                <button
                  type="button"
                  className="datetime-picker-time-btn-circle"
                  onClick={() => setMinutes(minutes === 0 ? 45 : minutes - 15)}
                >
                  <b className="datetime-picker-time-btn-text">-</b>
                </button>
                <ScrollableTimeDisplay
                  values={Array.from({ length: 4 }, (_, i) => i * 15)}
                  selectedValue={minutes}
                  onValueChange={setMinutes}
                  formatValue={(val) => String(val).padStart(2, "0")}
                />
                <button
                  type="button"
                  className="datetime-picker-time-btn-circle"
                  onClick={() => setMinutes((minutes + 15) % 60)}
                >
                  <b className="datetime-picker-time-btn-text">+</b>
                </button>
              </div>
            </div>

            {/* AM/PM Wheel Picker */}
            <PeriodWheel
              selectedValue={period}
              onValueChange={setPeriod}
            />
          </div>
        </div>

        {/* Confirm Button */}
        <div className="datetime-picker-confirm-wrapper">
          <button
            type="button"
            className="datetime-picker-confirm-btn"
            onClick={handleConfirm}
            disabled={!selectedDate}
          >
            <b className="datetime-picker-confirm-text">Confirm</b>
          </button>
        </div>
      </div>
    </>
  );
}

