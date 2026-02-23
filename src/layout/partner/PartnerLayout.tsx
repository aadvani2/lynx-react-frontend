import React, { useState, useEffect, lazy, Suspense } from 'react';
import { partnerService } from '../../services/partnerService/partnerService';
import { Link } from 'react-router-dom';
import LoadingComponent from '../../components/common/LoadingComponent';

const Header = lazy(() => import("./Header"));
const SideMenu = lazy(() => import("./SideMenu"));
const ChatWidget = lazy(() => import('../../components/common/ChatWidget'));

interface PartnerLayoutProps {
  children?: React.ReactNode;
  setActivePage: (page: string) => void;
  activePage: string;
}

const PartnerLayout = ({ children, setActivePage, activePage }: PartnerLayoutProps) => {
  const [alerts, setAlerts] = useState<
    { type: string; message: string; button?: { actionType: string; action: string; label: string } }[]
  >([]);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchDashboardInfo = async () => {
      try {
        setIsLoading(true);
        // Note: DashboardContent also calls getDashboardInfo, but request deduplication
        // will ensure only one network request is made - both components will share the same promise
        const response = await partnerService.getDashboardInfo();
        if (isMounted) {
          setAlerts(Array.isArray(response.alerts) ? response.alerts : []);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching dashboard info:', error);
          setAlerts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchDashboardInfo();
    
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  return (
    <div>
      <Suspense fallback={<LoadingComponent />}>
        <Header />
      </Suspense>

      <section className="wrapper">
        <div className="container pt-6 pb-10">
          <div className="d-flex flex-column align-items-center">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`alert alert-${alert.type} mb-2 alert-dismissible fade show d-flex align-items-center ${alert.type === 'warning' ? 'w-100 justify-content-between' : ''
                  }`}
                style={alert.type === 'warning' ? {} : { maxWidth: 'fit-content' }}
                role="alert"
              >
                <span className={alert.type === 'warning' ? 'flex-grow-1' : ''}>
                  <i className="uil uil-info-circle" />&nbsp;{alert.message}
                </span>

                <div className={`d-flex align-items-center ${alert.type === 'warning' ? '' : 'ms-3'}`}>
                  {alert.button?.actionType === 'route' && (
                    <Link to={alert.button.action} className="btn btn-sm btn-link">
                      {alert.button.label}
                    </Link>
                  )}

                  {alert.button?.actionType === 'external' && (
                    <a href={alert.button.action} target="_blank" rel="noopener noreferrer"
                      className="btn btn-sm btn-danger rounded-pill">
                      {alert.button.label}
                    </a>
                  )}

                  {alert.button?.actionType === 'modal' && (
                    <button
                      className="btn btn-sm btn-link text-primary"
                      data-bs-toggle="modal"
                      data-bs-target={alert.button.action}
                    >
                      {alert.button.label}
                    </button>
                  )}

                  <div className="cursor-pointer ms-2" data-bs-dismiss="alert" aria-label="Close">
                    <i className="uil uil-times" style={{ fontSize: "1.2rem" }}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row">
            <Suspense fallback={<LoadingComponent />}>
              <SideMenu setActivePage={setActivePage} activePage={activePage} />
            </Suspense>

            <div className="col lynx-my_account position-relative overflow-hidden">
              <div className="loader-main-v2 d-none">
                <span className="loader-v2"></span>
              </div>

              <div id="loadView">{children}</div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div></div>}>
        <ChatWidget />
      </Suspense>
    </div>
  );
};

export default PartnerLayout;
