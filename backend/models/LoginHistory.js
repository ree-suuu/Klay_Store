import mongoose from 'mongoose'

const loginHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      required: true,
      default: 'SUCCESS'
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1'
    },
    userAgent: {
      type: String,
      default: 'Mozilla/5.0 (X11; Linux x86_64)'
    },
    deviceType: {
      type: String,
      enum: ['DESKTOP', 'MOBILE', 'TABLET', 'UNKNOWN'],
      default: 'DESKTOP'
    },
    location: {
      city: { type: String, default: 'Kathmandu' },
      country: { type: String, default: 'Nepal' }
    },
    loginTime: {
      type: Date,
      default: Date.now
    },
    failureReason: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
)

loginHistorySchema.index({ email: 1, loginTime: -1 })

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema)

export default LoginHistory
