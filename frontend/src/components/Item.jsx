export default function Item({ item, onDeleteItem, onToggleItem }) {
  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );
    if (confirmed) onDeleteItem(item.id);
  }

  return (
    <li>
      <input
        type="checkbox"
        checked={item.packed}
        onChange={() => onToggleItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity}  {item.name}
        {item.note && (
          <span style={{ fontStyle: "italic", marginLeft: "0.5rem", color: "#666" }}>
            — {item.note}
          </span>
        )}
      </span>
      <button onClick={handleDelete}>❌</button>
    </li>
  );
}
