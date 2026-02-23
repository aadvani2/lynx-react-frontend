import { useEffect, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Layout from "./layout/public/Layout";
import LoadingComponent from "./components/common/LoadingComponent";
import AuthGuard from "./components/auth/AuthGuard";
import { useSessionValidation } from "./hooks/useSessionValidation";

// Lazy load routes - only load when navigated to (reduces initial JS)
// Grouped by priority: auth pages load on-demand
const SignUpPage = lazy(() => import("./pages/auth/General/SignUpPage"));
const SignInPage = lazy(() => import("./pages/auth/General/SignInPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/General/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/General/ResetPasswordPage"));
const VerifyAccount = lazy(() => import("./pages/public/VerifyAccount"));
const ServiceArea = lazy(() => import("./pages/public/ServiceArea"));
const OurStoryPage = lazy(() => import("./pages/public/OurStoryPage"));
const Security = lazy(() => import("./pages/public/Security"));
const Contact = lazy(() => import("./pages/public/Contact"));
const Download = lazy(() => import("./pages/public/Download"));
const Faqs = lazy(() => import("./pages/public/Faqs"));
const TermsOfUse = lazy(() => import("./pages/public/TermsOfUse"));
const CookiePolicy = lazy(() => import("./pages/public/CookiePolicy"));
const PrivacyRequestForm = lazy(() => import("./pages/public/PrivacyRequestForm"));
const DeleteAccount = lazy(() => import("./pages/public/DeleteAccount"));

// Legal/info pages - lazy load
const LynxAgreement = lazy(() => import("./pages/public/LynxAgreement"));
const PrivacyPolicy = lazy(() => import("./pages/public/PrivacyPolicy"));
const CancellationPolicyCustomer = lazy(() => import("./pages/public/CancellationPolicyCustomer"));
const CancellationPolicyProvider = lazy(() => import("./pages/public/CancellationPolicyProvider"));
// HomePage loads immediately - critical for LCP (not lazy)
import HomePage from "./pages/public/HomePage";
const ReturningUserPage = lazy(() => import("./pages/ReturningUserPage/ReturningUserPage.tsx"));
const DynamicServicePage = lazy(() => import("./pages/public/DynamicServicePage/DynamicServicePage"));
const ProfessionalPage = lazy(() => import("./pages/public/ProfessionalPage"));
const OurPartners = lazy(() => import("./pages/public/OurPartners"));
const Blogs = lazy(() => import("./pages/public/Blogs"));
const BlogDetailPage = lazy(() => import("./pages/public/BlogDetailPage/BlogDetailPage.tsx"));
const BrowseAllServicesNew = lazy(() => import("./components/public/BrowseAllServices/BrowseAllServicesNew"));
const Testimonials = lazy(() => import("./pages/public/Testimonials"));
const BookServicePage = lazy(() => import("./pages/public/BookServicePage"));
const BookingPage = lazy(() => import("./pages/public/BookingPage"));
const ConfirmBookingPage = lazy(() => import("./pages/public/ConfirmBookingPage"));
const BookingEmergencyConfirmed = lazy(() => import("./pages/public/BookingEmergencyConfirmed"));
const SearchResult = lazy(() => import("./pages/SearchResult/SearchResult.tsx"));
const RequestStepPage = lazy(() => import("./pages/public/RequestStepPage"));

// Auth pages
const CustomerSignUp = lazy(() => import("./pages/auth/customer/CustomerSignUp"));
const CustomerSignInPage = lazy(() => import("./pages/auth/customer/CustomerSignInPage"));
const PartnerSignUpPage = lazy(() => import("./pages/auth/partner/PartnerSignUpPage"));
const PartnerLoginPage = lazy(() => import("./pages/auth/partner/PartnerLoginPage"));
const EmployeeLogInPage = lazy(() => import("./pages/auth/employee/EmployeeLogInPage"));

// Dashboard pages - likely to be heavy with functionality
const CustomerAccountPage = lazy(() => import("./pages/customer/CustomerAccountPage"));
const PartnerAccountPage = lazy(() => import("./pages/partner/PartnerAccountPage"));
const PartnerOnboardingPage = lazy(() => import("./pages/partner/OnboardingPage"));
const EmployeeAccountPage = lazy(() => import("./pages/employee/EmployeeAccountPage"));

// Error pages
const Error404 = lazy(() => import("./components/common/ErrorPages/Error404"));
const Error500 = lazy(() => import("./components/common/ErrorPages/Error500"));
const Error503 = lazy(() => import("./components/common/ErrorPages/Error503"));

function App() {
  const location = useLocation();

  // Session validation - periodically checks if session is still valid
  // This detects logout from other devices (e.g., mobile app)
  useSessionValidation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Delay Cue.js initialization until after first paint to improve TBT
  useEffect(() => {
    // Use requestIdleCallback or delay to avoid blocking first paint
    const initCue = () => {
      const loadCueCSS = () => {
        const existingLink = document.querySelector('link[href*="cue.css"]');
        if (!existingLink) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/cue.css/cue.min.css';
          document.head.appendChild(link);
        }
      };

      const triggerCue = () => {
        loadCueCSS();
        if (window.cue && typeof window.cue.init === "function") {
          window.cue.init();
        }
      };
      
      // Delay Cue initialization to avoid blocking first paint
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          triggerCue();
          setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
        }, { timeout: 500 });
      } else {
        setTimeout(() => {
          triggerCue();
          setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
        }, 200);
      }
    };
    
    initCue();
  }, [location]);

  return (
    <div className="content-wrapper">
      <Layout>
        <Suspense fallback={<LoadingComponent />}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Search Results Page */}
            <Route path="/search" element={<SearchResult />} />
            {/* Returning User Page */}
            <Route path="/returning-user" element={<ReturningUserPage />} />



            <Route path="/services" element={<BrowseAllServicesNew />} />
            {/* Dynamic Service Category Route */}
            <Route path="/services/:category" element={<DynamicServicePage />} />

            {/* Book Service Route */}
            <Route path="/book-service/:category/:subcategory" element={<BookServicePage />} />

            {/* Booking Page Route */}
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/confirm-booking" element={<ConfirmBookingPage />} />
            <Route path="/booking/confirmed" element={<BookingEmergencyConfirmed />} />

            {/* Request tracking */}
            <Route path="/requests/:id" element={<RequestStepPage />} />

            <Route path="/service-area" element={<ServiceArea />} />

            {/* <Route path="/pricing" element={<PricingPage />} /> */}

            <Route path="/our-story" element={<OurStoryPage />} />
            <Route path="/our-partners" element={<OurPartners />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:category" element={<Blogs />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />

            <Route path="/professional" element={<ProfessionalPage />} />

            <Route path="/security" element={<Security />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/download" element={<Download />} />
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/cancellation-policy-customer" element={<CancellationPolicyCustomer />} />
            <Route path="/cancellation-policy-provider" element={<CancellationPolicyProvider />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/privacy-request-form" element={<PrivacyRequestForm />} />
            <Route path="/lynx-agreement" element={<LynxAgreement />} />
            <Route path="/delete-account" element={<DeleteAccount />} />

            {/* Auth Routes */}
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />

            <Route path="/signup/customer" element={<CustomerSignUp />} />
            <Route path="/sign-in/customer" element={<CustomerSignInPage />} />

            <Route path="/signup/partner" element={<PartnerSignUpPage />} />
            <Route path="/sign-in/partner" element={<PartnerLoginPage />} />

            <Route path="/sign-in/employee" element={<EmployeeLogInPage />} />

            <Route path="/verify-account" element={<VerifyAccount />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/forgot-password/:role" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/reset-password/:role" element={<ResetPasswordPage />} />




            {/* Customer Routes */}
            <Route
              path="/my-account"
              element={
                <AuthGuard requiredAuth={true} allowedUserTypes={['customer']}>
                  <CustomerAccountPage />
                </AuthGuard>
              }
            />

            {/* Partner Routes */}
            <Route
              path="/professional/my-account"
              element={
                <AuthGuard requiredAuth={true} allowedUserTypes={['provider']}>
                  <PartnerAccountPage />
                </AuthGuard>
              }
            />
            <Route
              path="/professional/onboarding"
              element={
                <AuthGuard requiredAuth={true} allowedUserTypes={['provider']}>
                  <PartnerOnboardingPage />
                </AuthGuard>
              }
            />

            {/* Employee Routes */}
            <Route
              path="/employee/my-account"
              element={
                <AuthGuard requiredAuth={true} allowedUserTypes={['employee']}>
                  <EmployeeAccountPage />
                </AuthGuard>
              }
            />

            {/* Error Pages */}
            <Route path="/error/404" element={<Error404 />} />
            <Route path="/error/500" element={<Error500 />} />
            <Route path="/error/503" element={<Error503 />} />
            
            {/* Catch-all 404 route - must be last */}
            <Route path="*" element={<Error404 />} />

          </Routes>
        </Suspense>
      </Layout>
    </div>
  );
}

export default App;
