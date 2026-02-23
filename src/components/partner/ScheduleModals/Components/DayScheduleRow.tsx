import React from 'react';
import TimePickerInput from '../../../common/TimePickerInput';
import styles from '../ScheduleModal.module.css';

interface DaySchedule {
  dayId: number;
  dayName: string;
  isEnabled: boolean;
  startTime: string;
  endTime: string;
}

interface DayScheduleRowProps {
  day: DaySchedule;
  onDayToggle: (dayId: number, isEnabled: boolean) => void;
  onTimeChange: (dayId: number, field: 'startTime' | 'endTime', value: string) => void;
}

/**
 * DayScheduleRow component for rendering a single day's schedule row
 * Memoized to prevent unnecessary re-renders when other days change
 */
const DayScheduleRow: React.FC<DayScheduleRowProps> = React.memo(({
  day,
  onDayToggle,
  onTimeChange,
}) => {
  return (
    <div className={`border gx-2 gx-md-6 mb-3 p-1 rounded row row-gap-2 ${styles.scheduleBox}`}>
      <div className="align-items-center col-md-4 d-flex">
        <div className="form-check m-0">
          <input
            className="form-check-input"
            type="checkbox"
            name={`days[${day.dayId}]`}
            id={`flexCheckDefault${day.dayId}`}
            checked={day.isEnabled}
            onChange={(e) => onDayToggle(day.dayId, e.target.checked)}
          />
          <label
            className="form-check-label"
            htmlFor={`flexCheckDefault${day.dayId}`}
          >
            {day.dayName}
          </label>
        </div>
      </div>
      <div className="col-6 col-md-4">
        <div className="form-floating">
          <TimePickerInput
            id={`start_time_${day.dayId}`}
            value={day.startTime}
            onChange={(value) => onTimeChange(day.dayId, 'startTime', value)}
            disabled={!day.isEnabled}
            placeholder="Start Time"
            defaultHour={0}
            defaultMinute={0}
          />
          <label htmlFor={`start_time_${day.dayId}`}>Start Time</label>
        </div>
      </div>
      <div className="col-6 col-md-4">
        <div className="form-floating">
          <TimePickerInput
            id={`end_time_${day.dayId}`}
            value={day.endTime}
            onChange={(value) => onTimeChange(day.dayId, 'endTime', value)}
            disabled={!day.isEnabled}
            placeholder="End Time"
            defaultHour={23}
            defaultMinute={59}
          />
          <label htmlFor={`end_time_${day.dayId}`}>End Time</label>
        </div>
      </div>
    </div>
  );
});

DayScheduleRow.displayName = 'DayScheduleRow';

export default DayScheduleRow;

