import React, { useEffect, useMemo, useState } from 'react';
import { customerService } from '../../../services/customerServices/customerService';
// import { useCustomerStore } from '../../../store/customerStore/customerStore';
import { /* SubscriptionCard,  FreeServiceCard,*/ RequestSummary } from './components';
import { useCustomerDashboardStore } from '../../../store/customerDashboardStore';

interface DashboardContentProps {
  setActivePage: (page: string) => void;
}

// interface Pricing {
//   id: number;
//   name: string;
//   price: number;
//   unit_amount: number;
//   currency: string;
//   interval: string;
//   interval_count: number;
//   trial_period_days: number | null;
//   active: boolean;
// }

// interface Plan {
//   id: number;
//   name: string;
//   description: string;
//   pricing: Pricing[];
//   active: boolean;
// }

// interface MySubscriptionData {
//   plan_name?: string;
//   status?: string; // Active, Inactive, etc
//   billing_period?: string; // e.g., monthly
//   next_invoice_on?: string; // e.g., 31 Aug 2025
//   sub_id?: string; // subscription id
// }

interface DashboardCounts {
  pending: number;
  accepted: number;
  completed: number;
  in_process: number;
  onhold: number;
  cancelled: number;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ setActivePage }) => {
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const [data, setData] = useState<MySubscriptionData | null>(null);
  const [counts, setCounts] = useState<DashboardCounts | null>(null);
  const { setRating } = useCustomerDashboardStore();
  // const { setSelectedSubscriptionId } = useCustomerStore();

  const timezoneHours = useMemo(() => {
    const tzOffsetMinutes = new Date().getTimezoneOffset();
    return -tzOffsetMinutes / 60;
  }, []);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetch = async () => {
      try {
        // setLoading(true);
        // setError(null);
        const res = await customerService.getMySubscription({ user_timezone: timezoneHours });
        
        if (!isMounted) return;

        const payload = res?.data || res;

        const rating = payload?.rating ?? null;
        const ratingCount = payload?.rating_count ?? null;

        setRating(rating, ratingCount);

        // Handle the new response structure
        const subscriptionArray = payload?.subscription || payload?.data?.subscription || [];
        const plansArray = payload?.plans || payload?.data?.plans || [];
        const dashboard: DashboardCounts | null = payload?.data?.dashboard || payload?.dashboard || null;

        if (isMounted) {
          // Extract data from first subscription item if available
          if (Array.isArray(subscriptionArray) && subscriptionArray.length > 0) {
            // const firstSubscription = subscriptionArray[0];
            
            // Find the corresponding plan from plans array
            // let planInfo: Plan | null = null;
            if (Array.isArray(plansArray) && plansArray.length > 0) {
              // For now, use the first active plan, but you might want to match by subscription
              // planInfo = plansArray.find((plan: Plan) => plan.active) || plansArray[0];
            }
            
            // const subscriptionData: MySubscriptionData = {
            //   sub_id: firstSubscription.id,
            //   status: firstSubscription.status,
            //   plan_name: planInfo?.name || 'Active Plan',
            //   billing_period: planInfo?.pricing?.[0]?.interval || 'Monthly',
            //   next_invoice_on: 'N/A' // You might want to calculate this from subscription data
            // };
            // setData(subscriptionData);
          } else if (Array.isArray(plansArray) && plansArray.length > 0) {
            // If no subscription but has plans, show the active plan
            // const activePlan = plansArray.find((plan: Plan) => plan.active) || plansArray[0];
            // const subscriptionData: MySubscriptionData = {
            //   sub_id: 'free',
            //   status: 'active',
            //   plan_name: activePlan.name,
            //   billing_period: activePlan.pricing?.[0]?.interval || 'Monthly',
            //   next_invoice_on: 'N/A'
            // };
            // setData(subscriptionData);
          } else {
            // setData(null);
          }

          setCounts(dashboard);
        }
      } catch (e: unknown) {
        if (isMounted) {
          // setError(e instanceof Error ? e.message : 'Failed to load subscription');
        }
      } finally {
        // if (isMounted) setLoading(false);
      }
    };
    fetch();
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [timezoneHours]);

  // const handleViewDetails = () => {
  //   // Set the subscription ID in the store before navigating
  //   if (data?.sub_id) {
  //     setSelectedSubscriptionId(data.sub_id);
  //   }
  //   setActivePage('subscription_details');
  // };

  const openRequests = (status: string) => {
    // Navigate to requests page with the specific status
    setActivePage(`requests_${status}`);
  };


  return (
    <div className="card my-account-dashboard">
      <div className="card-header p-3">
        <h4 className="card-title mb-0">Dashboard</h4>
      </div>
      {/* <SubscriptionCard
        data={data}
        loading={loading}
        error={error}
        onViewDetails={handleViewDetails}
        onUpgrade={() => setActivePage("upgrade_subscription")}
      /> */}

      <div className="card-body">
        {/* <FreeServiceCard
          used={2}
          total={2}
          onViewDetails={() => setActivePage('free_services')}
        /> */}
        <RequestSummary
          counts={counts}
          onRequestClick={openRequests}
        />
      </div>
    </div>
  );
};

export default DashboardContent; 