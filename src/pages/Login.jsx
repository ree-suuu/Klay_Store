import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Login.css'

export default function Login() {
  const [mode, setMode] = useState('register') // 'signin' or 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user, login, logout } = useAuth()
  const { showToast } = useCart()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })

    const isRegister = mode === 'register'

    // Validate retype password in signup mode
    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        setStatus({
          type: 'error',
          message: 'Passwords do not match. Please retype carefully.'
        })
        return
      }
    }

    setIsSubmitting(true)

    const endpoint = isRegister ? '/auth/register' : '/auth/login'
    const payload = isRegister 
      ? { name: formData.name, email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password }

    try {
      const data = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      if (data?.user) {
        login(data.user)
        showToast(
          isRegister
            ? `Welcome to KLAY, ${data.user.name || 'Friend'}! Account created successfully.`
            : `Welcome back, ${data.user.name || 'Friend'}!`,
          'success'
        )
        navigate('/shop', { replace: true })
      } else {
        setStatus({
          type: 'success',
          message: data.message || 'Operation successful'
        })
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.message || 'Authentication failed. Please check your details.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getUserInitial = (u) => {
    const target = u || user
    if (!target) return 'K'
    if (target.name?.trim()) return target.name.trim().charAt(0).toUpperCase()
    if (target.email?.trim()) return target.email.trim().charAt(0).toUpperCase()
    return 'K'
  }

  // If already logged in
  if (user) {
    return (
      <div className="crextio-page-wrapper">
        <div className="already-logged-card">
          <div className="already-avatar-badge">
            {getUserInitial(user)}
          </div>
          <h2>Welcome Back, {user.name || 'Member'}!</h2>
          <p className="already-email-text">{user.email}</p>
          <p className="already-desc">
            Your KLAY account is active. Your profile initial is shown in the top navbar.
          </p>

          <div className="already-actions">
            <Link to="/shop" className="crextio-submit-btn">
              Explore Utensil Shop
            </Link>
            <button 
              type="button" 
              className="btn-auth-outline" 
              onClick={() => logout()}
            >
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="crextio-page-wrapper">
      {/* Dynamic card orientation:
          - Register: Form on LEFT, Picture on RIGHT
          - Sign In: Picture on LEFT, Form on RIGHT
      */}
      <div className={`crextio-card-container ${mode === 'register' ? 'register-mode' : 'signin-mode'}`}>
        
        {/* ================= FORM COLUMN ================= */}
        <div className="crextio-form-column">
          <div className="crextio-form-inner">
              {/* Mode toggle button */}
              <div className="crextio-top-bar">
                <div className="crextio-mode-pill-toggle">
                  <button
                    type="button"
                    className={`mode-toggle-chip ${mode === 'register' ? 'active' : ''}`}
                    onClick={() => {
                      setMode('register')
                      setStatus({ type: '', message: '' })
                    }}
                  >
                    Create Account
                  </button>
                  <button
                    type="button"
                    className={`mode-toggle-chip ${mode === 'signin' ? 'active' : ''}`}
                    onClick={() => {
                      setMode('signin')
                      setStatus({ type: '', message: '' })
                    }}
                  >
                    Sign In
                  </button>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="crextio-header-text">
                <h1 className="crextio-title">
                  {mode === 'register' ? 'Create an account' : 'Welcome back'}
                </h1>
                <p className="crextio-subtitle">
                  {mode === 'register'
                    ? 'Sign up and get access to genuine Nepali cookware & fast delivery'
                    : 'Sign in to access your kitchen utensils & orders'}
                </p>
              </div>

              {/* Alert box if any */}
              {status.message && (
                <div className={`crextio-alert ${status.type}`} role="alert">
                  {status.type === 'error' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              {/* Form with clean pill inputs */}
              <form onSubmit={handleSubmit} className="crextio-form">
                {mode === 'register' && (
                  <div className="crextio-field">
                    <label htmlFor="auth-name">Full name</label>
                    <input
                      type="text"
                      id="auth-name"
                      name="name"
                      className="crextio-pill-input"
                      placeholder="e.g. Rishu Prajapati"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </div>
                )}

                <div className="crextio-field">
                  <label htmlFor="auth-email">Email</label>
                  <input
                    type="email"
                    id="auth-email"
                    name="email"
                    className="crextio-pill-input"
                    placeholder="e.g. rishu@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="crextio-field">
                  <label htmlFor="auth-password">Password</label>
                  <div className="password-pill-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="auth-password"
                      name="password"
                      className="crextio-pill-input password-input"
                      placeholder="••••••••••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="crextio-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Retype Password for Sign Up */}
                {mode === 'register' && (
                  <div className="crextio-field">
                    <label htmlFor="auth-confirmPassword">Retype password</label>
                    <div className="password-pill-wrapper">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="auth-confirmPassword"
                        name="confirmPassword"
                        className="crextio-pill-input password-input"
                        placeholder="••••••••••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="crextio-eye-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="crextio-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Please wait...' : mode === 'register' ? 'Submit' : 'Sign In'}
                </button>
              </form>

              {/* Footer Switch */}
              <div className="crextio-footer-switch">
                {mode === 'register' ? (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="crextio-switch-link"
                      onClick={() => {
                        setMode('signin')
                        setStatus({ type: '', message: '' })
                      }}
                    >
                      Sign In &rarr;
                    </button>
                  </p>
                ) : (
                  <p>
                    New to KLAY?{' '}
                    <button
                      type="button"
                      className="crextio-switch-link"
                      onClick={() => {
                        setMode('register')
                        setStatus({ type: '', message: '' })
                      }}
                    >
                      Create an account &rarr;
                    </button>
                  </p>
                )}
              </div>
            </div>
        </div>

        {/* ================= PICTURE COLUMN (Clean slay_with_klay) ================= */}
        <div className="crextio-picture-column">
          <div className="picture-inner-wrapper">
            <img 
              src="/slay_with_klay.png" 
              alt="Slay with KLAY" 
              className="slay-klay-hero-img" 
            />
          </div>
        </div>

      </div>
    </div>
  )
}
