import React, { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import BookingHeader from "../../components/public/booking/BookingHeader"
import BookingSidebar from "../../components/public/booking/BookingSidebar"
import BookingFooter from "../../components/public/booking/BookingFooter"
import "./ConfirmBookingPage.css"

interface BookingData {
  service: string
  location: string
  when: "emergency" | "later"
  scheduleDate: string
  provider: {
    name: string
    distance: string
    rating: string
    reviews: string
    description: string
    image: string
    established: string
  }
  isNewUser: boolean
  isReturningUser: boolean
  isEmergency: boolean
  isScheduled: boolean
}

export default function ConfirmBookingPage(): React.ReactElement {
  const navigate = useNavigate()
  const location = useLocation()
  const bookingData = location.state as BookingData | null

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const imagePreviews = useMemo(() => {
    return files
      .filter(f => f.type.startsWith('image/'))
      .map(f => ({ file: f, url: URL.createObjectURL(f) }))
  }, [files])

  useEffect(() => {
    return () => {
      imagePreviews.forEach(p => URL.revokeObjectURL(p.url))
    }
  }, [imagePreviews])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []).slice(0, 10)
    setFiles(selected)
  }

  function handleBack() {
    navigate("/booking", { state: bookingData || undefined })
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault()

    // Serialize attachments for persistence (images to data URLs; others as metadata)
    const attachmentsSerialized = await Promise.all(
      files.slice(0, 10).map(async (f) => {
        if (f.type && f.type.startsWith('image/')) {
          try {
            const dataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => resolve(String(reader.result || ''))
              reader.onerror = () => reject(new Error('read-failed'))
              reader.readAsDataURL(f)
            })
            return { name: f.name, type: f.type, url: dataUrl }
          } catch {
            return { name: f.name, type: f.type }
          }
        }
        return { name: f.name, type: f.type }
      })
    )

    const chosenIsEmergency = (location.state as any)?.when
      ? (location.state as any)?.when === 'emergency'
      : ((location.state as any)?.isEmergency !== undefined
          ? (location.state as any)?.isEmergency
          : !(location.state as any)?.scheduleDate)

    const payload = {
      requestId: `#${Date.now()}`,
      service: (location.state as any)?.service || "",
      scheduleDate: (location.state as any)?.scheduleDate,
      isEmergency: chosenIsEmergency,
      provider: (location.state as any)?.provider,
      address: { ...((location.state as any)?.address || {}), ...{ street: (location.state as any)?.address?.street, city: (location.state as any)?.address?.city, zipCode: (location.state as any)?.address?.zipCode } },
      contact: { email, fullName, phone },
      additionalDetails: jobDescription,
      attachments: files,
      attachmentsSerialized
    }

    try {
      localStorage.setItem('bookingConfirmedData', JSON.stringify(payload))
      // Append to persistent "My Requests" list for account view
      const existingRaw = localStorage.getItem('myRequests')
      const existing: any[] = existingRaw ? JSON.parse(existingRaw) : []
      existing.push({ ...payload, createdAt: new Date().toISOString() })
      localStorage.setItem('myRequests', JSON.stringify(existing))
    } catch {}

    navigate("/booking/confirmed", { state: payload })
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#EDFCFF",
      display: "flex",
      flexDirection: "column"
    }}>
      <BookingHeader currentStep="confirm" />
      <div className="booking-main">
        <form onSubmit={handleConfirm} className="booking-form">
          <h2 style={{
            fontFamily: "Bricolage Grotesque",
            fontWeight: 700,
            fontSize: 32,
            color: "#1E4D5A",
            marginBottom: 6
          }}>Contact Information</h2>
          <div style={{ fontSize: 14, marginBottom: 4 }}>
            Already have an account? <b>Log In</b>
          </div>
          <div className="floating-label-group">
            <input
              type="email"
              id="email"
              className="floating-label-input"
              placeholder=" "
              autoComplete="off"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email" className="floating-label-label">Email</label>
            <span className="floating-label-hint">Enter your email</span>
          </div>
          <div className="floating-label-group">
            <input
              type="password"
              id="password"
              className="floating-label-input"
              placeholder=" "
              autoComplete="off"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password" className="floating-label-label">Password</label>
            <span className="floating-label-hint">Create password</span>
          </div>
          <div className="floating-label-group">
            <input
              type="text"
              id="fullname"
              className="floating-label-input"
              placeholder=" "
              autoComplete="off"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
            <label htmlFor="fullname" className="floating-label-label">Full name</label>
            <span className="floating-label-hint">Enter your full name</span>
          </div>
          <div className="floating-label-group" style={{ marginBottom: 32 }}>
            <input
              type="tel"
              id="phone"
              className="floating-label-input"
              placeholder=" "
              autoComplete="off"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
            <label htmlFor="phone" className="floating-label-label">Phone number</label>
            <span className="floating-label-hint">Enter your phone number</span>
          </div>

          <h2 style={{
            fontFamily: "Bricolage Grotesque",
            fontWeight: 700,
            fontSize: 32,
            color: "#1E4D5A",
            marginBottom: 8
          }}>Service Information</h2>
          <div style={{ fontSize: 16, color: "#1E4D5A", marginBottom: 16 }}>
            Let us know what needs to be or serviced.
          </div>
          <div className="floating-label-group" style={{ marginBottom: 24 }}>
            <textarea
              id="job_description"
              className="floating-label-input"
              placeholder=" "
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              rows={4}
              required
            />
            <label htmlFor="job_description" className="floating-label-label">Job description</label>
            <span className="floating-label-hint">Describe the issue or service you need</span>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>
              Upload Images <span style={{ color: "#999", fontWeight: 400 }}>(optional)</span>
            </label>
          </div>
          <div style={{ fontSize: 14, color: "#1E4D5A", marginBottom: 8 }}>
            Add clear photos of the item or area that needs repair
          </div>
          <div style={{
            border: "2px dashed #C8E9EF",
            borderRadius: 12,
            background: "#fff",
            padding: 24,
            marginBottom: 32,
            textAlign: "center"
          }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Choose file or drag & drop here</div>
            <div style={{ color: "#999", fontSize: 14, marginBottom: 12 }}>File supported: JPG, PNG & PDF</div>
            <label style={{
              display: "inline-block",
              border: "2px solid #1E4D5A",
              borderRadius: 24,
              padding: "6px 28px",
              color: "#1E4D5A",
              fontWeight: 600,
              fontSize: 18,
              cursor: "pointer",
              marginBottom: 8
            }}>
              Browse
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                multiple
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </label>
            <div style={{ color: "#999", fontSize: 14 }}>Limit 10 images</div>
            {files.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 14 }}>
                {files.map((file, idx) => (
                  <div key={idx}>{file.name}</div>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <button type="button" onClick={handleBack} style={backBtnStyle}>Back</button>
            <button type="submit" style={confirmBtnStyle}>Confirm Booking</button>
          </div>

          {files.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 700, color: '#1E4D5A', marginBottom: 8 }}>Selected files</div>
              <div className="preview-grid">
                {imagePreviews.map(p => (
                  <div className="preview-item" key={p.file.name + p.file.lastModified}>
                    <img src={p.url} alt={p.file.name} />
                    <div className="preview-name" title={p.file.name}>{p.file.name}</div>
                  </div>
                ))}
                {files
                  .filter(f => !f.type.startsWith('image/'))
                  .map(f => (
                    <div className="preview-item doc" key={f.name + f.lastModified}>
                      <div className="preview-doc">PDF</div>
                      <div className="preview-name" title={f.name}>{f.name}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </form>

        <div className="booking-service-sidebar">
          {bookingData && (
            <BookingSidebar
              service={bookingData.service.includes(" > ")
                ? bookingData.service.split(" > ")[1] || bookingData.service.split(" > ")[0]
                : bookingData.service}
              provider={bookingData.provider.name}
              distance={bookingData.provider.distance}
              rating={bookingData.provider.rating}
              reviews={bookingData.provider.reviews}
              vetted={true}
              licensed={true}
              established={bookingData.provider.established}
              description={bookingData.provider.description}
              image={bookingData.provider.image}
              date={bookingData.when === 'later' && bookingData.scheduleDate ? new Date(bookingData.scheduleDate) : new Date()}
              scheduleDate={bookingData.when === 'later' ? bookingData.scheduleDate : undefined}
              isEmergency={bookingData.when ? bookingData.when === 'emergency' : (bookingData.isEmergency ?? !bookingData.scheduleDate)}
              phone={"+18774115969"}
              email={"hello@connectwithlynx.com"}
            />
          )}
        </div>
      </div>

      <BookingFooter />
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontWeight: 700,
  color: "#1E4D5A",
  fontFamily: "Bricolage Grotesque",
  fontSize: 16,
  marginBottom: 4,
  display: "block"
}

const backBtnStyle: React.CSSProperties = {
  border: "2px solid #1E4D5A",
  borderRadius: 8,
  background: "#fff",
  color: "#1E4D5A",
  fontWeight: 700,
  fontSize: 18,
  padding: "12px 32px",
  cursor: "pointer"
}

const confirmBtnStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 8,
  background: "#F7EF6F",
  color: "#1E4D5A",
  fontWeight: 700,
  fontSize: 18,
  padding: "12px 32px",
  cursor: "pointer"
}


