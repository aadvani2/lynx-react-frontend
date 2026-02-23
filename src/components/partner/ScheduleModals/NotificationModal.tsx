import React, { useState, useEffect, useCallback } from 'react';
import { partnerService } from '../../../services/partnerService/partnerService';
import { to12h, to24h } from '../../../utils/timeUtils';
import DayScheduleRow from './Components/DayScheduleRow';
import styles from './ScheduleModal.module.css';
import Swal from 'sweetalert2';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTierId: number;
  serviceTierTitle: string;
  isClosing?: boolean;
}

interface DaySchedule {
  dayId: number;
  dayName: string;
  isEnabled: boolean;
  startTime: string;
  endTime: string;
}

interface ApiResponse {
  provider_schedules: {
    [key: string]: {
      day_id: number;
      start_time: string;
      end_time: string;
      is_on: 1 | 0;
      // ... other fields
    };
  };
  days: {
    [key: string]: string;
  };
  service_tier_id: string;
  service_tier_title: string;
}

/**
 * Transform API response to DaySchedule array
 */
const apiToState = (apiResponse: ApiResponse): DaySchedule[] => {
  const defaultSchedule: DaySchedule[] = Array.from({ length: 7 }, (_, i) => ({
    dayId: i + 1,
    dayName: '', // Will be filled by API response
    isEnabled: false,
    startTime: to12h('00:00'),
    endTime: to12h('23:59'),
  }));

  if (!apiResponse || !apiResponse.provider_schedules || !apiResponse.days) {
    return defaultSchedule;
  }

  const scheduleMap = new Map<number, DaySchedule>();

  // Populate with default values and day names
  Object.keys(apiResponse.days).forEach(dayKey => {
    const dayId = Number(dayKey);
    scheduleMap.set(dayId, {
      dayId,
      dayName: apiResponse.days[dayKey],
      isEnabled: false,
      startTime: to12h('00:00'),
      endTime: to12h('23:59'),
    });
  });

  // Override with API provider schedules
  Object.keys(apiResponse.provider_schedules).forEach(dayKey => {
    const dayId = Number(dayKey);
    const apiDaySchedule = apiResponse.provider_schedules[dayKey];
    const existingDay = scheduleMap.get(dayId);

    if (existingDay) {
      scheduleMap.set(dayId, {
        ...existingDay,
        isEnabled: Boolean(apiDaySchedule.is_on),
        startTime: to12h(apiDaySchedule.start_time),
        endTime: to12h(apiDaySchedule.end_time),
      });
    }
  });

  // Convert map to array and sort by dayId
  return Array.from(scheduleMap.values()).sort((a, b) => a.dayId - b.dayId);
};

interface SchedulePayload {
  service_tier_id: string;
  start_time: Record<string, string>;
  end_time: Record<string, string>;
  days: Record<string, string>;
  [key: string]: unknown;
}

/**
 * Transform DaySchedule array to API payload
 */
const stateToPayload = (scheduleData: DaySchedule[], serviceTierId: number): SchedulePayload => {
  const start_time: Record<string, string> = {};
  const end_time: Record<string, string> = {};
  const days: Record<string, string> = {};

  scheduleData.forEach((day) => {
    start_time[String(day.dayId)] = to24h(day.startTime);
    end_time[String(day.dayId)] = to24h(day.endTime);
    if (day.isEnabled) {
      days[String(day.dayId)] = "on";
    }
  });

  return {
    service_tier_id: String(serviceTierId),
    start_time,
    end_time,
    days,
  };
};

