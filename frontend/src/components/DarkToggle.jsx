export default function DarkToggle({ dark, onToggle }) {
    return (
        <div className="auth-dark-toggle">
            <button className="dark-toggle-btn" onClick={onToggle}>
                {dark ? "Light mode" : "Dark mode"}
            </button>
        </div>
    );
}