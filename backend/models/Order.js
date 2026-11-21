import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String,
      default: ''
    },
    brand: {
      type: String,
      default: 'KLAY'
    },
    category: {
      type: String,
      default: 'utensils'
    }
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true
    },
    shippingAddress: {
      city: { type: String, required: true },
      street: { type: String, required: true },
      province: { type: String, default: 'Bagmati Province' },
      postalCode: { type: String, default: '44600' }
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['esewa', 'cod', 'khalti'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['completed', 'pending', 'failed'],
      default: 'pending'
    },
    transactionId: {
      type: String,
      default: ''
    },
    orderStatus: {
      type: String,
      enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'confirmed'
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Order', orderSchema)
