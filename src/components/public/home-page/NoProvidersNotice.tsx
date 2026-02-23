import React, { useEffect, useState } from "react";
import { addModalCloseIconStyles } from "../../../utils/modalCloseIcon";
import { emailSubscribeService } from "../../../services/generalServices/emailSubscribeService";
import Swal from "../../../lib/swal";

interface ApiResponse {
  success: boolean;
  message?: string;
  errors?: Array<{ type: string; value: string; msg: string; path: string; location: string }>;
}

interface NoProvidersNoticeProps {
  onClose?: () => void;
  serviceId?: string;
  serviceName?: string;
  serviceTier?: string;
  serviceTierTag?: string;
  zipCode?: string;
  date?: string;
}

const CLOSE_ICON_CLASS = "custom-modal-close";

const NoProvidersNotice: React.FC<NoProvidersNoticeProps> = (props) => {
  const { onClose, serviceId, serviceName, serviceTier, serviceTierTag, zipCode, date } = props;
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Inject custom close icon styles
    const cleanup = addModalCloseIconStyles({ className: CLOSE_ICON_CLASS });
    return () => {
      cleanup();
    };
  }, [onClose]);

  return (
    <section className="search-form-result" id="searchResult-v2">
      <div className="not-search-result">
        <div className="container">
          <div className="not-search-result-inner bg-primary p-5 rounded-4">
            <div className="not-search-result-inner-main bg-white rounded-4 overflow-hidden position-relative">
              <button
                type="button"
                className={`${CLOSE_ICON_CLASS} not-search-close m-0 p-0`}
                aria-label="Close"
                onClick={onClose}
                style={{ position: "absolute", top: 0, right: 0 }}
              />
              <div className="border-bottom border-soft-violet not-search-result-top text-center">
                <h2 className="font-bricolage">We’re not in your area just yet</h2>
                <p>But we’re getting close. Lynx are expanding quickly.</p>
                <h4 className="m-0 font-bricolage">Join our list and we’ll let you know the moment we go live near you.</h4>
              </div>
              <div className="not-search-result-form">
                <div className="not-result-form-content">
                  <div className="not-result-form-logo">
                    <img src="" alt="" />
                  </div>
                  <div className="not-result-form-text">
                    <h4 className="font-bricolage">Join our mailing list</h4>
                    <p>and be the first to know when Lynx expands to your neighborhood</p>
                  </div>
                </div>
                <div className="not-result-form">
                  <form id="email-subscribe-form" className="form-subscribe" noValidate onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    try {
                      const payload = {
                        email,
                        from: "search", // Static value as requested
                        service_id: serviceId,
                        service: serviceName,
                        service_tier: serviceTier,
                        service_tier_tag: serviceTierTag,
                        zip_code: zipCode,
                        date: date,
                      };
                      const res: ApiResponse = await emailSubscribeService.subscribeEmail(payload);
                      if (res.success) {
                        Swal.fire({
                          title: "Success!",
                          text: "Successfully subscribed!",
                          icon: "success",
                          showConfirmButton: false,
                          timer: 3000, // Auto-close after 3 seconds
                        });
                        setEmail(""); // Clear email on success
                      } else {
                        let errorMessage = res.message || "Failed to subscribe. Please try again.";
                        if (res.errors && res.errors.length > 0) {
                          const fieldErrors = res.errors.map(err => err.msg).join("\n");
                          errorMessage += `\n${fieldErrors}`;
                        }
                        Swal.fire({
                          title: "Error!",
                          text: errorMessage,
                          icon: "error",
                          showConfirmButton: false,
                          timer: 3000, // Auto-close after 3 seconds
                        });
                      }
                    } catch (err: unknown) {
                      let errorMessage = "An unknown error occurred. Please try again.";
                      if (typeof err === 'object' && err !== null && 'message' in err && typeof err.message === 'string') {
                        // Check if the error object directly contains API response structure (e.g., from api.ts)
                        const apiError = err as ApiResponse;
                        if (apiError.message) {
                          errorMessage = apiError.message;
                          if (apiError.errors && apiError.errors.length > 0) {
                            const fieldErrors = apiError.errors.map(e => e.msg).join("\n");
                            errorMessage += `\n${fieldErrors}`;
                          }
                        } else {
                          errorMessage = err.message; // Generic error message from the thrown Error object
                        }
                      } else if (err instanceof Error) {
                        errorMessage = err.message;
                      }

                      Swal.fire({
                        title: "Error!",
                        text: errorMessage,
                        icon: "error",
                        showConfirmButton: false,
                        timer: 3000, // Auto-close after 3 seconds
                      });
                      console.error("Email subscription error:", err);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}>
                    <div className="form-wrap">
                      <div className="input-form-wrap form-floating">
                        <input
                          type="email"
                          name="email"
                          id="subscribe-email"
                          className="form-control"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <label htmlFor="subscribe-email">Email</label>
                      </div>
                      <div className="input-form-btn">
                        <button type="submit" className="btn btn-primary rounded-pill btn-send" disabled={isSubmitting}>
                          {isSubmitting ? "Subscribing..." : "Join our mailing list"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoProvidersNotice;

