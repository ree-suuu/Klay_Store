import { useCart } from '../context/CartContext'
import './QuantityModal.css'

export default function QuantityModal() {
  const {
    quantityModalProduct,
    selectedQuantity,
    setSelectedQuantity,
    closeQuantityModal,
    addToCart
  } = useCart()

  if (!quantityModalProduct) return null

  const handleMinus = () => {
    setSelectedQuantity((prev) => Math.max(1, prev - 1))
  }

  const handlePlus = () => {
    setSelectedQuantity((prev) => prev + 1)
  }

  const handleConfirm = () => {
    addToCart(quantityModalProduct, selectedQuantity)
    closeQuantityModal()
  }

  return (
    <div className="quantity-popup-overlay" onClick={closeQuantityModal}>
      <div 
        className="quantity-popup-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Quantity Selection"
      >
        {/* Close Button at top right */}
        <button
          type="button"
          className="popup-close-btn"
          onClick={closeQuantityModal}
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Product Image Pod (replacing tomato) */}
        <div className="popup-image-pod">
          <img
            src={quantityModalProduct.image}
            alt={quantityModalProduct.name}
            className="popup-product-img"
          />
          <div className="popup-img-shadow"></div>
        </div>

        {/* Product Name & Brand */}
        <div className="popup-product-info">
          <span className="popup-brand-badge">{quantityModalProduct.brand}</span>
          <h3 className="popup-product-title">{quantityModalProduct.name}</h3>
          <span className="popup-unit-price">Rs. {Number(quantityModalProduct.price).toLocaleString('en-IN')} each</span>
        </div>

        {/* Quantity Selector: Minus at Left, Count in Middle, Plus at Right */}
        <div className="popup-selector-row">
          {/* - sign on the left (cannot go below 1) */}
          <button
            type="button"
            className="popup-circle-btn minus"
            disabled={selectedQuantity <= 1}
            onClick={handleMinus}
            aria-label="Decrease quantity"
            title={selectedQuantity <= 1 ? "Minimum quantity is 1" : "Decrease quantity"}
          >
            −
          </button>

          {/* Count in middle */}
          <div className="popup-center-count">
            <span className="popup-count-number">{selectedQuantity}</span>
            <span className="popup-count-unit">pcs</span>
          </div>

          {/* + sign on the right */}
          <button
            type="button"
            className="popup-circle-btn plus"
            onClick={handlePlus}
            aria-label="Increase quantity"
            title="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Dynamic Total Price */}
        <div className="popup-total-box">
          <span className="popup-total-label">Subtotal:</span>
          <span className="popup-total-val">
            Rs. {(Number(quantityModalProduct.price) * selectedQuantity).toLocaleString('en-IN')}
          </span>
        </div>

        {/* OK Option Button at Bottom Middle */}
        <div className="popup-bottom-center-action">
          <button
            type="button"
            className="popup-ok-btn"
            onClick={handleConfirm}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
