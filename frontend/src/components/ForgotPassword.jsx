import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ForgotPassword({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setSuccess("Password reset link sent! Check your email.");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Forgot password?</h2>
        <p className="auth-subtitle">
          Enter your email and we'll send you a reset link.
        </p>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <span className="auth-btn-spinner" />
            ) : (
              "Send reset link"
            )}
          </button>
        </form>

        <div className="auth-links">
          <button className="auth-link" onClick={onSwitchToLogin}>
            Back to Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
