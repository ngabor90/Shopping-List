import { useState } from "react";

export default function Logo({ onLogout, user, dark, onToggleDark }) {
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await onLogout();
    setLoggingOut(false);
  }

  return (
    <>
      <div className="logo-wrapper">
        <h1>Shopping list</h1>
        {onLogout && (
          <div className="logo-right">
            {user && <span className="user-greeting">Hello, {user.name}!</span>}
            <button className="logout-btn" onClick={handleLogout} disabled={loggingOut}>
              {loggingOut ? <span className="auth-btn-spinner logout-spinner" /> : "Sign out"}
            </button>
          </div>
        )}
      </div>
      <div className="toolbar">
        <button className="dark-toggle-btn" onClick={onToggleDark}>
          {dark ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </>
  );
}