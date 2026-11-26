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

  // Dynamic Bill session state for eSewa QR
  const [billToken, setBillToken] = useState(null)
  const [billOrderId, setBillOrderId] = useState(null)
  const [isCreatingBill, setIsCreatingBill] = useState(false)
  const pollIntervalRef = useRef(null)

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  // Whenever modal opens with esewa, create a dynamic bill session so user can scan it on their phone
  useEffect(() => {
    let isMounted = true

    async function initBillSession() {
      if (!isCheckoutOpen || paymentMethod !== 'esewa' || !cart.length) {
        return
      }

      setIsCreatingBill(true)
      try {
        const items = cart.map((i) => ({
          productId: i.productId || i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
          brand: i.brand,
          category: i.category
        }))

        const res = await apiRequest('/bills/create', {
          method: 'POST',
          body: JSON.stringify({
            customerDetails,
            items,
            totalAmount
          })
        })

        if (isMounted && res.success) {
          setBillToken(res.billToken)
          setBillOrderId(res.orderId)
        }
      } catch (err) {
        console.error('Failed to create bill session for QR:', err)
      } finally {
        if (isMounted) setIsCreatingBill(false)
      }
    }

    if (isCheckoutOpen && paymentMethod === 'esewa') {
      initBillSession()
    }

    return () => {
      isMounted = false
    }
  }, [isCheckoutOpen, paymentMethod, totalAmount])

  // Poll bill status when billToken is active
  useEffect(() => {
    if (!billToken || confirmedOrder) return

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await apiRequest(`/bills/${billToken}`)
        if (res.success && res.bill && res.bill.status === 'paid') {
          clearInterval(pollIntervalRef.current)
          setConfirmedOrder({
            orderId: res.bill.orderId,
            customerName: res.bill.customerDetails.name,
            customerEmail: res.bill.customerDetails.email,
            customerPhone: res.bill.customerDetails.phone,
            totalAmount: res.bill.totalAmount,
            shippingAddress: res.bill.customerDetails,
            items: res.bill.items
          })
          showToast(`Payment received! Order #${res.bill.orderId} placed.`, 'success')
        }
      } catch (err) {
        // Silently ignore poll errors
      }
    }, 2500)

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [billToken, confirmedOrder, showToast])

  // Dynamic QR code URL pointing directly to the mobile bill payment page
  const qrTargetUrl = useMemo(() => {
    if (!billToken) return ''
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://klay-store-mqru.vercel.app'
    return `${origin}/bill/${billToken}`
  }, [billToken])

  // Generate SVG QR Matrix for the URL
  const qrSvgData = useMemo(() => {
    if (!qrTargetUrl) return null
    try {
      const matrix = generateQRMatrix(qrTargetUrl)
      return renderQRAsSVGPath(matrix)
    } catch (e) {
      console.warn('QR generation fallback:', e)
      return null
    }
  }, [qrTargetUrl])

  if (!isCheckoutOpen) return null

  const handleInputChange = (e) => {
    setCustomerDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Handle Order Placement & Database Saving for COD or Khalti
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
    setBillToken(null)
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
          /* ================= ORDER SUCCESS VIEW ================= */
          <div className="bill-success-view">
            <div className="bill-success-badge">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 className="bill-success-title">Order Placed Successfully!</h2>
            <p className="bill-success-subtitle">
              Your official order has been registered in the database.
            </p>

            <div className="bill-success-order-box">
              <div className="bill-receipt-row">
                <span className="receipt-label">Order Number:</span>
                <strong className="receipt-value order-id-highlight">
                  #{confirmedOrder.orderId}
                </strong>
              </div>
              <div className="bill-receipt-row">
                <span className="receipt-label">Customer Name:</span>
                <strong className="receipt-value">{confirmedOrder.customerName}</strong>
              </div>
              <div className="bill-receipt-row">
                <span className="receipt-label">Customer Phone:</span>
                <span className="receipt-value">{confirmedOrder.customerPhone}</span>
              </div>
              <div className="bill-receipt-row">
                <span className="receipt-label">Delivery Address:</span>
                <span className="receipt-value">
                  {confirmedOrder.shippingAddress?.street}, {confirmedOrder.shippingAddress?.city}
                </span>
              </div>
              <div className="bill-receipt-row total-paid-row">
                <span className="receipt-label">Total Amount:</span>
                <strong className="receipt-value paid-val">
                  Rs. {confirmedOrder.totalAmount?.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            <button type="button" className="bill-finish-btn" onClick={handleFinish}>
              Return to Store
            </button>
          </div>
        ) : (
          /* ================= STANDARD BILL & PAYMENT VIEW ================= */
          <div className="bill-content-scroll">
            {/* Header: Logo, Invoice ID, Date */}
            <div className="bill-header">
              <div className="bill-brand">
                <img
                  src="/logo.png"
                  alt="KLAY Kitchenware"
                  className="bill-logo-img"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                <span className="bill-tagline">Kitchen Utensils &amp; Premium Appliances</span>
              </div>
              <div className="bill-meta-header">
                <span className="bill-badge">OFFICIAL INVOICE</span>
                <span className="bill-invoice-id">
                  #{billOrderId || 'KLAY-BILL'}
                </span>
                <span className="bill-invoice-date">{currentDate}</span>
              </div>
            </div>

            {/* Customer Details Form */}
            <div className="bill-customer-section">
              <h3 className="bill-section-title">Delivery &amp; Customer Information</h3>
              <div className="bill-form-grid">
                <div className="bill-field">
                  <label htmlFor="customerName">Full Name</label>
                  <input
                    id="customerName"
                    type="text"
                    name="name"
                    value={customerDetails.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rishu Prajapati"
                    required
                  />
                </div>
                <div className="bill-field">
                  <label htmlFor="customerPhone">Phone Number</label>
                  <input
                    id="customerPhone"
                    type="tel"
                    name="phone"
                    value={customerDetails.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9841234567"
                    required
                  />
                </div>
                <div className="bill-field">
                  <label htmlFor="customerEmail">Email Address</label>
                  <input
                    id="customerEmail"
                    type="email"
                    name="email"
                    value={customerDetails.email}
                    onChange={handleInputChange}
                    placeholder="e.g. customer@gmail.com"
                    required
                  />
                </div>
                <div className="bill-field">
                  <label htmlFor="customerCity">City / Valley</label>
                  <input
                    id="customerCity"
                    type="text"
                    name="city"
                    value={customerDetails.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Kathmandu Valley"
                    required
                  />
                </div>
                <div className="bill-field full-width">
                  <label htmlFor="customerStreet">Delivery Street &amp; Landmark</label>
                  <input
                    id="customerStreet"
                    type="text"
                    name="street"
                    value={customerDetails.street}
                    onChange={handleInputChange}
                    placeholder="e.g. New Baneshwor, Ward 10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Purchased Items Table */}
            <div className="bill-items-section">
              <div className="bill-items-header">
                <span className="col-desc">Purchased Product</span>
                <span className="col-rate">Rate</span>
                <span className="col-qty">Qty</span>
                <span className="col-total">Total</span>
              </div>
              <div className="bill-items-list">
                {cart.map((item) => (
                  <div key={item._id || item.productId} className="bill-item-row">
                    <div className="bill-item-meta">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="bill-item-thumbnail"
                          loading="lazy"
                        />
                      )}
                      <div>
                        <span className="bill-item-brand">{item.brand}</span>
                        <h4 className="bill-item-title">{item.name}</h4>
                      </div>
                    </div>
                    <span className="bill-item-rate">
                      Rs. {item.price.toLocaleString('en-IN')}
                    </span>
                    <span className="bill-item-qty">{item.quantity}</span>
                    <span className="bill-item-subtotal">
                      Rs. {(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations & Subtotal */}
            <div className="bill-summary-box">
              <div className="summary-calc-row">
                <span>Items Subtotal ({totalCount} items):</span>
                <span>Rs. {totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-calc-row">
                <span>Fragile Packaging &amp; Delivery:</span>
                <span className="free-tag">FREE Across Nepal</span>
              </div>
              <div className="summary-calc-row grand-total-row">
                <span className="grand-total-label">Total Bill Payable:</span>
                <span className="grand-total-amount">
                  Rs. {totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bill-payment-selector">
              <label className="bill-selector-label">Choose Payment Option:</label>
              <div className="payment-options-grid">
                <label className={`payment-pill ${paymentMethod === 'esewa' ? 'active esewa' : ''}`}>
                  <input
                    type="radio"
                    name="billPayment"
                    value="esewa"
                    checked={paymentMethod === 'esewa'}
                    onChange={() => setPaymentMethod('esewa')}
                  />
                  <span className="pill-dot esewa-dot"></span>
                  <span>eSewa (Dynamic Bill QR)</span>
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

            {/* ================= ESEWA DYNAMIC BILL QR SECTION ================= */}
            {paymentMethod === 'esewa' ? (
              <div className="esewa-qr-container">
                <div className="esewa-qr-header">
                  <div className="esewa-logo-badge">
                    <span className="esewa-icon">e</span>
                    <span className="esewa-text">eSewa Bill Pay</span>
                  </div>
                  <div className="esewa-bill-details">
                    <span className="esewa-scan-instruction">Scan with phone camera or scanner</span>
                    <strong className="esewa-payable-val">
                      NPR {totalAmount.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                {/* The Dynamic Bill QR Box */}
                <div className="esewa-qr-box">
                  {isCreatingBill ? (
                    <div className="qr-fallback-box" style={{ minHeight: '190px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>Generating Bill QR...</span>
                    </div>
                  ) : qrSvgData ? (
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

                  <p className="qr-caption" style={{ marginTop: '0.85rem' }}>
                    Bill Order: <strong>#{billOrderId || 'KLAY'}</strong> • Amount: <strong>Rs. {totalAmount.toLocaleString('en-IN')}</strong>
                  </p>

                  <div style={{
                    marginTop: '0.75rem',
                    background: '#f1f8ee',
                    border: '1px solid #c8e6c9',
                    borderRadius: '10px',
                    padding: '0.6rem 0.9rem',
                    fontSize: '0.82rem',
                    color: '#2e7d32',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.1rem' }}>📱</span>
                    <span>
                      Scan this QR code with your mobile phone to view your official bill and pay with eSewa.
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Awaiting payment from your phone... This screen will automatically confirm when payment is complete.
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
