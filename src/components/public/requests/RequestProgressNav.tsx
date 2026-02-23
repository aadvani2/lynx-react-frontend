// no React import necessary with automatic JSX runtime

import CheckmarkIcon from "../../../assets/Icon/checkmark.svg";

interface Props { currentStep?: number; onBack?: () => void }

const steps = [
  { label: "Request Sent" },
  { label: "Request Accepted" },
  { label: "Arrived at Location" },
  { label: "Completed" }
];

export default function RequestProgressNav({ currentStep = 0, onBack }: Props) {
  // Indicator ends at mid-point between current and next step
  // Segment widths are equal (25% each). Midpoints: 12.5%, 37.5%, 62.5%, 100% (for last).
  const midpointPercents = [12.5, 37.5, 62.5, 100];

  return (
    <div className="request-progress-nav">
      <div className="request-progress-grid">
        <button className="back-btn" onClick={onBack}>
          <span className="back-icon">⏴</span>
          Back
        </button>

        <div className="steps-container">
          {steps.map((step, idx) => {
            const isActive = idx === currentStep
            return (
              <span key={step.label} className={"step-label" + (isActive ? " active" : "") }>
                {isActive ? (
                  <img src={CheckmarkIcon} alt="checked" style={{ width: 16, height: 16, display: 'inline-block' }} />
                ) : null}
                {step.label}
              </span>
            )
          })}
        </div>

        <div className="progress-bar-bg">
          <div className="progress-bar-fg" style={{ width: `${midpointPercents[currentStep]}%` }} />
        </div>
      </div>
    </div>
  );
}


