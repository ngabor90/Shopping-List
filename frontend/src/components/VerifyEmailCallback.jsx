import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function VerifyEmailCallback() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split("/verify-email/")[1]?.split("/");
    const id = parts?.[0];
    const hash = parts?.[1];
    const search = window.location.search;

    const token = localStorage.getItem("token");

    fetch(`${API_BASE}/email/verify/${id}/${hash}${search}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok || res.redirected) {
          setStatus("success");
          localStorage.setItem("needs_verify", "0");
          setTimeout(() => {
            window.location.replace("/");
          }, 2000);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="auth-wrapper">
      <div className="auth-box" style={{ textAlign: "center" }}>
        {status === "loading" && (
          <p className="auth-subtitle">Verifying your email...</p>
        )}
        {status === "success" && (
          <>
            <p style={{ fontSize: "5rem" }}>✅</p>
            <h2>Email verified!</h2>
            <p className="auth-subtitle">
              Redirecting to your shopping list...
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <p style={{ fontSize: "5rem" }}>❌</p>
            <h2>Verification failed</h2>
            <p className="auth-subtitle">
              The link may have expired. Please request a new one.
            </p>
          </>
        )}
        <div className="auth-links" style={{ marginTop: "2rem" }}>
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
