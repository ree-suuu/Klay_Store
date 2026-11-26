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
import billRoutes from './routes/billRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())

// Enable CORS with support for local dev and production frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, or same-origin on Vercel)
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(o => origin.startsWith(o))) {
      return callback(null, true)
    }
    return callback(null, true) // Allow all in production or restrict if needed
  },
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

// Ensure database connection middleware for serverless invocations
app.use(async (req, res, next) => {
  try {
    await connectDatabase()
    next()
  } catch (error) {
    console.error('Database connection error:', error)
    res.status(500).json({ error: 'Database connection failed' })
  }
})

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
app.use('/api/bills', billRoutes)

import { fileURLToPath } from 'url'

// Only start the HTTP listener if executed directly (e.g., node backend/server.js in local dev)
const isDirectExecution = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]

if (isDirectExecution) {
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
}

export default app
