import { useEffect, useRef, useState } from 'react';
import { ExteriorServices, GeneralContractingServices, IndoorServices, LawnGardenServices, OtherServices, PremiumServices, RestorationCleaningServices } from './services';
import { useManageServices } from '../../hooks/useManageServices';
import { partnerService } from '../../services/partnerService/partnerService';
import Swal from 'sweetalert2';
import { loadSelect2 } from '../../utils/externalLoaders';

// Minimal jQuery typings to avoid 'any'
type JQueryElement = {
  select2: (options?: Record<string, unknown> | string) => void;
  val: (value?: string[] | string | null) => JQueryElement;
  trigger: (event: string) => void;
  hasClass: (className: string) => boolean;
};
type JQueryStatic = (el: Element | HTMLElement | string) => JQueryElement;
declare global {
  interface Window {
    jQuery?: JQueryStatic;
    $?: JQueryStatic;
  }
}

interface AddModifyServicesContentProps {
  setActivePage: (page: string) => void;
}

const AddModifyServicesContent: React.FC<AddModifyServicesContentProps> = ({ setActivePage }) => {
  const {
    isLoading,
    error,
    categories,
    serviceTypes,
    selectedServices,
    fetchManageServices,
  } = useManageServices();

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const handleBackToDashboard = () => {
    setActivePage("dashboard");
  };



  // Service Type options from API
  const serviceTypeOptions = serviceTypes.map(type => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1) // Capitalize first letter
  }));

  const serviceTypeSelectRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        await loadSelect2();
        if (!isMounted || !serviceTypeSelectRef.current) return;
        const jq: JQueryStatic | undefined = window.jQuery || window.$;
        if (!jq) return;

        const el = jq(serviceTypeSelectRef.current);
        if (!el.hasClass('select2-hidden-accessible')) {
          el.select2({ placeholder: 'Select Service Type', width: '100%' });
        }

        if (selectedServices.length > 0) {
          el.val(selectedServices).trigger('change');
        }
      } catch (err) {
        console.warn('Error initializing Select2:', err);
      }
    };

    init();

    return () => {
      isMounted = false;
      const jqCleanup: JQueryStatic | undefined = window.jQuery || window.$;
      if (jqCleanup && serviceTypeSelectRef.current) {
        try {
          const el = jqCleanup(serviceTypeSelectRef.current);
          if (el.hasClass('select2-hidden-accessible')) {
            el.select2('destroy');
          }
        } catch (err) {
          console.warn('Error cleaning up Select2:', err);
        }
      }
    };
  }, [selectedServices]);

  // Handle service type selection change
  const handleServiceTypeChange = (selectedValues: string[]) => {
    console.log('Selected service types:', selectedValues);
    // TODO: Implement service type selection logic
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Collect all checked service IDs from the form
      const form = document.getElementById('form-services') as HTMLFormElement;
      const checkedServices = form.querySelectorAll('input[name="services[]"]:checked');
      const selectedServiceIds = Array.from(checkedServices).map(checkbox => 
        parseInt((checkbox as HTMLInputElement).value)
      );

      // Collect selected service types
      const serviceTypeSelect = serviceTypeSelectRef.current;
      let selectedServiceTypes: string[] = [];
      if (serviceTypeSelect) {
        const jq: JQueryStatic | undefined = window.jQuery || window.$;
        if (jq) {
          const el = jq(serviceTypeSelect);
          const val = el.val();
          selectedServiceTypes = Array.isArray(val) ? val : [];
        }
      }


      // Validate that at least one service is selected
      if (selectedServiceIds.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'No Services Selected',
          text: 'Please select at least one service before saving.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        return;
      }

      // Make API call to save services
      const response = await partnerService.setServicesInfo({
        service_type: selectedServiceTypes,
        services: selectedServiceIds
      });

      // Close loading dialog
      Swal.close();

      console.log('API Response:', response);

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Services saved successfully!',
          showConfirmButton: false,
          timer: 1500
        });
        
        // Refresh the services data to get updated selections
        await fetchManageServices();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.message || 'Failed to save services. Please try again.',
          confirmButtonColor: '#dc3545',
          confirmButtonText: 'Try Again'
        });
      }
      
    } catch (err) {
      console.error('Error saving services:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while saving services. Please try again.',
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="alert alert-danger" role="alert">
            <i className="uil uil-exclamation-triangle me-2"></i>
            {error}
          </div>
          <button 
            className="btn btn-primary mt-3" 
            onClick={fetchManageServices}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header p-3 d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <button className="btn btn-primary btn-sm rounded-pill" onClick={handleBackToDashboard}>
            <i className="uil uil-arrow-left"></i> Back
          </button>
          &nbsp;&nbsp;
          <h4 className="card-title mb-0">Add/Modify Services</h4>
        </div>
      </div>
      <div className="card-body add-modify-services">
        <form id="form-services" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} noValidate>
          <div className="row">
            <div className="col-md-12">
              <p className="lead mb-1 text-start">Select Services</p>
              <p className="mb-1">What type of work do you do?</p>
              <div className="form-floating mb-4">
                <select
                  ref={serviceTypeSelectRef}
                  className="select2"
                  name="service_type[]"
                  multiple
                  data-placeholder="Select Service Type"
                  style={{ width: '100%' }}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    handleServiceTypeChange(selectedOptions);
                  }}
                >
                  {serviceTypeOptions.map(opt => (
                    <option 
                      key={opt.value} 
                      value={opt.value}
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mb-0">Tell us what kind of services you're looking to get as jobs</p>
            </div>

            {/* Render categories dynamically from API */}
            {categories.map(category => {
              // Map category slugs to component names
              const categoryComponentMap: Record<string, React.ComponentType<{ category?: typeof category }>> = {
                'indoor': IndoorServices,
                'exterior': ExteriorServices,
                'lawn-garden': LawnGardenServices,
                'premium': PremiumServices,
                'restoration-cleaning': RestorationCleaningServices,
                'general-contracting': GeneralContractingServices,
                'other': OtherServices,
              };
              const CategoryComponent = categoryComponentMap[category.slug];
              
              if (CategoryComponent) {
                return <CategoryComponent key={category.id} category={category} />;
              }
              
              return null;
            })}

            <div className="text-center mt-3">
              <button 
                type="submit" 
                className="btn btn-primary rounded-pill btn-login" 
                id="submit-services"
                disabled={isLoading || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModifyServicesContent; 