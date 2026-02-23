import React, { useEffect, useState } from "react";
import { servicesService } from "../../../services/generalServices/servicesService";
import LoadingComponent from "../../common/LoadingComponent";

const CookiePolicyMainContent: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await servicesService.getPageContent('cookie-policy');
        
        if (response?.success) {
          // Handle empty content gracefully - it's not an error, just no content yet
          setContent(response.data?.content || '');
        } else {
          setError('Failed to load cookie policy');
        }
      } catch (err) {
        console.error('Error fetching cookie policy:', err);
        setError('Failed to load cookie policy. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <section className="wrapper bg-light">
        <div className="container pt-6 pb-10">
          <div className="row gx-md-5 gy-5">
            <div className="col-lg-12">
              <LoadingComponent />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="wrapper bg-light">
        <div className="container pt-6 pb-10">
          <div className="row gx-md-5 gy-5">
            <div className="col-lg-12">
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!content) {
    return (
      <section className="wrapper bg-light">
        <div className="container pt-6 pb-10">
          <div className="row gx-md-5 gy-5">
            <div className="col-lg-12">
              <div className="alert alert-info" role="alert">
                Cookie policy content is not available at this time.
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="wrapper bg-light">
      <div className="container pt-6 pb-10">
        <div className="row gx-md-5 gy-5">
          <div className="col-lg-12 terms-page">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CookiePolicyMainContent;
