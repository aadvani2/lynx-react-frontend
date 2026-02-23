import { useEffect, useRef } from "react";

function useAnimateOnMount(animationClass: string) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.classList.add("animate__animated", animationClass);
    }
  }, [animationClass]);
  return ref;
}

export default function PricingHeader() {
  const headerRef = useAnimateOnMount("animate__slideInDown");
  return (
    <section className="wrapper image-wrapper bg-yellow">
      <div className="container pt-16 pb-6 text-center">
        <div className="row">
          <div
            ref={headerRef}
            className="col-lg-10 col-xl-10 col-xxl-10 mx-auto"
            data-group="page-title"
          >
            <h1 className="display-1 mb-3 text-center mobile-text-left">
              Use Lynx for free. Pay only when it counts.
            </h1>
            <p className="lead text-center mobile-text-left">
              No fees to browse. No cost to book. No sneaky charges.
              <br />
              Need someone now? You'll pay a flat emergency fee — that's it.
              <br />
              Want extra speed or better tools? Upgrade when you're ready.
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="divider text-light mx-n2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60">
            <path fill="currentColor" d="M0,0V60H1440V0A5771,5771,0,0,1,0,0Z" />
          </svg>
        </div>
      </div>
    </section>
  );
}
