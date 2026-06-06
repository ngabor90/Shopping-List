export default function Footer({ onPrivacyPolicy }) {
  return (
    <footer className="app-footer">
      <p>
        © {new Date().getFullYear()} Shop List - {" "}
        <a
          href="https://www.ngaborwebdev.hu"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Németh Gábor
        </a>
      </p>

      <button className="auth-link footer-privacy" onClick={onPrivacyPolicy}>
        Privacy Policy
      </button>
    </footer>
  );
}
