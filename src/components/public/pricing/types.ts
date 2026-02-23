export interface PricingPlan {
  id: number;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: Array<{
    text: string;
    included: boolean;
    tooltip?: string;
  }>;
  priceId: string;
  isComingSoon?: boolean;
  gradientColor?: string;
}

export interface PricingPlanProps {
  plan: PricingPlan;
  isMobile?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  panelRef?: React.RefObject<HTMLDivElement | null>;
  onSubscribe?: () => void;
  showSubscribeButton?: boolean;
}
