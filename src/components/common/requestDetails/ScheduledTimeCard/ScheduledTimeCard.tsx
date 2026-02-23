import React from 'react';
import styles from './ScheduledTimeCard.module.css';
import { format } from 'date-fns';
import CalenderIcon from "../../../../assets/Icon/calendar.svg";
import ClockIcon from "../../../../assets/Icon/clock.svg";

interface ScheduledTimeCardProps {
  schedule_time: string | null;  // allow null just in case
  service_tier: string;
}

const ScheduledTimeCard: React.FC<ScheduledTimeCardProps> = ({ schedule_time, service_tier }) => {

  // Show date/time only for "Scheduled Service"
  const isScheduledService =
    service_tier &&
    service_tier.toLowerCase().includes("scheduled service");

  const hasScheduleTime = !!schedule_time;

  return (
    <div className={styles.scheduledTime}>
      <div className={styles.requestAcceptedWrapper}>
        <div className={styles.frameWrapper4}>
          <div className={styles.requestAcceptedWrapper}>
            <b className={styles.bodyRequestSent}>
              {service_tier ? service_tier : "Scheduled Time"}
            </b>
          </div>
        </div>
      </div>

      {isScheduledService && (
        <div className={styles.frameParent4}>
          <div className={styles.frameWrapper5}>
            <div className={styles.frameParent5}>
              <div className={styles.iconcalendarParent}>
                <img className={styles.iconcalendar} alt="" src={CalenderIcon} />
                <div className={styles.bodyButton}>
                  {hasScheduleTime ? format(new Date(schedule_time as string), "MMMM do, yyyy") : "N/A"}
                </div>
              </div>

              <div className={styles.iconcalendarParent}>
                <img className={styles.iconcalendar} alt="" src={ClockIcon} />
                <div className={styles.bodyButton}>
                  {hasScheduleTime ? format(new Date(schedule_time as string), "hh:mm a") : "N/A"}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.button7} />
        </div>
      )}
    </div>
  );
};

export default ScheduledTimeCard;
