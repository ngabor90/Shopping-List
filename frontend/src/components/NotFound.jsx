export default function NotFound({ onGoHome }) {
    return (
        <div className="auth-wrapper">
            <div className="auth-box" style={{ textAlign: "center" }}>
                <h2 style={{ fontSize: "6rem", marginBottom: "0" }}>404</h2>
                <p className="auth-subtitle">Oops! Page not found.</p>
                <button className="auth-btn" onClick={onGoHome}>
                    Go to Home
                </button>
            </div>
        </div>
    );
}