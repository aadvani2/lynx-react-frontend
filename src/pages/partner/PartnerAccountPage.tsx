import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import LoadingComponent from "../../components/common/LoadingComponent";

const PartnerLayout = lazy(() => import("../../layout/partner/PartnerLayout"));

// Dashboard
const DashboardContent = lazy(() => import("../../components/partner/DashboardContent/DashboardContent"));

// Pending Requests 
const NewRequestsContent = lazy(() => import("../../components/partner/NewRequestsContent"));
const RequestDetailsContent = lazy(() => import("../../components/partner/RequestDetailsContent.tsx"));

// Active Communication Requests
const ActiveCommunicationRequestsContent = lazy(() => import("../../components/partner/ActiveCommunicationRequestsContent"));
const OnHoldRequestDetailsIndex = lazy(() => import("../../components/partner/on-hold-request/OnHoldRequestDetails.index"));

// Accepted Requests
const AcceptedRequestsContent = lazy(() => import("../../components/partner/AcceptedRequestsContent"));
const AcceptedRequestDetails = lazy(() => import("../../components/partner/AcceptedRequestDetails"));

// In-Progress Requests
const InProgressRequestsContent = lazy(() => import("../../components/partner/in-progress-requests/InProgressRequestsContent"));
const InProgressRequestDetailsContent = lazy(() => import("../../components/partner/in-progress-request-details/InProgressRequestDetailsContent"));

// Completed Requests
const CompletedRequestsContent = lazy(() => import("../../components/partner/CompletedRequestsContent"));
const CompletedRequestDetails = lazy(() => import("../../components/partner/CompletedRequestsContentDetails.tsx"));

// Cancelled Requests
const CancelledRequestsContent = lazy(() => import("../../components/partner/CancelledRequestsContent"));
const CancelledRequestDetails = lazy(() => import("../../components/partner/CancelledRequestDetails"));

const EmployeesContent = lazy(() => import("../../components/partner/EmployeesContent"));
const ServiceTiersLocationContent = lazy(() => import("../../components/partner/ServiceTiersLocationContent"));
const ServiceTiersAvailabilityContent = lazy(() => import("../../components/partner/ServiceTiersAvailabilityContent"));
const AddModifyServicesContent = lazy(() => import("../../components/partner/AddModifyServicesContent"));
const BusinessProfileContent = lazy(() => import("../../components/partner/BusinessProfileContent"));
const PasswordSettingsContent = lazy(() => import("../../components/partner/PasswordSettingsContent"));
const ContactInformationContent = lazy(() => import("../../components/partner/ContactInformationContent"));
const NotificationsContent = lazy(() => import("../../components/partner/NotificationsContent"));
const ChangeTierContent = lazy(() => import("../../components/partner/change-tier/ChangeTierContent"));
const SettingsContent = lazy(() => import("../../components/partner/SettingsContent"));


