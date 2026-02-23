import { useState, useEffect, useCallback } from 'react';
import { partnerService } from '../services/partnerService/partnerService';

export interface ManageServiceTiersResponse {
  address?: string;
  unit_number?: string;
  zip_code?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  country?: string;
  service_radius?: ServiceRadiusItem[];
}

export interface ServiceRadiusItem {
  tier_title: string;
  tier_id: number;
  radius: number;
  is_available: number;
}

export const useManageServiceTiers = (userTimezone: number = 5.5) => {
  const [data, setData] = useState<ManageServiceTiersResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await partnerService.getManageServiceTiersInfo(userTimezone);
      setData(response);
    } catch (err) {
      console.error('Error fetching manage service tiers data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [userTimezone]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};
