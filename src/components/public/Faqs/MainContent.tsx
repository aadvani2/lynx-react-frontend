import React, { useEffect, useState } from "react";
import { servicesService } from "../../../services/generalServices/servicesService";
import LoadingComponent from "../../common/LoadingComponent";

interface FAQ {
  id: number;
  type: 'customer' | 'provider';
  category: string;
  question: string;
  answer: string;
  status: string;
}

const FaqsMainContent: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'customer' | 'provider'>('customer');

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await servicesService.getFAQs();
        
        if (response?.success && response?.data?.faqs) {
          setFaqs(response.data.faqs);
        } else {
          setError('Failed to load FAQs');
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError('Failed to load FAQs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const customerFAQs = faqs.filter(faq => faq.type === 'customer');
  const providerFAQs = faqs.filter(faq => faq.type === 'provider');

  if (loading) {
    return (
      <section className="wrapper bg-light faqs-page">
        <div className="container pt-6 pb-10">
          <div className="row">
            <div className="col-12">
              <LoadingComponent />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="wrapper bg-light faqs-page">
        <div className="container pt-6 pb-10">
          <div className="row">
            <div className="col-12">
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const renderFAQs = (faqList: FAQ[], accordionId: string) => {
    if (faqList.length === 0) {
      return (
        <div className="alert alert-info" role="alert">
          No FAQs available at this time.
        </div>
      );
    }

    return (
      <div id={accordionId} className="accordion-wrapper accordion">
        {faqList.map((faq, index) => (
          <div key={faq.id} className="card accordion-item">
            <div className="card-header" id={`accordion-heading-${index}-${faq.id}`}>
              <button
                className="collapsed"
                data-bs-toggle="collapse"
                data-bs-target={`#accordion-collapse-${index}-${faq.id}`}
                aria-expanded="false"
                aria-controls={`accordion-collapse-${index}-${faq.id}`}
              >
                {faq.question}
              </button>
            </div>
            <div
              id={`accordion-collapse-${index}-${faq.id}`}
              className="collapse accordion-collapse"
              aria-labelledby={`accordion-heading-${index}-${faq.id}`}
              data-bs-parent={`#${accordionId}`}
            >
              <div className="card-body">
                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="wrapper bg-light faqs-page">
      <div className="container pt-6 pb-10">
        <div className="row">
          <div className="col-12">
            <h3 className="mb-4 mb-md-6">
              Here are some frequently asked questions. If you don't see an answer to your question, you can email us from our contact form.
            </h3>
            <ul className="nav nav-tabs nav-pills justify-content-center" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'customer' ? 'active' : ''}`}
                  onClick={() => setActiveTab('customer')}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'customer'}
                >
                  <span>Customer</span>
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'provider' ? 'active' : ''}`}
                  onClick={() => setActiveTab('provider')}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'provider'}
                >
                  <span>Service Partner</span>
                </button>
              </li>
            </ul>
            <div className="tab-content">
              <div
                className={`tab-pane fade ${activeTab === 'customer' ? 'active show' : ''}`}
                id="tab1-1"
                role="tabpanel"
              >
                <div className="row">
                  {renderFAQs(customerFAQs, 'accordion-3')}
                </div>
              </div>
              <div
                className={`tab-pane fade ${activeTab === 'provider' ? 'active show' : ''}`}
                id="tab1-2"
                role="tabpanel"
              >
                <div className="row gx-lg-8 gx-xl-12 gy-10">
                  {renderFAQs(providerFAQs, 'accordion-4')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqsMainContent;
