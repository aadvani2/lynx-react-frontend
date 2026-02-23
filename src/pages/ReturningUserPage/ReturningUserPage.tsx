import React, { useEffect, useCallback, useRef, useState, lazy, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";
import { useAddressSelectionStore } from "../../store/addressSelectionStore";

import BookingHeader from "../../components/public/booking/BookingHeader";
import ContactCard from "../../components/common/ContactCard/ContactCard";
import BookingFooter from "../../components/public/booking/BookingFooter";

const ContactInformationContainer = lazy(() => import("./components/ContactInformationContainer"));
const ServiceAddressContainer = lazy(() => import("./components/ServiceAddressContainer"));
const ServiceInformationContainer = lazy(() => import("./components/ServiceInformationContainer"));
const ServiceCardContainer = lazy(() => import("./components/ServiceCardContainer"));
const DateTimeCardContainer = lazy(() => import("./components/DateTimeCardContainer"));

import {
  useReturningUserAuthStore,
  useReturningUserAddressStore,
  useReturningUserFormStore,
  useReturningUserBookingStore,
} from "./stores";

import styles from "./ReturningUserPage.module.css";

import { getSessionData } from "../../utils/sessionDataManager";

import { useProviderSelection } from "./hooks/useProviderSelection";
import { useConfirmBooking } from "./hooks/useConfirmBooking";
import { useReturningUserBootstrap } from "./hooks/useReturningUserBootstrap";

import type { BookingData } from "./types";
import { servicesService } from "../../services/generalServices/servicesService";

/** =========================
 *  Constants
 *  ========================= */
const DEFAULT_SERVICE = "home-staging";
const DEFAULT_CATEGORY = "indoor";

const ReturningUserPage: React.FC = () => {
  /** =========================
   *  Router + auth
   *  ========================= */
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  /** =========================
   *  Local refs/state
   *  ========================= */
  const addressRequestInFlight = useRef(false);
  const bookingDataRef = useRef<BookingData | null>(null);

  /** =========================
   *  Stores (ReturningUser feature stores)
   *  ========================= */
  const { loading, userPhone, setLoading, setUserPhone } = useReturningUserAuthStore();

  const {
    addresses,
    selectedAddress,
    setAddresses,
    setSelectedAddress,
  } = useReturningUserAddressStore();

  const {
    jobDescription,
    files,
    reset: resetForm,
  } = useReturningUserFormStore();

  const {
    bookingData,
    contactInfo,
    setBookingData,
  } = useReturningUserBookingStore();

  const [categoryImageFallback, setCategoryImageFallback] = useState<string>("");
  const [subcategoryImageFallback, setSubcategoryImageFallback] = useState<string>("");
  const [serviceImageFallback, setServiceImageFallback] = useState<string>("");

  /** =========================
   *  Global store (Address selection)
   *  ========================= */
  const {
    handleAddressChange: handleAddressSelectionAPI,
    fetchAddresses: fetchAddressesAPI,
    firstRequestId,
    providers,
    showProviderLoader,
    showProviderList,
    showNoProviderAlert,
    noProviderMessage,
    areaMeta,
  } = useAddressSelectionStore();

  /** =========================
   *  Location state hydration
   *  ========================= */
  const locationBookingData = location.state as BookingData | null;

  useEffect(() => {
    if (locationBookingData) setBookingData(locationBookingData);
  }, [locationBookingData, setBookingData]);

  useEffect(() => {
    bookingDataRef.current = bookingData;
  }, [bookingData]);

  /** =========================
   *  Derived helpers
   *  ========================= */
  const getServiceAndCategory = useCallback(() => {
    return {
      service: bookingData?.service || DEFAULT_SERVICE,
      category: DEFAULT_CATEGORY,
    };
  }, [bookingData?.service]);

  const serviceLabel =
    bookingData?.service?.includes(" > ")
      ? bookingData?.service?.split(" > ")[1] || bookingData?.service?.split(" > ")[0]
      : bookingData?.service || "Plumbing";

  useEffect(() => {
    const loadCategoryImage = async () => {
      if (!areaMeta?.catId && !areaMeta?.subcatId) {
        setCategoryImageFallback("");
        setSubcategoryImageFallback("");
        setServiceImageFallback("");
        return;
      }

      try {
        const services = await servicesService.getServices();
        const categories = services?.categories || [];
        const catId = areaMeta?.catId ? Number(areaMeta.catId) : undefined;
        const subcatId = areaMeta?.subcatId ? Number(areaMeta.subcatId) : undefined;

        const category = catId
          ? categories.find((c: { id: number }) => Number(c.id) === catId)
          : undefined;

        const categoryImage = category?.image || "";
        setCategoryImageFallback(categoryImage);

        let subcategorySlug = "";
        let subcategoryImage = "";

        if (subcatId) {
          for (const c of categories) {
            const sub = (c.subcategories || []).find((s: { id: number }) => Number(s.id) === subcatId);
            if (sub) {
              subcategorySlug = sub.slug || "";
              subcategoryImage = sub.image || "";
              break;
            }
          }
        }

        setSubcategoryImageFallback(subcategoryImage);

        if (subcategorySlug && serviceLabel) {
          try {
            const serviceResponse = await servicesService.getServiceBySubcategory(subcategorySlug);
            const serviceList = serviceResponse?.data?.services || serviceResponse?.services || [];
            const matchedService = serviceList.find((s: { title?: string }) =>
              (s?.title || "").toLowerCase() === serviceLabel.toLowerCase()
            );
            setServiceImageFallback(matchedService?.image || "");
          } catch (error) {
            console.error("Failed to load service image fallback:", error);
            setServiceImageFallback("");
          }
        } else {
          setServiceImageFallback("");
        }
      } catch (error) {
        console.error("Failed to load category image fallback:", error);
        setCategoryImageFallback("");
        setSubcategoryImageFallback("");
        setServiceImageFallback("");
      }
    };

    loadCategoryImage();
  }, [areaMeta?.catId, areaMeta?.subcatId, serviceLabel]);

  /** =========================
   *  Address API helpers
   *  ========================= */
  const runAddressSelectionApi = useCallback(
    async (addressId: number) => {
      if (addressRequestInFlight.current) return;

      addressRequestInFlight.current = true;
      const { service, category } = getServiceAndCategory();

      try {
        await handleAddressSelectionAPI(addressId, service, category, false);
      } finally {
        addressRequestInFlight.current = false;
      }
    },
    [getServiceAndCategory, handleAddressSelectionAPI]
  );

  const handleAddressSelection = useCallback(
    async (addressId: number) => {
      const addr = addresses.find((a) => a.id === addressId);
      if (!addr) return;

      setSelectedAddress(addr);
      try {
        await runAddressSelectionApi(addressId);
      } catch (e) {
        console.error("Error calling address selection APIs:", e);
      }
    },
    [addresses, setSelectedAddress, runAddressSelectionApi]
  );

  const refetchReturningUserData = useCallback(async () => {
    if (!selectedAddress?.id) return;
    try {
      await runAddressSelectionApi(selectedAddress.id);
    } catch (e) {
      console.error("Error refetching returning user data:", e);
    }
  }, [selectedAddress?.id, runAddressSelectionApi]);

  /** =========================
   *  Provider selection hook
   *  ========================= */
  const {
    selectedProviderId,
    setSelectedProviderId,
    updatingProviderId,
    handleProviderSelection,
  } = useProviderSelection({
    providers,
    setBookingData,
    refetchReturningUserData,
  });

  const previousSelectedAddressIdRef = useRef<number | null>(null);

  useEffect(() => {
    const currentAddressId = selectedAddress?.id ?? null;
    const previousAddressId = previousSelectedAddressIdRef.current;

    if (
      previousAddressId !== null &&
      currentAddressId !== null &&
      previousAddressId !== currentAddressId
    ) {
      setSelectedProviderId(null);
      setBookingData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          provider: undefined,
          selected_provider_id: undefined,
          selectedProviderId: undefined,
          providerId: undefined,
        };
      });
    }

    previousSelectedAddressIdRef.current = currentAddressId;
  }, [selectedAddress?.id, setBookingData, setSelectedProviderId]);

  /** =========================
   *  Confirm booking hook
   *  ========================= */
  const { handleConfirmBooking, isSubmitting } = useConfirmBooking({
    addresses,
    selectedAddress,
    showNoProviderAlert,
    jobDescription,
    contactInfo,
    user,
    userPhone,
    firstRequestId,
    files,
    resetForm,
    navigate,
  });

  /** =========================
   *  ProviderId init (location state OR session)
   *  ========================= */
  useEffect(() => {
    const locationProviderId =
      locationBookingData?.selected_provider_id ??
      locationBookingData?.selectedProviderId ??
      locationBookingData?.providerId ??
      locationBookingData?.provider?.id;

    const sessionProviderId = getSessionData()?.selected_provider_id;
    const parsedId = locationProviderId ?? sessionProviderId;

    if (parsedId == null) return;

    const numericId = Number(parsedId);
    if (!Number.isNaN(numericId)) setSelectedProviderId(numericId);
  }, [locationBookingData, setSelectedProviderId]);

  /** =========================
   *  Bootstrap (auth/addresses/profile/init selection)
   *  ========================= */
  useReturningUserBootstrap({
    isAuthenticated,
    user,
    navigate,
    locationBookingData,
    bookingDataRef,
    fetchAddressesAPI,
    handleAddressSelectionAPI,
    setAddresses,
    setSelectedAddress,
    setUserPhone,
    setLoading,
  });

  /** =========================
   *  Cleanup on unmount
   *  ========================= */
  useEffect(() => {
    return () => resetForm();
  }, [resetForm]);


  /** =========================
   *  Guards
   *  ========================= */
  if (loading) {
    return (
      <div className={styles.returningUserLoading}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.user_type !== "customer") return null;

  /** =========================
   *  Render
   *  ========================= */
  return (
    <div className={styles.returningUserPage}>
      <BookingHeader currentStep="confirm" showServiceAddress={false} />

      <div className={styles.returningUserContentWrapper}>
        <div className={styles.returningUserMainContent}>
          <div className={styles.returningUserLeft}>
            <form onSubmit={handleConfirmBooking}>
              <Suspense fallback={null}>
                <ContactInformationContainer user={user} userPhone={userPhone} />
              </Suspense>

              <Suspense fallback={null}>
                <ServiceAddressContainer
                  providers={providers}
                  showProviderLoader={showProviderLoader}
                  showProviderList={showProviderList}
                  showNoProviderAlert={showNoProviderAlert}
                  noProviderMessage={noProviderMessage}
                  selectedProviderId={selectedProviderId}
                  updatingProviderId={updatingProviderId}
                  onAddressChange={handleAddressSelection}
                  onProviderClick={handleProviderSelection}
                  imageFallback={categoryImageFallback || subcategoryImageFallback || serviceImageFallback}
                />
              </Suspense>

              <Suspense fallback={null}>
                <ServiceInformationContainer />
              </Suspense>

              <div className={styles.actionButtons}>
                <button type="submit" className={styles.confirmBtn} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Submitting...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className={styles.returningUserSidebar}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, minHeight: 600 }}>
              <Suspense fallback={null}>
                <ServiceCardContainer
                  bookingData={bookingData}
                  imageFallback={categoryImageFallback || subcategoryImageFallback || serviceImageFallback}
                  defaultImage={categoryImageFallback || subcategoryImageFallback || serviceImageFallback || providers?.[0]?.image}
                />
              </Suspense>
              <Suspense fallback={null}>
                <DateTimeCardContainer bookingData={bookingData} />
              </Suspense>
              <ContactCard phone="+18774115969" email="hello@connectwithlynx.com" />
            </div>
          </div>
        </div>
      </div>

      <BookingFooter />
    </div>
  );
};

export default ReturningUserPage;
