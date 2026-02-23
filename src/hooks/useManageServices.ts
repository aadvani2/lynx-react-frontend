import { useState, useEffect } from 'react';
import { partnerService } from '../services/partnerService/partnerService';
import type { ApiResponse } from '../types/api';

// Interface for subcategory items
interface SubcategoryItem {
  id: number;
  title: string;
  slug: string;
  image: string;
  description?: string;
  services?: Array<{
    id: number;
    title: string;
    description?: string;
    checked?: boolean;
  }>;
}

// Interface for category items
interface CategoryItem {
  id: number;
  title: string;
  slug: string;
  image: string;
  description: string;
  subcategories: SubcategoryItem[];
}

// Interface for the manage services API response
interface ManageServicesData {
  page: string;
  seo_title: string;
  menu: string;
  categories: CategoryItem[];
  service_type: string[];
  services: string[]; // Array of selected service types (e.g., ["commercial"])
  service_types: string[];
  selected_service_types: string[];
}

interface UseManageServicesReturn {
  isLoading: boolean;
  error: string | null;
  categories: CategoryItem[];
  serviceTypes: string[];
  selectedServices: string[]; // Changed to string[] for service types
  setSelectedServices: (services: string[]) => void;
  fetchManageServices: () => Promise<void>;
}

export const useManageServices = (): UseManageServicesReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Fetch manage services data
  const fetchManageServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: ApiResponse<ManageServicesData> = await partnerService.getManageServicesInfo();
      
      if (response.success && response.data) {
        // Set categories if they exist
        if (response.data.categories) {
          setCategories(response.data.categories);
        }
        
        // Set service types if they exist
        if (response.data.service_types) {
          setServiceTypes(response.data.service_types);
        }
        
        // Set selected services if they exist
        if (response.data.selected_service_types) {
          setSelectedServices(response.data.selected_service_types);
        }
      } else {
        setError(response.message || 'Failed to fetch services data');
      }
    } catch (err) {
      console.error('Error fetching manage services:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch services data on component mount
    fetchManageServices();
  }, []);

  return {
    isLoading,
    error,
    categories,
    serviceTypes,
    selectedServices,
    setSelectedServices,
    fetchManageServices,
  };
}; 