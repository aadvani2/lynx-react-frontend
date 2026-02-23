import { useState, useEffect, useCallback } from 'react';
import { servicesService } from '../services/generalServices/servicesService';

// Blog interface based on the API response
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
  seo_description: string;
  seo_keywords: string;
  status: string;
  updated_by: number | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// Category interface based on the API response
interface Category {
  id: number;
  title: string;
  slug: string;
  blogs_count: number;
}

// API response interface
interface BlogsResponse {
  status: string;
  message: string;
  result: Blog[];
  categories: Category[];
  latest_blogs: Blog[];
  tags: string[];
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
}

type UseBlogsInput = string | { tag?: string; slug?: string } | undefined;

export const useBlogs = (input?: UseBlogsInput) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse input to extract tag and slug
  let tag: string | undefined;
  let slug: string | undefined;

  if (typeof input === 'string') {
    tag = input;
  } else if (input && typeof input === 'object') {
    tag = input.tag;
    slug = input.slug;
  }

  // Fetch blogs from API
  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let response: BlogsResponse;

      if (slug) {
        response = await servicesService.getBlogsBySlug(slug);
      } else {
        response = await servicesService.getBlogs(tag);
      }

      if (response && response.status === "1" && response.result) {
        setBlogs(response.result || []);
        setLatestBlogs(response.latest_blogs || []);
        setTags(response.tags || []);
        setCategories(response.categories || []);
        setPagination({
          current_page: response.current_page,
          total: response.total,
          per_page: response.per_page,
          last_page: response.last_page
        });
      } else {
        throw new Error('Failed to fetch blogs');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
    } finally {
      setIsLoading(false);
    }
  }, [tag, slug]);

  // Format date for display
  const formatDate = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }, []);

  // Load blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    // Data
    blogs,
    latestBlogs,
    tags,
    categories,
    pagination,
    isLoading,
    error,

    // Utility functions
    formatDate,

    // Actions
    refetch: fetchBlogs
  };
};
