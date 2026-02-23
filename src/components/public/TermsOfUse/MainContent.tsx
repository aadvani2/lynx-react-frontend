import React, { useEffect, useState } from "react";
import { servicesService } from "../../../services/generalServices/servicesService";
import LoadingComponent from "../../common/LoadingComponent";

const TermsOfUseMainContent: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await servicesService.getPageContent('terms-of-use');
        
        if (response?.success) {
          // Handle empty content gracefully - it's not an error, just no content yet
          setContent(response.data?.content || '');
        } else {
          setError('Failed to load terms of use');
        }
      } catch (err) {
        console.error('Error fetching terms of use:', err);
        setError('Failed to load terms of use. Please try again later.');
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
                Terms of use content is not available at this time.
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

export default TermsOfUseMainContent;
