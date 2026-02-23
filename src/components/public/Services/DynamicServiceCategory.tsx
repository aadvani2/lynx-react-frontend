import React from 'react';
import { useNavigate } from 'react-router-dom';
import { updateSessionData } from '../../../utils/sessionDataManager';
import type { ServiceCategory, ServiceSubcategory } from '../../../types/services';

interface DynamicServiceCategoryProps {
  category: ServiceCategory;
}

const DynamicServiceCategory: React.FC<DynamicServiceCategoryProps> = ({ category }) => {
  const navigate = useNavigate();

  const handleSubcategoryClick = async (subcategory: ServiceSubcategory) => {
    try {
      // Store session data in localStorage (pre-login flow - no API call)
      updateSessionData({
        cat_id: category.id,
        sub_category_id: subcategory.id,
        sub_category: subcategory.title
      });

      // Navigate to the service booking page
      navigate(`/book-service/${category.slug}/${subcategory.slug}`);
    } catch (error) {
      console.error('Error storing session data:', error);
      // Still navigate even if storage fails
      navigate(`/book-service/${category.slug}/${subcategory.slug}`);
    }
  };

  return (
    <div className="card p-8 shadow-lg mt-4">
      <div className="d-flex align-items-center justify-content-center">
        {/* Icon */}
        <div className="me-3">
          <img
            src={`/storage/${category.image}`}
            className="icon-svg icon-svg-lg text-yellow"
            alt={category.title}
          />
        </div>
        {/* Title (Centered Vertically) */}
        <div className="d-flex flex-column text-start">
          <h4 className="mb-0 fw-bold">{category.title}</h4>
        </div>
      </div>
      <div className="divider-icon my-4"><i className="uil uil-arrow-down" /></div>
      {/* Description Below */}
      <div className="row gx-md-5 gy-5 pt-2">
        {category.subcategories
          .filter(subcategory => subcategory.status === 'active')
          .sort((a, b) => a.display_order - b.display_order)
          .map((subcategory) => {
            return (
              <div key={subcategory.id} className="col-md-6 col-xl-4 col-xxl-3 d-flex">
                <div
                  className="services-hover w-100 d-flex"
                  onClick={() => handleSubcategoryClick(subcategory)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card bg-soft-aqua border-1 p-4 w-100 justify-content-center">
                    <div className="d-flex align-items-center justify-content-start">
                      {/* Icon */}
                      <div className="me-3">
                        <img
                          src={`/storage/${subcategory.image}`}
                          className="icon-svg icon-svg-md text-yellow"
                          alt={subcategory.title}
                        />
                      </div>
                      {/* Title (Centered Vertically) */}
                      <div className="d-flex flex-column text-start">
                        <p className="mb-0">{subcategory.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  );
};

export default DynamicServiceCategory;
