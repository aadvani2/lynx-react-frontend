import { useEffect, useRef, useState } from "react";
import { FreePlan, PremiumPlan, CorporatePlan, pricingPlans } from "./index";
import AuthModal from "../../common/AuthModal";
import { useAuthStore } from "../../../store/authStore";

declare global {
  interface Window {
    bootstrap?: Record<string, unknown>;
  }
}

function useAccordionAnimation(isOpen: boolean, duration = 400) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.overflow = "hidden";
    el.style.transition = `height ${duration}ms cubic-bezier(0.4,0,0.2,1)`;

    if (isOpen) {
      el.style.display = "block";
      // Start from 0 if closed
      if (el.style.height === "0px" || !el.style.height) {
        el.style.height = "0px";
        void el.offsetHeight;
      }
      el.style.height = el.scrollHeight + "px";
      const timeout = setTimeout(() => {
        el.style.height = "auto";
      }, duration);
      return () => clearTimeout(timeout);
    } else {
      // If open, set to px first to enable transition
      if (el.style.height === "auto") {
        el.style.height = el.scrollHeight + "px";
        void el.offsetHeight;
      }
      el.style.height = "0px";
      const timeout = setTimeout(() => {
        el.style.display = "none";
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, duration]);

  return ref;
}

export default function PricingDetails() {
  const { user, isAuthenticated, isVerified } = useAuthStore();
  
  // Check if user is logged in as customer
  const isLoggedInCustomer = isAuthenticated && isVerified && user?.user_type === 'customer';

  useEffect(() => {
    // Enable Bootstrap tooltips if Bootstrap is loaded
    if (typeof window !== "undefined" && window.bootstrap) {
      const tooltipTriggerList = Array.from(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        // Only initialize if not already initialized
        if (!tooltipTriggerEl.getAttribute("data-tooltip-initialized")) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          new (window.bootstrap as any).Tooltip(tooltipTriggerEl);
          tooltipTriggerEl.setAttribute("data-tooltip-initialized", "true");
        }
      });
    }
  }, []);

  // Accordion state for mobile
  const [openAccordion, setOpenAccordion] = useState<11 | 12 | 13 | null>(11);
  
  // Modal state for authentication
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Minimal, robust refs for each accordion
  const panelRef11 = useAccordionAnimation(openAccordion === 11, 400);
  const panelRef12 = useAccordionAnimation(openAccordion === 12, 400);
  const panelRef13 = useAccordionAnimation(openAccordion === 13, 400);

  const handleSubscribeClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      {/* Desktop Pricing Section */}
      <section className="pt-6 pb-10 brevo-pricing-column">
        <div className="container">
          <div className="pricing-desktop-column">
            <FreePlan 
              plan={pricingPlans[0]} 
              onSubscribe={!isLoggedInCustomer ? handleSubscribeClick : undefined}
              showSubscribeButton={!isLoggedInCustomer}
            />
            <PremiumPlan 
              plan={pricingPlans[1]} 
              onSubscribe={!isLoggedInCustomer ? handleSubscribeClick : undefined}
              showSubscribeButton={!isLoggedInCustomer}
            />
            <CorporatePlan 
              plan={pricingPlans[2]} 
              showSubscribeButton={!isLoggedInCustomer}
            />
          </div>
        </div>
      </section>

      {/* Mobile Pricing Section */}
      <section className="pricing-mobile pb-6 pt-6">
        <div className="container">
          <div className="accordion accordion-wrapper" id="accordionExample">
            <FreePlan 
              plan={pricingPlans[0]} 
              isMobile={true}
              isOpen={openAccordion === 11}
              onToggle={() => setOpenAccordion(openAccordion === 11 ? null : 11)}
              panelRef={panelRef11}
              onSubscribe={!isLoggedInCustomer ? handleSubscribeClick : undefined}
              showSubscribeButton={!isLoggedInCustomer}
            />
            <PremiumPlan 
              plan={pricingPlans[1]} 
              isMobile={true}
              isOpen={openAccordion === 12}
              onToggle={() => setOpenAccordion(openAccordion === 12 ? null : 12)}
              panelRef={panelRef12}
              onSubscribe={!isLoggedInCustomer ? handleSubscribeClick : undefined}
              showSubscribeButton={!isLoggedInCustomer}
            />
            <CorporatePlan 
              plan={pricingPlans[2]} 
              isMobile={true}
              isOpen={openAccordion === 13}
              onToggle={() => setOpenAccordion(openAccordion === 13 ? null : 13)}
              panelRef={panelRef13}
              showSubscribeButton={!isLoggedInCustomer}
            />
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        show={isAuthModalOpen} 
        onClose={handleCloseModal}
      />
    </>
  );
}
