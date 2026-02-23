import React, { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BookingSidebar from '../../components/public/booking/BookingSidebar'
import RequestProgressNav from '../../components/public/requests/RequestProgressNav'
import '../../components/public/requests/RequestProgressNav.css'
import './BookingEmergencyConfirmed.css'

interface ProviderInfo {
  name: string
  distance: string
  rating: string
  reviews: string
  description: string
  image?: string
  established: string
}

interface RequestState {
  requestId?: string
  service?: string
  scheduleDate?: string
  isEmergency?: boolean
  provider?: ProviderInfo
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

export default function RequestStepPage(): React.ReactElement {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = (location.state || {}) as RequestState

  // Prefer navigation state; fallback to localStorage (reuse key if already stored by booking)
  const state: RequestState = useMemo(() => {
    if (locationState && Object.keys(locationState).length > 0) return locationState
    try {
      const raw = localStorage.getItem('bookingConfirmedData')
      if (raw) return JSON.parse(raw) as RequestState
    } catch {}
    return {}
  }, [locationState])

  // Normalize attachment previews
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

  return (
    <div className="booking-page" style={{ background: '#EDFCFF', minHeight: '100vh' }}>
      {/* Main header is rendered by Layout. Progress nav sits under it */}
      <RequestProgressNav currentStep={0} onBack={() => navigate(-1)} />

      <div className="booking-main">
        {/* Left column (status + details) */}
        <div className="booking-confirmed-card">
          <div className="booking-confirmed-header">
            <span className="be-check" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M5 9.5L8 12.5L13 6.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <div className="booking-confirmed-title">Request Sent</div>
          </div>
          <div className="request-status-pill">Your request has been received by the provider</div>
          <div className="booking-confirmed-requestid">Request {requestId}</div>

          <div>
            <hr className="booking-confirmed-hr" />
            <div className="booking-confirmed-section-title">Service Details</div>

            <div className="booking-confirmed-details-row">
              <b>Requested services</b>
              <span className="value">{state.service || '—'}</span>
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
                {state.address?.city ? `${state.address.city}, ` : ''}
                {state.address?.zipCode || ''}
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
                {state.address?.city ? `, ${state.address.city}` : ''}
                {state.address?.zipCode ? `, ${state.address.zipCode}` : ''}
              </span>
            </div>
            <hr className="booking-confirmed-hr" />
          </div>

          {previews.filter((p: PreviewItem) => p.type?.startsWith('image/') && p.url).length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div className="booking-confirmed-attachments-title">Attachments</div>
              <div className="booking-confirmed-attachments-row">
                {previews.filter((p: PreviewItem) => p.type?.startsWith('image/') && p.url).map((p: PreviewItem) => (
                  <img key={p.name} src={p.url!} alt={p.name} className="booking-confirmed-attachment-img" />
                ))}
              </div>
            </div>
          )}

          <div className="booking-confirmed-actions">
            <button className="booking-confirmed-btn" onClick={() => navigate('/employee/my-requests')}>Back to Requests</button>
            <button className="booking-confirmed-btn cancel" onClick={() => alert('Assignment cancellation flow here')}>Cancel Assignment</button>
          </div>
        </div>

        {/* Right column: mirror booking page sidebar */}
        <div className="booking-service-sidebar">
          <BookingSidebar
            service={state.service || ''}
            provider={state.provider?.name}
            distance={state.provider?.distance}
            rating={state.provider?.rating}
            reviews={state.provider?.reviews}
            vetted={true}
            licensed={true}
            established={state.provider?.established}
            description={state.provider?.description}
            image={state.provider?.image || ''}
            date={state.scheduleDate ? new Date(state.scheduleDate) : new Date()}
            scheduleDate={state.scheduleDate}
            isEmergency={!!state.isEmergency}
            phone={'+18774115969'}
            email={'hello@connectwithlynx.com'}
            hideMeta={true}
            showEditService={false}
            showEditSchedule={false}
            hideDateTimeHeader={true}
            emergencyTitleSize={20}
          />
        </div>
      </div>
    </div>
  )
}


