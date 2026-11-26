import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

const JWT_COOKIE_NAME = 'klay_token'

function createToken(userId) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not configured')
  return jwt.sign({ userId }, secret, { expiresIn: '7d' })
}

function sendAuthResponse(res, user, message, statusCode = 200) {
  const token = createToken(user._id.toString())
  const userRole = user.role || user.type || 'customer'
  res
    .cookie(JWT_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    .status(statusCode)
    .json({
      success: true,
      message,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: userRole,
        type: userRole
      }
    })
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  try {
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Only Gmail addresses (@gmail.com) are allowed' })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
    }

    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' })
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'customer',
      type: 'customer'
    })
    sendAuthResponse(res, user, 'Account created successfully', 201)
  } catch (error) {
    console.error('Registration failed:', error)
    res.status(500).json({ success: false, message: 'Unable to create account' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    if (!email?.trim() || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Only Gmail addresses (@gmail.com) are allowed' })
    }

    const user = await User.findOne({ email: normalizedEmail })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    user.lastLoginAt = new Date()
    if (!user.role || !user.type) {
      user.role = user.role || 'customer'
      user.type = user.type || 'customer'
    }
    await user.save()
    sendAuthResponse(res, user, 'Welcome back')
  } catch (error) {
    console.error('Login failed:', error)
    res.status(500).json({ success: false, message: 'Unable to sign in' })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie(JWT_COOKIE_NAME, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
  res.json({ success: true, message: 'Signed out successfully' })
})

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies[JWT_COOKIE_NAME]
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' })

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.userId).select('-password')
    if (!user) return res.status(401).json({ success: false, message: 'Not authenticated' })

    const userRole = user.role || user.type || 'customer'
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: userRole,
        type: userRole
      }
    })
  } catch {
    res.status(401).json({ success: false, message: 'Not authenticated' })
  }
})

export default router
