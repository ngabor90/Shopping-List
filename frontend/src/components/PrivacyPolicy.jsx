export default function PrivacyPolicy({ onBack }) {
    return (
        <div className="policy-wrapper">
            <div className="policy-box">
                <button className="auth-link policy-back" onClick={onBack}>
                    ← Back
                </button>

                <h2>Privacy Policy</h2>
                <p className="policy-date">Last updated: June 2026</p>

                <div className="policy-section">
                    <h3>1. Data We Collect</h3>
                    <p>We collect the following personal data when you register:</p>
                    <ul>
                        <li>Name</li>
                        <li>Email address</li>
                        <li>Encrypted password</li>
                        <li>Shopping list items you create</li>
                    </ul>
                </div>

                <div className="policy-section">
                    <h3>2. How We Use Your Data</h3>
                    <p>Your data is used solely to provide the Shopping List service. We do not sell, share, or use your data for marketing purposes.</p>
                </div>

                <div className="policy-section">
                    <h3>3. Data Storage</h3>
                    <p>Your data is stored securely on our servers. Passwords are encrypted and never stored in plain text. We use browser local storage to keep you logged in between sessions.</p>
                </div>

                <div className="policy-section">
                    <h3>4. Your Rights</h3>
                    <p>Under GDPR, you have the right to:</p>
                    <ul>
                        <li>Access your personal data</li>
                        <li>Request deletion of your account and data</li>
                        <li>Request correction of inaccurate data</li>
                    </ul>
                    <p>To exercise these rights, contact us at the email below.</p>
                </div>

                <div className="policy-section">
                    <h3>5. Contact</h3>
                    <p>For any privacy-related questions, contact: <a href="mailto:your@email.com">your@email.com</a></p>
                </div>
            </div>
        </div>
    );
}