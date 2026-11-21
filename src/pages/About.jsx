import { Link } from 'react-router-dom'
import './Pages.css'
import './About.css'

export default function About() {
  return (
    <div className="page-container about-page-wrapper">

      {/* Dramatic Hero Intro */}
      <section className="about-hero-section">
        <h1 className="about-dramatic-title">
          Born From Broken Whistles, Burnt Hands, and a <span>Promise to Every Nepali Kitchen.</span>
        </h1>
        <p className="about-hero-lead">
          Every great meal in Nepal tells a story. Ours began with the daily headache of setting up a real kitchen in a sea of roadside knock-offs, cracked handles, and zero accountability.
        </p>
      </section>

      {/* Cinematic Main Story Banner */}
      <div className="about-story-banner">
        <img
          src="/about_kitchen_steam.jpg"
          alt="Authentic warm kitchen with steaming cookware in morning light"
          className="story-banner-image"
        />
        <div className="story-banner-overlay">
          <p className="story-banner-tagline">The Genesis of KLAY</p>
          <blockquote className="story-banner-quote">
            "Why did cooking dal-bhat for our families require surviving a maze of 10 chaotic alley shops, broken promises, and counterfeit cookware?"
          </blockquote>
        </div>
      </div>

      {/* Chapter 1: The Backstory - The Chaos of Kathmandu Kitchens */}
      <section className="story-chapter">
        <div className="chapter-media">
          <img
            src="/about_clay_artisan.jpg"
            alt="Artisan shaping clay pots by hand on potter wheel in Bhaktapur"
            className="chapter-image"
          />
          <div className="chapter-badge-caption">
            Thimi &amp; Bhaktapur Heritage: Living Earth &amp; Sacred Fire
          </div>
        </div>

        <div className="chapter-content">
          <p className="chapter-number">CHAPTER 01</p>
          <h2 className="chapter-title">The Cold Morning Dal That Sparked a Revolt</h2>
          <p className="chapter-text">
            It was 7:15 AM on a frosty morning in Kathmandu. The dal was on the stove, the family was waiting, and in a split second—the cheap roadside cooker lid jammed. The gasket gave out with a shrill screech, boiling lentil broth sprayed across the counter, and the synthetic handle snapped clean off.
          </p>
          <p className="chapter-text">
            Anyone who has built a kitchen in Nepal knows this battle intimately: You wander through the dusty gallis of <strong>Asan and Mangal Bazaar</strong> searching for an authentic heavy-gauge pressure cooker. You fight traffic to find genuine food-grade stainless steel in Mahabouddha. You trek out to <strong>Bhaktapur</strong> for heat-cured clay handis that won't fracture under fire.
          </p>
          <p className="chapter-text">
            And when buying electrical mixers or induction cooktops? You're handed a flimsy box and a hand-written "warranty" scribbled on a piece of cardboard. <strong>We refused to accept that kitchen essentials had to be this fragile and frustrating.</strong>
          </p>
        </div>
      </section>

      {/* Chapter 2: The Name & Philosophy */}
      <section className="story-chapter reversed">
        <div className="chapter-media">
          <img
            src="/about_modern_sanctuary.jpg"
            alt="Pristine modern kitchen counter with stainless pressure cookers, electric kettles, and ceramic cookware"
            className="chapter-image"
          />
          <div className="chapter-badge-caption">
            The 1-Stop Sanctuary: Engineered for Nepali Cooking
          </div>
        </div>

        <div className="chapter-content">
          <p className="chapter-number">CHAPTER 02</p>
          <h2 className="chapter-title">Rooted in Earth. Engineered for Life.</h2>
          <p className="chapter-text">
            Before metal factories and fast electronics, the Nepali kitchen centered around the <strong>Mato ko Chulo (Clay Hearth)</strong>—vessels born from valley earth, cured by open flames, and capable of holding heat like nothing else on this planet.
          </p>
          <p className="chapter-text">
            That timeless balance became our compass. We named our venture <strong>KLAY</strong>: a tribute to the humble clay pot that fed generations, fused seamlessly with unbreakable modern culinary engineering.
          </p>
          <p className="chapter-text">
            We pledged that no home cook should ever have to gamble on whether their pressure cooker safety valve will hold up at 1,400 meters altitude, or if their non-stick kadai will peel after three washes.
          </p>
        </div>
      </section>

      {/* Chapter 3: 1-Stop Kitchenware Sanctuary */}
      <section className="sanctuary-section">
        <div className="sanctuary-header">
          <h2>The 1-Stop Sanctuary for Every Kitchenware</h2>
          <p>
            No middleman markups. No dubious fakes. We united Nepal’s most respected kitchen brands and heritage craftsmen under one transparent roof.
          </p>
        </div>

        <div className="sanctuary-grid">
          <div className="sanctuary-card">
            <div className="sanctuary-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <h3>Heavy Cookware &amp; Pressure Cookers</h3>
            <p>
              Direct authorized stock from <strong>Baltra, Hawkins, and Diamond</strong>. Certified heavy-gauge virgin aluminium and induction-ready tri-ply steel engineered for 15+ PSI safety.
            </p>
          </div>

          <div className="sanctuary-card">
            <div className="sanctuary-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
            <h3>Electric Appliances with Real Warranty</h3>
            <p>
              High-torque mixer grinders, crystal glass induction cooktops, rapid-boil kettles, and drum rice cookers that handle Kathmandu voltage fluctuations without blowing out.
            </p>
          </div>

          <div className="sanctuary-card">
            <div className="sanctuary-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
            </div>
            <h3>Thimi Artisanal Ceramics &amp; Handis</h3>
            <p>
              Hand-thrown terracotta dinner sets, tea kulhads, and unglazed earthen cooking pots that impart authentic mineral richness to every stew and slow-simmered curry.
            </p>
          </div>

          <div className="sanctuary-card">
            <div className="sanctuary-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <h3>Everyday Storage &amp; Stainless Utility</h3>
            <p>
              Rust-proof dish drainers from Famous Steel, airtight spice dabbas from GEM, and BPA-free insulated tiffins from Bagmati Nepal that keep lunch warm for school and office.
            </p>
          </div>
        </div>
      </section>

      {/* The KLAY Quality Pillars */}
      <div className="about-stats-strip">
        <div className="stat-item">
          <p className="stat-num">100%</p>
          <p className="stat-label">Manufacturer Guaranteed</p>
          <p className="stat-sub">Zero counterfeit or grey market goods</p>
        </div>

        <div className="stat-item">
          <p className="stat-num">15+ PSI</p>
          <p className="stat-label">High-Altitude Tested</p>
          <p className="stat-sub">Cooker valves calibrated for valley elevations</p>
        </div>

        <div className="stat-item">
          <p className="stat-num">10K+</p>
          <p className="stat-label">Kitchens Equipped</p>
          <p className="stat-sub">Trusted from Mechi to Mahakali</p>
        </div>

        <div className="stat-item">
          <p className="stat-num">1-Stop</p>
          <p className="stat-label">Complete Catalog</p>
          <p className="stat-sub">Spices racks to 2000W appliances</p>
        </div>
      </div>

      {/* Call to Action Box */}
      <section className="about-cta-box">
        <h2>Upgrade the Heart of Your Home</h2>
        <p>
          Stop compromising on cheap kitchen tools that wear out when you need them most. Explore curated, authentic cookware built for Nepali cooking.
        </p>
        <Link to="/shop" className="about-cta-btn">
          Explore the Full Utensil Shop &rarr;
        </Link>
      </section>

    </div>
  )
}
