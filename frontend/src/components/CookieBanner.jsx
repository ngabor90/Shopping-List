import { useState, useEffect } from "react";

export default function CookieBanner({ onPrivacyPolicy }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookies_accepted");
    if (!accepted) setVisible(true);
  }, []);

  function handleAccept() {
    localStorage.setItem("cookies_accepted", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <p className="cookie-text">
        We use local storage to keep you logged in and save your preferences. No
        tracking or third-party cookies are used.{" "}
        <button className="cookie-policy-link" onClick={onPrivacyPolicy}>
          Learn more
        </button>
      </p>
      <button className="cookie-btn" onClick={handleAccept}>
        Accept
      </button>
    </div>
  );
}
