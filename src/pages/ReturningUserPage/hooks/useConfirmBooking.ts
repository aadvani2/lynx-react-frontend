import { useCallback, useState } from 'react';
import Swal from 'sweetalert2';
import { clearSessionData } from '../../../utils/sessionDataManager';
import { getUserTimezoneOffset } from '../../../utils/timezoneHelper';
import { servicesService } from '../../../services/generalServices/servicesService';

interface ContactInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
}

interface UseConfirmBookingParams {
  addresses: Array<{ id?: number }>;
  selectedAddress: { id?: number } | null;
  showNoProviderAlert: boolean;
  jobDescription: string;
  contactInfo: ContactInfo;
  user: { name?: string; phone?: string } | null;
  userPhone: string | null;
  firstRequestId: number | null;
  files: File[];
  resetForm: () => void;
  navigate: (path: string) => void;
}

export function useConfirmBooking({
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
}: UseConfirmBookingParams) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmBooking = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    // Validate address selection
    if (!selectedAddress || !addresses || addresses.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Address Required',
        text: 'Please select or add a service address before submitting your booking.',
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    // Prevent submission if current address has no available providers
    if (showNoProviderAlert) {
      Swal.fire({
        icon: 'warning',
        title: 'No Providers Available',
        text: 'Please select another address where providers are available before confirming.',
        showConfirmButton: false,
        timer: 2200,
      });
      return;
    }

    // Validate required fields
    if (!jobDescription || jobDescription.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Description Required',
        text: 'Please provide a description of the service you need.',
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (!contactInfo.fullName && !user?.name) {
      Swal.fire({
        icon: 'error',
        title: 'Name Required',
        text: 'Please provide your full name.',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!contactInfo.phoneNumber && !userPhone && !user?.phone) {
      Swal.fire({
        icon: 'error',
        title: 'Phone Number Required',
        text: 'Please provide your phone number.',
        confirmButtonText: 'OK'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure backend session is aligned with the currently selected address
      let effectiveFirstRequestId = firstRequestId || undefined;
      if (selectedAddress?.id) {
        try {
          const storeResponse = await servicesService.storeSessionData({
            service_address_id: selectedAddress.id.toString(),
          });
          if (storeResponse?.success && storeResponse?.first_request_id) {
            effectiveFirstRequestId = storeResponse.first_request_id;
          }
        } catch (e) {
          console.error('Error syncing selected address before booking:', e);
        }
      }

      // Prepare the API payload
      const requestData = {
        contact_person: contactInfo.fullName || user?.name || '',
        phone: contactInfo.phoneNumber || userPhone || user?.phone || '',
        dial_code: '+1', // Default dial code
        country_code: 'US', // Default country code
        user_timezone: getUserTimezoneOffset(), // User's actual timezone
        description: jobDescription.trim(), // Trim whitespace
        files: files,
        first_request_id: effectiveFirstRequestId
      };

      // Call the add-request API
      const response = await servicesService.addRequest(requestData);

      if (response && response.status === "1") {
        // Clear the form state after successful submission
        resetForm(); // Clear all form data (job description, files, image previews)

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Booking Confirmed!',
          text: 'Your service request has been submitted successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        clearSessionData();
        // Navigate to requests page after success
        setTimeout(() => {
          navigate('/my-account?page=my_requests');
        }, 2000);
      } else {
        // Show error message
        clearSessionData();
        navigate('/');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response?.message || 'Failed to submit booking. Please try again.',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while submitting your booking. Please try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    addresses,
    contactInfo.fullName,
    contactInfo.phoneNumber,
    files,
    firstRequestId,
    isSubmitting,
    jobDescription,
    navigate,
    resetForm,
    selectedAddress,
    showNoProviderAlert,
    user?.name,
    user?.phone,
    userPhone
  ]);

  return { handleConfirmBooking, isSubmitting };
}
