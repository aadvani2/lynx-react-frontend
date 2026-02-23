import { useState, useCallback } from 'react';
import { servicesService } from '../services/generalServices/servicesService';

export const useSearchService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any>(null);

  const searchService = useCallback(async (searchText: string) => {
    setLoading(true);
    setError(null);
    setSearchResults(null);

    try {
      const response = await servicesService.searchService(searchText);
      setSearchResults(response);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to search service';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults(null);
    setError(null);
  }, []);

  return {
    searchService,
    loading,
    error,
    searchResults,
    clearResults
  };
};
