import React from 'react';
import { useAuthStore } from '../../../store/authStore';

interface Service {
  id: number;
  title: string;
  slug: string;
  image: string;
}

interface ServiceData {
  success: boolean;
  data: {
    page: string;
    seo_title: string;
    seo_desc: string;
    menu: string;
    category: {
      id: number;
      title: string;
      slug: string;
    };
    subcategory: {
      id: number;
      title: string;
      slug: string;
    };
    services: Service[];
  };
}

interface ServiceDetailsSectionProps {
  serviceData: ServiceData | null;
  selectedServices: number[];
  onServiceChange: (serviceId: number) => void;
  onNext: () => void;
  isLoadingServiceTier: boolean;
}

const ServiceDetailsSection: React.FC<ServiceDetailsSectionProps> = ({
  serviceData,
  selectedServices,
  onServiceChange,
  onNext,
  isLoadingServiceTier
}) => {
  // Get user from auth store
  const { user } = useAuthStore();
  const isEmployee = user?.user_type === 'employee';
  const isPartner = user?.user_type === 'provider';
  const isReadOnlyUser = isEmployee || isPartner;

  // Helper function to check if image is empty or invalid
  const hasValidImage = (imageUrl: string) => {
    return imageUrl && imageUrl.trim() !== '' && imageUrl !== 'null' && imageUrl !== 'undefined';
  };

  return (
    <section id="service-details" className="wrapper bg-light wrapper-border">
      <div className="container pt-3 pb-10">
        {isReadOnlyUser ? (
          // Read-only view for employees and partners with dynamic data and no input circles
          <div id="service-list">
            <p className="lead px-xxl-10 text-center mb-6">
              Here is the list of available services
            </p>
            {serviceData?.data?.services && serviceData.data.services.length > 0 ? (
              <div className="row text-start">
                {serviceData.data.services.map((service: Service) => {
                  const hasImage = hasValidImage(service.image);
                  return (
                    <div key={service.id} className="col-md-12 col-lg-6 col-xl-4 d-flex">
                      <div className="service-card p-3 w-100 border rounded-pill">
                        <div className="d-flex align-items-center">
                          {hasImage && (
                            <img
                              src={service.image}
                              className="icon-svg icon-svg-md text-yellow me-3"
                              alt={service.title}
                            />
                          )}
                          <div>{service.title}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center">
                <div className="alert alert-warning" role="alert">
                  <h4 className="alert-heading">No Services Available</h4>
                  <p>No services were found for the selected category.</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Regular user view - show the normal booking UI
          <div id="service-list">
            <p className="lead px-xxl-10 text-center mb-6">
              Please select the issue(s) you're facing from the list below.
            </p>
            {serviceData?.data?.services && serviceData.data.services.length > 0 ? (
              <div className="row text-start">
                {serviceData.data.services.map((service: Service) => {
                  const hasImage = hasValidImage(service.image);
                  return (
                    <div key={service.id} className="col-md-12 col-lg-6 col-xl-4 d-flex">
                      <div className="inputGroup d-flex w-100">
                        <input
                          id={`service_${service.id}`}
                          name="bookServices"
                          className="bookServices"
                          data-id={service.id}
                          data-title={service.title}
                          type="checkbox"
                          defaultValue={service.id}
                          checked={selectedServices.includes(service.id)}
                          onChange={() => onServiceChange(service.id)}
                        />
                        <label htmlFor={`service_${service.id}`}>
                          {hasImage && (
                            <img
                              src={service.image}
                              className="icon-svg icon-svg-md text-yellow"
                              alt={service.title}
                            />
                          )}
                          <div>{service.title}</div>
                        </label>
                      </div>
                    </div>
                  );
                })}
                <div className="col-md-12 text-center mt-3">
                  <button
                    type="button"
                    id="bookServiceBtn"
                    className="btn btn-primary rounded-pill w-20"
                    onClick={onNext}
                    disabled={selectedServices.length === 0 || isLoadingServiceTier}
                  >
                    {isLoadingServiceTier ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Loading...
                      </>
                    ) : (
                      'Next'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="alert alert-warning" role="alert">
                  <h4 className="alert-heading">No Services Available</h4>
                  <p>No services were found for the selected category.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceDetailsSection; 