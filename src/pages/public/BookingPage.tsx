import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import BookingHeader from "../../components/public/booking/BookingHeader";
import BookingSidebar from "../../components/public/booking/BookingSidebar";
import BookingFooter from "../../components/public/booking/BookingFooter";
import "./BookingPage.css";

interface BookingData {
  service: string;
  location: string;
  when: "emergency" | "later";
  scheduleDate: string;
  provider?: {  // Made optional for "Let Lynx choose" functionality
    name: string;
    distance: string;
    rating: string;
    reviews: string;
    description: string;
    image: string;
    established: string;
  };
  isNewUser: boolean;
  isReturningUser: boolean;
  isEmergency: boolean;
  isScheduled: boolean;
  lynxChoice?: boolean; // Flag to indicate "Let Lynx choose" selection
}

export default function BookingPage(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const bookingData = location.state as BookingData | null;

  // Redirect if no booking data
  useEffect(() => {
    if (!bookingData) {
      navigate("/search");
    }
  }, [bookingData, navigate]);

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    zipCode: "",
  });

  const [errors, setErrors] = useState({
    street: "This address is incorrect",
    city: "",
    zipCode: "",
  });

  // Initialize validation on mount
  useEffect(() => {
    // Validate initial form data
    if (formData.street.toLowerCase().includes("")) {
      setErrors((prev) => ({ ...prev, street: "This address is incorrect" }));
    }
  }, []);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Validate on change
    validateField(field, value);
  };

  const validateField = (field: keyof typeof formData, value: string) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      
      if (field === "street") {
        if (!value.trim()) {
          newErrors.street = "";
        } else if (value.toLowerCase().includes("2 logan street")) {
          newErrors.street = "This address is incorrect";
        } else {
          newErrors.street = "";
        }
      } else if (field === "city") {
        if (!value.trim()) {
          newErrors.city = "";
        } else {
          newErrors.city = "";
        }
      } else if (field === "zipCode") {
        if (!value.trim()) {
          newErrors.zipCode = "";
        } else if (!/^\d{5}(-\d{4})?$/.test(value)) {
          newErrors.zipCode = "Please enter a valid zip code";
        } else {
          newErrors.zipCode = "";
        }
      }
      
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors = {
      street: "",
      city: "",
      zipCode: "",
    };

    if (!formData.street.trim()) {
      newErrors.street = "Street address is required";
    } else if (formData.street.toLowerCase().includes("2 logan street")) {
      newErrors.street = "This address is incorrect";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    // if (!formData.zipCode.trim()) {
    //   newErrors.zipCode = "Zip code is required";
    // } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
    //   newErrors.zipCode = "Please enter a valid zip code";
    // }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Navigate to next step (confirm booking)
      navigate("/confirm-booking", {
        state: {
          ...bookingData,
          address: formData,
        },
      });
    }
  };

  const handleBack = () => {
    navigate("/search");
  };

  const handleEditService = () => {
    // Navigate back to service selection or open modal
    navigate("/search", { state: bookingData });
  };

  const handleEditSchedule = () => {
    // Navigate to schedule selection or open modal
    // This could open a modal or navigate to a scheduling page
    console.log("Edit schedule clicked");
  };

  if (!bookingData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="booking-page">
      {/* Header with Progress */}
      <BookingHeader currentStep="address" />

      {/* Main Content */}
      <div className="booking-content">
        <div className="booking-container">
          {/* Left Column - Address Form */}
          <div className="booking-left">
            <h1 className="booking-title">Select your service address</h1>
            {!isAuthenticated && (
              <p className="booking-login-prompt">
                Already have an account? <Link to="/sign-in">Log In</Link>
              </p>
            )}

            <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
              {/* Street Field */}
              <div className="form-group">
                <div className={`input-field-wrapper ${errors.street ? "error" : ""}`}>
                  <div className="input-field-container">
                    <label htmlFor="street" className="input-label">Street</label>
                    <input
                      id="street"
                      type="text"
                      value={formData.street}
                      onChange={(e) => handleInputChange("street", e.target.value)}
                      placeholder=""
                      className="input-value"
                    />
                  </div>
                </div>
                {errors.street && (
                  <div className="error-message">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="8" cy="8" r="8" fill="#ef4444" />
                      <path
                        d="M5 5L11 11M11 5L5 11"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="error-text">{errors.street}</span>
                  </div>
                )}
              </div>

              {/* City Field */}
              <div className="form-group">
                <div className={`input-field-wrapper ${errors.city ? "error" : ""}`}>
                  <div className="input-field-container">
                    <label htmlFor="city" className="input-label">City</label>
                    <input
                      id="city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder=""
                      className="input-value"
                    />
                  </div>
                  {!errors.city && formData.city && (
                    <svg
                      className="input-checkmark"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="10" cy="10" r="10" fill="#1E4D5A" />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="#F7EF6F"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Zip Code Field */}
              <div className="form-group">
                <div className={`input-field-wrapper ${errors.zipCode ? "error" : ""}`}>
                  <div className="input-field-container">
                    <label htmlFor="zipCode" className="input-label">Zip code</label>
                    <input
                      id="zipCode"
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      placeholder="Enter your zip code"
                      className="input-value"
                      maxLength={10}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button type="button" className="btn-back" onClick={handleBack}>
                  Back
                </button>
                <button
                  type="button"
                  className="btn-continue"
                  onClick={handleContinue}
                >
                  Continue to Booking
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Summary Cards */}
          <div className="booking-right">
            <BookingSidebar
              service={bookingData.service.includes(" > ")
                ? bookingData.service.split(" > ")[1] || bookingData.service.split(" > ")[0]
                : bookingData.service}
              provider={bookingData.lynxChoice ? "Let Lynx Choose For You" : bookingData.provider?.name || "Provider"}
              distance={bookingData.lynxChoice ? "TBD" : bookingData.provider?.distance || "TBD"}
              rating={bookingData.lynxChoice ? "TBD" : bookingData.provider?.rating || "TBD"}
              reviews={bookingData.lynxChoice ? "TBD" : bookingData.provider?.reviews || "TBD"}
              vetted={true}
              licensed={true}
              established={bookingData.lynxChoice ? "TBD" : bookingData.provider?.established || "TBD"}
              description={bookingData.lynxChoice ? "Lynx will select the best provider for your needs" : bookingData.provider?.description || "Professional service provider"}
              image={bookingData.lynxChoice ? "/src/assets/Icon/LOGO.svg" : bookingData.provider?.image || "/src/assets/Icon/LOGO.svg"}
              date={bookingData.scheduleDate ? new Date(bookingData.scheduleDate) : new Date()}
              scheduleDate={bookingData.scheduleDate}
              isEmergency={bookingData.isEmergency}
              phone="+18774115969"
              email="hello@connectwithlynx.com"
              onEditService={handleEditService}
              onEditSchedule={handleEditSchedule}
            />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <BookingFooter />
    </div>
  );
}

