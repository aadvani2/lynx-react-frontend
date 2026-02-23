import React, { lazy, Suspense } from "react";
const ServiceCard = lazy(() => import("../../../components/common/ServiceCard/ServiceCard"));
import type { BookingData } from "../types";

interface Props {
  bookingData: BookingData | null;
  imageFallback?: string;
  defaultImage?: string;
}

const ServiceCardContainer: React.FC<Props> = ({ bookingData, imageFallback, defaultImage }) => {
  const service =
    bookingData?.service?.includes(" > ")
      ? bookingData?.service?.split(" > ")[1] || bookingData?.service?.split(" > ")[0]
      : bookingData?.service || "Plumbing";
  const hasProvider = Boolean(bookingData?.provider?.id || bookingData?.provider?.name);
  const resolvedImage = hasProvider
    ? (bookingData?.provider?.image || imageFallback || defaultImage)
    : defaultImage;

  return (
    <Suspense fallback={null}>
      <ServiceCard
        service={service}
        provider={hasProvider ? bookingData?.provider?.name : "Select a provider"}
        distance={hasProvider ? bookingData?.provider?.distance : undefined}
        rating={hasProvider ? bookingData?.provider?.rating : undefined}
        reviews={hasProvider ? bookingData?.provider?.reviews : undefined}
        vetted
        licensed
        established={hasProvider ? bookingData?.provider?.established : undefined}
        description={hasProvider ? bookingData?.provider?.description : undefined}
        image={resolvedImage}
        imageFallback={imageFallback}
        imageFit="contain"
        hideMeta={!hasProvider}
      />
    </Suspense>
  );
};

export default ServiceCardContainer;
