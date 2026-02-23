import { useState } from "react";
import styles from "./DatePicker.module.css";

interface DatePickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export default function DatePicker({ selectedDate, onDateSelect }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day)
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day)
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={styles.datePickerSection}>
      <div className={styles.dateHeader}>
        <b className={styles.title}>Select Date</b>
        <div className={styles.monthNav}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            <svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 1L1 4L4 7" stroke="#1E4D5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <b className={styles.month}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </b>
          <button
            type="button"
            className={styles.navBtn}
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L4 4L1 7" stroke="#1E4D5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.calendar}>
        <div className={styles.weekdays}>
          {daysOfWeek.map((day) => (
            <div key={day} className={styles.weekday}>
              {day}
            </div>
          ))}
        </div>

        {days.reduce((rows: Array<Array<{ day: number; isCurrentMonth: boolean; date: Date }>>, dayObj, index) => {
          if (index % 7 === 0) rows.push([]);
          rows[rows.length - 1].push(dayObj);
          return rows;
        }, []).map((week, weekIndex) => (
          <div key={weekIndex} className={styles.week}>
            {week.map((dayObj, dayIndex) => {
              const isOtherMonth = !dayObj.isCurrentMonth;
              const isSelectedDate = isSelected(dayObj.date);
              const isTodayDate = isToday(dayObj.date);
              const isDisabled = dayObj.date < new Date(new Date().setHours(0, 0, 0, 0));

              return (
                <div
                  key={dayIndex}
                  className={`${styles.dayCell} ${isOtherMonth ? styles.dayCellOtherMonth : ""} ${isSelectedDate ? styles.dayCellSelected : ""}`}
                  onClick={() => !isDisabled && handleDateClick(dayObj.date)}
                  style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1 }}
                >
                  <div className={`${styles.dayBg} ${isSelectedDate ? styles.dayBgSelected : ""} ${isTodayDate ? styles.dayBgToday : ""}`} />
                  <div className={`${styles.dayText} ${isSelectedDate ? styles.dayTextSelected : ""}`}>
                    {dayObj.day}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

