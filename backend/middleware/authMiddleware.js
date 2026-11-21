import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.klay_token
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.userId).select('-password')
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Authentication required' })
  }
}