const PartnerAccountPage = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedRequestId, setSelectedRequestId] = useState<number | undefined>();
  const [selectedRequestType, setSelectedRequestType] = useState<string>("pending");
  const [searchParams] = useSearchParams();
  const [acceptedRequestsEmployeeId, setAcceptedRequestsEmployeeId] = useState<number | null>(null); // Added state to manage employeeId for accepted requests
  const [inProgressRequestsEmployeeId, setInProgressRequestsEmployeeId] = useState<number | null>(null);
  const [completedRequestsEmployeeId, setCompletedRequestsEmployeeId] = useState<number | null>(null);
  const [cancelledRequestsEmployeeId, setCancelledRequestsEmployeeId] = useState<number | null>(null);

  // Check URL parameters on component mount
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      setActivePage(pageParam);
    }
  }, [searchParams]);

  const onOpenAcceptedRequestsFromDashboard = useCallback(() => {
    setAcceptedRequestsEmployeeId(null);
    setActivePage('accepted-requests');
  }, []);

  const onOpenInProgressRequestsFromDashboard = useCallback(() => {
    setInProgressRequestsEmployeeId(null);
    setActivePage('in-progress-requests');
  }, []);

  const onOpenCompletedRequestsFromDashboard = useCallback(() => {
    setCompletedRequestsEmployeeId(null);
    setActivePage('completed-requests');
  }, []);

  const onOpenCancelledRequestsFromDashboard = useCallback(() => {
    setCancelledRequestsEmployeeId(null);
    setActivePage('cancelled-requests');
  }, []);

  const onOpenAcceptedRequestsForEmployee = useCallback((employeeId: number) => {
    setAcceptedRequestsEmployeeId(employeeId);
    setActivePage('accepted-requests');
  }, []);

  const onOpenInProgressRequestsForEmployee = useCallback((employeeId: number) => {
    setInProgressRequestsEmployeeId(employeeId);
    setActivePage('in-progress-requests');
  }, []);

  const onOpenCompletedRequestsForEmployee = useCallback((employeeId: number) => {
    setCompletedRequestsEmployeeId(employeeId);
    setActivePage('completed-requests');
  }, []);

  const onOpenCancelledRequestsForEmployee = useCallback((employeeId: number) => {
    setCancelledRequestsEmployeeId(employeeId);
    setActivePage('cancelled-requests');
  }, []);

  const handleRequestSelection = (requestId: number, requestType: string = "pending") => {
    setSelectedRequestId(requestId);
    setSelectedRequestType(requestType);
    sessionStorage.setItem('selectedRequestId', requestId.toString()); // Store the request ID in session storage

    // Navigate to different pages based on request type
    if (requestType === "accepted") {
      setActivePage("accepted-request-details");
    } else if (requestType === "in-progress") {
      setActivePage("in-progress-request-details");
    } else if (requestType === "completed") {
      setActivePage("completed-request-details");
    } else if (requestType === "on-hold") {
      setActivePage("on-hold-request-details");
    } else {
      setActivePage("request-details");
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent
          setActivePage={setActivePage}
          onOpenAcceptedRequestsFromDashboard={onOpenAcceptedRequestsFromDashboard}
          onOpenInProgressRequestsFromDashboard={onOpenInProgressRequestsFromDashboard}
          onOpenCompletedRequestsFromDashboard={onOpenCompletedRequestsFromDashboard}
          onOpenCancelledRequestsFromDashboard={onOpenCancelledRequestsFromDashboard}
        />;
      case "new-requests":
        return <NewRequestsContent setActivePage={setActivePage} onRequestClick={handleRequestSelection} />;
      case "request-details":
        return <RequestDetailsContent
          setActivePage={setActivePage}
          requestId={selectedRequestId}
          requestType={selectedRequestType}
        />;
      case "active-communication-requests":
        return <ActiveCommunicationRequestsContent setActivePage={setActivePage} onViewDetails={handleRequestSelection} />;
      case "on-hold-request-details":
        return <OnHoldRequestDetailsIndex setActivePage={setActivePage} />;
      case "accepted-requests":
        return <AcceptedRequestsContent setActivePage={setActivePage} employeeId={acceptedRequestsEmployeeId} />;
      case "accepted-request-details":
        return <AcceptedRequestDetails
          setActivePage={setActivePage}
        />;

      case "in-progress-requests":
        return <InProgressRequestsContent setActivePage={setActivePage} onRequestClick={handleRequestSelection} employeeId={inProgressRequestsEmployeeId} />;
      case "in-progress-request-details":
        return <InProgressRequestDetailsContent
          requestId={selectedRequestId || 0}
          onBack={() => setActivePage("in-progress-requests")}
          setActivePage={setActivePage}
        />;
      case "completed-requests":
        return <CompletedRequestsContent setActivePage={setActivePage} employeeId={completedRequestsEmployeeId} />;
      case "completed-request-details":
        return <CompletedRequestDetails setActivePage={setActivePage} />;
      case "cancelled-requests":
        return <CancelledRequestsContent setActivePage={setActivePage} employeeId={cancelledRequestsEmployeeId} />;
      case "cancelled-request-details":
        return <CancelledRequestDetails setActivePage={setActivePage} />;
      case "manage_employees":
        return <EmployeesContent
          setActivePage={setActivePage}
          onOpenAcceptedRequestsForEmployee={onOpenAcceptedRequestsForEmployee}
          onOpenInProgressRequestsForEmployee={onOpenInProgressRequestsForEmployee}
          onOpenCompletedRequestsForEmployee={onOpenCompletedRequestsForEmployee}
          onOpenCancelledRequestsForEmployee={onOpenCancelledRequestsForEmployee}
        />;
      case "manage_service_tiers":
        return <ServiceTiersLocationContent setActivePage={setActivePage} />;
      case "manage_availability":
        return <ServiceTiersAvailabilityContent setActivePage={setActivePage} />;
      case "manage_services":
        return <AddModifyServicesContent setActivePage={setActivePage} />;
      case "business_profile":
        return <BusinessProfileContent setActivePage={setActivePage} />;
      case "password_settings":
        return <PasswordSettingsContent setActivePage={setActivePage} />;
      case "contact_information":
        return <ContactInformationContent setActivePage={setActivePage} />;
      case "notifications":
        return <NotificationsContent
          setActivePage={setActivePage}
          goToRequestDetails={(status, requestId) => {
            const normalizedStatus = status.toLowerCase().replace(' ', '-');

            // Set both state and sessionStorage
            setSelectedRequestId(requestId);
            setSelectedRequestType(normalizedStatus);
            sessionStorage.setItem('selectedRequestId', requestId.toString());

            if (normalizedStatus === "accepted") {
              setActivePage("accepted-request-details");
            } else if (normalizedStatus === "in-progress" || normalizedStatus === "in-process") {
              setActivePage("in-progress-request-details");
            } else if (normalizedStatus === "completed") {
              setActivePage("completed-request-details");
            } else if (normalizedStatus === "on-hold") {
              setActivePage("on-hold-request-details");
            } else if (normalizedStatus === "cancelled") {
              setActivePage("cancelled-request-details");
            } else {
              setActivePage("request-details");
            }
          }}
        />;
      case "settings":
        return <SettingsContent setActivePage={setActivePage} />;
      case "changeTier":
        return <ChangeTierContent />;
      default:
        return <DashboardContent
          setActivePage={setActivePage}
          onOpenAcceptedRequestsFromDashboard={onOpenAcceptedRequestsFromDashboard}
          onOpenInProgressRequestsFromDashboard={onOpenInProgressRequestsFromDashboard}
          onOpenCompletedRequestsFromDashboard={onOpenCompletedRequestsFromDashboard}
          onOpenCancelledRequestsFromDashboard={onOpenCancelledRequestsFromDashboard}
        />;
    }
  };

  return (
    <PartnerLayout setActivePage={setActivePage} activePage={activePage}>
      <Suspense fallback={<LoadingComponent />}>
        {renderContent()}
      </Suspense>
    </PartnerLayout>
  );
};

export default PartnerAccountPage;