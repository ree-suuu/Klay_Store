import express from 'express'
import mongoose from 'mongoose'
import Product from '../models/Product.js'

const router = express.Router()

// GET /api/products - List all products with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, sort, search } = req.query
    const query = { isActive: true }

    if (category && category !== 'All') {
      query.category = category.toLowerCase()
    }

    if (brand && brand !== 'All') {
      query.brand = brand
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) {
        const minimum = Number(minPrice)
        if (!Number.isFinite(minimum) || minimum < 0) {
          return res.status(400).json({ success: false, message: 'minPrice must be a non-negative number' })
        }
        query.price.$gte = minimum
      }
      if (maxPrice) {
        const maximum = Number(maxPrice)
        if (!Number.isFinite(maximum) || maximum < 0) {
          return res.status(400).json({ success: false, message: 'maxPrice must be a non-negative number' })
        }
        query.price.$lte = maximum
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specs: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    let sortOption = { createdAt: -1 }
    if (sort === 'price-low') sortOption = { price: 1 }
    else if (sort === 'price-high') sortOption = { price: -1 }
    else if (sort === 'name-asc') sortOption = { name: 1 }

    const products = await Product.find(query).sort(sortOption)
    res.json({
      success: true,
      count: products.length,
      data: products
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/products/brand/:brand - Get products for a specific brand
router.get('/brand/:brand', async (req, res) => {
  try {
    const brandName = req.params.brand
    const products = await Product.find({
      brand: { $regex: new RegExp(`^${brandName}$`, 'i') },
      isActive: true
    })
    res.json({
      success: true,
      brand: brandName,
      count: products.length,
      data: products
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/products/:id - Single product by ID or slug
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findOne({
      $or: [{ productId: id }, { slug: id }, { _id: mongoose.isValidObjectId(id) ? id : null }]
    })

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    res.json({ success: true, data: product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
