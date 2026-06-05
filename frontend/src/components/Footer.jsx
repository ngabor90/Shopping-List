export default function Footer({ onPrivacyPolicy }) {
    return (
        <footer className="app-footer">
            <p>© {new Date().getFullYear()} Shopping List - Németh Gábor</p>
            <button className="auth-link" onClick={onPrivacyPolicy}>
                Privacy Policy
            </button>
        </footer>
    );
}