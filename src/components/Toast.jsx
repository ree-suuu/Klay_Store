import { useCart } from '../context/CartContext'
import './Toast.css'

export default function Toast() {
  const { toast, hideToast, openCart } = useCart()

  if (!toast.visible) return null

  return (
    <div className={`klay-toast-banner ${toast.type}`} role="status" aria-live="polite">
      <div className="toast-icon-wrap">
        {toast.type === 'cart' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </div>

      <div className="toast-body">
        <p className="toast-message">{toast.message}</p>
        {toast.type === 'cart' && (
          <button 
            type="button" 
            className="toast-action-btn"
            onClick={() => {
              hideToast()
              openCart()
            }}
          >
            View Cart &rarr;
          </button>
        )}
      </div>

      <button
        type="button"
        className="toast-close-btn"
        onClick={hideToast}
        aria-label="Close message"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  )
}