const NotificationModal: React.FC<NotificationModalProps> = ({ 
  isOpen, 
  onClose, 
  serviceTierId, 
  serviceTierTitle,
  isClosing = false
}) => {
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>([
    { dayId: 1, dayName: 'Monday', isEnabled: true, startTime: to12h('00:00'), endTime: to12h('23:59') },
    { dayId: 2, dayName: 'Tuesday', isEnabled: true, startTime: to12h('00:00'), endTime: to12h('23:59') },
    { dayId: 3, dayName: 'Wednesday', isEnabled: true, startTime: to12h('00:00'), endTime: to12h('23:59') },
    { dayId: 4, dayName: 'Thursday', isEnabled: true, startTime: to12h('00:00'), endTime: to12h('23:59') },
    { dayId: 5, dayName: 'Friday', isEnabled: true, startTime: to12h('00:00'), endTime: to12h('23:59') },
    { dayId: 6, dayName: 'Saturday', isEnabled: true, startTime: to12h('00:00'), endTime: to12h('23:59') },
    { dayId: 7, dayName: 'Sunday', isEnabled: true, startTime: to12h('00:00'), endTime: to12h('23:59') }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch service tier notification schedule when modal opens
  useEffect(() => {
    if (isOpen && serviceTierId) {
      const fetchNotifyScheduleData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await partnerService.getServiceTierNotifySchedule({
            service_tier_id: String(serviceTierId),
            service_tier_title: serviceTierTitle
          });
          
          if (response?.success && response.data) {
            
            // If API returns schedule data, use it; otherwise keep default schedule
            if (response.data.provider_schedules && Object.keys(response.data.provider_schedules).length > 0) {
              setScheduleData(apiToState(response.data as ApiResponse));
            } else {
              // API returned empty schedule, keep the default 7-day schedule
              console.log('No existing notification schedule found, using default schedule');
              // Reinitialize with default 12h times if necessary
              setScheduleData(prev => prev.map(day => ({ 
                ...day, 
                startTime: to12h('00:00'), 
                endTime: to12h('23:59'),
                isEnabled: false // Default to disabled if no schedule is found
              })));
            }
          }
        } catch (err) {
          console.error('Error fetching service tier notification schedule:', err);
          setError('Failed to load notification schedule data');
        } finally {
          setLoading(false);
        }
      };
      
      fetchNotifyScheduleData();
    }
  }, [isOpen, serviceTierId, serviceTierTitle]);

  const handleDayToggle = useCallback((dayId: number, isEnabled: boolean) => {
    setScheduleData((prev) =>
      prev.map((day) => (day.dayId === dayId ? { ...day, isEnabled } : day))
    );
  }, []);

  const handleTimeChange = useCallback((dayId: number, field: 'startTime' | 'endTime', value: string) => {
    setScheduleData((prev) =>
      prev.map((day) => (day.dayId === dayId ? { ...day, [field]: value } : day))
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      const payload = stateToPayload(scheduleData, serviceTierId);

      const response = await partnerService.updateServiceTierNotifySchedule(payload);

      if (response?.success) {
        // Show success message
        await Swal.fire({
          title: 'Success!',
          text: response?.message || 'Notification schedule updated successfully',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        onClose();
      } else {
        // Show error message for failed API response
        await Swal.fire({
          title: 'Error',
          text: response?.message || 'Failed to save notification schedule',
          icon: 'error',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        setError(response?.message || 'Failed to save notification schedule');
      }
    } catch (err) {
      console.error('Error saving notification schedule:', err);
      setError('Failed to save notification schedule');
      
      // Show error message
      await Swal.fire({
        title: 'Error',
        text: 'Failed to save notification schedule. Please try again.',
        icon: 'error',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    } finally {
      setSaving(false);
    }
  };


  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className={`modal-backdrop fade show ${styles.backdrop} ${isClosing ? 'closing' : ''}`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        className={`modal fade show ${styles.modalContainer} ${isClosing ? 'closing' : ''}`}
        tabIndex={-1}
        aria-labelledby="manageNotificationModel"
        aria-modal="true"
        role="dialog"
      >
      <div className={`modal-dialog modal-dialog-centered modal-lg ${isClosing ? 'closing' : ''}`}>
        <div className={`modal-content position-relative ${styles.modalContent}`}>
          <div className={`modal-header position-relative z-2 d-flex justify-content-end align-items-center ${styles.modalHeader}`}>
            <button
              type="button"
              className={`btn-close ${styles.closeButton}`}
              onClick={onClose}
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <div>
              <h4>Manage Notification Schedule [{serviceTierTitle}]</h4>
              <p className="mb-1">
                Use this schedule to define the time periods during which you'll receive notifications for new service requests in your area.
              </p>
              <div className="card bg-soft-gray p-2">
                <b>Note:</b> Please select the days you are available and set the start and end times for each day.
              </div>
              
              {/* Loading State */}
              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading notification schedule...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading notification schedule...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  <i className="uil uil-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
              
              {!loading && (
                <form className="p-3" onSubmit={handleSubmit}>
                  {scheduleData.map((day) => (
                    <DayScheduleRow
                      key={day.dayId}
                      day={day}
                      onDayToggle={handleDayToggle}
                      onTimeChange={handleTimeChange}
                    />
                  ))}

                  <div className="text-center">
                    <button type="submit" className="btn btn-primary rounded-pill" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default NotificationModal; 