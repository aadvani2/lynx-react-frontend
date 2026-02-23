import ClockIcon from "../../../assets/Icon/clock.svg";
import CalendarIcon from "../../../assets/Icon/calendar.svg";
import MailIcon from "../../../assets/Icon/mail.svg";
import BuildingIcon from "../../../assets/Icon/building.svg";
import CheckmarkIcon from "../../../assets/Icon/checkmark.svg";
import StarIcon from "../../../assets/Icon/star.svg";
import EditIcon from "../../../assets/Icon/edit2.svg";
import PhoneIcon from "../../../assets/Icon/phone.svg";
import LocationIcon from "../../../assets/Icon/location.png";

interface BookingSidebarProps {
  service?: string;
  provider?: string;
  distance?: string;
  rating?: string;
  reviews?: string;
  vetted?: boolean;
  licensed?: boolean;
  established?: string;
  description?: string;
  image?: string;
  date?: Date;
  phone?: string;
  email?: string;
  isEmergency?: boolean;
  scheduleDate?: string;
  onEditService?: () => void;
  onEditSchedule?: () => void;
  hideMeta?: boolean; // hide distance/rating/badges/established
  showEditService?: boolean; // toggle Edit Service button
  showEditSchedule?: boolean; // toggle Edit Schedule button
  hideDateTimeHeader?: boolean; // hide "Date & Time" heading
  emergencyTitleSize?: number; // font size for Emergency/Scheduled title
}

