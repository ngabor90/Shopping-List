export default function ConfirmDialog({ message, onConfirm, onCancel }) {
    return (
        <div className="dialog-overlay">
            <div className="dialog-box">
                <p className="dialog-message">{message}</p>
                <div className="dialog-actions">
                    <button className="dialog-btn dialog-btn-cancel" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="dialog-btn dialog-btn-confirm" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}