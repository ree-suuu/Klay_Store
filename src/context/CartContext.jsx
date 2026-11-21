import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { apiRequest } from '../services/api'

const CartContext = createContext(null)

function getProductId(product) {
  return product?.productId || product?._id || product?.id || product?.name
}

function mapCart(data) {
  return (data?.items || []).map(({ product, quantity }) => ({
    id: product.productId || product._id,
    productId: product.productId,
    mongoId: product._id,
    name: product.name,
    price: Number(product.price) || 0,
    image: product.image || '/diamond/cooker_diamond.png',
    brand: product.brand || 'KLAY',
    specs: product.specs || '',
    category: product.category || 'utensils',
    stock: product.stock,
    quantity
  }))
}

export function CartProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [cartLoading, setCartLoading] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [quantityModalProduct, setQuantityModalProduct] = useState(null)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      setCart([])
      return
    }

    setCartLoading(true)
    apiRequest('/cart')
      .then(({ data }) => setCart(mapCart(data)))
      .catch((error) => {
        if (!error.message?.includes('Authentication required')) {
          showToast(error.message, 'error')
        }
      })
      .finally(() => setCartLoading(false))
  }, [authLoading, isAuthenticated])

  useEffect(() => {
    if (!toast.visible) return undefined
    const timer = setTimeout(() => {
      setToast((previous) => ({ ...previous, visible: false }))
    }, 3200)
    return () => clearTimeout(timer)
  }, [toast.visible])

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type })
  }

  const requireLogin = () => {
    if (isAuthenticated) return true
    showToast('Please sign up or log in before adding items to your cart.', 'error')
    navigate('/login')
    return false
  }

  const applyCartResponse = ({ data }) => {
    setCart(mapCart(data))
  }

  const addToCart = async (product, quantity = 1) => {
    if (!product || !requireLogin()) return
    try {
      const result = await apiRequest('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId: getProductId(product), quantity: Math.max(1, quantity) })
      })
      applyCartResponse(result)
      showToast(`Added ${quantity} × "${product.name}" to cart!`, 'cart')
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  const removeFromCart = async (productId) => {
    if (!requireLogin()) return
    try {
      const result = await apiRequest(`/cart/items/${encodeURIComponent(productId)}`, { method: 'DELETE' })
      applyCartResponse(result)
      showToast('Item removed from cart', 'info')
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  const updateQuantity = async (productId, delta) => {
    if (!requireLogin()) return
    const item = cart.find((entry) => entry.id === productId || entry.mongoId === productId)
    if (!item) return

    const quantity = Math.max(1, item.quantity + delta)
    try {
      const result = await apiRequest(`/cart/items/${encodeURIComponent(productId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity })
      })
      applyCartResponse(result)
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  const clearCart = async () => {
    if (!requireLogin()) return
    try {
      const result = await apiRequest('/cart', { method: 'DELETE' })
      applyCartResponse(result)
      showToast('Cart cleared', 'info')
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  const getItemQuantity = (productId) => {
    const item = cart.find((entry) => entry.id === productId || entry.mongoId === productId)
    return item?.quantity || 0
  }

  const openQuantityModal = (product) => {
    if (!product || !requireLogin()) return
    const existing = getItemQuantity(getProductId(product))
    setSelectedQuantity(existing > 0 ? existing : 1)
    setQuantityModalProduct(product)
  }

  const closeQuantityModal = () => {
    setQuantityModalProduct(null)
    setSelectedQuantity(1)
  }

  const openCheckout = () => {
    if (!requireLogin()) return
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
        totalCount,
        totalAmount,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((previous) => !previous),
        isCheckoutOpen,
        openCheckout,
        closeCheckout: () => setIsCheckoutOpen(false),
        quantityModalProduct,
        selectedQuantity,
        setSelectedQuantity,
        openQuantityModal,
        closeQuantityModal,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        clearCart,
        toast,
        showToast,
        hideToast: () => setToast((previous) => ({ ...previous, visible: false }))
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
