import './Pages.css'

export default function PrivacyPolicy() {
  return (
    <div className="page-container policy-page">
      <div className="page-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: November 2026. This policy describes how KLAY collects, uses, and safeguards your personal information.</p>
      </div>

      <div className="policy-content-card">
        <section className="policy-section">
          <h2>1. Information We Collect</h2>
          <p>
            When you visit KLAY, browse our cookware collections, create an account, or make an order, we may collect the following details:
          </p>
          <ul>
            <li><strong>Contact Information:</strong> Your name, email address, delivery address, and telephone number.</li>
            <li><strong>Order Details:</strong> Items purchased, order value, payment status, and delivery preferences.</li>
            <li><strong>Account Credentials:</strong> Your username, encrypted authentication records, and order history.</li>
            <li><strong>Technical Data:</strong> Basic device information, IP address, and browser type used solely to ensure site security and correct layout rendering.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use your personal data strictly for legitimate operational purposes:</p>
          <ul>
            <li>Processing orders, shipping products, and issuing delivery notifications.</li>
            <li>Providing customer support regarding product warranties and technical appliance assistance.</li>
            <li>Protecting against unauthorized transactions, fraud, and security vulnerabilities.</li>
            <li>Maintaining account records and warranty registrations for purchased electronics.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. Payment &amp; Financial Security</h2>
          <p>
            KLAY does not store full credit card numbers or sensitive banking PINs on its servers. All payments are processed through certified, PCI-DSS compliant third-party payment gateways.
          </p>
        </section>

        <section className="policy-section">
          <h2>4. Cookies &amp; Local Storage</h2>
          <p>
            We use essential session cookies and local storage tokens strictly to maintain your logged-in session, remember items in your shopping bag, and preserve your category filter selections. We do not sell tracking cookies or your personal data to third-party ad brokers.
          </p>
        </section>

        <section className="policy-section">
          <h2>5. Third-Party Disclosures</h2>
          <p>
            We only share essential information with trusted operational partners necessary to fulfill your orders (such as authorized courier delivery services and payment processors). We never sell, rent, or trade your personal information.
          </p>
        </section>

        <section className="policy-section">
          <h2>6. Your Rights</h2>
          <p>
            You have the right to inspect, update, or request the deletion of your personal account data at any time. To exercise these rights, please contact our support team at <a href="mailto:support@klaystore.com">support@klaystore.com</a>.
          </p>
        </section>

        <section className="policy-section">
          <h2>7. Contact Information</h2>
          <p>
            If you have questions regarding this Privacy Policy or how your data is handled, please reach out to us at:
          </p>
          <div className="policy-contact-box">
            <p><strong>KLAY Utensils &amp; Appliances</strong></p>
            <p>Customer Support Department</p>
            <p>Email: support@klaystore.com</p>
            <p>Hours: Sunday - Friday, 9:00 AM - 7:00 PM</p>
          </div>
        </section>
      </div>
    </div>
  )
}
