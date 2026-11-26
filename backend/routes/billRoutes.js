import express from 'express'
import crypto from 'crypto'
import Bill from '../models/Bill.js'
import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

// 1. Create a dynamic bill session (requires user authentication)
router.post('/create', requireAuth, async (req, res) => {
  try {
    const { customerDetails, items, totalAmount } = req.body

    if (!items || !items.length || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Invalid bill items or total amount' })
    }

    const billToken = crypto.randomBytes(16).toString('hex')
    const orderId = 'KLAY-' + Math.floor(100000 + Math.random() * 900000)

    const newBill = new Bill({
      billToken,
      orderId,
      user: req.user._id,
      customerDetails: {
        name: customerDetails?.name || req.user.name,
        email: customerDetails?.email || req.user.email,
        phone: customerDetails?.phone || req.user.phone || '9841234567',
        city: customerDetails?.city || 'Kathmandu Valley',
        street: customerDetails?.street || 'New Baneshwor',
        province: customerDetails?.province || 'Bagmati Province'
      },
      items,
      totalAmount,
      status: 'pending'
    })

    await newBill.save()

    res.status(201).json({
      success: true,
      billToken,
      orderId,
      bill: newBill
    })
  } catch (error) {
    console.error('Error creating bill session:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// 2. Public endpoint to fetch bill details by billToken (when scanned on mobile)
router.get('/:billToken', async (req, res) => {
  try {
    const bill = await Bill.findOne({ billToken: req.params.billToken })
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found or has expired' })
    }

    res.json({
      success: true,
      bill
    })
  } catch (error) {
    console.error('Error fetching bill:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// 3. Mobile action: "Pay with eSewa" triggers payment completion and creates the Order
router.post('/:billToken/pay-esewa', async (req, res) => {
  try {
    const bill = await Bill.findOne({ billToken: req.params.billToken })
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' })
    }

    if (bill.status === 'paid') {
      return res.json({
        success: true,
        message: 'Order already completed and paid',
        orderId: bill.orderId
      })
    }

    // Deduct stock if products still available
    for (const item of bill.items) {
      if (item.productId) {
        await Product.updateOne(
          { productId: item.productId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } }
        ).catch(() => {})
      }
    }

    // Create the final Order record
    const newOrder = new Order({
      orderId: bill.orderId,
      user: bill.user,
      customerName: bill.customerDetails.name,
      customerEmail: bill.customerDetails.email,
      customerPhone: bill.customerDetails.phone,
      shippingAddress: {
        city: bill.customerDetails.city,
        street: bill.customerDetails.street,
        province: bill.customerDetails.province,
        postalCode: '44600'
      },
      items: bill.items,
      subtotal: bill.totalAmount,
      deliveryFee: 0,
      totalAmount: bill.totalAmount,
      paymentMethod: 'esewa',
      paymentStatus: 'completed',
      orderStatus: 'confirmed'
    })

    const savedOrder = await newOrder.save()

    // Mark bill as paid
    bill.status = 'paid'
    bill.paidAt = new Date()
    bill.createdOrderId = savedOrder._id
    await bill.save()

    // Clear user cart if user exists
    if (bill.user) {
      await Cart.updateOne({ user: bill.user }, { $set: { items: [] } }).catch(() => {})
    }

    res.json({
      success: true,
      message: 'Payment received successfully via eSewa!',
      order: savedOrder
    })
  } catch (error) {
    console.error('Error processing bill payment:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
