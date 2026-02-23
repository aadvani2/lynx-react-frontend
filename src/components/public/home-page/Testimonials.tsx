import type { RefObject } from "react"
import { useEffect, useMemo, useState } from "react"
import ScrollAnimation from "./ScrollAnimation"
import "./Testimonials.css"

import starIcon from "../../../assets/Icon/star.svg"
import PlumbingImg from "../../../assets/images/Plumbing.jpg"
import RoofingImg from "../../../assets/images/Roofing.jpg"
import FlooringImg from "../../../assets/images/flooring.jpg"
import { useInViewImage, transparentPlaceholder } from "./useInViewImage"
interface Testimonial {
  id: string
  image: string
  title: string
  text: string
  name: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: "angelina-benk",
    image: PlumbingImg,
    title: "Quick response and expert plumbing repair",
    text: "I had a plumbing emergency late at night, and the technician arrived quickly and fixed the issue professionally. They were knowledgeable, courteous, and explained everything clearly. Highly recommend their plumbing services!",
    name: "Angelina Benk",
    rating: 5
  },
  {
    id: "amit-solanki",
    image: FlooringImg,
    title: "Excellent flooring installation and professional service",
    text: "The flooring team was excellent from start to finish. They helped me choose the perfect flooring option, provided a fair quote, and completed the installation efficiently. The quality of their work is outstanding, and I'm very satisfied with my new floors.",
    name: "Amit Solanki",
    rating: 5
  },
  {
    id: "daniel-ortiz",
    image: RoofingImg,
    title: "Professional roofing repair that exceeded expectations",
    text: "After a storm damaged my roof, the roofing team came out quickly and did an amazing job. They were professional, thorough, and the repair work looks perfect. I'm very happy with the service and would definitely use them again.",
    name: "Daniel Ortiz",
    rating: 5
  }
]

const transitionDurationMs = 600
const autoplayIntervalMs = 7000 // Increased from 3000ms to 6000ms (6 seconds) for slower carousel

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(1)
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true)

  const TestimonialImage = ({ image, name }: { image: string; name: string }) => {
    const { ref, isInView } = useInViewImage();
    const src = isInView ? image : transparentPlaceholder;
    return (
      <img
        ref={ref as RefObject<HTMLImageElement>}
        src={src}
        data-src={image}
        alt={`Portrait of ${name}`}
        className="testimonial-image"
        loading="lazy"
      />
    );
  };

  const slides = useMemo(
    () => [testimonials[testimonials.length - 1], ...testimonials, testimonials[0]],
    []
  )

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex(previous => previous + 1)
    }, autoplayIntervalMs)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const lastIndex = slides.length - 1

    if (activeIndex <= 0) {
      const timeoutId = window.setTimeout(() => {
        setIsTransitionEnabled(false)
        setActiveIndex(lastIndex - 1)
      }, transitionDurationMs)

      return () => window.clearTimeout(timeoutId)
    }

    if (activeIndex >= lastIndex) {
      const timeoutId = window.setTimeout(() => {
        setIsTransitionEnabled(false)
        setActiveIndex(1)
      }, transitionDurationMs)

      return () => window.clearTimeout(timeoutId)
    }

    setIsTransitionEnabled(true)
    return undefined
  }, [activeIndex, slides.length])

  const trackStyle = {
    transform: `translateX(-${activeIndex * 100}%)`,
    transition: isTransitionEnabled ? `transform ${transitionDurationMs}ms ease-in` : "none"
  }

  const visibleIndex = ((activeIndex - 1) % testimonials.length + testimonials.length) % testimonials.length

  return (
    <section className="testimonials-section" aria-label="Customer testimonials">
      <div className="testimonials-container">
        <ScrollAnimation>
          <div className="testimonial-carousel">
            <div className="testimonial-track" style={trackStyle}>
              {slides.map((testimonial, index) => (
                <article
                  key={`${testimonial.id}-${index}`}
                  className="testimonial-slide"
                  role="listitem"
                  aria-label={`Review from ${testimonial.name}`}
                >
                  <div className="testimonial-image-wrapper">
                    <TestimonialImage image={testimonial.image} name={testimonial.name} />
                  </div>

                  <div className="testimonial-content">
                    <div className="testimonial-meta">
                      <p className="testimonial-author">{testimonial.name}</p>
                      <div className="testimonial-stars" aria-label={`${testimonial.rating} star rating`}>
                        {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                          <img
                            key={`${testimonial.id}-star-${starIndex}`}
                            src={starIcon}
                            alt=""
                            className="star-icon"
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>

                    <h3 className="testimonial-title">"{testimonial.title}"</h3>

                    <p className="testimonial-text">{testimonial.text}</p>

                    <div className="testimonial-divider" role="separator" aria-hidden="true"></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </ScrollAnimation>

        <div className="testimonial-indicator-wrapper" aria-hidden="true">
          <div className="testimonial-indicator">
            {testimonials.map((testimonial, index) => (
              <span 
                key={`indicator-${testimonial.id}`} 
                className={`testimonial-indicator-bar ${index === visibleIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
