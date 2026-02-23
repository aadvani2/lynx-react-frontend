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

export default function ServiceAreaHeader() {
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
            <h1 className="display-1 mb-3">Where You’ll Find Lynx <br />(and Where We’re Headed Next)</h1>
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