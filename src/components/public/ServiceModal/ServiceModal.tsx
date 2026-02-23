import React, { useEffect, useCallback, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ServiceModal.module.css';
import { servicesService } from '../../../services/generalServices/servicesService';
import { swalFire } from '../../../lib/swalLazy';
import { useAuthStore } from '../../../store/authStore';
import CheckmarkIcon from "../../../assets/Icon/checkmark.svg";
import EllipseIcon from "../../../assets/Icon/Ellipse 1.svg";
import { useServiceBookingStore } from '../../../store/serviceBookingStore';
import ServiceModalStep1SelectServices from './steps/ServiceModalStep1SelectServices';
import { type Service, type Subcategory, type SessionPayload } from '../../../types';
import { updateSessionData, type SessionData } from '../../../utils/sessionDataManager';

// Lazy load heavy steps to reduce initial bundle size
// Step 2 uses Google Maps (~200-300KB)
const ServiceModalStep2SelectAddress = lazy(() => import('./steps/ServiceModalStep2SelectAddress'));
// Step 3 uses DateTimePicker (~30-50KB)
const ServiceModalStep3SelectServiceType = lazy(() => import('./steps/ServiceModalStep3SelectServiceType'));

interface ApiError extends Error {
    response?: {
        data?: {
            message?: string;
        };
    };
}

function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as ApiError).response === 'object' &&
        (error as ApiError).response !== null &&
        'data' in (error as ApiError).response! &&
        typeof (error as ApiError).response!.data === 'object' &&
        (error as ApiError).response!.data !== null &&
        'message' in (error as ApiError).response!.data!
    );
}

