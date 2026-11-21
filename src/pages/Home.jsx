import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const trustedBrands = [
    { name: 'BALTRA', brand: 'Baltra', logo: '/baltra/baltra.png' },
    { name: 'HAWKINS', brand: 'Hawkins', logo: '/hawkins/hawkins.png' },
    { name: 'GEMS', brand: 'GEM', logo: '/gem/gem.png' },
    { name: 'DIAMOND', brand: 'Diamond', logo: '/diamond/diamond.png' },
    { name: 'WEGA', brand: 'Wega', logo: '/wega/wega.png' },
    { name: 'BAGMATI', brand: 'Bagmati', logo: '/bagmati/bagmati.png' },
    { name: 'CERAMICS', brand: 'Thimi Ceramics', logo: '/ceramics/ceramics.png' },
    { name: 'FAMOUS', brand: 'Famous Steel', logo: '/famous/famous.png' },
  ]

  const bestSellers = [
    {
      id: 101,
      name: 'Baltra Non-Stick Granite Kadai with Lid',
      price: 'Rs. 3,250',
      brand: 'Baltra',
      badge: 'Best Seller',
      material: 'Granite Coated Non-Stick',
      image: '/baltra/kadai_baltra.png',
      category: 'pressure-cooker'
    },
    {
      id: 102,
      name: 'Diamond Induction Base Stainless Steel Pressure Cooker (5L)',
      price: 'Rs. 3,850',
      brand: 'Diamond',
      badge: 'Cookware',
      material: 'Food-Grade Stainless Steel',
      image: '/diamond/induction_pressure_cooker_diamond.jpg',
      category: 'pressure-cooker'
    },
    {
      id: 103,
      name: 'Baltra Readycook Pro Infrared Induction Cooker',
      price: 'Rs. 5,450',
      brand: 'Baltra',
      badge: 'Induction',
      material: 'Crystal Glass & Copper Coil',
      image: '/baltra/readycook_induction_baltra.jpg',
      category: 'electric-kettle'
    },
    {
      id: 104,
      name: 'Baltra Fast 1.8L Stainless Steel Electric Kettle',
      price: 'Rs. 1,650',
      brand: 'Baltra',
      badge: 'Fast Boil',
      material: 'Food-Grade Stainless Steel',
      image: '/baltra/fast_kettle_baltra.jpg',
      category: 'electric-kettle'
    },
    {
      id: 105,
      name: 'Baltra Dream Deluxe Automatic Drum Rice Cooker',
      price: 'Rs. 4,450',
      brand: 'Baltra',
      badge: 'Appliances',
      material: 'Anodized Non-Stick Pot',
      image: '/baltra/dream_dlx_ricecooker_baltra.jpg',
      category: 'rice-cooker'
    },
    {
      id: 106,
      name: 'Baltra Nilofer High-Velocity Table Fan (BF-121)',
      price: 'Rs. 2,850',
      brand: 'Baltra',
      badge: 'Cooling',
      material: 'Aerodynamic Cooling Blades',
      image: '/baltra/tablefan_baltra.jpg',
      category: 'fan'
    }
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-banner">
        <img src="/KLAY_hero.png" alt="KLAY kitchen utensils" />
      </section>

      {/* Intro & Explore Collection Section */}
      <section className="intro-cta-section">
        <h1 className="intro-title">Everything Your Kitchen Needs. All in One Place.</h1>
        <p className="intro-subtitle">
          From everyday essentials to thoughtful kitchen upgrades, discover products that make every moment in the kitchen better.
        </p>
        <Link to="/shop" className="btn btn-primary intro-btn">
          Explore Collection →
        </Link>
      </section>

      {/* Trusted Brands Frame (matching user mockup) */}
      <section className="trusted-brands-container">
        <h3 className="trusted-brands-heading">TRUSTED BRANDS, ALL IN ONE PLACE</h3>
        <div className="trusted-brands-grid">
          {trustedBrands.map((brand) => (
            <Link to={`/shop?brand=${encodeURIComponent(brand.brand)}`} key={brand.name} className="brand-pill-card">
              {brand.logo && (
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="brand-logo-img"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              )}
              <span className="brand-pill-name">{brand.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers of All Time (6 products in 2 rows) */}
      <section className="products-section">
        <div className="section-header">
          <h2>Best Sellers of All Time</h2>
          <p>Durable everyday cookware and kitchen appliances from authorized brand partners.</p>
        </div>

        <div className="products-grid best-sellers-grid">
          {bestSellers.map((prod) => (
            <div key={prod.id} className="product-card">
              <div className="product-image-box">
                <span className="product-tag">{prod.badge}</span>
                <img className="product-preview-image" src={prod.image} alt={prod.name} />
              </div>
              <div className="product-info">
                <div className="product-meta">
                  <span className="product-material">{prod.material}</span>
                  <span className="brand-badge-pill">{prod.brand}</span>
                </div>
                <h3 className="product-title">{prod.name}</h3>
                <div className="product-footer">
                  <span className="product-price">{prod.price}</span>
                  <Link to={`/shop?category=${prod.category}`} className="btn-add">
                    View Item
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
