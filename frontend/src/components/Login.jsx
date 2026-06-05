import { useState } from "react";
import { useAuth } from "../context/useAuth";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Login({ onSwitchToRegister, onForgotPassword }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.status === 403 && data.needs_verify) {
        login(data.token, data.user, true);
        return;
      }

      if (!res.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      login(data.token, data.user);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="auth-box">
          <h2>Welcome!</h2>
          <p className="auth-subtitle">Access your shopping list</p>

          {error && <p className="auth-error">{error}</p>}

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

            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="auth-btn-spinner" /> : "Sign in"}
            </button>
          </form>

          <div className="auth-links">
            <button className="auth-link" onClick={onSwitchToRegister}>
              Don't have an account? Register
            </button>
            <button className="auth-link" onClick={onForgotPassword}>
              Forgot your password?
            </button>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-hero">
          <h2 className="auth-hero-title">Your smart shopping companion</h2>
          <p className="auth-hero-subtitle">
            Keep track of everything you need to buy, organized and accessible anywhere.
          </p>
          <ul className="auth-features">
            <li>
              <span className="auth-feature-icon">✓</span>
              Add items with quantities and notes
            </li>
            <li>
              <span className="auth-feature-icon">✓</span>
              Check off items as you shop
            </li>
            <li>
              <span className="auth-feature-icon">✓</span>
              Drag and drop to reorder your list
            </li>
            <li>
              <span className="auth-feature-icon">✓</span>
              Your list is saved and synced automatically
            </li>
            <li>
              <span className="auth-feature-icon">✓</span>
              Works on any device, any time
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}