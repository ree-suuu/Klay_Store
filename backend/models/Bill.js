import mongoose from 'mongoose'

const billSchema = new mongoose.Schema(
  {
    billToken: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    orderId: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      province: { type: String, default: 'Bagmati Province' }
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        brand: String,
        category: String
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'],
      default: 'pending'
    },
    paidAt: Date,
    createdOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Bill || mongoose.model('Bill', billSchema)
