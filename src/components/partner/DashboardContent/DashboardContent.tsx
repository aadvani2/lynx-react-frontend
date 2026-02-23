import { partnerService } from '../../../services/partnerService/partnerService';
import { useEffect, useState, lazy, Suspense } from 'react';
import { useAvailabilityStore } from '../../../store/availabilityStore';
import { usePartnerDashboardStore } from '../../../store/partnerDashboardStore';
import LoadingComponent from '../../common/LoadingComponent';
const PrivacyPolicyModal = lazy(() => import('./components/PrivacyPolicyModal'));
const LynxAgreementModal = lazy(() => import('./components/LynxAgreementModal'));
interface DashboardContentProps {
  setActivePage: (page: string) => void;
  onOpenAcceptedRequestsFromDashboard: () => void; // Added prop for accepted requests from dashboard
  onOpenInProgressRequestsFromDashboard: () => void;
  onOpenCompletedRequestsFromDashboard: () => void;
  onOpenCancelledRequestsFromDashboard: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ setActivePage, onOpenAcceptedRequestsFromDashboard, onOpenInProgressRequestsFromDashboard, onOpenCompletedRequestsFromDashboard, onOpenCancelledRequestsFromDashboard }) => {
  interface DashboardStats {
    members: number;
    pending: number;
    accepted: number;
    completed: number;
    in_process: number;
    onhold: number;
    cancelled: number;
  }

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [availability, setAvailability] = useState<boolean>(false); // Default to false, will be updated from API
  const [availabilityLoading, setAvailabilityLoading] = useState<boolean>(false);
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState<boolean>(false);
  const [showLynxAgreementModal, setShowLynxAgreementModal] = useState<boolean>(false);
  const [isAcceptingPolicy, setIsAcceptingPolicy] = useState<boolean>(false);
  const setAvailabilityGlobal = useAvailabilityStore((s) => s.setAvailability);
  const { setDashboardData } = usePartnerDashboardStore();

  // Handler functions for different actions
  const handleAvailabilityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isAvailable = e.target.checked;
    setAvailability(isAvailable); // Update local state immediately for better UX
    setAvailabilityGlobal(isAvailable); // Sync global state for other components (e.g., SideMenu)
    const actionText = isAvailable ? 'make yourself available' : 'make yourself unavailable';

    // Dynamic import of SweetAlert2
    const Swal = (await import('sweetalert2')).default;

    Swal.fire({
      title: 'Change Availability',
      html: `Are you sure you want to ${actionText}? You will ${isAvailable ? 'start receiving' : 'not receive'} new request notifications if you are ${isAvailable ? 'available' : 'not available'}.`,
      imageUrl: '',
      imageWidth: 77,
      imageHeight: 77,
      showCancelButton: false,
      showDenyButton: false,
      confirmButtonText: 'Yes, change it!',
      confirmButtonColor: '#0d6efd',
      customClass: {
        popup: 'swal2-popup swal2-modal swal2-show',
        container: 'swal2-container swal2-center swal2-backdrop-show',
        confirmButton: 'btn btn-primary rounded-pill w-20'
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setAvailabilityLoading(true); // Start loading
          await partnerService.setAvailability(isAvailable);
        } catch (err) {
          // Revert the local state and show error
          setAvailability(!isAvailable);
          setAvailabilityGlobal(!isAvailable);
          const message = err instanceof Error ? err.message : 'Failed to update availability';
          Swal.fire({
            title: 'Error',
            text: message,
            icon: 'error',
            confirmButtonColor: '#0d6efd',
            customClass: {
              popup: 'swal2-popup swal2-modal swal2-show',
              container: 'swal2-container swal2-center swal2-backdrop-show',
              confirmButton: 'btn btn-primary rounded-pill'
            },
            buttonsStyling: false
          });
          return;
        } finally {
          setAvailabilityLoading(false); // End loading
        }

        // Show success message
        Swal.fire({
          title: 'Success!',
          text: `Your availability has been ${isAvailable ? 'enabled' : 'disabled'} successfully.`,
          icon: 'success',
          confirmButtonColor: '#0d6efd',
          customClass: {
            popup: 'swal2-popup swal2-modal swal2-show',
            container: 'swal2-container swal2-center swal2-backdrop-show',
            confirmButton: 'btn btn-primary rounded-pill'
          },
          buttonsStyling: false
        });
      } else {
        // Revert the local state if user cancels
        setAvailability(!isAvailable);
        setAvailabilityGlobal(!isAvailable);
      }
    });
  };

  const handleNewRequests = () => {
    setActivePage('new-requests');
  };

  const handleActiveCommunication = () => {
    setActivePage('active-communication-requests');
  };

  const handleOpenRequests = (status: string) => {
    const map: Record<string, string> = {
      accepted: 'accepted-requests',
      'in process': 'in-progress-requests',
      completed: 'completed-requests',
      cancelled: 'cancelled-requests',
    };
    const page = map[status] || 'dashboard';

    if (status === 'accepted') {
      onOpenAcceptedRequestsFromDashboard(); // Use the new callback for accepted requests
    } else if (status === 'in process') {
      onOpenInProgressRequestsFromDashboard();
    } else if (status === 'completed') {
      onOpenCompletedRequestsFromDashboard();
    } else if (status === 'cancelled') {
      onOpenCancelledRequestsFromDashboard();
    } else {
      setActivePage(page);
    }
  };

  const handleOpenModifyServices = () => {
    setActivePage('manage_services');
  };

  const handleOpenServiceTiers = () => {
    setActivePage('manage_service_tiers');
  };

  const handleOpenAvailabilitySchedule = () => {
    setActivePage('manage_availability');
  };

  const handleOpenTechnicians = () => {
    setActivePage('manage_employees');
  };

  // Fetch dashboard info on mount
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchDashboardInfo = async () => {
      try {
        const res = await partnerService.getDashboardInfo();
        
        if (!isMounted) return;

        if (res.stats) {
          setDashboardStats(res.stats);
        }

        const { rating, ratingCount, servicePartnerTierName } = res;

        setDashboardData(rating, ratingCount, servicePartnerTierName);

        // Availability from provider
        const availFromApi = res.availFromApi;
        setAvailability(availFromApi);
        setAvailabilityGlobal(availFromApi);

        const isAccepted = res.isAccepted;

        // If policies not accepted, show privacy policy modal first
        if (isAccepted === 0) {
          setShowPrivacyPolicyModal(true);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch dashboard info:', error);
        }
      }
    };

    fetchDashboardInfo();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [setAvailabilityGlobal, setDashboardData]);

  // Handle accepting privacy policy
  const handleAcceptPrivacyPolicy = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isAcceptingPolicy) return; // Prevent double-clicks
    
    try {
      setIsAcceptingPolicy(true);
      console.log('[Policy] Accepting privacy policy...');
      const response = await partnerService.acceptPolicy("privacy_policy", "1");
      console.log('[Policy] Privacy policy response:', response);

      // Handle different response structures
      const data = response?.data || response;
      const success = data?.success !== false; // Default to true if not explicitly false

      if (success) {
        console.log('[Policy] Privacy policy accepted successfully');
        setShowPrivacyPolicyModal(false);
        setShowLynxAgreementModal(true); // Show the next modal after successful acceptance
      } else {
        console.error('[Policy] Privacy policy acceptance failed:', data);
        const Swal = (await import('sweetalert2')).default;
        await Swal.fire({
          title: 'Error',
          text: data?.message || 'Failed to accept Privacy Policy',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('[Policy] Error accepting privacy policy:', error);
      const Swal = (await import('sweetalert2')).default;
      const errorMessage = error instanceof Error ? error.message : 'Failed to accept Privacy Policy';
      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        timer: 2000,
        showConfirmButton: false
      });
    } finally {
      setIsAcceptingPolicy(false);
    }
  };

  // Handle accepting lynx agreement
  const handleAcceptLynxAgreement = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isAcceptingPolicy) return; // Prevent double-clicks
    
    try {
      setIsAcceptingPolicy(true);
      console.log('[Policy] Accepting lynx agreement...');
      const response = await partnerService.acceptPolicy("lynx_agreement", "1");
      console.log('[Policy] Lynx agreement response:', response);

      // Handle different response structures
      const data = response?.data || response;
      const success = data?.success !== false; // Default to true if not explicitly false

      if (success) {
        console.log('[Policy] Lynx agreement accepted successfully');
        setShowLynxAgreementModal(false);
        // Refresh dashboard info to update the isAccepted status
        const res = await partnerService.getDashboardInfo();
        if (res.stats) {
          setDashboardStats(res.stats);
        }
      } else {
        console.error('[Policy] Lynx agreement acceptance failed:', data);
        const Swal = (await import('sweetalert2')).default;
        await Swal.fire({
          title: 'Error',
          text: data?.message || 'Failed to accept Lynx Agreement',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('[Policy] Error accepting lynx agreement:', error);
      const Swal = (await import('sweetalert2')).default;
      const errorMessage = error instanceof Error ? error.message : 'Failed to accept Lynx Agreement';
      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        timer: 2000,
        showConfirmButton: false
      });
    } finally {
      setIsAcceptingPolicy(false);
    }
  };

  return (
    <>
      <Suspense fallback={<LoadingComponent />}>
        <PrivacyPolicyModal
          show={showPrivacyPolicyModal}
          onAccept={handleAcceptPrivacyPolicy}
          isAccepting={isAcceptingPolicy}
        />

        <LynxAgreementModal
          show={showLynxAgreementModal}
          onAccept={handleAcceptLynxAgreement}
          isAccepting={isAcceptingPolicy}
        />
      </Suspense>
      <div className="card my-account-dashboard">
        <div className="card-body">
          <div className="alert d-none" id="responseMessage" />
          <div className="form-check form-switch form-switch-md">
            <label className="h4 form-check-label m-0" htmlFor="flexSwitchCheckDefault">
              Availability
              {availabilityLoading && <span className="spinner-border spinner-border-sm ms-2" role="status" />}
            </label>
            <input
              className="form-check-input availability"
              type="checkbox"
              id="flexSwitchCheckDefault"
              checked={availability}
              disabled={availabilityLoading}
              onChange={handleAvailabilityChange}
            />
          </div>
          <hr className="my-3" />
          <ul className="my-account-menu tree-columns more-options">
            <li className="bg-pale-aqua">
              <a href="javascript:void(0);" onClick={() => { }}>
                <span className="icon"><i className="uil uil-gift" /></span>
                <span className="text">Available Free Jobs: 2/2</span>
              </a>
            </li>
          </ul>
          <h6>Request Summary</h6>
          <ul className="my-account-menu two-columns row-gap-2">
            <li className="mb-0">
              <a href="javascript:void(0);" onClick={handleNewRequests}>
                <span className="icon"><i className="uil uil-stopwatch" /></span>
                <span className="text">New Requests ({dashboardStats?.pending ?? 0})</span>
              </a>
            </li>
            <li className="mb-0">
              <a href="javascript:void(0);" onClick={handleActiveCommunication}>
                <span className="icon"><i className="uil uil-clock" /></span>
                <span className="text">Active Communication Requests ({dashboardStats?.onhold ?? 0})</span>
              </a>
            </li>
            <li className="mb-0">
              <a href="javascript:void(0);" onClick={() => handleOpenRequests('accepted')}>
                <span className="icon"><i className="uil uil-check-circle" /></span>
                <span className="text">Accepted Requests ({dashboardStats?.accepted ?? 0})</span>
              </a>
            </li>
            <li className="mb-0">
              <a href="javascript:void(0);" onClick={() => handleOpenRequests('in process')}>
                <span className="icon"><i className="uil uil-chart-line" /></span>
                <span className="text">In-Progress Requests ({dashboardStats?.in_process ?? 0})</span>
              </a>
            </li>
            <li className="mb-0">
              <a href="javascript:void(0);" onClick={() => handleOpenRequests('completed')}>
                <span className="icon"><i className="uil uil-cloud-check" /></span>
                <span className="text">Completed Requests ({dashboardStats?.completed ?? 0})</span>
              </a>
            </li>
            <li className="mb-0">
              <a href="javascript:void(0);" onClick={() => handleOpenRequests('cancelled')}>
                <span className="icon rotate45"><i className="uil uil-plus-circle" /></span>
                <span className="text">Cancelled Requests ({dashboardStats?.cancelled ?? 0})</span>
              </a>
            </li>
          </ul>
          <hr className="my-3" />
          <ul className="my-account-menu tree-columns more-options">
            <li className="bg-pale-aqua">
              <a href="javascript:void(0);" onClick={handleOpenModifyServices}>
                <span className="icon"><i className="uil uil-map-marker-edit" /></span>
                <span className="text">Add/Modify Your Services</span>
              </a>
            </li>
            <li className="bg-pale-pink">
              <a href="javascript:void(0);" onClick={handleOpenServiceTiers}>
                <span className="icon"><i className="uil uil-map-marker-edit" /></span>
                <span className="text">Location &amp; Service Tiers</span>
              </a>
            </li>
            <li className="bg-pale-blue">
              <a href="javascript:void(0);" onClick={handleOpenAvailabilitySchedule}>
                <span className="icon"><i className="uil uil-calendar-alt" /></span>
                <span className="text">Availability Schedule</span>
              </a>
            </li>
            <li className="bg-pale-grape">
              <a href="javascript:void(0);" onClick={handleOpenTechnicians}>
                <span className="icon"><i className="uil uil-paint-tool" /></span>
                <span className="text">Employees ({dashboardStats?.members ?? 0})</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
