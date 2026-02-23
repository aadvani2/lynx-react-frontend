import React from 'react';

interface TimeFilterProps {
  timeFilter: string;
  onTimeChange: (value: string) => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({ timeFilter, onTimeChange }) => {
  return (
    <div className="filter-day-select">
      <select
        className="form-select rounded-pill"
        id="timeFilter"
        name="timeFilter"
        value={timeFilter}
        onChange={(e) => onTimeChange(e.target.value)}
      >
        <option value="">Lifetime</option>
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="week">Last 7 Days</option>
        <option value="month">Last 30 Days</option>
        <option value="quarter">Last 90 Days</option>
      </select>
    </div>
  );
};

export default TimeFilter; 