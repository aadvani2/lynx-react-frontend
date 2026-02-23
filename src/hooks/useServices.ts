import { useState, useEffect } from 'react';
import { servicesService } from '../services/generalServices/servicesService';
import type { ServiceCategory } from '../types/services';

// Define the structure of a category as returned by the API
// This interface is intentionally left here for future reference or if it needs to be different
// from the central ServiceCategory. For now, it's commented out.
// interface ServiceCategory {
//   id: number;
//   title: string;
//   slug: string;
//   description?: string;
//   image?: string;
//   color?: string;
//   seo_title?: string;
//   seo_description?: string;
//   seo_keywords?: string | null;
//   status?: string;
//   display_order: number;
//   updated_by?: number;
//   createdAt?: string;
//   updatedAt?: string;
//   deleted_at?: string | null;
//   subcategories?: Array<{
//     id: number;
//     title: string;
//     slug: string;
//   }>;
// }

export const useServices = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await servicesService.getServices();
        
        // Access categories directly from the response object
        if (response.success && response.categories) {
          // Sort categories by display_order
          const sortedCategories = response.categories
            .filter((category: ServiceCategory) => category.status === 'active')
            .sort((a: ServiceCategory, b: ServiceCategory) => a.display_order - b.display_order);
          
          setCategories(sortedCategories);
        } else {
          setError('Failed to load services data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { categories, loading, error };
};
