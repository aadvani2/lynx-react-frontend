import React, { useEffect, useState, lazy, Suspense } from 'react';
import CustomerLayout from '../../layout/customer/CustomerLayout';
import { goToRequestDetails } from '../../utils/notificationNavigation';
import { useSearchParams } from 'react-router-dom';
import LoadingComponent from '../../components/common/LoadingComponent';

/* --- Lazy Load All Dashboard Content Components --- */
const DashboardContent = lazy(() => import('../../components/customer/dashboard/DashboardContent'));
const ProfileContent = lazy(() => import('../../components/customer/ProfileContent'));
const PasswordSettingsContent = lazy(() => import('../../components/customer/PasswordSettingsContent'));
const RequestsContent = lazy(() => import('../../components/customer/RequestsContent'));
const SubscriptionDetailsContent = lazy(() => import('../../components/customer/SubscriptionDetailsContent'));
const UpgradeSubscriptionContent = lazy(() => import('../../components/customer/UpgradeSubscriptionContent'));
const ServiceLocationsContent = lazy(() => import('../../components/customer/ServiceLocationsContent/ServiceLocationsContent'));
const ContactInformationContent = lazy(() => import('../../components/customer/ContactInformationContent'));
const NotificationsContent = lazy(() => import('../../components/customer/notifications/NotificationsContent'));
const SettingsContent = lazy(() => import('../../components/customer/SettingsContent'));
const ReferralsContent = lazy(() => import('../../components/customer/ReferralsContent'));

/* --- Lazy Load Request Details Pages --- */
const PendingRequestDetailsPage = lazy(() => import('../../components/customer/request-details-new/PendingRequestDetailsPage/PendingRequestDetailsPage'));
const AcceptedRequestDetailsPage = lazy(() => import('../../components/customer/request-details-new/AcceptedRequestDetailsPage/AcceptedRequestDetailsPage'));
const InProcessRequestDetailsPage = lazy(() => import('../../components/customer/request-details-new/InProcessRequestDetailsPage/InProcessRequestDetailsPage'));
const CompletedRequestDetailsPage = lazy(() => import('../../components/customer/request-details-new/CompletedRequestDetailsPage/CompletedRequestDetailsPage'));
const CancelledRequestDetailsPage = lazy(() => import('../../components/customer/request-details-new/CancelledRequestDetailsPage/CancelledRequestDetailsPage'));
const OnHoldRequestDetailsPage = lazy(() => import('../../components/customer/request-details-new/OnHoldRequestDetailsPage/OnHoldRequestDetailsPage'));

const CustomerAccountPage: React.FC = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) setActivePage(pageParam);
  }, [searchParams]);

  const navigateToRequestDetails = goToRequestDetails(setActivePage);

  const renderContent = () => {

    /** ----- Request Details ----- */
    if (activePage.startsWith('details_')) {
      const parts = activePage.split('_');

      let status = '';
      let requestId = '';
      let currentPage = '';

      if (parts[1] === 'in' && parts[2] === 'process') {
        status = 'in_process';
        requestId = parts[3];
        currentPage = parts[4];
      } else if (parts[1] === 'on' && parts[2] === 'hold') {
        status = 'on_hold';
        requestId = parts[3];
        currentPage = parts[4];
      } else {
        status = parts[1];
        requestId = parts[2];
        currentPage = parts[3];
      }

      const id = parseInt(requestId);
      const page = parseInt(currentPage) || 1;

      switch (status) {
        case 'pending':
          return <PendingRequestDetailsPage setActivePage={setActivePage} requestId={id} currentPage={page} />;
        case 'accepted':
          return <AcceptedRequestDetailsPage setActivePage={setActivePage} requestId={id} currentPage={page} />;
        case 'in_process':
          return <InProcessRequestDetailsPage setActivePage={setActivePage} requestId={id} currentPage={page} />;
        case 'completed':
          return <CompletedRequestDetailsPage setActivePage={setActivePage} requestId={id} currentPage={page} />;
        case 'cancelled':
          return <CancelledRequestDetailsPage setActivePage={setActivePage} requestId={id} currentPage={page} />;
        case 'on_hold':
          return <OnHoldRequestDetailsPage setActivePage={setActivePage} requestId={id} currentPage={page} />;
      }
    }

    /** ----- Badge → Requests Filter ----- */
    if (activePage.startsWith('requests_')) {
      const requestType = activePage.replace('requests_', '');
      return <RequestsContent setActivePage={setActivePage} requestType={requestType} />;
    }

    /** ----- Standard Pages ----- */
    switch (activePage) {
      case "dashboard":
        return <DashboardContent setActivePage={setActivePage} />;
      case "my_requests":
        return <RequestsContent setActivePage={setActivePage} requestType="all" />;
      case "edit_profile":
        return <ProfileContent setActivePage={setActivePage} />;
      case "password_settings":
        return <PasswordSettingsContent setActivePage={setActivePage} />;
      // case "save_cards":
      //   return <SavedCardsContent setActivePage={setActivePage} />;
      case "addresses":
        return <ServiceLocationsContent setActivePage={setActivePage} />;
      // case "transaction_history":
      //   return <TransactionHistoryContent setActivePage={setActivePage} />; // Using BillingContent for transaction history
      case "contact_information":
        return <ContactInformationContent setActivePage={setActivePage} />;
      case "notifications":
        return <NotificationsContent setActivePage={setActivePage} goToRequestDetails={navigateToRequestDetails} />;
      case "settings":
        return <SettingsContent setActivePage={setActivePage} />;
      case "referrals":
        return <ReferralsContent setActivePage={setActivePage} />;
      case "subscription_details":
        return <SubscriptionDetailsContent setActivePage={setActivePage} />;
      case "upgrade_subscription":
        return <UpgradeSubscriptionContent setActivePage={setActivePage} />;
      default:
        return <DashboardContent setActivePage={setActivePage} />;
    }
  };

  return (
    <CustomerLayout setActivePage={setActivePage} activePage={activePage}>
      <Suspense fallback={<LoadingComponent />}>
        {renderContent()}
      </Suspense>
    </CustomerLayout>
  );
};

export default CustomerAccountPage;
