import { useState, useMemo, useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../services/api'
import { generateQRMatrix, renderQRAsSVGPath } from '../utils/qrGenerator'
import './CheckoutBillModal.css'

export default function CheckoutBillModal() {
  const { cart, totalAmount, totalCount, isCheckoutOpen, closeCheckout, clearCart, showToast } =
    useCart()
  const { user } = useAuth()

  // Customer / Shipping Form State
  const [customerDetails, setCustomerDetails] = useState({
    name: user?.name || 'Rishu Prajapati',
    email: user?.email || 'customer@example.com',
    phone: user?.phone || '9841234567',
    city: 'Kathmandu Valley',
    street: 'New Baneshwor, Ward 10',
    province: 'Bagmati Province'
  })

  const [paymentMethod, setPaymentMethod] = useState('esewa') // 'esewa' | 'cod' | 'khalti'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Generate dynamic unique order ID
  const orderId = useMemo(() => {
    return 'KLAY-' + Math.floor(100000 + Math.random() * 900000)
  }, [isCheckoutOpen])

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  // Dynamic QR Code payload pointing to the live bill page on mobile
  const esewaPayload = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://klay-store-mqru.vercel.app'
    return `${origin}/bill/${orderId}`
  }, [orderId])

  // Automatically register order on backend when eSewa QR opens so mobile can view the exact bill
  useEffect(() => {
    let active = true
    async function ensureBillReady() {
      if (!isCheckoutOpen || paymentMethod !== 'esewa' || !cart.length) return
      try {
        await apiRequest('/orders', {
          method: 'POST',
          body: JSON.stringify({
            customOrderId: orderId,
            customerPhone: customerDetails.phone.trim(),
            shippingAddress: {
              city: customerDetails.city.trim(),
              street: customerDetails.street.trim(),
              province: customerDetails.province.trim(),
              postalCode: '44600'
            },
            paymentMethod: 'esewa'
          })
        })
      } catch (e) {
        // Silently handle if already created
      }
    }

    if (isCheckoutOpen && paymentMethod === 'esewa') {
      ensureBillReady()
    }

    return () => { active = false }
  }, [isCheckoutOpen, paymentMethod, orderId])
  useEffect(() => {
    if (!isCheckoutOpen || paymentMethod !== 'esewa' || confirmedOrder) return

    pollRef.current = setInterval(async () => {
      try {
        const res = await apiRequest(`/orders/view/${orderId}`)
        if (res.success && res.order && res.order.paymentStatus === 'completed') {
          clearInterval(pollRef.current)
          setConfirmedOrder(res.order)
          showToast(`Order #${res.order.orderId} verified and paid via eSewa!`, 'success')
        }
      } catch (e) {}
    }, 2500)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [isCheckoutOpen, paymentMethod, orderId, confirmedOrder, showToast])

  // Generate SVG QR Matrix
  const qrSvgData = useMemo(() => {
    try {
      const matrix = generateQRMatrix(esewaPayload)
      return renderQRAsSVGPath(matrix)
    } catch (e) {
      console.warn('QR generation fallback:', e)
      return null
    }
  }, [esewaPayload])

  if (!isCheckoutOpen) return null

  const handleInputChange = (e) => {
    setCustomerDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Handle Order Placement & Database Saving
  const handlePlaceOrder = async (confirmedPaymentMethod = paymentMethod) => {
    setErrorMessage('')
    setIsSubmitting(true)

    const payload = {
      customerPhone: customerDetails.phone.trim(),
      shippingAddress: {
        city: customerDetails.city.trim(),
        street: customerDetails.street.trim(),
        province: customerDetails.province.trim(),
        postalCode: '44600'
      },
      paymentMethod: confirmedPaymentMethod
    }

    try {
      const res = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      if (res?.success && res?.order) {
        setConfirmedOrder(res.order)
        showToast(`Order #${res.order.orderId} saved to database!`, 'success')
      } else {
        throw new Error('The order could not be created')
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to place order')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinish = () => {
    setConfirmedOrder(null)
    clearCart()
    closeCheckout()
  }

  return (
    <div className="checkout-bill-overlay" onClick={closeCheckout}>
      <div
        className="checkout-bill-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Order Bill & Payment"
      >
        {/* Close Button */}
        <button
          type="button"
          className="bill-close-btn"
          onClick={closeCheckout}
          aria-label="Close Bill"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {confirmedOrder ? (
          /* ================= ORDER SUCCESS CONFIRMATION ================= */
          <div className="order-confirmed-view">
            <div className="order-success-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span className="order-kicker">SAVED TO DATABASE &amp; CONFIRMED</span>
            <h2>Thank You, {confirmedOrder.customerName}!</h2>
            <p className="order-subtext">
              Your order <strong>#{confirmedOrder.orderId}</strong> is verified. We are packaging your genuine cookware for doorstep delivery across Nepal.
            </p>

            <div className="order-meta-box">
              <div className="meta-row">
                <span>Total Bill Paid:</span>
                <strong className="text-terracotta">Rs. {confirmedOrder.totalAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="meta-row">
                <span>Payment Method:</span>
                <strong>
                  {confirmedOrder.paymentMethod === 'esewa'
                    ? 'eSewa Digital Pay (Verified)'
                    : confirmedOrder.paymentMethod === 'cod'
                    ? 'Cash on Delivery (COD)'
                    : 'Khalti'}
                </strong>
              </div>
              <div className="meta-row">
                <span>Delivery Address:</span>
                <span>{confirmedOrder.shippingAddress?.street}, {confirmedOrder.shippingAddress?.city}</span>
              </div>
              <div className="meta-row">
                <span>Contact Phone:</span>
                <span>{confirmedOrder.customerPhone}</span>
              </div>
            </div>

            <button type="button" className="bill-primary-btn" onClick={handleFinish}>
              Back to Store
            </button>
          </div>
        ) : (
          /* ================= BILL & PAYMENT CHECKOUT FLOW ================= */
          <div className="bill-content-scroll">
            {/* Header */}
            <div className="bill-header">
              <div className="bill-brand">
                <img src="/KLAY_hero.png" alt="KLAY" className="bill-logo-img" />
                <span className="bill-tagline">Authentic Nepali Utensils &amp; Appliances</span>
              </div>
              <div className="bill-meta-header">
                <span className="invoice-badge">OFFICIAL BILL</span>
                <span className="bill-invoice-num">#{orderId}</span>
                <span className="bill-date">{currentDate}</span>
              </div>
            </div>

            <div className="bill-divider"></div>

            {/* Customer & Delivery Form Inputs */}
            <div className="checkout-customer-section">
              <h4 className="section-title">Delivery &amp; Customer Details</h4>
              <div className="customer-form-grid">
                <div className="form-field">
                  <label htmlFor="checkout-name">Full Name</label>
                  <input
                    type="text"
                    id="checkout-name"
                    name="name"
                    value={customerDetails.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rishu Prajapati"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="checkout-phone">Mobile / Phone</label>
                  <input
                    type="tel"
                    id="checkout-phone"
                    name="phone"
                    value={customerDetails.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9841234567"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="checkout-email">Email Address</label>
                  <input
                    type="email"
                    id="checkout-email"
                    name="email"
                    value={customerDetails.email}
                    onChange={handleInputChange}
                    placeholder="e.g. rishu@example.com"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="checkout-city">Delivery City / Area</label>
                  <input
                    type="text"
                    id="checkout-city"
                    name="city"
                    value={customerDetails.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Kathmandu Valley, Lalitpur, Pokhara"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Itemized Table of Purchased Products */}
            <div className="bill-table-wrapper">
              <table className="bill-table">
                <thead>
                  <tr>
                    <th className="th-item">Purchased Product</th>
                    <th className="th-price">Rate</th>
                    <th className="th-qty">Qty</th>
                    <th className="th-total">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td className="td-item">
                        <div className="bill-item-cell">
                          <img src={item.image} alt={item.name} className="bill-item-thumb" />
                          <div className="bill-item-meta">
                            <span className="bill-item-brand">{item.brand}</span>
                            <span className="bill-item-name">{item.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="td-price">Rs. {Number(item.price).toLocaleString('en-IN')}</td>
                      <td className="td-qty">{item.quantity}</td>
                      <td className="td-total">
                        Rs. {(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="bill-calculation-box">
              <div className="calc-row">
                <span>Items Subtotal ({totalCount} items):</span>
                <span>Rs. {totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="calc-row">
                <span>Fragile Packaging &amp; Delivery:</span>
                <span className="free-tag">FREE Across Nepal</span>
              </div>
              <div className="calc-divider"></div>
              <div className="calc-row grand-total-row">
                <span>Total Bill Payable:</span>
                <span className="grand-total-amount">Rs. {totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Options Toggle */}
            <div className="bill-payment-section">
              <span className="payment-label">Choose Payment Option:</span>
              <div className="payment-pill-options">
                <label className={`payment-pill ${paymentMethod === 'esewa' ? 'active esewa' : ''}`}>
                  <input
                    type="radio"
                    name="billPayment"
                    value="esewa"
                    checked={paymentMethod === 'esewa'}
                    onChange={() => setPaymentMethod('esewa')}
                  />
                  <span className="pill-dot esewa-dot"></span>
                  <span>eSewa (Dynamic QR &amp; Direct Pay)</span>
                </label>

                <label className={`payment-pill ${paymentMethod === 'cod' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="billPayment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <span>Cash on Delivery (COD)</span>
                </label>

                <label className={`payment-pill ${paymentMethod === 'khalti' ? 'active khalti' : ''}`}>
                  <input
                    type="radio"
                    name="billPayment"
                    value="khalti"
                    checked={paymentMethod === 'khalti'}
                    onChange={() => setPaymentMethod('khalti')}
                  />
                  <span>Khalti</span>
                </label>
              </div>
            </div>

            {/* Error banner if any */}
            {errorMessage && <div className="bill-error-banner">{errorMessage}</div>}

            {/* ================= ESEWA DYNAMIC QR SECTION ================= */}
            {paymentMethod === 'esewa' ? (
              <div className="esewa-qr-container">
                <div className="esewa-qr-header">
                  <div className="esewa-logo-badge">
                    <span className="esewa-icon">e</span>
                    <span className="esewa-text">eSewa</span>
                  </div>
                  <div className="esewa-bill-details">
                    <span className="esewa-scan-instruction">Scan with eSewa Mobile App</span>
                    <strong className="esewa-payable-val">
                      NPR {totalAmount.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                {/* The Dynamic QR Box */}
                <div className="esewa-qr-box">
                  {qrSvgData ? (
                    <div className="qr-svg-wrapper">
                      <svg
                        viewBox={`0 0 ${qrSvgData.size} ${qrSvgData.size}`}
                        className="esewa-qr-svg"
                        shapeRendering="crispEdges"
                      >
                        <path d={qrSvgData.path} fill="#1D231F" />
                      </svg>
                      {/* Center eSewa Brand Emblem */}
                      <div className="qr-center-emblem">
                        <span>e</span>
                      </div>
                    </div>
                  ) : (
                    <div className="qr-fallback-box">
                      <span>QR Code Ready</span>
                    </div>
                  )}
                  <p className="qr-caption">
                    Bill Order: <strong>#{orderId}</strong> • Amount: <strong>Rs. {totalAmount.toLocaleString('en-IN')}</strong>
                  </p>
                </div>

                {/* Fallback Option below QR: Done & Proceed */}
                <div className="esewa-fallback-row">
                  <button
                    type="button"
                    className="esewa-done-proceed-btn"
                    disabled={isSubmitting}
                    onClick={() => handlePlaceOrder('esewa')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Done &amp; Proceed (Confirm Checkout)
                  </button>
                </div>
              </div>
            ) : (
              /* COD or Khalti Actions */
              <div className="bill-actions-row">
                <button
                  type="button"
                  className="bill-primary-btn"
                  disabled={isSubmitting}
                  onClick={() => handlePlaceOrder(paymentMethod)}
                >
                  {isSubmitting
                    ? 'Saving Order...'
                    : paymentMethod === 'cod'
                    ? `Confirm Order (Cash on Delivery) • Rs. ${totalAmount.toLocaleString('en-IN')}`
                    : `Pay with Khalti • Rs. ${totalAmount.toLocaleString('en-IN')}`}
                </button>
                <button type="button" className="bill-secondary-btn" onClick={closeCheckout}>
                  Back to Cart
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
