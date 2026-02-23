import React, { useEffect, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import BookingHeader from "../../components/public/booking/BookingHeader"
import BookingSidebar from "../../components/public/booking/BookingSidebar"
import BookingFooter from "../../components/public/booking/BookingFooter"
import "./BookingEmergencyConfirmed.css"
// no external icons used here

interface ProviderInfo {
  name: string
  distance: string
  rating: string
  reviews: string
  description: string
  image: string
  established: string
}

interface BookingState {
  requestId?: string
  service: string
  scheduleDate?: string
  isEmergency?: boolean
  provider: ProviderInfo
  address?: {
    street?: string
    city?: string
    zipCode?: string
  }
  contact?: {
    email?: string
    fullName?: string
    phone?: string
  }
  additionalDetails?: string
  attachments?: Array<{ name: string; type: string; url?: string } | File>
}

export default function BookingEmergencyConfirmed(): React.ReactElement {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = (location.state || {}) as BookingState
  const state: BookingState = React.useMemo(() => {
    // Prefer navigation state; fallback to localStorage on refresh
    if (locationState && Object.keys(locationState).length > 0) return locationState
    try {
      const raw = localStorage.getItem('bookingConfirmedData')
      if (raw) return JSON.parse(raw) as BookingState
    } catch {}
    return {} as BookingState
  }, [locationState])

  // Normalize attachments to preview URLs (prefer serialized from storage)
  interface PreviewItem { name: string; type: string; url?: string }
  const previews = useMemo<PreviewItem[]>(() => {
    const source = (state as any)?.attachmentsSerialized ?? (state as any)?.attachments ?? []
    const items: PreviewItem[] = source.map((a: any) => {
      if (a instanceof File) return { name: a.name, type: a.type, url: URL.createObjectURL(a) }
      return { name: a?.name as string, type: a?.type as string, url: a?.url as string | undefined }
    })
    return items
  }, [(state as any)?.attachmentsSerialized, (state as any)?.attachments])

  useEffect(() => {
    return () => {
      previews.forEach((p: PreviewItem) => { if (p.url) URL.revokeObjectURL(p.url) })
    }
  }, [previews])

  const requestId = state.requestId || `#${Date.now()}`

  // If still no critical data, route back to booking to avoid broken layout
  useEffect(() => {
    if (!state || !state.provider || !state.service) {
      // keep header/footer stable but send user back to flow
      navigate('/booking')
    }
  }, [state, navigate])

  return (
    <div className="booking-page" style={{ background: "#EDFCFF", minHeight: "100vh" }}>
      <BookingHeader currentStep="confirm" />

      <div className="booking-main">
        {/* Left column */}
        <div className="booking-confirmed-card">
          <div className="booking-confirmed-header">
            <span className="be-check" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M5 9.5L8 12.5L13 6.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <div className="booking-confirmed-title">Booking Confirmed</div>
          </div>
          <div className="booking-confirmed-requestid">Request {requestId}</div>

          <div>
            <hr className="booking-confirmed-hr" />
            <div className="booking-confirmed-section-title">Service Details</div>

            <div className="booking-confirmed-details-row">
              <b>Requested services</b>
              <span className="value">{state.service}</span>
            </div>
            {state.additionalDetails && (
              <div className="booking-confirmed-details-row">
                <b>Additional details</b>
                <span className="value">{state.additionalDetails}</span>
              </div>
            )}
            <div className="booking-confirmed-details-row">
              <b>Location</b>
              <span className="value">
                {state.address?.city ? `${state.address.city}, ` : ""}
                {state.address?.zipCode || ""}
              </span>
            </div>
            <div className="booking-confirmed-details-row">
              <b>Contact</b>
              <span className="value">
                {state.contact?.fullName}
                {state.contact?.phone ? (
                  <> <a href={`tel:${state.contact.phone}`} style={{ color: '#1E4D5A', textDecoration: 'underline' }}>{state.contact.phone}</a></>
                ) : null}
              </span>
            </div>
            <div className="booking-confirmed-details-row">
              <b>Address</b>
              <span className="value">
                {state.address?.street}
                {state.address?.city ? `, ${state.address.city}` : ""}
                {state.address?.zipCode ? `, ${state.address.zipCode}` : ""}
              </span>
            </div>
            <hr className="booking-confirmed-hr" />
          </div>

          {previews.filter((p: PreviewItem) => p.type?.startsWith("image/") && p.url).length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div className="booking-confirmed-attachments-title">Attachments</div>
              <div className="booking-confirmed-attachments-row">
                {previews.filter((p: PreviewItem) => p.type?.startsWith("image/") && p.url).map((p: PreviewItem) => (
                  <img key={p.name} src={p.url!} alt={p.name} className="booking-confirmed-attachment-img" />
                ))}
              </div>
            </div>
          )}

          <div className="booking-confirmed-actions">
            <button
              className="booking-confirmed-btn"
              onClick={() => {
                const attachUrls = previews.filter((p: PreviewItem) => p.type?.startsWith('image/') && p.url).map((p: PreviewItem) => p.url!)
                const cleanId = String(requestId).replace('#','')
                navigate(`/requests/${cleanId}`, {
                  state: {
                    requestId: cleanId,
                    lastUpdated: new Date().toISOString(),
                    service: state.service,
                    details: state.additionalDetails,
                    location: `${state.address?.city || ''} ${state.address?.zipCode || ''}`.trim(),
                    contactName: state.contact?.fullName,
                    contactPhone: state.contact?.phone,
                    address: [state.address?.street, state.address?.city, state.address?.zipCode].filter(Boolean).join(', '),
                    attachments: attachUrls,
                    provider: state.provider,
                    when: state.isEmergency ? 'emergency' : 'later',
                    scheduleDate: state.scheduleDate,
                  }
                })
              }}
            >
              See My Requests
            </button>
            <button className="booking-confirmed-btn" onClick={() => navigate("/")}>Back to Home Page</button>
            <button className="booking-confirmed-btn cancel" onClick={() => alert("Assignment cancellation flow here")}>                
              <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:18,height:18,background:'#fff',color:'#F36',borderRadius:999,marginRight:8}} aria-hidden>
                <svg width="10" height="10" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3L9 9M9 3L3 9" stroke="#F36" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              Cancel Assignment
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="booking-service-sidebar">
          <BookingSidebar
              service={state.service}
              provider={state.provider?.name}
              distance={state.provider?.distance}
              rating={state.provider?.rating}
              reviews={state.provider?.reviews}
              vetted={true}
              licensed={true}
              established={state.provider?.established}
              description={state.provider?.description}
              image={state.provider?.image}
              date={state.scheduleDate ? new Date(state.scheduleDate) : new Date()}
              scheduleDate={state.scheduleDate}
              isEmergency={state.isEmergency}
              phone={"+18774115969"}
              email={"hello@connectwithlynx.com"}
              hideMeta={true}
              showEditService={false}
              showEditSchedule={false}
              hideDateTimeHeader={true}
              emergencyTitleSize={20}
            />
        </div>
      </div>

      <BookingFooter />
    </div>
  )
}


