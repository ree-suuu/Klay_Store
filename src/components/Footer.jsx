import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            KLAY
          </div>
          <p className="footer-desc">
            Kitchen utensils, cookware, and trusted home appliances built for everyday cooking.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop Appliances</Link></li>
            <li><Link to="/about">About KLAY</Link></li>
            <li><Link to="/contact">Contact Support</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Top Categories</h4>
          <ul>
            <li><Link to="/shop?category=induction-cooker">Induction Cooktops</Link></li>
            <li><Link to="/shop?category=electric-kettle">Electric Kettles</Link></li>
            <li><Link to="/shop?category=rice-cooker">Rice Cookers</Link></li>
            <li><Link to="/shop?category=mixer-grinder">Mixer Grinders</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Store Service</h4>
          <p className="footer-hours">Sunday - Friday: 9:00 AM - 7:00 PM</p>
          <p className="footer-hours">Saturday: 10:00 AM - 5:00 PM</p>
          <p className="footer-location">Authorized retailer for Baltra, Hawkins, Diamond, Wega, Gems, Bagmati, and Famous Steel.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} KLAY Utensils &amp; Appliances. All rights reserved.</p>
          <div className="footer-legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="legal-sep">|</span>
            <Link to="/terms">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
