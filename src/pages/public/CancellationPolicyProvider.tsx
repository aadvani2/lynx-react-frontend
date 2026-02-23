import React, { lazy, Suspense } from "react";
import CancellationPolicyProviderHeader from "../../components/public/CancellationPolicyProvider/Header";
import LoadingComponent from "../../components/common/LoadingComponent";

// Lazy load the heavy content component
const CancellationPolicyProviderMainContent = lazy(() => import("../../components/public/CancellationPolicyProvider/MainContent"));

const CancellationPolicyProvider: React.FC = () => (
  <>
    <CancellationPolicyProviderHeader />
    <Suspense fallback={<LoadingComponent />}>
      <CancellationPolicyProviderMainContent />
    </Suspense>
  </>
);

export default CancellationPolicyProvider;

