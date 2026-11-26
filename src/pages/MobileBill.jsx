import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiRequest } from '../services/api'
import '../components/CheckoutBillModal.css'

export default function MobileBill() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const [isPaid, setIsPaid] = useState(false)

  useEffect(() => {
    async function fetchBill() {
      try {
        setLoading(true)
        const res = await apiRequest(`/orders/view/${orderId}`)
        if (res.success && res.order) {
          setOrder(res.order)
          if (res.order.paymentStatus === 'completed') {
            setIsPaid(true)
          }
        } else {
          setError(res.message || 'Bill not found')
        }
      } catch (err) {
        setError(err.message || 'Unable to load bill')
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchBill()
    }
  }, [orderId])

  const handlePay = async () => {
    setIsPaying(true)
    try {
      const res = await apiRequest(`/orders/view/${orderId}/pay`, {
        method: 'POST'
      })
      if (res.success) {
        setIsPaid(true)
      } else {
        alert(res.message || 'Payment failed')
      }
    } catch (err) {
      alert(err.message || 'Payment error')
    } finally {
      setIsPaying(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading official bill...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h3 style={{ color: '#c0392b' }}>Bill Not Found</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error || 'Invalid or expired bill order.'}</p>
        <Link to="/" style={{ color: 'var(--accent-terracotta)', fontWeight: 600 }}>Back to Store</Link>
      </div>
    )
  }

  const billDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  return (
    <div style={{ maxWidth: '640px', margin: '1.5rem auto', padding: '0 1rem 3rem' }}>
      <div className="checkout-bill-card" style={{ position: 'relative', width: '100%', maxHeight: 'none', margin: '0 auto' }}>
        <div className="bill-content-scroll" style={{ padding: '1.5rem' }}>
          {/* Header matching modal exactly */}
          <div className="bill-header">
            <div className="bill-brand">
              <img src="/KLAY_hero.png" alt="KLAY" className="bill-logo-img" />
              <span className="bill-tagline">Authentic Nepali Utensils &amp; Appliances</span>
            </div>
            <div className="bill-meta-header">
              <span className="invoice-badge">OFFICIAL BILL</span>
              <span className="bill-invoice-num">#{order.orderId}</span>
              <span className="bill-date">{billDate}</span>
            </div>
          </div>

          <div className="bill-divider"></div>

          {/* Customer Details display */}
          <div className="checkout-customer-section">
            <h4 className="section-title">Delivery &amp; Customer Details</h4>
            <div className="customer-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div className="form-field">
                <label>Full Name</label>
                <div style={{ padding: '0.65rem 0.85rem', background: '#f8f6f2', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                  {order.customerName}
                </div>
              </div>
              <div className="form-field">
                <label>Mobile / Phone</label>
                <div style={{ padding: '0.65rem 0.85rem', background: '#f8f6f2', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                  {order.customerPhone}
                </div>
              </div>
              <div className="form-field">
                <label>Email Address</label>
                <div style={{ padding: '0.65rem 0.85rem', background: '#f8f6f2', borderRadius: '8px', fontSize: '0.9rem' }}>
                  {order.customerEmail}
                </div>
              </div>
              <div className="form-field">
                <label>Delivery City / Area</label>
                <div style={{ padding: '0.65rem 0.85rem', background: '#f8f6f2', borderRadius: '8px', fontSize: '0.9rem' }}>
                  {order.shippingAddress?.street}, {order.shippingAddress?.city}
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Table of Purchased Products */}
          <div className="bill-table-wrapper" style={{ marginTop: '1.25rem' }}>
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
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="td-item">
                      <div className="bill-item-cell">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="bill-item-thumb" />
                        )}
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
          <div className="bill-calculation-box" style={{ marginTop: '1.25rem' }}>
            <div className="calc-row">
              <span>Items Subtotal:</span>
              <span>Rs. {order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="calc-row">
              <span>Fragile Packaging &amp; Delivery:</span>
              <span className="free-tag">FREE Across Nepal</span>
            </div>
            <div className="calc-divider"></div>
            <div className="calc-row grand-total-row">
              <span>Total Bill Payable:</span>
              <span className="grand-total-amount">Rs. {order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Payment action on mobile */}
          <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
            {isPaid ? (
              <div style={{
                background: '#e8f5e9',
                border: '1.5px solid #a5d6a7',
                borderRadius: '12px',
                padding: '1.25rem',
                color: '#2e7d32'
              }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>✓</div>
                <strong style={{ fontSize: '1.1rem' }}>Bill Paid with eSewa!</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                  Thank you! Your order is confirmed.
                </p>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  className="esewa-pay-btn"
                  disabled={isPaying}
                  onClick={handlePay}
                  style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}
                >
                  <span className="btn-esewa-icon">e</span>
                  {isPaying ? 'Processing Payment...' : `Pay with eSewa (Rs. ${order.totalAmount.toLocaleString('en-IN')})`}
                </button>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Tap to pay. Your order is registered in the store database.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
