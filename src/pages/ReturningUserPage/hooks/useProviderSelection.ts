import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { servicesService } from '../../../services/generalServices/servicesService';
import type { BookingData, ProviderItem } from '../types';

interface UseProviderSelectionParams {
  providers: ProviderItem[] | undefined;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData | null>>;
  refetchReturningUserData: () => Promise<void>;
}

export function useProviderSelection({
  providers,
  setBookingData,
  refetchReturningUserData,
}: UseProviderSelectionParams) {
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const [updatingProviderId, setUpdatingProviderId] = useState<number | null>(null);

  const resolveProviderImage = useCallback((provider: ProviderItem) => {
    const p = provider as unknown as {
      image?: string;
      logo?: string;
      profile_image?: string;
      company_logo?: string;
      image_url?: string;
      avatar?: string;
    };
    return (
      p.image ||
      p.logo ||
      p.profile_image ||
      p.company_logo ||
      p.image_url ||
      p.avatar ||
      ''
    );
  }, []);

  // Keep booking card provider details in sync with the currently selected provider from the provider list
  useEffect(() => {
    if (selectedProviderId === null || selectedProviderId === undefined || !providers?.length) return;
    const matchedProvider = providers.find((provider) => provider.id === selectedProviderId);
    if (!matchedProvider) return;

    setBookingData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        provider: {
          id: matchedProvider.id,
          name: matchedProvider.name ?? prev.provider?.name ?? '',
          distance: matchedProvider.distance?.toString() ?? prev.provider?.distance ?? '',
          rating: matchedProvider.rating?.toString() ?? prev.provider?.rating ?? '',
          reviews: matchedProvider.review_count?.toString() ?? prev.provider?.reviews ?? '',
          description: matchedProvider.services ?? prev.provider?.description ?? '',
          image: resolveProviderImage(matchedProvider) || prev.provider?.image || '',
          established: prev.provider?.established ?? '',
        }
      };
    });
  }, [providers, resolveProviderImage, selectedProviderId, setBookingData]);

  const handleProviderSelection = useCallback(async (provider: ProviderItem) => {
    if (provider?.id === undefined || provider?.id === null) return;
    if (selectedProviderId === provider.id) return;
    if (updatingProviderId !== null) return; // prevent concurrent selection calls

    const newProviderId = provider.id;

    try {
      setUpdatingProviderId(newProviderId);
      await servicesService.storeSessionData({
        selected_provider_id: newProviderId.toString()
      });

      setSelectedProviderId(newProviderId);

      // Immediately reflect the change in the booking card
      setBookingData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          provider: {
            id: newProviderId,
            name: provider.name ?? prev.provider?.name ?? '',
            distance: provider.distance?.toString() ?? prev.provider?.distance ?? '',
            rating: provider.rating?.toString() ?? prev.provider?.rating ?? '',
            reviews: provider.review_count?.toString() ?? prev.provider?.reviews ?? '',
            description: prev.provider?.description || provider.services || '',
            image: resolveProviderImage(provider) || prev.provider?.image || '',
            established: prev.provider?.established || '',
          }
        };
      });

      await refetchReturningUserData();

      Swal.fire({
        icon: 'success',
        title: 'Provider updated',
        text: 'Your selected provider has been updated for this booking.',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error selecting provider:', error);
      Swal.fire({
        icon: 'error',
        title: 'Unable to update provider',
        text: 'Please try again or choose another provider.',
        timer: 2500,
        showConfirmButton: false,
      });
    } finally {
      setUpdatingProviderId(null);
    }
  }, [resolveProviderImage, selectedProviderId, refetchReturningUserData, setBookingData, updatingProviderId]);

  return {
    selectedProviderId,
    setSelectedProviderId,
    updatingProviderId,
    handleProviderSelection,
  };
}
