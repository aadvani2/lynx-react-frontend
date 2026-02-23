import type { MouseEvent } from "react"
import { Link, useLocation } from "react-router-dom"
import ScrollAnimation from "./ScrollAnimation"
import "./CTA.css"

type WindowWithCTAHandlers = Window & {
  handleGetStartedClick?: (event: MouseEvent) => void
  onGetStarted?: (event: MouseEvent) => void
  ctaClick?: (event: MouseEvent) => void
}

function CTA() {
  const location = useLocation()
  const queryString = location.search || ""

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const win = window as WindowWithCTAHandlers
    const handler = win.handleGetStartedClick || win.onGetStarted || win.ctaClick

    if (typeof handler === "function") {
      handler(event)
    }
  }

  return (
    <section className="cta" aria-labelledby="cta-hero-title">
      <div className="cta__container">
        <ScrollAnimation>
          <div className="cta__content">
            <div className="cta__headline-wrapper">
              <h1 id="cta-hero-title" className="cta__title">
              A better way to get help for your home or business
              </h1>
            </div>

            <div className="cta__body-wrapper">
              <p className="cta__body">
              Lynx connects you with top-rated service professionals for your home or business, with faster service, zero spam, and people you can trust.
              </p>
              <p className="cta__body">
              From broken air conditioners to cluttered closets, Lynx makes it easy to get reliable help when you need it.
              </p>
            </div>
          </div>
        </ScrollAnimation>

        <ScrollAnimation>
          <div className="cta__button-wrapper">
            <Link
              to={`/signup${queryString}`}
              id="cta-hero"
              data-testid="cta-hero"
              className="cta__button"
              aria-label="Get Started For FREE"
              onClick={handleClick}
            >
              Get started for free
            </Link>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}

export default CTA

