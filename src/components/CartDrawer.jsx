import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './CartDrawer.css'

export default function CartDrawer() {
  const {
    cart,
    totalCount,
    totalAmount,
    isCartOpen,
    closeCart,
    openCheckout,
    updateQuantity,
    removeFromCart,
    clearCart,
    showToast
  } = useCart()

  const navigate = useNavigate()

  if (!isCartOpen) return null

  const handleCheckout = () => {
    openCheckout()
  }

  const handleBrowse = () => {
    closeCart()
    navigate('/shop')
  }

  return (
    <div className="cart-drawer-overlay" onClick={closeCart}>
      <aside className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title-group">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <h2>Kitchen Basket</h2>
            <span className="cart-count-chip">{totalCount} {totalCount === 1 ? 'item' : 'items'}</span>
          </div>

          <button type="button" className="drawer-close-btn" onClick={closeCart} aria-label="Close cart drawer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="cart-drawer-content">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-cart-icon">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#C86D51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <h3>Your basket is empty</h3>
              <p>Explore our 10 categories of genuine pressure cookers, kettles, and clay ceramics.</p>
              <button type="button" className="btn-browse-shop" onClick={handleBrowse}>
                Explore Utensil Shop &rarr;
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <img src={item.image} alt={item.name} className="cart-item-thumb" />
                  
                  <div className="cart-item-details">
                    <span className="cart-item-brand">{item.brand}</span>
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-price">Rs. {Number(item.price).toLocaleString('en-IN')}</span>

                    {/* Quantity controls */}
                    <div className="cart-item-controls">
                      <div className="qty-picker">
                        <button 
                          type="button" 
                          disabled={item.quantity <= 1}
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.id, -1)
                            }
                          }} 
                          aria-label="Decrease quantity"
                          title={item.quantity <= 1 ? "Minimum count is 1" : "Decrease quantity"}
                        >
                          -
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button 
                          type="button" 
                          onClick={() => updateQuantity(item.id, 1)} 
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        type="button" 
                        className="btn-remove-item" 
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal-row">
              <span className="subtotal-label">Subtotal</span>
              <span className="subtotal-amount">Rs. {totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <p className="delivery-note">✓ Delivery available across Nepal • Cash on Delivery accepted</p>

            <button type="button" className="btn-drawer-checkout" onClick={handleCheckout}>
              Proceed to Checkout &rarr;
            </button>

            <button type="button" className="btn-clear-cart" onClick={clearCart}>
              Clear Basket
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
