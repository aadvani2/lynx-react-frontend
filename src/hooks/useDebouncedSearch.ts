import { useState, useEffect, useCallback } from 'react';
import { useSearchSuggestions } from './useSearchSuggestions';

export const useDebouncedSearch = (delay: number = 300) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [bypassSearch, setBypassSearch] = useState(false);

  const {
    suggestions,
    loading,
    error,
    searchSuggestions,
    clearSuggestions,
    searchServicesFromSentence,
  } = useSearchSuggestions();

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchQuery, delay]);

  // Trigger /search-service-suggestion when debounced query changes
  useEffect(() => {
    if (bypassSearch) {
      // If bypass is active (sentence flow), don't trigger suggestions API
      return;
    }

    if (debouncedQuery.trim().length >= 3) {
      searchSuggestions(debouncedQuery);
      setShowSuggestions(true);
    } else {
      clearSuggestions();
      setShowSuggestions(false);
    }
  }, [debouncedQuery, searchSuggestions, clearSuggestions, bypassSearch]);

  const handleInputChange = useCallback((value: string) => {
    setBypassSearch(false); // user typing — go back to normal suggestion flow
    setSearchQuery(value);
  }, []);

  // This is used when we want to programmatically set the input
  // WITHOUT causing /search-service-suggestion calls.
  const setInputValueWithoutSearch = useCallback((value: string) => {
    setBypassSearch(true);
    setSearchQuery(value);
    // DON'T touch debouncedQuery here
  }, []);

  const handleInputFocus = useCallback(() => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [suggestions.length]);

  const handleInputBlur = useCallback(() => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  }, []);

  const resetBypassFlag = useCallback(() => {
    setBypassSearch(false);
  }, []);

  // IMPORTANT: run sentence -> services search manually
  const runSentenceSearch = useCallback(
    async (sentence: string) => {
      // Enter "sentence flow": avoid auto /search-service-suggestion
      setBypassSearch(true);
      setSearchQuery(sentence);
      await searchServicesFromSentence(sentence);
      setShowSuggestions(true);

      // We can keep debouncedQuery in sync so other consumers see the text,
      // but bypassSearch prevents the debounced effect from calling suggestions API.
      setDebouncedQuery(sentence);
    },
    [searchServicesFromSentence]
  );

  return {
    searchQuery,
    suggestions,
    loading,
    error,
    showSuggestions,
    setShowSuggestions,
    handleInputChange,
    setInputValueWithoutSearch,
    handleInputFocus,
    handleInputBlur,
    clearSuggestions,
    resetBypassFlag,
    runSentenceSearch,
  };
};
