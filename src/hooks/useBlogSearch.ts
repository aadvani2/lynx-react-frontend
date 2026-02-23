import { useState, useCallback } from 'react';
import { servicesService } from '../services/generalServices/servicesService';

// Blog interface matching the API response
interface Blog {
  id: number;
  title: string;
  slug: string;
  likes: number;
  category_id: number;
  description: string;
  image: string | null;
  date: string;
  tags: string;
  seo_title: string;
  seo_description: string | null;
  seo_keywords: string | null;
  status: string;
  updated_by: number | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}


// Simple search result interface for the actual API response
interface SimpleBlogSearchResult {
  title: string;
  slug: string;
}

export const useBlogSearch = () => {
  const [searchResults, setSearchResults] = useState<Blog[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Search blogs function
  const searchBlogs = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setSearchTerm('');
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);
      setSearchTerm(term);
      
      const response = await servicesService.searchBlogs(term);
      
      // Handle the actual API response format (array of simple objects)
      if (Array.isArray(response)) {
        // Convert simple search results to full Blog objects for consistency
        const fullBlogResults: Blog[] = response.map((item: SimpleBlogSearchResult, index: number) => ({
          id: index + 1, // Generate temporary ID
          title: item.title,
          slug: item.slug,
          likes: 0,
          category_id: 1,
          description: '',
          image: null,
          date: new Date().toISOString(),
          tags: '',
          seo_title: item.title,
          seo_description: null,
          seo_keywords: null,
          status: 'published',
          updated_by: null,
          deleted_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        setSearchResults(fullBlogResults);
      } else if (response && response.status === "1" && response.result) {
        setSearchResults(response.result || []);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error searching blogs:', err);
      setSearchError(err instanceof Error ? err.message : 'Failed to search blogs');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Clear search results
  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchTerm('');
    setSearchError(null);
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    searchTerm,
    searchBlogs,
    clearSearch,
  };
};
