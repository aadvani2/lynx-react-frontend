import { useState, useCallback } from 'react';
import { servicesService } from '../services/generalServices/servicesService';

export interface SearchSuggestion {
  type: 'sentence' | 'service';

  service_id?: number;
  category_id?: number;
  sub_category_id?: number;

  score?: number;
  text?: string;
  title?: string;
  category?: string;
  sub_category?: string;
}

export interface SearchSuggestionsResponse {
  suggestions: SearchSuggestion[];
}

export const useSearchSuggestions = () => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * /search-service-suggestion?q=...&searchForm=service
   * Returns mixed "sentence" + "service" suggestions.
   */
  const searchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await servicesService.searchServiceSuggestions(query);

      // Defensive: handle different response shapes
      // Possible: { suggestions: [...] } OR { data: { suggestions: [...] } }
      const raw =
        (response && (response as any).data?.suggestions) ||
        (response && (response as any).suggestions) ||
        response;

      const nextSuggestions: SearchSuggestion[] = Array.isArray(raw)
        ? raw
        : [];

      setSuggestions(nextSuggestions);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch suggestions';
      setError(errorMessage);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * /search?search=<sentence>&searchForm=service
   * Take the sentence text, call the service search API, and map response to
   * pure "service" suggestions.
   */
  const searchServicesFromSentence = useCallback(async (sentence: string) => {
    if (!sentence.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await servicesService.searchService(sentence);

      // Be defensive about shape:
      // Possible: { data: { services: [...] } } OR { services: [...] } OR [ ... ]
      const rawServices =
        (response && (response as any).data?.services) ||
        (response && (response as any).services) ||
        response;

      const servicesArray: any[] = Array.isArray(rawServices)
        ? rawServices
        : [];

      const mapped: SearchSuggestion[] = servicesArray.map((s: any) => ({
        type: 'service',
        service_id: s?.id ?? s?.service_id,
        category_id: s?.category_id,
        sub_category_id: s?.sub_category_id,
        title: s?.title ?? s?.name ?? '',
        category: s?.category ?? s?.category_title ?? s?.category_name,
        sub_category:
          s?.sub_category ?? s?.sub_category_title ?? s?.sub_category_name,
        score: s?.score,
      }));

      setSuggestions(mapped);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to search service';
      setError(errorMessage);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    suggestions,
    loading,
    error,
    searchSuggestions,
    searchServicesFromSentence,
    clearSuggestions,
  };
};
