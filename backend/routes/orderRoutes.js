import express from 'express'
import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public route to view bill on mobile after scanning QR
router.get('/view/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
    if (!order) {
      return res.status(404).json({ success: false, message: 'Bill/Order not found' })
    }
    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Public route to pay via eSewa from mobile
router.post('/view/:orderId/pay', async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { paymentStatus: 'completed' },
      { new: true }
    )
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }
    res.json({ success: true, message: 'Payment completed successfully!', order })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.use(requireAuth)


router.post('/', async (req, res) => {
  try {
    const { customerPhone, shippingAddress, paymentMethod = 'cod' } = req.body
    const customerName = req.user.name
    const customerEmail = req.user.email

    if (!customerPhone?.trim() || !shippingAddress?.city?.trim() || !shippingAddress?.street?.trim()) {
      return res.status(400).json({ success: false, message: 'Phone, city, and street are required' })
    }

    if (!['cod', 'esewa', 'khalti'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Invalid payment method' })
    }

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart?.items.length) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' })
    }

    const productIds = cart.items.map((item) => item.product)
    const products = await Product.find({ _id: { $in: productIds }, isActive: true })
    const productMap = new Map(products.map((product) => [product._id.toString(), product]))
    const orderItems = []
    let subtotal = 0

    for (const cartItem of cart.items) {
      const product = productMap.get(cartItem.product.toString())
      if (!product) {
        return res.status(400).json({ success: false, message: 'A cart product is no longer available' })
      }
      if (cartItem.quantity > product.stock) {
        return res.status(400).json({ success: false, message: `Only ${product.stock} item(s) of ${product.name} are available` })
      }

      subtotal += product.price * cartItem.quantity
      orderItems.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        image: product.image,
        brand: product.brand,
        category: product.category
      })
    }

    const stockUpdates = []
    for (const cartItem of cart.items) {
      const product = productMap.get(cartItem.product.toString())
      const updated = await Product.findOneAndUpdate(
        { _id: product._id, stock: { $gte: cartItem.quantity }, isActive: true },
        { $inc: { stock: -cartItem.quantity } },
        { new: true }
      )
      if (!updated) {
        for (const update of stockUpdates) {
          await Product.updateOne({ _id: update.productId }, { $inc: { stock: update.quantity } })
        }
        return res.status(409).json({ success: false, message: `Stock changed for ${product.name}; please try again` })
      }
      stockUpdates.push({ productId: product._id, quantity: cartItem.quantity })
    }

    const newOrder = new Order({
      orderId: req.body.customOrderId || `KLAY-${Date.now().toString().slice(-8)}`,
      user: req.user._id,
      customerName,
      customerEmail,
      customerPhone: customerPhone.trim(),
      shippingAddress: {
        city: shippingAddress.city.trim(),
        street: shippingAddress.street.trim(),
        province: shippingAddress.province?.trim() || 'Bagmati Province',
        postalCode: shippingAddress.postalCode?.trim() || '44600'
      },
      items: orderItems,
      subtotal,
      deliveryFee: 0,
      totalAmount: subtotal,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'confirmed'
    })

    const savedOrder = await newOrder.save()
    await Cart.updateOne({ user: req.user._id }, { $set: { items: [] } })

    res.status(201).json({
      success: true,
      message: 'Order placed and saved successfully!',
      order: savedOrder
    })
  } catch (error) {
    console.error('Failed to create order:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while placing order.'
    })
  }
})

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({
      success: true,
      count: orders.length,
      orders
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId, user: req.user._id })
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }
    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
