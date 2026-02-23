import { useEffect, useRef, useState } from "react";

interface UseInViewImageOptions extends IntersectionObserverInit {
  /**
   * When true, the observer stops after the first intersection
   */
  once?: boolean;
}

export function useInViewImage(options?: UseInViewImageOptions) {
  const nodeRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const target = nodeRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (options?.once !== false) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        root: options?.root || null,
        rootMargin: options?.rootMargin ?? "150px 0px",
        threshold: options?.threshold ?? 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [options?.root, options?.rootMargin, options?.threshold, options?.once]);

  return { ref: nodeRef, isInView };
}

export const transparentPlaceholder =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
