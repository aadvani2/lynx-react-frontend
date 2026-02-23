import { useState, useEffect } from 'react';
import type { ReactNode, ComponentType, LazyExoticComponent } from 'react';

interface DeferredComponentProps {
  component: LazyExoticComponent<ComponentType<unknown>>;
  fallback?: ReactNode;
  delay?: number; // Delay in ms before starting to load (default: wait for first paint)
  rootMargin?: string; // IntersectionObserver rootMargin (default: '200px')
}

/**
 * DeferredComponent - Loads lazy components after first paint or when approaching viewport
 * Reduces initial JS execution time (TBT) by deferring non-critical components
 */
export default function DeferredComponent({
  component: LazyComponent,
  fallback = null,
  delay = 0,
  rootMargin = '200px',
}: DeferredComponentProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef) return; // Wait for ref to be set

    // Strategy: Wait for first paint, then use IntersectionObserver
    let timeoutId: ReturnType<typeof setTimeout>;
    let observer: IntersectionObserver | null = null;

    const startLoading = () => {
      setShouldLoad(true);
    };

    // Wait for first paint using requestAnimationFrame
    const waitForFirstPaint = () => {
      // After first paint, set up IntersectionObserver
      const setupObserver = () => {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                startLoading();
                observer?.disconnect();
              }
            });
          },
          { rootMargin }
        );
        observer.observe(containerRef!);
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(setupObserver, { timeout: delay || 500 });
      } else {
        timeoutId = setTimeout(setupObserver, delay || 100);
      }
    };

    // Use requestAnimationFrame to ensure we're after first paint
    requestAnimationFrame(waitForFirstPaint);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, [containerRef, delay, rootMargin]);

  if (shouldLoad) {
    return <LazyComponent />;
  }

  return (
    <div ref={setContainerRef} style={{ minHeight: '1px' }}>
      {fallback}
    </div>
  );
}
