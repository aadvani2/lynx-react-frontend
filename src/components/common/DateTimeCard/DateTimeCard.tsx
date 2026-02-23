import type { FunctionComponent } from 'react';
import styles from './DateTimeCard.module.css';
import ClockIcon from '../../../assets/Icon/clock.svg';
import CalendarIcon from '../../../assets/Icon/calendar.svg';
// import EditIcon from '../../../assets/Icon/edit2.svg';

export interface DateTimeCardProps {
  date?: Date;
  scheduleDate?: string;
  isEmergency?: boolean;
  showEditSchedule?: boolean;
  onEditSchedule?: () => void;
  hideDateTimeHeader?: boolean;
}

const DateTimeCard: FunctionComponent<DateTimeCardProps> = ({
  date,
  scheduleDate,
  isEmergency = false,
  // showEditSchedule = true,
  // onEditSchedule,
  hideDateTimeHeader = false,
}) => {

  // Better date parsing with error handling
  let displayDate: Date;
  try {
    if (scheduleDate) {
      // Handle different date formats
      if (typeof scheduleDate === 'string') {
        // Try to parse "YYYY-MM-DD HH:MM" format
        const dateStr = scheduleDate.replace(' ', 'T') + ':00';
        displayDate = new Date(dateStr);

        // If that didn't work, try direct parsing
        if (isNaN(displayDate.getTime())) {
          displayDate = new Date(scheduleDate);
        }
      } else {
        displayDate = new Date(scheduleDate);
      }
    } else if (date) {
      displayDate = new Date(date);
    } else {
      displayDate = new Date();
    }

    // Fallback if date is still invalid
    if (isNaN(displayDate.getTime())) {
      console.warn("🕐 Invalid date provided, using current date");
      displayDate = new Date();
    }
  } catch (error) {
    console.error("🕐 Error parsing date:", error);
    displayDate = new Date();
  }


  const formatDate = () =>
    displayDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  const formatTime = () =>
    displayDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <div className={styles.card}>
      <div className={styles.dateHeader}>
        {!hideDateTimeHeader && <div className={styles.dateTitle}>Date & Time</div>}
        {/* {showEditSchedule && (
          <button className={styles.editButton} onClick={onEditSchedule}>
            <img src={EditIcon} alt="Edit" width={14} height={14} />
            Edit Schedule
          </button>
        )} */}
      </div>

      <div
        className={styles.emergencyTitle}
      >
        {isEmergency ? "Emergency Service" : "Scheduled Service"}
      </div>

      <div className={styles.dateInfo}>
        <span className={styles.metaItem}>
          <img src={CalendarIcon} alt="" width={16} height={16} />
          {formatDate()}
        </span>
        <span className={styles.metaItem}>
          <img src={ClockIcon} alt="" width={16} height={16} />
          {formatTime()}
        </span>
      </div>
    </div>
  );
};

export default DateTimeCard;
