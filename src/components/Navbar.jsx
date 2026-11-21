import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const { totalCount, openCart } = useCart()
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setDropdownOpen(false)
    closeMobileMenu()
    navigate('/')
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Calculate user initial
  const getUserInitial = () => {
    if (!user) return 'U'
    if (user.name && user.name.trim()) {
      return user.name.trim().charAt(0).toUpperCase()
    }
    if (user.email && user.email.trim()) {
      return user.email.trim().charAt(0).toUpperCase()
    }
    return 'U'
  }

  // Display name
  const getFirstName = () => {
    if (!user?.name) return 'Account'
    const parts = user.name.trim().split(' ')
    return parts[0] || 'Account'
  }

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img src="/KLAY_hero.png" alt="KLAY Utensils" className="navbar-logo-img" />
        </Link>

        {/* Navigation Links */}
        <nav className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <NavLink 
            to="/" 
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} 
            onClick={closeMobileMenu}
            end
          >
            Home
          </NavLink>
          
          <NavLink 
            to="/about" 
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} 
            onClick={closeMobileMenu}
          >
            About Us
          </NavLink>

          <NavLink 
            to="/shop" 
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} 
            onClick={closeMobileMenu}
          >
            Shop
          </NavLink>

          <NavLink 
            to="/contact" 
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} 
            onClick={closeMobileMenu}
          >
            Contact
          </NavLink>

          {/* Mobile Auth & Cart Section */}
          <div className="mobile-auth-section mobile-only">
            <button 
              type="button" 
              className="mobile-cart-toggle-btn" 
              onClick={() => {
                closeMobileMenu()
                openCart()
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>View Cart</span>
              <span className="mobile-cart-count">{totalCount}</span>
            </button>

            {user ? (
              <div className="mobile-user-card">
                <div className="mobile-user-profile">
                  <div className="user-avatar-badge" aria-hidden="true">
                    {getUserInitial()}
                  </div>
                  <div className="mobile-user-info">
                    <span className="mobile-user-name">{user.name || 'Member'}</span>
                    <span className="mobile-user-email">{user.email}</span>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="mobile-logout-btn" 
                  onClick={handleLogout}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="login-btn mobile-login-btn" 
                onClick={closeMobileMenu}
              >
                Login / Register
              </Link>
            )}
          </div>
        </nav>

        {/* Right side actions (Cart Button + Profile/Login + Hamburger) */}
        <div className="navbar-actions">
          {/* CART BUTTON beside profile icon */}
          <button 
            type="button" 
            className="navbar-cart-btn" 
            onClick={openCart}
            aria-label="View shopping cart"
            title="Shopping Cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {totalCount > 0 && (
              <span className="cart-badge-count">{totalCount}</span>
            )}
          </button>

          {/* User Profile or Login */}
          {user ? (
            <div className="user-menu-container" ref={dropdownRef}>
              <button 
                type="button"
                className={`user-profile-toggle ${dropdownOpen ? 'open' : ''}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                title={`${user.name || 'User'} profile`}
              >
                <div className="user-avatar-badge">
                  {getUserInitial()}
                </div>
                <span className="user-profile-name">{getFirstName()}</span>
                <svg 
                  className={`user-profile-chevron ${dropdownOpen ? 'rotated' : ''}`} 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {/* Profile Dropdown Popover */}
              {dropdownOpen && (
                <div className="profile-dropdown" role="menu">
                  <div className="dropdown-user-header">
                    <div className="user-avatar-badge large">
                      {getUserInitial()}
                    </div>
                    <div className="dropdown-user-details">
                      <p className="dropdown-name">{user.name || 'KLAY Member'}</p>
                      <p className="dropdown-email">{user.email}</p>
                      <span className="dropdown-badge">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                        </svg>
                        KLAY Member
                      </span>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <div className="dropdown-menu-links">
                    <button 
                      type="button"
                      className="dropdown-link btn-like" 
                      onClick={() => {
                        setDropdownOpen(false)
                        openCart()
                      }}
                      role="menuitem"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                      View Cart Basket ({totalCount})
                    </button>

                    <Link 
                      to="/shop" 
                      className="dropdown-link" 
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      Explore Utensils & Shop
                    </Link>

                    <Link 
                      to="/contact" 
                      className="dropdown-link" 
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      Customer Support
                    </Link>
                  </div>

                  <div className="dropdown-divider"></div>

                  <button 
                    type="button" 
                    className="dropdown-logout-btn" 
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn desktop-only">
              Login
            </Link>
          )}

          {/* Mobile hamburger toggle */}
          <button 
            className="hamburger-btn" 
            onClick={toggleMobileMenu} 
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>
    </header>
  )
}
