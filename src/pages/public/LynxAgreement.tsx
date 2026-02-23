import React, { lazy, Suspense } from "react";
import LynxAgreementHeader from "../../components/public/LynxAgreement/Header";
import LoadingComponent from "../../components/common/LoadingComponent";

// Lazy load the heavy content component
const LynxAgreementMainContent = lazy(() => import("../../components/public/LynxAgreement/MainContent"));

const LynxAgreement: React.FC = () => (
  <>
    <LynxAgreementHeader />
    <Suspense fallback={<LoadingComponent />}>
      <LynxAgreementMainContent />
    </Suspense>
  </>
);

export default LynxAgreement; 