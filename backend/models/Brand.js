import mongoose from 'mongoose'

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    logo: {
      type: String,
      required: true,
      trim: true
    },
    countryOfOrigin: {
      type: String,
      default: 'Nepal'
    },
    authorizedPartner: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      trim: true
    },
    categories: [
      {
        type: String,
        trim: true
      }
    ],
    productCount: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  { timestamps: true }
)

const Brand = mongoose.model('Brand', brandSchema)

export default Brand
