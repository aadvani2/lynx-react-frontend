import React, { useState, useEffect } from 'react';
import styles from './DateTimePickerFigma.module.css';
import VectorIcon from "../../../../assets/Icon/Vector.svg"

interface DateTimePickerFigmaProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dateTime: string) => void;
}

const DateTimePickerFigma: React.FC<DateTimePickerFigmaProps> = ({ isOpen, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hours, setHours] = useState(3);
  const [minutes, setMinutes] = useState(15);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  useEffect(() => {
    if (!isOpen) {
      setSelectedDate(null);
      setCurrentMonth(new Date());
      setHours(3);
      setMinutes(15);
      setPeriod('AM');
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (!selectedDate) return;

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');

    let hour24 = hours;
    if (period === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0;
    }
    const hour24Str = String(hour24).padStart(2, '0');
    const dateTimeString = `${year}-${month}-${day} ${hour24Str}:${String(minutes).padStart(2, '0')}`;

    onConfirm(dateTimeString);
    onClose();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={styles.calendarPopUpOverlay}>
      <div className={styles.calendarPopUp}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='feather feather-x'><line x1='18' y1='6' x2='6' y2='18'></line><line x1='6' y1='6' x2='18' y2='18'></line></svg>
        </button>
        <div className={styles.selectDateParent}>
          <b className={styles.selected}>Select Date</b>
          <div className={styles.smallArrowParent}>
            <img className={styles.smallArrowIcon} alt="" src={VectorIcon} onClick={handlePrevMonth} />
            <b className={styles.selected}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</b>
            <div className={styles.smallArrow} onClick={handleNextMonth}>
              <img className={styles.vectorIcon} alt="" src={VectorIcon} />
            </div>
          </div>
        </div>
        <div className={styles.frameWrapper2}>
          <div className={styles.frameParent5}>
            <div className={styles.sunParent}>
              {daysOfWeek.map(day => <div key={day} className={styles.sun}>{day}</div>)}
            </div>
            {days.reduce((rows: Array<Array<{ day: number; isCurrentMonth: boolean; date: Date }>>, dayObj, index) => {
              if (index % 7 === 0) rows.push([]);
              rows[rows.length - 1].push(dayObj);
              return rows;
            }, []).map((week, weekIndex) => (
              <div key={weekIndex} className={styles.component25Parent}>
                {week.map((dayObj, dayIndex) => {
                  const isOtherMonth = !dayObj.isCurrentMonth;
                  const isSelectedDate = isSelected(dayObj.date);
                  const isTodayDate = isToday(dayObj.date);
                  const isDisabled = dayObj.date < new Date(new Date().setHours(0, 0, 0, 0));

                  return (
                    <div
                      key={dayIndex}
                      className={`${styles.component25} ${isOtherMonth ? styles.otherMonth : ''} ${isSelectedDate ? styles.selectedDate : ''} ${isTodayDate ? styles.todayDate : ''} ${isDisabled ? styles.disabledDate : ''}`}
                      onClick={() => !isDisabled && handleDateClick(dayObj.date)}
                      style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                    >
                      <div className={styles.component25Child} />
                      <div className={styles.div}>{dayObj.day}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.selectTimeParent}>
          <b className={styles.selected}>Select Time</b>
          <div className={styles.selectDateParent}>
            <div className={styles.frameParent7}>
              <div className={styles.frameParent8}>
                <div className={styles.wrapper} onClick={() => setHours(prev => prev === 1 ? 12 : prev - 1)}>
                  <b className={styles.b}>-</b>
                </div>
                <div className={styles.street}>{String(hours).padStart(2, '0')}</div>
                <div className={styles.wrapper} onClick={() => setHours(prev => prev === 12 ? 1 : prev + 1)}>
                  <b className={styles.b}>+</b>
                </div>
              </div>
              <div className={styles.div37}>:</div>
              <div className={styles.frameParent8}>
                <div className={styles.wrapper} onClick={() => setMinutes(prev => prev === 0 ? 45 : prev - 15)}>
                  <b className={styles.b}>-</b>
                </div>
                <div className={styles.street}>{String(minutes).padStart(2, '0')}</div>
                <div className={styles.wrapper} onClick={() => setMinutes(prev => (prev + 15) % 60)}>
                  <b className={styles.b}>+</b>
                </div>
              </div>
            </div>
            <div className={styles.frameParent10}>
              <div className={`${styles.amWrapper} ${period === 'AM' ? styles.periodActive : ''}`} onClick={() => setPeriod('AM')}>
                <div className={styles.street}>AM</div>
              </div>
              <div className={`${styles.pmWrapper} ${period === 'PM' ? styles.periodActive : ''}`} onClick={() => setPeriod('PM')}>
                <div className={styles.street}>PM</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.button} onClick={handleConfirm}>
          <b className={styles.text}>Confirm</b>
        </div>
      </div>
    </div>
  );
};

export default DateTimePickerFigma;
