import React, { lazy, Suspense } from "react";
import CancellationPolicyCustomerHeader from "../../components/public/CancellationPolicyCustomer/Header";
import LoadingComponent from "../../components/common/LoadingComponent";

// Lazy load the heavy content component
const CancellationPolicyCustomerMainContent = lazy(() => import("../../components/public/CancellationPolicyCustomer/MainContent"));

const CancellationPolicyCustomer: React.FC = () => (
  <>
    <CancellationPolicyCustomerHeader />
    <Suspense fallback={<LoadingComponent />}>
      <CancellationPolicyCustomerMainContent />
    </Suspense>
  </>
);

export default CancellationPolicyCustomer;