export default function BookingSidebar({
  service = "Plumbing",
  provider = "Blue Star Construction & Remodeling",
  distance = "6.39",
  rating = "4.7",
  reviews = "501",
  vetted = true,
  licensed = true,
  established = "2015",
  description = "Blue Star Construction & Roofing is a family-owned company, located in Houston Texas. We are a fully licensed, bonded, and insured general contractor serving our clients since 2005.",
  image,
  date,
  phone = "+18774115969",
  email = "hello@connectwithlynx.com",
  isEmergency = false,
  scheduleDate,
  onEditService,
  onEditSchedule,
  hideMeta = false,
  showEditService = true,
  showEditSchedule = true,
  hideDateTimeHeader = false,
  emergencyTitleSize
}: BookingSidebarProps) {
  // Use current date/time for emergency, or scheduleDate if available
  const displayDate = scheduleDate ? new Date(scheduleDate) : (date || new Date());
  
  const formatDate = (): string => {
    try {
      return displayDate.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return "";
    }
  };

  const formatTime = (): string => {
    try {
      return displayDate.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return "";
    }
  };

  const dateStr = formatDate();
  const timeStr = formatTime();

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: 24,
      minHeight: 600
    }}>
      {/* Service Card */}
      <div style={{
        width: "100%",
        position: "relative",
        boxShadow: "0px 1px 3px rgba(39, 39, 39, 0.05)",
        borderRadius: 16,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        overflow: "hidden"
      }}>
        {image ? (
          <img
            src={image}
            alt={service}
            style={{
              width: "100%",
              height: 200,
              objectFit: "cover"
            }}
          />
        ) : (
          // Reserve image space when image is not provided (backend will supply later)
          <div
            aria-hidden="true"
            style={{
              width: "100%",
              height: 200,
              background: "#F0F8FF",
              borderBottom: "1px solid rgba(39,39,39,0.05)"
            }}
          />
        )}
        <div style={{ 
          width: "100%",
          position: "relative",
          boxShadow: "0px 1px 3px rgba(39, 39, 39, 0.05)",
          borderRadius: "0px 0px 16px 16px",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 32,
          boxSizing: "border-box",
          gap: 16,
          textAlign: "left"
        }}>
          {/* Service Name - 36px */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
            <div style={{ fontWeight: 700, fontSize: 36, color: "#1E4D5A", fontFamily: "Bricolage Grotesque, sans-serif", lineHeight: 1.2, flex: 1 }}>{service || "Plumbing"}</div>
            {showEditService && (
              <button 
                onClick={onEditService}
                style={{
                  border: "1px solid #1E4D5A",
                  borderRadius: 24,
                  background: "#fff",
                  color: "#1E4D5A",
                  fontWeight: 600,
                  fontSize: 14,
                  padding: "4px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  fontFamily: "Bricolage Grotesque, sans-serif",
                  flexShrink: 0,
                  alignSelf: "flex-start"
                }}
              >
                <img src={EditIcon} alt="Edit" style={{ width: 14, height: 14 }} />
                Edit Service
              </button>
            )}
          </div>
          {/* Provider Name - 20px */}
          <div style={{ fontWeight: 700, fontSize: 20, color: "#1E4D5A", fontFamily: "Bricolage Grotesque, sans-serif", width: "100%" }}>{provider || "Blue Star Construction & Remodeling"}</div>
                {!hideMeta && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8, fontSize: 14, fontFamily: "Bricolage Grotesque, sans-serif" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <img src={LocationIcon} alt="" style={{ width: 16, height: 16 }} />
                        {distance} Miles away
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <img src={StarIcon} alt="" style={{ width: 16, height: 16 }} />
                        {rating} <span style={{ color: "#999" }}>({reviews} reviews)</span>
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8, fontSize: 14, fontFamily: "Bricolage Grotesque, sans-serif" }}>
                      {vetted && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <img src={CheckmarkIcon} alt="" style={{ width: 16, height: 16 }} />
                          Vetted by Lynx
                        </span>
                      )}
                      {licensed && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <img src={CheckmarkIcon} alt="" style={{ width: 16, height: 16 }} />
                          Licensed & Insured
                        </span>
                      )}
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <img src={BuildingIcon} alt="" style={{ width: 16, height: 16 }} />
                        Est. {established}
                      </span>
                    </div>
                  </>
                )}
          <div style={{ marginTop: 8, color: "#1E4D5A", fontSize: 14, fontFamily: "Bricolage Grotesque, sans-serif" }}>
            {description} <span style={{ color: "#1E4D5A", fontWeight: 600, cursor: "pointer" }}>See More</span>
          </div>
        </div>
      </div>

      {/* Date & Time Card */}
      <div style={{
        width: "100%",
        position: "relative",
        boxShadow: "0px 1px 3px rgba(39, 39, 39, 0.05)",
        borderRadius: 16,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 32,
        boxSizing: "border-box",
        gap: 24,
        textAlign: "left",
        fontSize: 36
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          {!hideDateTimeHeader && (
            <div style={{ fontWeight: 700, fontSize: 18, color: "#1E4D5A", fontFamily: "Bricolage Grotesque, sans-serif" }}>Date & Time</div>
          )}
          {showEditSchedule && (
            <button 
              onClick={onEditSchedule}
              style={{
                border: "1px solid #1E4D5A",
                borderRadius: 24,
                background: "#fff",
                color: "#1E4D5A",
                fontWeight: 600,
                fontSize: 14,
                padding: "4px 16px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                fontFamily: "Bricolage Grotesque, sans-serif"
              }}
            >
              <img src={EditIcon} alt="Edit" style={{ width: 14, height: 14 }} />
              Edit Schedule
            </button>
          )}
        </div>
        <div style={{ marginTop: hideDateTimeHeader ? 0 : 12, fontWeight: 700, color: "#1E4D5A", fontSize: emergencyTitleSize || 16, fontFamily: "Bricolage Grotesque, sans-serif" }}>
          {isEmergency ? "Emergency Service" : "Scheduled Service"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8, fontSize: 14, fontFamily: "Bricolage Grotesque, sans-serif" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <img src={CalendarIcon} alt="" style={{ width: 16, height: 16 }} />
            {dateStr}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <img src={ClockIcon} alt="" style={{ width: 16, height: 16 }} />
            {timeStr}
          </span>
        </div>
      </div>

      {/* Contact Card */}
      <div style={{
        width: "100%",
        position: "relative",
        boxShadow: "0px 1px 3px rgba(39, 39, 39, 0.05)",
        borderRadius: 16,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 32,
        boxSizing: "border-box",
        gap: 16,
        textAlign: "left",
        fontSize: 18
      }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: "#1E4D5A", fontFamily: "Bricolage Grotesque, sans-serif" }}>
          Need help? We've got your back!
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14, fontFamily: "Bricolage Grotesque, sans-serif" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={PhoneIcon} alt="" style={{ width: 16, height: 16 }} />
            {phone}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={MailIcon} alt="" style={{ width: 16, height: 16 }} />
            {email}
          </span>
        </div>
      </div>
    </div>
  );
}

