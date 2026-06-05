import { useState } from "react";
import { useAuth } from "../context/useAuth";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Register({ onSwitchToLogin }) {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const firstError = Object.values(data.errors || {})[0]?.[0];
        setError(firstError || data.message || "Registration failed.");
        return;
      }

      login(data.token, data.user, true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Create account</h2>
        <p className="auth-subtitle">Start managing your shopping list</p>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="auth-hint">
              Min. 8 characters, must include letters and numbers
            </span>
          </div>

          <div className="auth-field">
            <label>Confirm password</label>
            <input
              type="password"
              placeholder="••••••••"
              minLength={8}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="auth-btn-spinner" /> : "Register"}
          </button>
        </form>

        <div className="auth-links">
          <button className="auth-link" onClick={onSwitchToLogin}>
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
