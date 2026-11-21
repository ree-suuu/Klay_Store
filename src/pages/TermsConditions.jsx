import './Pages.css'

export default function TermsConditions() {
  return (
    <div className="page-container policy-page">
      <div className="page-header">
        <h1>Terms and Conditions</h1>
        <p>Last updated: November 2026. Please read these terms carefully before using or purchasing from the KLAY platform.</p>
      </div>

      <div className="policy-content-card">
        <section className="policy-section">
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using the KLAY website, browsing our product catalog, or placing an order, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. Product Listings &amp; Accuracy</h2>
          <p>
            We strive to display accurate descriptions, technical specifications, wattage ratings, and dimensions for all cookware and appliances. However, slight variations in color or packaging may occur from manufacturers (such as Baltra, Hawkins, Diamond, Wega, and Gems). We reserve the right to correct any typographical errors or inaccuracies without prior notice.
          </p>
        </section>

        <section className="policy-section">
          <h2>3. Pricing &amp; Orders</h2>
          <p>
            All prices listed on the store are stated in official currency and are subject to verification at the time of order processing. KLAY reserves the right to cancel or refuse any order in the event of pricing discrepancies, stock unavailability, or suspected fraudulent activity.
          </p>
        </section>

        <section className="policy-section">
          <h2>4. Shipping &amp; Delivery</h2>
          <p>
            Orders are dispatched via authorized logistics partners. Delivery timeframes provided at checkout are estimates. Risk of loss and title for items purchased pass to you upon delivery by the carrier.
          </p>
        </section>

        <section className="policy-section">
          <h2>5. Returns, Replacements &amp; Warranties</h2>
          <ul>
            <li><strong>Damage on Arrival:</strong> In the rare event of transit damage, customers must notify KLAY within 48 hours of receipt with unboxing photos or video evidence.</li>
            <li><strong>Manufacturer Warranty:</strong> Electrical appliances (including induction cooktops, electric kettles, mixer grinders, and fans) are accompanied by official brand warranties. Warranty service is honored in accordance with each brand's standard warranty cards.</li>
            <li><strong>Cookware Hygiene:</strong> Cookware, pressure cookers, and utensils that have been used or washed cannot be returned for hygiene reasons unless a verifiable manufacturing defect exists.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>6. Limitation of Liability</h2>
          <p>
            KLAY and its affiliates shall not be liable for any indirect, incidental, or consequential damages resulting from improper appliance installation, electrical surges, or misuse of high-pressure cooking equipment contrary to user safety manuals.
          </p>
        </section>

        <section className="policy-section">
          <h2>7. Contact &amp; Disputes</h2>
          <p>
            Any disputes or concerns regarding orders should be directed to our customer resolution desk at <a href="mailto:support@klaystore.com">support@klaystore.com</a>. We are committed to fair and prompt resolution.
          </p>
        </section>
      </div>
    </div>
  )
}