const ServiceModal: React.FC<{ show: boolean; onClose: () => void; subcategory: Subcategory | null; }> = ({ show, onClose, subcategory }) => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const isProviderOrEmployee = user?.user_type === 'provider' || user?.user_type === 'employee';

    const {
        currentStep,
        selectedServices,
        location,
        zipCode,
        selectedServiceType,
        selectedScheduleTime,
        setCurrentStep,
        reset,
    } = useServiceBookingStore();

    const handleCloseModal = useCallback(() => {
        reset();
        onClose();
    }, [reset, onClose]);

    const completeBooking = useCallback(async () => {
        if (!subcategory) {
            console.error('completeBooking: subcategory is missing');
            return;
        }

        try {
            const selectedServiceTitles = subcategory.services
                .filter((service: Service) => selectedServices.includes(service.id))
                .map((service: Service) => service.title);

            if (selectedServiceTitles.length === 0) {
                console.error('completeBooking: No services selected');
                await swalFire({
                    title: 'Error',
                    text: 'No services selected. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#1e4d5a',
                });
                return;
            }

            let serviceTierId: number;
            let scheduleTime: string;
            const currentZipCode = zipCode || '';

            if (selectedServiceType === 'emergency') {
                serviceTierId = 1;
                scheduleTime = 'now';
            } else if (selectedServiceType === 'scheduled') {
                serviceTierId = 3;
                scheduleTime = selectedScheduleTime || '';
                if (!scheduleTime) {
                    console.error('completeBooking: scheduleTime is missing for scheduled service');
                    await swalFire({
                        title: 'Error',
                        text: 'Schedule time is required for scheduled services.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#1e4d5a',
                    });
                    return;
                }
            } else {
                serviceTierId = 1;
                const now = new Date();
                const y = now.getFullYear();
                const m = String(now.getMonth() + 1).padStart(2, '0');
                const d = String(now.getDate()).padStart(2, '0');
                const hh = String(now.getHours()).padStart(2, '0');
                const mm = String(now.getMinutes()).padStart(2, '0');
                scheduleTime = `${y}-${m}-${d} ${hh}:${mm}`;
            }

            const sessionPayload: SessionPayload = {
                booked_services: selectedServices,
                booked_services_title: selectedServiceTitles,
                service_tier_id: serviceTierId,
                schedule_time: scheduleTime,
                zipcode: currentZipCode,
                location: location,
                latLng: null, // latLng is not available in this context, so set to null
            };

            // Store the full payload in localStorage
            const fullPayload = {
                ...sessionPayload,
                sub_category: subcategory?.title || '',
                selectedServiceType: selectedServiceType || '',
            };
            updateSessionData(fullPayload);

            // Check authentication before calling API
            const isAuthenticated = useAuthStore.getState().isAuthenticated;
            if (isAuthenticated) {
                // Post-login flow: Call API
                try {
                    await servicesService.storeSessionData(sessionPayload);
                } catch (error) {
                    console.error('Error storing session data:', error);
                    // Continue with navigation even if API call fails
                }
            }
            // Pre-login flow: Only localStorage (no API call)

            const displayServiceText = selectedServiceTitles.length === 1
                ? selectedServiceTitles[0]
                : `${selectedServiceTitles.slice(0, 2).join(', ')}${selectedServiceTitles.length > 2 ? ` +${selectedServiceTitles.length - 2} more` : ''}`;

            // Prepare navigation state
            const navigationState = {
                service: displayServiceText,
                location: currentZipCode,
                when: selectedServiceType === 'scheduled' ? 'schedule' : 'emergency',
                service_id: selectedServices[0]?.toString() || '',
                serviceTier: serviceTierId,
                date: scheduleTime
            };

            // Build URL with query params
            // Note: URLSearchParams.set() automatically encodes values, so don't use encodeURIComponent
            const searchParams = new URLSearchParams({
                service: navigationState.service,
                location: navigationState.location,
                when: navigationState.when,
                service_id: navigationState.service_id,
            });
            if (navigationState.date) {
                // Replace space with + for URL encoding (URLSearchParams will handle the rest)
                searchParams.set('date', navigationState.date.replace(' ', '+'));
            }
            const searchUrl = `/search?${searchParams.toString()}`;

            // Store navigation state in sessionStorage as backup
            sessionStorage.setItem('pendingNavigation', JSON.stringify({
                path: '/search',
                state: navigationState,
                url: searchUrl
            }));

            // Reset store state
            reset();

            // Close modal first
            handleCloseModal();

            // Navigate to search page with URL params and state
            navigate(searchUrl, {
                state: navigationState,
                replace: false
            });
        } catch (error) {
            console.error('completeBooking: Error occurred:', error);
            // Close modal even if there's an error
            handleCloseModal();
            // Show error to user
            await swalFire({
                title: 'Error',
                text: error instanceof Error ? error.message : 'An error occurred. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#1e4d5a',
            });
        }
    }, [subcategory, selectedServices, selectedServiceType, selectedScheduleTime, location, zipCode, reset, handleCloseModal, navigate]);

    useEffect(() => {
        if (show && subcategory) {
            reset();
            setCurrentStep(1);
        }
    }, [show, subcategory, reset, setCurrentStep]);

    const handleNext = useCallback(async (e?: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent any default form submission behavior
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (currentStep === 1) {
            if (selectedServices.length === 0) {
                await swalFire({
                    title: 'Service Required',
                    text: 'Please select at least one service before proceeding.',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#1e4d5a',
                    customClass: {
                        popup: 'swal2-popup swal2-modal swal2-show',
                        container: 'swal2-container swal2-center swal2-backdrop-show',
                        confirmButton: 'btn btn-primary rounded-pill'
                    },
                    buttonsStyling: false
                });
                return;
            }

            if (!subcategory) {
                // safety check, should not happen
                await swalFire({
                    title: 'Error',
                    text: 'No subcategory data found. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#1e4d5a',
                    customClass: {
                        popup: 'swal2-popup swal2-modal swal2-show',
                        container: 'swal2-container swal2-center swal2-backdrop-show',
                        confirmButton: 'btn btn-primary rounded-pill'
                    },
                    buttonsStyling: false
                });
                return;
            }

            const bookedServices = selectedServices; // number[]
            const bookedServicesTitle = subcategory.services
                .filter(service => bookedServices.includes(service.id))
                .map(service => service.title);

            const partialPayloadStep1: Partial<SessionData> = {
                booked_services: bookedServices,
                booked_services_title: bookedServicesTitle,
                sub_category: subcategory?.title || '',
            };

            // Store payload in localStorage
            updateSessionData(partialPayloadStep1 as Partial<SessionData>);

            // Check authentication before calling API
            const isAuthenticated = useAuthStore.getState().isAuthenticated;
            if (isAuthenticated) {
                // Post-login flow: Call API
                try {
                    const response = await servicesService.storeSessionData({
                        booked_services: bookedServices,
                        booked_services_title: bookedServicesTitle,
                    });
                    if (response.success === false) {
                        // API error. Show error but continue to next step.
                        await swalFire({
                            title: 'Error',
                            text: response.message || 'Failed to save your selected services. Please try again.',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#1e4d5a',
                            customClass: {
                                popup: 'swal2-popup swal2-modal swal2-show',
                                container: 'swal2-container swal2-center swal2-backdrop-show',
                                confirmButton: 'btn btn-primary rounded-pill'
                            },
                            buttonsStyling: false
                        });
                    }
                } catch (error) {
                    console.error('Error storing booked services session data:', error);
                    const errorMessage = isApiError(error) ? error.response?.data?.message || (error as Error).message : (error as Error).message;
                    await swalFire({
                        title: 'Error',
                        text: errorMessage || 'Failed to save your selected services. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#1e4d5a',
                        customClass: {
                            popup: 'swal2-popup swal2-modal swal2-show',
                            container: 'swal2-container swal2-center swal2-backdrop-show',
                            confirmButton: 'btn btn-primary rounded-pill'
                        },
                        buttonsStyling: false
                    });
                }
            }
            // Pre-login flow: Only localStorage (no API call)

            // Move to next step regardless of authentication status
            setCurrentStep(2);
        } else if (currentStep === 2) {
            // 1) Validate location / zipcode
            if (!location) {
                await swalFire({
                    title: 'Location Required',
                    text: 'Please select a location before proceeding.',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#1e4d5a',
                    customClass: {
                        popup: 'swal2-popup swal2-modal swal2-show',
                        container: 'swal2-container swal2-center swal2-backdrop-show',
                        confirmButton: 'btn btn-primary rounded-pill'
                    },
                    buttonsStyling: false
                });
                return;
            }

            if (!zipCode) {
                await swalFire({
                    title: 'Zip Code Required',
                    text: 'Please select a location that includes a valid zip code before proceeding.',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#1e4d5a',
                    customClass: {
                        popup: 'swal2-popup swal2-modal swal2-show',
                        container: 'swal2-container swal2-center swal2-backdrop-show',
                        confirmButton: 'btn btn-primary rounded-pill'
                    },
                    buttonsStyling: false
                });
                return;
            }

            const latLng = useServiceBookingStore.getState().latLng; // Get latLng directly from store

            const partialPayloadStep2: Partial<SessionData> = {
                zipcode: zipCode,
                location: location,
                latLng: latLng,
            };

            // Check if user is authenticated
            const isAuthenticated = useAuthStore.getState().isAuthenticated;

            if (!isAuthenticated) {
                // Pre-login flow: Store payload in localStorage only (no API call)
                updateSessionData(partialPayloadStep2 as Partial<SessionData>);
                setCurrentStep(3);
            } else {
                // Post-login flow: Call API and store in localStorage
                try {
                    const response = await servicesService.storeSessionData({
                        zipcode: zipCode,
                    });

                    // Store payload in localStorage regardless of API response
                    updateSessionData(partialPayloadStep2 as Partial<SessionData>);

                    if (response.success === false) {
                        // API error. Show error but continue to next step.
                        await swalFire({
                            title: 'Error',
                            text: response.message || 'Failed to save your location details. Please try again.',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#1e4d5a',
                            customClass: {
                                popup: 'swal2-popup swal2-modal swal2-show',
                                container: 'swal2-container swal2-center swal2-backdrop-show',
                                confirmButton: 'btn btn-primary rounded-pill'
                            },
                            buttonsStyling: false
                        });
                    }

                    // Continue to next step
                    setCurrentStep(3);
                } catch (error) {
                    console.error('Error storing zipcode session data:', error);
                    const errorMessage = isApiError(error) ? error.response?.data?.message || (error as Error).message : (error as Error).message;

                    // Store payload in localStorage regardless of error type.
                    updateSessionData(partialPayloadStep2 as Partial<SessionData>);

                    await swalFire({
                        title: 'Error',
                        text: errorMessage || 'Failed to save your location details. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#1e4d5a',
                        customClass: {
                            popup: 'swal2-popup swal2-modal swal2-show',
                            container: 'swal2-container swal2-center swal2-backdrop-show',
                            confirmButton: 'btn btn-primary rounded-pill'
                        },
                        buttonsStyling: false
                    });

                    // Continue to next step even on error
                    setCurrentStep(3);
                }
            }
        } else if (currentStep === 3) {
            if (!selectedServiceType) {
                await swalFire({
                    title: 'Service Type Required',
                    text: 'Please select a service type (Emergency or Scheduled) before proceeding.',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#1e4d5a',
                    customClass: {
                        popup: 'swal2-popup swal2-modal swal2-show',
                        container: 'swal2-container swal2-center swal2-backdrop-show',
                        confirmButton: 'btn btn-primary rounded-pill'
                    },
                    buttonsStyling: false
                });
                return;
            }

            if (selectedServiceType === 'scheduled' && !selectedScheduleTime) {
                await swalFire({
                    title: 'Date & Time Required',
                    text: 'Please pick a date & time for your Scheduled Service.',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#1e4d5a',
                    customClass: {
                        popup: 'swal2-popup swal2-modal swal2-show',
                        container: 'swal2-container swal2-center swal2-backdrop-show',
                        confirmButton: 'btn btn-primary rounded-pill'
                    },
                    buttonsStyling: false
                });
                return;
            }


            await completeBooking();

        }
    }, [currentStep, selectedServices, setCurrentStep, selectedServiceType, selectedScheduleTime, completeBooking, location, zipCode, subcategory]);

    const handleBack = useCallback(() => {
        setCurrentStep(Math.max(1, currentStep - 1) as 1 | 2 | 3);
    }, [currentStep, setCurrentStep]);

    const renderStepContent = () => {
        if (!subcategory) return null;

        switch (currentStep) {
            case 1:
                return <ServiceModalStep1SelectServices subcategory={subcategory} isProviderOrEmployee={isProviderOrEmployee} />;
            case 2:
                return (
                    <Suspense fallback={<div className={styles.stepLoading}>Loading location search...</div>}>
                        <ServiceModalStep2SelectAddress />
                    </Suspense>
                );
            case 3:
                return (
                    <Suspense fallback={<div className={styles.stepLoading}>Loading service type selection...</div>}>
                        <ServiceModalStep3SelectServiceType isProviderOrEmployee={isProviderOrEmployee} />
                    </Suspense>
                );
            default:
                return null;
        }
    };

    const getStepStatus = (step: number) => {
        if (currentStep > step) {
            return <img src={CheckmarkIcon} alt="completed" className={styles.stepIcon} />;
        } else if (currentStep === step) {
            return <div className={`${styles.stepNumber} ${styles.currentStepNumber}`}>{step}</div>;
        } else {
            return <img src={EllipseIcon} alt="pending" className={styles.stepIcon} />;
        }
    };

    if (!show || !subcategory) {
        return null;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.frameParent}>
                <div className={styles.stepIndicatorContainer}>
                    <div className={`${styles.stepIndicator} ${currentStep === 1 ? styles.currentStep : ''}`}>
                        {getStepStatus(1)}
                        <span className={`${styles.stepText} ${currentStep === 1 ? styles.currentStepText : ''}`}>Choose Service Issue(s)</span>
                    </div>
                    <div className={styles.stepSeparator} />
                    <div className={`${styles.stepIndicator} ${currentStep === 2 ? styles.currentStep : ''}`}>
                        {getStepStatus(2)}
                        <span className={`${styles.stepText} ${currentStep === 2 ? styles.currentStepText : ''}`}>Choose Service Address</span>
                    </div>
                    <div className={styles.stepSeparator} />
                    <div className={`${styles.stepIndicator} ${currentStep === 3 ? styles.currentStep : ''}`}>
                        {getStepStatus(3)}
                        <span className={`${styles.stepText} ${currentStep === 3 ? styles.currentStepText : ''}`}>Choose Service Type & Time</span>
                    </div>
                </div>

                {renderStepContent()}

                <div className={styles.navigationButtons}>
                    {currentStep > 1 && (
                        <button className={styles.backButton} onClick={handleBack}>
                            Back
                        </button>
                    )}
                    {!isProviderOrEmployee && (
                        <button
                            type="button"
                            className={styles.nextButton}
                            onClick={handleNext}
                            disabled={(currentStep === 1 && selectedServices.length === 0) || (currentStep === 2 && (!location || !zipCode)) || (currentStep === 3 && (!selectedServiceType || (selectedServiceType === 'scheduled' && !selectedScheduleTime)))}
                        >
                            {currentStep === 3 ? 'Confirm & Search' : 'Next'}
                        </button>
                    )}
                </div>

                <button className={styles.closeButton} onClick={handleCloseModal} aria-label="Close">
                    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='feather feather-x'><line x1='18' y1='6' x2='6' y2='18'></line><line x1='6' y1='6' x2='18' y2='18'></line></svg>
                </button>

            </div>

        </div>
    );
};

export default ServiceModal;
