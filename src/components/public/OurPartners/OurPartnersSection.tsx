import { useEffect, useState } from 'react';
import { servicesService } from '../../../services/generalServices/servicesService';
import type { ServicePartnerTier } from '../../../types/partners';
import BackendImage from '../../common/BackendImage/BackendImage';
import LoadingComponent from '../../common/LoadingComponent';

const OurPartnersSection = () => {
  const [servicePartnerTiers, setServicePartnerTiers] = useState<ServicePartnerTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await servicesService.getPartners();

        // Handle both direct response and wrapped response structures
        const responseData = response?.data || response;

        if (responseData?.status === '1' && responseData?.result) {
          setServicePartnerTiers(responseData.result);
        } else {
          console.error('Invalid response structure:', response);
          setError(responseData?.message || 'Failed to load partners');
        }
      } catch (err) {
        console.error('Error fetching partners:', err);
        // Check if it's a route not found error
        if (err instanceof Error && err.message.includes('Route not found')) {
          setError('API endpoint not found. Please check your backend server configuration.');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load partners');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Helper function to get tier description
  const getTierDescription = (tierName: string): string => {
    const name = tierName.toLowerCase();
    if (name.includes('eurasian')) {
      return 'Our most responsive pros. Ready for emergency, urgent, and scheduled jobs.';
    } else if (name.includes('iberian')) {
      return 'Available for urgent and scheduled service.';
    } else if (name.includes('bobcat')) {
      return 'Trusted for scheduled jobs only.';
    }
    return '';
  };


  if (loading) { return (<LoadingComponent />); }

  if (error) {
    return (
      <div className="container py-6 py-md-6">
        <div className="text-center">
          <p className="text-danger">Error: {error || 'Failed to load partners'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 py-md-6">
      <div className="col-xxl-10 mx-auto">
        <div className="col-12 mb-7 mb-lg-12 text-center">
          <h3 className="section-title mb-3">Not just anyone makes the list.</h3>
          <p>The providers you see here? They're the kind we’d let into our own homes. Licensed. Top-rated. Vetted by us.<br />
            We’ve partnered with a select group of companies that meet our highest standards - because you deserve real help, not a gamble.</p>
        </div>
        <div className="col-12 text-center">
          <h2 className="section-title">How We Choose Our Partners</h2>
          <h4 className="fs-20">We don’t work with everyone. We work with the best.</h4>
          <p className="mb-5 mt-2">Every Lynx partner must:</p>
          <div className="row gx-md-8 gy-5">
            <div className="col-md-6 col-lg-3 col-sm-6">
              <div className="icon btn btn-block btn-lg btn-soft-primary pe-none mb-5"> <i className="uil uil-file-alt" /> </div>
              <p className="mb-3">Hold active licensure and insurance</p>
            </div>
            {/*/column */}
            <div className="col-md-6 col-lg-3 col-sm-6">
              <div className="icon btn btn-block btn-lg btn-soft-primary pe-none mb-5"> <i className="uil uil-star" /> </div>
              <p className="mb-3">Maintain excellent customer ratings</p>
            </div>
            {/*/column */}
            <div className="col-md-6 col-lg-3 col-sm-6">
              <div className="icon btn btn-block btn-lg btn-soft-primary pe-none mb-5"> <i className="uil uil-shield-check" /> </div>
              <p className="mb-3">Pass our internal vetting process</p>
            </div>
            {/*/column */}
            <div className="col-md-6 col-lg-3 col-sm-6">
              <div className="icon btn btn-block btn-lg btn-soft-primary pe-none mb-5"> <i className="uil uil-user-arrows" /> </div>
              <p className="mb-3">Offer service we’d recommend to a neighbor</p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-10 mx-auto py-6">
        <div className="col-12 text-center">
          <h3 className="section-title mb-3">Our Partner Tiers [Explained Simply]</h3>
          <h4 className="fs-20">We organize our pros into three tiers based on how quickly they respond and what types of jobs they take:</h4>
        </div>
      </div>

      {/* Dynamically render partner tiers from API */}
      {servicePartnerTiers.map((tier, index) => {
        return (
          <div key={tier.id}>
            <div className="row gx-lg-8 gx-xl-12 gy-6 gy-lg-0 align-items-center">
              <div className="col-xl-3 col-lg-4 mt-lg-2 mobile-text-center">
                <h3 className="mb-3 pe-xxl-5">{tier.name}s</h3>
                <p className="mb-0">{getTierDescription(tier.name)}</p>
              </div>
              {/* /column */}
              <div className="col-xl-9 col-lg-8">
                {tier.partners && tier.partners.length > 0 ? (
                  <div className="row row-cols-4 row-cols-md-6 row-cols-lg-8 row-cols-xl-10 row-cols-xxl-12 align-items-center gx-4 gy-4 mobile-text-center">
                    {tier.partners.map((partner) => {
                      return (
                        <div key={partner.id} className="col">
                          <a href={partner.link} target="_blank" rel="noopener noreferrer">
                            <figure className="px-3 px-md-0 px-xxl-2">
                              <BackendImage
                                src={partner.image}
                                alt={partner.title || 'Partner logo'}
                                className="img-fluid"
                              />
                            </figure>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-muted">No partners available for this tier.</p>
                  </div>
                )}
                {/*/.row */}
              </div>
              {/* /column */}
            </div>
            {/* Add horizontal rule between tiers, but not after the last one */}
            {index < servicePartnerTiers.length - 1 && <hr className="my-3" />}
          </div>
        )
      })}

      {/* Show message if no tiers available */}
      {servicePartnerTiers.length === 0 && (
        <div className="text-center">
          <p className="text-muted">No partner tiers available at this time.</p>
        </div>
      )}
    </div>

  )
}

export default OurPartnersSection

