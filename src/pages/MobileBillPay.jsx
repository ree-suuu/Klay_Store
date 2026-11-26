import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiRequest } from '../services/api'
import './Pages.css'

export default function MobileBillPay() {
  const { billToken } = useParams()
  const [bill, setBill] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const [paidSuccess, setPaidSuccess] = useState(false)

  useEffect(() => {
    async function fetchBill() {
      try {
        setLoading(true)
        const res = await apiRequest(`/bills/${billToken}`)
        if (res.success && res.bill) {
          setBill(res.bill)
          if (res.bill.status === 'paid') {
            setPaidSuccess(true)
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

    if (billToken) {
      fetchBill()
    }
  }, [billToken])

  const handlePayWithEsewa = async () => {
    setIsPaying(true)
    try {
      const res = await apiRequest(`/bills/${billToken}/pay-esewa`, {
        method: 'POST'
      })
      if (res.success) {
        setPaidSuccess(true)
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
      <div style={{ padding: '3rem 1rem', textAlign: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading your bill details...</p>
      </div>
    )
  }

  if (error || !bill) {
    return (
      <div style={{ padding: '3rem 1rem', textAlign: 'center', minHeight: '60vh' }}>
        <h2 style={{ color: '#d9534f', marginBottom: '1rem' }}>Bill Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error || 'This QR bill session is invalid or has expired.'}</p>
        <Link to="/" style={{ color: 'var(--accent-terracotta)', fontWeight: 600 }}>Return to Homepage</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '520px', margin: '2rem auto', padding: '1rem', minHeight: '75vh' }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '2rem',
        boxShadow: '0 12px 36px rgba(45, 40, 37, 0.1)',
        border: '1.5px solid var(--border-light)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', borderBottom: '1.5px dashed var(--border-light)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <img src="/logo.png" alt="KLAY" style={{ height: '38px', marginBottom: '0.4rem' }} onError={(e) => { e.target.style.display = 'none' }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Official Order Bill</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order ID: #{bill.orderId}</span>
        </div>

        {/* Customer Information */}
        <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', background: '#faf8f5', padding: '1rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Customer:</span>
            <strong>{bill.customerDetails.name}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
            <span>{bill.customerDetails.phone}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Deliver to:</span>
            <span>{bill.customerDetails.street}, {bill.customerDetails.city}</span>
          </div>
        </div>

        {/* Items List */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Purchased Products</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {bill.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #f2eee8', paddingBottom: '0.5rem' }}>
                {item.image && (
                  <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', objectFit: 'contain', borderRadius: '8px', background: '#f8f8f8' }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </p>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} × Rs. {item.price?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  Rs. {(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Price */}
        <div style={{ borderTop: '2px dashed var(--border-light)', paddingTop: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Total Payable</span>
            <strong style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--accent-terracotta)' }}>
              Rs. {bill.totalAmount?.toLocaleString('en-IN')}
            </strong>
          </div>
        </div>

        {/* Payment Action */}
        {paidSuccess ? (
          <div style={{
            background: '#e8f5e9',
            border: '1.5px solid #a5d6a7',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#2e7d32',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              marginBottom: '0.5rem'
            }}>✓</div>
            <h3 style={{ margin: '0.2rem 0', color: '#1b5e20', fontSize: '1.15rem' }}>Payment Done &amp; Order Placed!</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#2e7d32' }}>
              Thank you! Your payment was verified via eSewa and your order is confirmed.
            </p>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={handlePayWithEsewa}
              disabled={isPaying}
              style={{
                width: '100%',
                padding: '1.1rem',
                backgroundColor: '#41a124',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                fontSize: '1.08rem',
                fontWeight: 800,
                cursor: isPaying ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                boxShadow: '0 6px 18px rgba(65, 161, 36, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{
                background: '#ffffff',
                color: '#41a124',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '0.85rem'
              }}>e</span>
              {isPaying ? 'Processing Payment...' : `Pay with eSewa (Rs. ${bill.totalAmount?.toLocaleString('en-IN')})`}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Tap above to complete payment on your phone. The screen on your other device will update automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
