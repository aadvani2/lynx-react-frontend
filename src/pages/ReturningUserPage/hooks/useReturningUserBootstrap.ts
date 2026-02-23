import { useCallback, useEffect } from 'react';
import { getUserTimezoneOffset } from '../../../utils/timezoneHelper';
import { customerService } from '../../../services/customerServices/customerService';
import type { BookingData } from '../types';
import type { Address } from '../types';

interface Params {
  isAuthenticated: boolean;
  user: { user_type?: string } | null;
  navigate: (path: string, options?: { state?: unknown }) => void;
  locationBookingData: BookingData | null;
  bookingDataRef: React.MutableRefObject<BookingData | null>;
  fetchAddressesAPI: () => Promise<void>;
  handleAddressSelectionAPI: (addressId: number, service: string, category: string, flag: boolean) => Promise<void>;
  setAddresses: (addresses: Address[]) => void;
  setSelectedAddress: (address: Address | null) => void;
  setUserPhone: (phone: string) => void;
  setLoading: (loading: boolean) => void;
}

export function useReturningUserBootstrap({
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
}: Params) {
  const checkUserStatus = useCallback(async () => {
    setLoading(true);

    if (!isAuthenticated || !user) {
      setLoading(false);
      navigate('/sign-in', { state: { redirect: '/returning-user', bookingData: locationBookingData } });
      return;
    }

    if (user.user_type !== 'customer') {
      setLoading(false);
      return;
    }

    try {
      const timezoneHours = getUserTimezoneOffset();

      // Fetch user addresses
      try {
        const addressesResponse = await customerService.getAddresses(timezoneHours);
        const addressesData = addressesResponse?.data?.addresses || addressesResponse?.data || [];

        if (Array.isArray(addressesData)) {
          setAddresses(addressesData);
        }

        // Initialize address selection store and call APIs for first address
        await fetchAddressesAPI();

        if (Array.isArray(addressesData) && addressesData.length > 0) {
          const matchingAddress = addressesData.find((addr: Address) =>
            addr.zip_code === bookingDataRef.current?.location
          ) || addressesData[0];
          setSelectedAddress(matchingAddress);

          const service = bookingDataRef.current?.service || 'home-staging';
          const category = 'indoor';
          try {
            await handleAddressSelectionAPI(matchingAddress.id, service, category, false);
          } catch (apiError) {
            console.error('Error calling initial address selection APIs:', apiError);
          }
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }

      // Fetch user profile info for phone number
      try {
        const profileResponse = await customerService.getEditProfileInfo({
          user_timezone: timezoneHours,
          page: 1
        });
        const profileData = profileResponse?.data?.customer || profileResponse?.data || {};
        if (profileData.phone || profileData.phone_number) {
          const phoneFromProfile = profileData.phone || profileData.phone_number || '';
          setUserPhone(phoneFromProfile);
        }
      } catch (error) {
        console.error('Error fetching profile info:', error);
      }
    } catch (error) {
      console.error('Error checking user service history:', error);
    } finally {
      setLoading(false);
    }
  }, [
    bookingDataRef,
    fetchAddressesAPI,
    handleAddressSelectionAPI,
    isAuthenticated,
    locationBookingData,
    navigate,
    setAddresses,
    setLoading,
    setSelectedAddress,
    setUserPhone,
    user,
  ]);

  useEffect(() => {
    checkUserStatus();
  }, [
    checkUserStatus,
    fetchAddressesAPI,
    handleAddressSelectionAPI,
    isAuthenticated,
    locationBookingData,
    navigate,
    setAddresses,
    setLoading,
    setSelectedAddress,
    setUserPhone,
    user,
  ]);
}

