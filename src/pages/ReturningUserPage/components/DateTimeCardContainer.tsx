import React, { lazy, Suspense } from "react";
const DateTimeCard = lazy(() => import("../../../components/common/DateTimeCard/DateTimeCard"));
import type { BookingData } from "../types";

interface Props {
  bookingData: BookingData | null;
}

const DateTimeCardContainer: React.FC<Props> = ({ bookingData }) => {
  const isSchedule = bookingData?.when === "schedule";
  const dateValue =
    isSchedule && bookingData?.scheduleDate ? new Date(bookingData.scheduleDate) : new Date();

  return (
    <Suspense fallback={null}>
      <DateTimeCard
        date={dateValue}
        scheduleDate={isSchedule ? bookingData?.scheduleDate : undefined}
        isEmergency={bookingData?.isEmergency || bookingData?.when === "emergency"}
      />
    </Suspense>
  );
};

export default DateTimeCardContainer;

