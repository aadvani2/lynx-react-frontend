import React, { lazy, Suspense } from "react";
import PrivacyPolicyHeader from "../../components/public/PrivacyPolicy/Header";
import LoadingComponent from "../../components/common/LoadingComponent";

// Lazy load the heavy content component
const PrivacyPolicyMainContent = lazy(() => import("../../components/public/PrivacyPolicy/MainContent"));

const PrivacyPolicy: React.FC = () => (
  <>
    <PrivacyPolicyHeader />
    <Suspense fallback={<LoadingComponent />}>
      <PrivacyPolicyMainContent />
    </Suspense>
  </>
);

export default PrivacyPolicy; 