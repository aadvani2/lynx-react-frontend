/**
 * Timezone Helper Utility for Frontend
 * 
 * Provides consistent timezone calculation for API calls
 * Works properly for all countries including USA (multiple timezones) and India (IST)
 */

/**
 * Get user's timezone offset in hours
 * Returns positive values for timezones ahead of UTC (e.g., +5.5 for IST)
 * Returns negative values for timezones behind UTC (e.g., -5 for EST)
 * 
 * @returns {number} - Timezone offset in hours (e.g., -5 for EST, 5.5 for IST)
 * 
 * @example
 * // For EST (UTC-5): returns -5
 * // For IST (UTC+5:30): returns 5.5
 * // For PST (UTC-8): returns -8
 */
export const getUserTimezoneOffset = (): number => {
  // getTimezoneOffset() returns the offset in minutes
  // It's positive for timezones behind UTC and negative for timezones ahead
  // We need to invert it and convert to hours
  const offsetMinutes = new Date().getTimezoneOffset();
  // Convert to hours and invert (multiply by -1)
  return -offsetMinutes / 60;
};

/**
 * Get timezone offset for a specific timezone name
 * 
 * @param {string} timezoneName - Timezone name (e.g., 'EST', 'PST', 'IST', 'CST')
 * @returns {number} - Timezone offset in hours
 */
export const getTimezoneOffsetByName = (timezoneName: string): number => {
  const timezones: Record<string, number> = {
    // USA Timezones
    'EST': -5,      // Eastern Standard Time (UTC-5)
    'EDT': -4,      // Eastern Daylight Time (UTC-4)
    'CST': -6,      // Central Standard Time (UTC-6)
    'CDT': -5,      // Central Daylight Time (UTC-5)
    'MST': -7,      // Mountain Standard Time (UTC-7)
    'MDT': -6,      // Mountain Daylight Time (UTC-6)
    'PST': -8,      // Pacific Standard Time (UTC-8)
    'PDT': -7,      // Pacific Daylight Time (UTC-7)
    'AKST': -9,     // Alaska Standard Time (UTC-9)
    'AKDT': -8,     // Alaska Daylight Time (UTC-8)
    'HST': -10,     // Hawaii Standard Time (UTC-10)
    
    // India
    'IST': 5.5,     // India Standard Time (UTC+5:30)
    
    // Other common timezones
    'UTC': 0,       // Coordinated Universal Time
    'GMT': 0,       // Greenwich Mean Time
  };
  
  return timezones[timezoneName.toUpperCase()] ?? getUserTimezoneOffset();
};

/**
 * Format datetime for API (ensures UTC format)
 * When sending schedule_time to backend, it should be in a format that backend can parse
 * Backend will convert from user's timezone to UTC
 * 
 * @param {Date|string} dateTime - Date object or ISO string
 * @returns {string} - Formatted datetime string for API
 */
export const formatDateTimeForAPI = (dateTime: Date | string): string => {
  if (!dateTime) return '';
  
  const date = dateTime instanceof Date ? dateTime : new Date(dateTime);
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  // Format as "YYYY-MM-DD HH:mm:ss" or ISO string
  // Backend will handle timezone conversion
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Format datetime with 12-hour format for API
 * Some APIs expect format like "12 Nov 2025 5:30 PM"
 * 
 * @param {Date|string} dateTime - Date object or ISO string
 * @returns {string} - Formatted datetime string
 */
export const formatDateTime12Hour = (dateTime: Date | string): string => {
  if (!dateTime) return '';
  
  const date = dateTime instanceof Date ? dateTime : new Date(dateTime);
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  
  return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
};

/**
 * Parse schedule_time from various formats
 * Handles formats like:
 * - "2025-12-16 14:30:00"
 * - "12 Nov 2025 5:30 PM"
 * - ISO string
 * 
 * @param {string} scheduleTime - Schedule time string
 * @returns {Date|null} - Parsed Date object or null
 */
export const parseScheduleTime = (scheduleTime: string): Date | null => {
  if (!scheduleTime) return null;
  
  // Try parsing as ISO string first
  const isoDate = new Date(scheduleTime);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }
  
  // Try parsing Laravel format: "12 Nov 2025 5:30 PM"
  const laravelFormat = /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+(\d{1,2}):(\d{2})\s+(AM|PM)$/i;
  const match = scheduleTime.match(laravelFormat);
  
  if (match) {
    const day = parseInt(match[1], 10);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames.findIndex(m => m.toLowerCase() === match[2].toLowerCase());
    const year = parseInt(match[3], 10);
    let hour = parseInt(match[4], 10);
    const minute = parseInt(match[5], 10);
    const ampm = match[6].toUpperCase();
    
    // Convert to 24-hour format
    if (ampm === 'PM' && hour !== 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }
    
    return new Date(year, month, day, hour, minute, 0);
  }
  
  return null;
};

