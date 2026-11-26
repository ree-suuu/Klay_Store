import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import QuantityModal from './components/QuantityModal'
import CheckoutBillModal from './components/CheckoutBillModal'
import Toast from './components/Toast'
import Home from './pages/Home'
import About from './pages/About'
import Shop from './pages/Shop'
import Contact from './pages/Contact'
import Login from './pages/Login'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import MobileBillPay from './pages/MobileBillPay'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app-layout">
            {/* Global Navigation Bar */}
            <Navbar />

            {/* Slide-out Cart Drawer, Quantity Popup & Checkout Bill */}
            <CartDrawer />
            <QuantityModal />
            <CheckoutBillModal />
            <Toast />

            {/* Dynamic Page Routes */}
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/bill/:billToken" element={<MobileBillPay />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsConditions />} />
              </Routes>
            </main>

            {/* Global Footer */}
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
