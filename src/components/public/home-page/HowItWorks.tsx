import type { RefObject } from "react";
import ScrollAnimation from "./ScrollAnimation";
import "./HowItWorks.css";
import { useInViewImage, transparentPlaceholder } from "./useInViewImage";

// Import icon SVGs
import iconNeedPeople from "../../../assets/Icon/hiw-01-need-people.svg";
import iconSchedule from "../../../assets/Icon/hiw-02-schedule-calendar.svg";
import iconMatchPro from "../../../assets/Icon/hiw-03-match-handshake.svg";
import iconTrackPay from "../../../assets/Icon/hiw-04-track-pay-clipboard.svg";

interface Step {
  icon: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: iconNeedPeople,
    title: "Tell us what you need",
    description: "Leak, short circuit, garage won’t open — share the issue and we’ll guide you."
  },
  {
    icon: iconSchedule,
    title: "Request the service",
    description: "Need help now? We’ll look for the fastest available pro. Planning ahead? Choose a time that works for you."
  },
  {
    icon: iconMatchPro,
    title: "Get matched or choose your pro",
    description: "Pick a pro yourself, or have Lynx choose the best match for you — whether it’s urgent or scheduled."
  },
  {
    icon: iconTrackPay,
    title: "Track, chat & pay easily",
    description: "See updates at every step. Chat with your pro once they accept the job. Pay them directly when the work is done."
  }
];

function HowItWorks() {
  const IconImage = ({ icon, title }: { icon: string; title: string }) => {
    const { ref, isInView } = useInViewImage();
    const src = isInView ? icon : transparentPlaceholder;
    return (
      <img 
        ref={ref as RefObject<HTMLImageElement>}
        src={src} 
        data-src={icon}
        alt={title}
        className="step-card__icon-image"
        loading="lazy"
      />
    );
  };

  return (
    <section className="how-it-works">
      <div className="how-it-works__container">
        <ScrollAnimation>
          <h2 className="how-it-works__title">How It Works</h2>
        </ScrollAnimation>

        <div className="how-it-works__steps">
          {steps.map((step, index) => (
            <ScrollAnimation key={index}>
              <div className="step-card">
                <div className="step-card__icon">
                  <IconImage icon={step.icon} title={step.title} />
                </div>
                <div className="step-card__content">
                  <h3 className="step-card__title">{step.title}</h3>
                  <p className="step-card__description">{step.description}</p>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

