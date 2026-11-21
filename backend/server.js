import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import { connectDatabase } from './config/db.js'

import productRoutes from './routes/productRoutes.js'
import brandRoutes from './routes/brandRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

// Root & Health Checks
app.get('/', (req, res) => {
  res.json({
    name: 'KLAY Kitchen Utensils & Appliances API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      brands: '/api/brands',
      authentication: '/api/auth',
      cart: '/api/cart',
      orders: '/api/orders'
    }
  })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() })
})

// API Routes
app.use('/api/products', productRoutes)
app.use('/api/brands', brandRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

async function startServer() {
  try {
    await connectDatabase()
    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Unable to start backend:', error.message)
    process.exitCode = 1
  }
}

startServer()
