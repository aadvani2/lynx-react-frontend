import React, { useState, useEffect } from 'react';
import { servicesService } from '../../../services/generalServices/servicesService';

interface SelectedService {
  id: number;
  title: string;
  category?: string;
  sub_category?: string;
}

interface ServiceSearchInputProps {
  defaultSelectedServices?: number[];
}

const ServiceSearchInput: React.FC<ServiceSearchInputProps> = ({ defaultSelectedServices = [] }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<{
    service_id: number;
    title?: string;
    name?: string;
    category?: string;
    sub_category?: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);

  // Function to call the search API using the service pattern
  const searchServices = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Using the services pattern for API call
      const response = await servicesService.searchService(query);
      console.log('Search API Response:', response);
      
      // Handle the response based on its structure
      const results = response.data || response.services || response || [];
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching services:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Call search API when search term changes (with debounce)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim().length >= 3) {
        searchServices(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    if (searchTerm) {
      // Immediate search on button click (no debounce)
      searchServices(searchTerm);
    }
  };
  
  const handleSelectService = (service: {
    service_id: number;
    title?: string;
    name?: string;
    category?: string;
    sub_category?: string;
  }) => {
    // Check if service is already selected
    if (!selectedServices.some(selected => selected.id === service.service_id)) {
      const newService: SelectedService = {
        id: service.service_id,
        title: service.title || service.name || 'Untitled Service',
        category: service.category,
        sub_category: service.sub_category
      };
      
      setSelectedServices([...selectedServices, newService]);
      setSearchTerm('');
      setSearchResults([]);
    }
  };
  
  const handleRemoveService = (serviceId: number) => {
    setSelectedServices(selectedServices.filter(service => service.id !== serviceId));
  };

  // Load default selected services on mount and fetch their names
  useEffect(() => {
    if (defaultSelectedServices && defaultSelectedServices.length > 0 && selectedServices.length === 0) {
      // Fetch service details for each service ID
      const loadServices = async () => {
        try {
          const loadedServices: SelectedService[] = [];
          
          // Use manage services API to get all services with their details
          try {
            const { partnerService } = await import('../../../services/partnerService/partnerService');
            const manageServicesResponse = await partnerService.getManageServicesInfo();
            
            // Flatten the categories -> subcategories -> services structure
            const allServicesMap = new Map<number, { title: string; category?: string; sub_category?: string }>();
            
            if (manageServicesResponse?.data?.categories && Array.isArray(manageServicesResponse.data.categories)) {
              manageServicesResponse.data.categories.forEach((category: any) => {
                const categoryTitle = category.title || '';
                if (category.subcategories && Array.isArray(category.subcategories)) {
                  category.subcategories.forEach((subcategory: any) => {
                    const subcategoryTitle = subcategory.title || '';
                    if (subcategory.services && Array.isArray(subcategory.services)) {
                      subcategory.services.forEach((service: any) => {
                        if (service.id) {
                          allServicesMap.set(service.id, {
                            title: service.title || service.name || `Service ${service.id}`,
                            category: categoryTitle,
                            sub_category: subcategoryTitle
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
            
            // Match services by ID from the map
            defaultSelectedServices.forEach(serviceId => {
              const serviceDetails = allServicesMap.get(serviceId);
              if (serviceDetails) {
                loadedServices.push({
                  id: serviceId,
                  title: serviceDetails.title,
                  category: serviceDetails.category,
                  sub_category: serviceDetails.sub_category
                });
              } else {
                // If not found in manage services, try search API as fallback
                loadedServices.push({
                  id: serviceId,
                  title: `Service ${serviceId}`, // Will be updated if search finds it
                });
              }
            });
            
            // For services not found in manage services, try search API
            const missingServices = loadedServices.filter(s => s.title.startsWith('Service '));
            if (missingServices.length > 0) {
              try {
                // Try searching for each missing service
                for (const missingService of missingServices) {
                  try {
                    const searchResponse = await servicesService.searchService('');
                    const servicesData = searchResponse?.data?.services || 
                                        searchResponse?.services || 
                                        searchResponse?.data || 
                                        (Array.isArray(searchResponse) ? searchResponse : []);
                    
                    const foundService = Array.isArray(servicesData) 
                      ? servicesData.find((s: any) => (s.id === missingService.id || s.service_id === missingService.id))
                      : null;
                    
                    if (foundService) {
                      const serviceIndex = loadedServices.findIndex(s => s.id === missingService.id);
                      if (serviceIndex >= 0) {
                        loadedServices[serviceIndex] = {
                          id: missingService.id,
                          title: foundService.title || foundService.name || `Service ${missingService.id}`,
                          category: foundService.category || foundService.category_title || foundService.category_name,
                          sub_category: foundService.sub_category || foundService.sub_category_title || foundService.sub_category_name
                        };
                      }
                    }
                  } catch (searchError) {
                    console.warn(`Error searching for service ${missingService.id}:`, searchError);
                  }
                }
              } catch (searchError) {
                console.warn('Error in fallback search:', searchError);
              }
            }
            
            setSelectedServices(loadedServices);
          } catch (manageServicesError) {
            console.warn('Error fetching manage services, trying search API:', manageServicesError);
            // Fallback to search API
            try {
              const searchResponse = await servicesService.searchService('');
              const servicesData = searchResponse?.data?.services || 
                                  searchResponse?.services || 
                                  searchResponse?.data || 
                                  (Array.isArray(searchResponse) ? searchResponse : []);
              
              defaultSelectedServices.forEach(serviceId => {
                const foundService = Array.isArray(servicesData) 
                  ? servicesData.find((s: any) => (s.id === serviceId || s.service_id === serviceId))
                  : null;
                
                if (foundService) {
                  loadedServices.push({
                    id: serviceId,
                    title: foundService.title || foundService.name || `Service ${serviceId}`,
                    category: foundService.category || foundService.category_title || foundService.category_name,
                    sub_category: foundService.sub_category || foundService.sub_category_title || foundService.sub_category_name
                  });
                } else {
                  loadedServices.push({
                    id: serviceId,
                    title: `Service ${serviceId}`,
                  });
                }
              });
              
              setSelectedServices(loadedServices);
            } catch (searchError) {
              console.error('Error in fallback search:', searchError);
              // Final fallback to placeholder services
              const placeholderServices: SelectedService[] = defaultSelectedServices.map(id => ({
                id: id,
                title: `Service ${id}`,
              }));
              setSelectedServices(placeholderServices);
            }
          }
        } catch (error) {
          console.error('Error loading default services:', error);
          // Fallback to placeholder services
          const loadedServices: SelectedService[] = defaultSelectedServices.map(id => ({
            id: id,
            title: `Service ${id}`,
          }));
          setSelectedServices(loadedServices);
        }
      };
      loadServices();
    }
  }, [defaultSelectedServices, selectedServices.length]);

  return (
    <>
      <div className="col-md-12">
        <p className="mb-1">Tell us what kind of services you're looking to get as jobs</p>
        <div className="input-group onboarding-search-bar">
          <input
            id="service-text"
            type="text"
            name="service_name"
            className="form-control"
            placeholder="Search services"
            autoComplete="off"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button className="btn" type="button" id="service_search" onClick={handleSearchClick}>Search</button>
          <div id="suggestions-list" className="suggestions-list" style={{ display: searchResults.length > 0 || isLoading ? 'block' : 'none' }}>
            {isLoading ? (
              <div className="suggestion-item">Loading...</div>
            ) : (
              searchResults.map((result, index) => (
                <div 
                  key={index} 
                  className="suggestion-item select-service" 
                  data-index={index} 
                  data-service_id={result.service_id}
                  onClick={() => handleSelectService(result)}
                >
                  <span>{result.title || result.name} {result.category && result.sub_category ? `> ${result.sub_category}` : ''}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="col-md-12 mb-3 mt-3">
        <div id="selected-list">
          {selectedServices.map((service, index) => (
            <div 
              key={service.id} 
              className="selected-item d-flex align-items-center mb-2 ps-2 border rounded" 
              data-index={index} 
              data-service_id={service.id}
            >
              <span className="me-3">{service.title} {service.category && service.sub_category ? `> ${service.sub_category}` : ''}</span>
              <input type="hidden" name="services[]" value={service.id} />
              <button 
                className="btn btn-circle btn-outline-danger btn-sm remove-service ms-auto m-1"
                onClick={() => handleRemoveService(service.id)}
              >
                <span><i className="uil uil-multiply"></i></span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ServiceSearchInput;
