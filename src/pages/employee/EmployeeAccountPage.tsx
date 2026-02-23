import React, { useEffect, useState, lazy, Suspense } from 'react';
import EmployeeLayout from '../../layout/employee/EmployeeLayout';
import { useSearchParams } from 'react-router-dom';
import LoadingComponent from '../../components/common/LoadingComponent';

/* --- Lazy Load All Dashboard Content Components --- */
const DashboardContent = lazy(() => import('../../components/employee/DashboardContent'));
const PasswordSettingsContent = lazy(() => import('../../components/employee/PasswordSettingsContent'));
const NotificationsContent = lazy(() => import('../../components/employee/NotificationsContent'));
const RequestsContent = lazy(() => import('../../components/employee/RequestsContent'));
const RequestDetailsComponent = lazy(() => import('../../components/employee/request-details/RequestDetailsComponent'));

const EmployeeAccountPage: React.FC = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [requestDetailsParams, setRequestDetailsParams] = useState<{
    requestId: number;
    requestType: string;
    currentPage: number;
  } | null>(null);
  const [searchParams] = useSearchParams();

  // Check URL parameters on component mount
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      setActivePage(pageParam);
    }
  }, [searchParams]);

  // Function to navigate to request details
  const navigateToRequestDetails = (requestId: number, requestType: string, currentPage: number) => {
    setRequestDetailsParams({ requestId, requestType, currentPage });
    setActivePage("request_details");
  };

  const getPageForRequestType = (type: string) => {
    switch (type) {
      case "accepted":
        return "requests_accepted";
      case "in process":
        return "requests_in process";
      case "completed":
        return "requests_completed";
      case "cancelled":
        return "requests_cancelled";
      default:
        return "requests_accepted";
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent setActivePage={setActivePage} />;
      case "password_settings":
        return <PasswordSettingsContent setActivePage={setActivePage} />;
      case "requests_accepted":
        return <RequestsContent setActivePage={setActivePage} onRequestClick={navigateToRequestDetails} requestType="accepted" />;
      case "requests_in process":
        return <RequestsContent setActivePage={setActivePage} onRequestClick={navigateToRequestDetails} requestType="in process" />;
      case "requests_completed":
        return <RequestsContent setActivePage={setActivePage} onRequestClick={navigateToRequestDetails} requestType="completed" />;
      case "requests_cancelled":
        return <RequestsContent setActivePage={setActivePage} onRequestClick={navigateToRequestDetails} requestType="cancelled" />;
      case "notifications":
        return <NotificationsContent setActivePage={setActivePage} />;
      case "request_details":
        return requestDetailsParams ? (
          <RequestDetailsComponent
            requestId={requestDetailsParams.requestId}
            requestType={requestDetailsParams.requestType}
            currentPage={requestDetailsParams.currentPage}
            onBack={() => {
              setActivePage(getPageForRequestType(requestDetailsParams.requestType));
              setRequestDetailsParams(null);
            }}
          />
        ) : (
          <DashboardContent setActivePage={setActivePage} />
        );
      default:
        return <DashboardContent setActivePage={setActivePage} />;
    }
  };

  return (
    <EmployeeLayout setActivePage={setActivePage} activePage={activePage}>
      <Suspense fallback={<LoadingComponent />}>
        {renderContent()}
      </Suspense>
    </EmployeeLayout>
  );
};

export default EmployeeAccountPage;
