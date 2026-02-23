/**
 * Time conversion utilities for 12-hour and 24-hour format conversion
 */

/**
 * Convert "HH:mm" (24-hour) to "h:mm AM/PM" (12-hour)
 * @param time24h - Time in 24-hour format (e.g., "14:30")
 * @returns Time in 12-hour format (e.g., "2:30 PM")
 */
export const to12h = (time24h: string): string => {
  if (!time24h) return '';
  const [hours, minutes] = time24h.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

/**
 * Convert "h:mm AM/PM" (12-hour) to "HH:mm" (24-hour)
 * @param time12h - Time in 12-hour format (e.g., "2:30 PM")
 * @returns Time in 24-hour format (e.g., "14:30")
 */
export const to24h = (time12h: string): string => {
  if (!time12h) return '';
  const [time, ampm] = time12h.split(' ');
  let hours = Number(time.split(':')[0]);
  const minutes = Number(time.split(':')[1]);

  if (ampm === 'PM' && hours < 12) {
    hours += 12;
  }
  if (ampm === 'AM' && hours === 12) {
    hours = 0;
  }
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

