import React, { useEffect, useState } from 'react';
import type { Stripe } from '@stripe/stripe-js';

interface StripeElementsWrapperProps {
  children: React.ReactNode;
}

type ElementsComponentType = React.ComponentType<{
  stripe: Stripe | Promise<Stripe | null> | null;
  children?: React.ReactNode;
}>;

const StripeElementsWrapper: React.FC<StripeElementsWrapperProps> = ({ children }) => {
  const [ElementsComponent, setElementsComponent] = useState<ElementsComponentType | null>(null);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadStripeLibraries = async () => {
      const [{ Elements }, { loadStripe }] = await Promise.all([
        import('@stripe/react-stripe-js'),
        import('@stripe/stripe-js'),
      ]);

      if (!isMounted) return;

      setElementsComponent(() => Elements as ElementsComponentType);
      setStripePromise(loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string));
    };

    loadStripeLibraries();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!stripePromise || !ElementsComponent) return null;

  return <ElementsComponent stripe={stripePromise}>{children}</ElementsComponent>;
};

export default StripeElementsWrapper;
