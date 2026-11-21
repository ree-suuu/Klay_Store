import { useState } from 'react'
import './Pages.css'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // When we build the backend (Express + MongoDB), this form will send real data to the server!
    setSubmitted(true)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Get in Touch with KLAY</h1>
        <p>Questions about product availability, bulk utensil orders, or warranty support? Contact our team.</p>
      </div>

      <div className="contact-wrapper">
        <div className="contact-info-panel">
          <div className="info-item">
            <span className="info-label">01</span>
            <div>
              <h4>Store Location</h4>
              <p>KLAY Kitchenware &amp; Appliances, Main Commercial Arcade</p>
            </div>
          </div>

          <div className="info-item">
            <span className="info-label">02</span>
            <div>
              <h4>Customer Support</h4>
              <p>support@klaystore.com</p>
            </div>
          </div>

          <div className="info-item">
            <span className="info-label">03</span>
            <div>
              <h4>Phone Support</h4>
              <p>+977 01-4455660 / +977 9801234567</p>
            </div>
          </div>

          <div className="store-note">
            <h5>Customer Service Hours:</h5>
            <p>Sunday - Friday: 9:00 AM - 7:00 PM. We reply to digital inquiries within 24 business hours.</p>
          </div>
        </div>

        <div className="contact-form-panel">
          {submitted ? (
            <div className="success-message">
              <h3>Thank you, {formData.name}!</h3>
              <p>Your message has been received. We'll reply shortly.</p>
              <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g. Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Utensil inquiry, care instructions..."
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="Write your note here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
