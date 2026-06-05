import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ResetPassword({ onResetSuccess }) {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const path = window.location.pathname;
    const tokenFromUrl = path.split("/reset-password/")[1];
    const emailFromUrl = new URLSearchParams(window.location.search).get(
      "email",
    );

    setToken(tokenFromUrl || "");
    setEmail(emailFromUrl || "");
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        redirect: "manual",
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      if (res.ok || res.type === "opaqueredirect") {
        setSuccess("Password reset successful! You can now sign in.");
        setTimeout(() => onResetSuccess(), 2000);
        return;
      }

      const data = await res.json();
      setError(data.message || "Something went wrong.");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>New password</h2>
        <p className="auth-subtitle">Enter your new password below.</p>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>New password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <div className="auth-field">
            <label>Confirm new password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="auth-btn-spinner" /> : "Reset password"}
          </button>
        </form>
        <div className="auth-links">
          <button
            className="auth-link"
            onClick={() => window.location.replace("/")}
          >
            Back to Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
