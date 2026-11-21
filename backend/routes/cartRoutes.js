import express from 'express'
import mongoose from 'mongoose'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

function findProduct(productId) {
  const query = mongoose.isValidObjectId(productId)
    ? { $or: [{ _id: productId }, { productId }] }
    : { productId }
  return Product.findOne({ ...query, isActive: true })
}

async function getCartResponse(userId) {
  const cart = await Cart.findOne({ user: userId }).populate('items.product')
  const items = (cart?.items || [])
    .filter((item) => item.product)
    .map((item) => ({
      product: item.product,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity
    }))

  return {
    items,
    totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + item.subtotal, 0)
  }
}

router.use(requireAuth)

router.get('/', async (req, res) => {
  try {
    res.json({ success: true, data: await getCartResponse(req.user._id) })
  } catch (error) {
    console.error('Unable to load cart:', error)
    res.status(500).json({ success: false, message: 'Unable to load cart' })
  }
})

router.post('/items', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body
    const requestedQuantity = Number(quantity)
    if (!productId || !Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      return res.status(400).json({ success: false, message: 'A valid productId and quantity are required' })
    }

    const product = await findProduct(productId)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })

    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $setOnInsert: { user: req.user._id } },
      { new: true, upsert: true }
    )
    const item = cart.items.find((entry) => entry.product.toString() === product._id.toString())
    const nextQuantity = (item?.quantity || 0) + requestedQuantity
    if (nextQuantity > product.stock) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} item(s) are available` })
    }

    if (item) item.quantity = nextQuantity
    else cart.items.push({ product: product._id, quantity: requestedQuantity })
    await cart.save()

    res.status(201).json({ success: true, data: await getCartResponse(req.user._id) })
  } catch (error) {
    console.error('Unable to add cart item:', error)
    res.status(500).json({ success: false, message: 'Unable to update cart' })
  }
})

router.patch('/items/:productId', async (req, res) => {
  try {
    const quantity = Number(req.body.quantity)
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive integer' })
    }

    const product = await findProduct(req.params.productId)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    if (quantity > product.stock) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} item(s) are available` })
    }

    const cart = await Cart.findOne({ user: req.user._id })
    const item = cart?.items.find((entry) => entry.product.toString() === product._id.toString())
    if (!item) return res.status(404).json({ success: false, message: 'Product is not in the cart' })

    item.quantity = quantity
    await cart.save()
    res.json({ success: true, data: await getCartResponse(req.user._id) })
  } catch (error) {
    console.error('Unable to update cart item:', error)
    res.status(500).json({ success: false, message: 'Unable to update cart item' })
  }
})

router.delete('/items/:productId', async (req, res) => {
  try {
    const product = await findProduct(req.params.productId)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })

    await Cart.updateOne(
      { user: req.user._id },
      { $pull: { items: { product: product._id } } }
    )
    res.json({ success: true, data: await getCartResponse(req.user._id) })
  } catch (error) {
    console.error('Unable to remove cart item:', error)
    res.status(500).json({ success: false, message: 'Unable to remove cart item' })
  }
})

router.delete('/', async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } })
    res.json({ success: true, data: await getCartResponse(req.user._id) })
  } catch (error) {
    console.error('Unable to clear cart:', error)
    res.status(500).json({ success: false, message: 'Unable to clear cart' })
  }
})

export default router
