import express from 'express'
import Brand from '../models/Brand.js'
import Product from '../models/Product.js'

const router = express.Router()

// GET /api/brands - List all brands with product count
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find({ authorizedPartner: true })
    const brandCounts = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$brand', count: { $sum: 1 } } }
    ])

    const countMap = {}
    brandCounts.forEach((b) => {
      countMap[b._id] = b.count
    })

    const brandsWithCounts = brands.map((b) => ({
      ...b.toObject(),
      productCount: countMap[b.name] || 0
    }))

    res.json({
      success: true,
      count: brandsWithCounts.length,
      data: brandsWithCounts
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/brands/:brand/products - Get searchable products for one brand
router.get('/:brand/products', async (req, res) => {
  try {
    const { brand } = req.params
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : ''
    const query = {
      brand: { $regex: `^${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
      isActive: true
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specs: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    const products = await Product.find(query).sort({ name: 1 })
    res.json({ success: true, brand, count: products.length, data: products })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
