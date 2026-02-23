import React from 'react';
import BackendImage from '../../../components/common/BackendImage/BackendImage';

// Interface for the API data structure - aligned with useManageServices hook
interface Service {
  id: number;
  title: string;
  description?: string;
  checked?: boolean;
}

interface Subcategory {
  id: number;
  title: string;
  slug: string;
  image: string;
  description?: string;
  services?: Service[];
}

interface LawnGardenServicesProps {
  category?: {
    id: number;
    title: string;
    slug: string;
    image: string;
    description: string;
    subcategories: Subcategory[];
  };
}

const LawnGardenServices: React.FC<LawnGardenServicesProps> = ({ category }) => {
  // If no category data is provided, show loading or fallback
  if (!category) {
    return (
      <div className="col-12 main-services-list">
        <div className="card">
          <div className="card-header bg-soft-aqua border-bottom p-2">
            <h5 className="d-flex align-items-center main-services-title">
              <BackendImage
              useBackendUrl={false}
                src="/storage/images/category/8KA5fXFgNJzMwfGaKyLe.webp"
                alt="Lawn & Garden Services"
                className="icon-services"
                placeholderText="No Image"
                transparentBackground={true}
              />
              <span className="ms-3">Lawn & Garden</span>
            </h5>
          </div>
          <div className="card-body p-3">
            <div className="text-center">
              <p>Loading lawn & garden services...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if category has subcategories
  if (!category.subcategories || category.subcategories.length === 0) {
    return (
      <div className="col-12 main-services-list">
        <div className="card">
          <div className="card-header bg-soft-aqua border-bottom p-2">
            <h5 className="d-flex align-items-center main-services-title">
              <BackendImage
              useBackendUrl={false}
                src={category.image}
                alt={category.title}
                className="icon-services"
                placeholderText="No Image"
                transparentBackground={true}
              />
              <span className="ms-3">{category.title}</span>
            </h5>
          </div>
          <div className="card-body p-3">
            <div className="text-center">
              <p>No subcategories available for this service.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-12 main-services-list">
      <div className="card">
        <div className="card-header bg-soft-aqua border-bottom p-2">
          <h5 className="d-flex align-items-center main-services-title">
            <BackendImage
            useBackendUrl={false}
              src={category.image}
              alt={category.title}
              className="icon-services"
              placeholderText="No Image"
              transparentBackground={true}
            />
            <span className="ms-3">{category.title}</span>
          </h5>
        </div>
        <div className="card-body p-3">
          <div className="row">
            <div className="sub-services-list">
              {category.subcategories.map((subcategory) => (
                <div key={subcategory.id} className="card m-1">
                  <div className="card-header bg-soft-primary p-2">
                    <h6 className="d-flex align-items-center sub-services-title">
                      <BackendImage
                      useBackendUrl={false}
                        src={subcategory.image}
                        alt={subcategory.title}
                        className="icon-services"
                        placeholderText="No Image"
                        transparentBackground={true}
                      />
                      <span className="ms-2">{subcategory.title}</span>
                    </h6>
                  </div>
                  <div className="card-body p-2">
                    <div className="select-services-list">
                      {subcategory.services?.map((service) => (
                        <div key={service.id} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="services[]"
                            defaultValue={service.id}
                            id={`service-${service.id}`}
                            defaultChecked={service.checked || false}
                          />
                          <label className="form-check-label" htmlFor={`service-${service.id}`}>
                            {service.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawnGardenServices; 