import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

interface TimePickerInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  defaultHour?: number;
  defaultMinute?: number;
}

/**
 * TimePickerInput component that wraps Flatpickr for time selection
 * Uses refs to maintain Flatpickr instance and prevent re-initialization on value changes
 */
const TimePickerInput: React.FC<TimePickerInputProps> = ({
  id,
  value,
  onChange,
  disabled = false,
  placeholder = 'Select time',
  defaultHour = 0,
  defaultMinute = 0,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const flatpickrInstanceRef = useRef<flatpickr.Instance | null>(null);

  // Initialize Flatpickr once when component mounts
  useEffect(() => {
    if (!inputRef.current || flatpickrInstanceRef.current) return;

    const picker = flatpickr(inputRef.current, {
      enableTime: true,
      noCalendar: true,
      dateFormat: 'h:i K', // 12-hour format with AM/PM
      time_24hr: false,
      defaultHour,
      defaultMinute,
      defaultDate: value || undefined,
      // Disable mobile fallback to native time input - always use Flatpickr UI
      // This ensures consistent time picker experience across all screen sizes
      disableMobile: true,
      // Append calendar to document.body to avoid positioning issues inside modals
      // This prevents the calendar from being affected by modal transforms, overflow, or scrolling
      appendTo: document.body,
      // Manually position the calendar correctly when it opens
      // This ensures accurate positioning on small screens and when modal is scrolled
      // Since calendar uses position: fixed, we position relative to viewport (getBoundingClientRect)
      onOpen: (_selectedDates, _dateStr, instance) => {
        if (!inputRef.current || !instance.calendarContainer) return;
        
        const calendar = instance.calendarContainer;
        
        // Wait for next frame to ensure calendar is rendered and we can get its dimensions
        requestAnimationFrame(() => {
          if (!inputRef.current || !calendar) return;
          
          // Get fresh input position in case of scroll
          const currentInputRect = inputRef.current.getBoundingClientRect();
          const calendarWidth = calendar.offsetWidth || 200;
          const calendarHeight = calendar.offsetHeight || 150;
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          
          // Default: position directly below input with 5px gap
          let top = currentInputRect.bottom + 5;
          let left = currentInputRect.left;
          
          // Adjust if calendar would overflow right edge
          if (left + calendarWidth > viewportWidth) {
            // Align to right edge of input instead
            left = currentInputRect.right - calendarWidth;
            // Ensure minimum margin from viewport edge
            if (left < 10) left = 10;
          }
          
          // Adjust if calendar would overflow bottom edge
          if (top + calendarHeight > viewportHeight) {
            // Position above input instead
            top = currentInputRect.top - calendarHeight - 5;
            // Ensure minimum margin from viewport top
            if (top < 10) top = 10;
          }
          
          // Apply calculated position (fixed positioning is relative to viewport)
          calendar.style.top = `${top}px`;
          calendar.style.left = `${left}px`;
          calendar.style.right = 'auto';
        });
      },
      onChange: (_,dateStr) => {
        // Call onChange when user selects a time
        onChange(dateStr);
      },
    });

    flatpickrInstanceRef.current = picker;

    // Cleanup on unmount
    return () => {
      if (flatpickrInstanceRef.current) {
        flatpickrInstanceRef.current.destroy();
        flatpickrInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array - only initialize once

  // Update Flatpickr value when prop changes externally (but don't re-initialize)
  useEffect(() => {
    if (flatpickrInstanceRef.current && value) {
      // Only update if the value is different to avoid unnecessary updates
      const currentValue = flatpickrInstanceRef.current.input.value.trim();
      const newValue = value.trim();
      if (currentValue !== newValue) {
        try {
          // Use setDate with false to prevent triggering onChange callback
          // This prevents infinite loops when the value is updated from parent
          flatpickrInstanceRef.current.setDate(value, false);
        } catch (error) {
          // Silently handle invalid date strings
          console.warn('Failed to set Flatpickr date:', error);
        }
      }
    }
  }, [value]);

  // Update disabled state
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.disabled = disabled;
    }
  }, [disabled]);

  return (
    <input
      ref={inputRef}
      type="text"
      id={id}
      className="form-control timepicker-schedule flatpickr-input"
      placeholder={placeholder}
      value={value}
      readOnly
      disabled={disabled}
    />
  );
};

export default TimePickerInput;

