import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function VerifyEmail({ onVerified }) {
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "1") {
      localStorage.setItem("needs_verify", "0");
      setVerified(true);
      setTimeout(() => onVerified(), 2000);
    }
  }, [onVerified]);

  async function handleResend() {
    setResending(true);
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE}/email/resend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setMessage(data.message || "Email sent!");
    } catch {
      setMessage("Something went wrong. Try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box" style={{ textAlign: "center" }}>
        <p style={{ fontSize: "5rem", lineHeight: 1 }}>📧</p>
        <h2>Verify your email</h2>

        {verified ? (
          <p className="auth-success">Email verified! Redirecting...</p>
        ) : (
          <>
            <p className="auth-subtitle">
              We sent a verification link to your email address. Please check
              your inbox and click the link to continue.
            </p>

            {message && <p className="auth-success">{message}</p>}

            <button
              className="auth-btn"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? "Sending..." : "Resend verification email"}
            </button>
          </>
        )}

        <div className="auth-links">
          <button
            className="auth-link"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("needs_verify");
              window.location.replace("/");
            }}
          >
            Back to Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
