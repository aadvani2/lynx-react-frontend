import { useState } from 'react';
import { partnerService } from '../services/partnerService/partnerService';

interface UpdateLocationData {
  location: string;
  latitude: number;
  longitude: number;
  country: string;
  address: string;
  unit_number: string;
  zip_code: string;
  city: string;
  state: string;
  switchRange: 'miles' | 'km';
  service_radius: Array<{
    tier_title: string;
    tier_id: number;
    is_available: number;
    radius: number;
  }>;
}

export const useUpdateLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateLocation = async (data: UpdateLocationData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await partnerService.updateLocation(data);
      setSuccess(true);
      return response.data; // Return the full response data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update location';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    updateLocation,
    loading,
    error,
    success,
    reset
  };
};
