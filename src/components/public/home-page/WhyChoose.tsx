import ScrollAnimation from "./ScrollAnimation";
import "./WhyChoose.css";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

interface Benefit {
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    title: "No spam. No lists. No guessing.",
    description: "We connect you with one trusted pro — not a directory that treats you like a lead."
  },
  {
    title: "We vet the customer and the provider.",
    description: "Every request is screened, and every provider meets our standards for licensing, experience, and reviews."
  },
  {
    title: "Emergency support without the stress.",
    description: "We look for the nearest available pro and keep you updated every step of the way."
  },
  {
    title: "Help in hours or later this week.",
    description: "Choose the timing that works for you, and your pro will confirm or suggest an alternative."
  },
  {
    title: "Pay your pro directly.",
    description: "No platform fees. No surprise charges."
  }
];

function WhyChoose() {
  const handleGetStarted = () => {
    // Scroll to hero section for search
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Track analytics if available
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'cta_click',
        cta_location: 'why_choose_section',
        cta_text: 'Get Started'
      });
    }
  };

  return (
    <section className="why-choose" aria-labelledby="why-choose-heading">
      <div className="why-choose__container">
        <ScrollAnimation>
          <h2 id="why-choose-heading" className="why-choose__title">
            Why Choose Lynx
          </h2>
        </ScrollAnimation>

        <div className="why-choose__grid">
          {benefits.map((benefit, index) => (
            <ScrollAnimation key={index}>
              <div className="why-choose-card">
                <h3 className="why-choose-card__title">{benefit.title}</h3>
                <p className="why-choose-card__description">{benefit.description}</p>
              </div>
            </ScrollAnimation>
          ))}

          {/* CTA Card */}
          <ScrollAnimation>
            <div className="why-choose-card why-choose-card--cta">
              <h3 className="why-choose-card__title">
              A service built to earn your trust.
              </h3>
              <button 
                className="why-choose-cta-button"
                onClick={handleGetStarted}
                data-testid="why-choose-cta-button"
              >
                Get Started
              </button>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;

