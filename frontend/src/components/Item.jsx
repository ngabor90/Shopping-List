import { useState } from "react";

export default function Item({
  item,
  onDeleteItem,
  onToggleItem,
  onEditItem,
  dragHandleProps,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editQuantity, setEditQuantity] = useState(item.quantity);
  const [editNote, setEditNote] = useState(item.note || "");

  function handleDelete() {
    onDeleteItem(item.id);
  }

  function handleSave() {
    if (!editName.trim()) return;
    onEditItem(item.id, {
      name: editName,
      quantity: editQuantity,
      note: editNote,
    });
    setIsEditing(false);
  }

  function handleCancel() {
    setEditName(item.name);
    setEditQuantity(item.quantity);
    setEditNote(item.note || "");
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className="item-editing">
        <select
          value={editQuantity}
          onChange={(e) => setEditQuantity(Number(e.target.value))}
          className="edit-select"
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
            <option value={num} key={num}>
              {num}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="edit-input"
          autoFocus
        />
        <input
          type="text"
          value={editNote}
          onChange={(e) => setEditNote(e.target.value)}
          className="edit-input"
          placeholder="Note (optional)"
        />
        <button className="edit-save-btn" onClick={handleSave}>
          ✓
        </button>
        <button className="edit-cancel-btn" onClick={handleCancel}>
          ✕
        </button>
      </li>
    );
  }

  return (
    <li className={`item-enter ${item.packed ? "item-packed-row" : ""}`}>
      <span className="drag-handle" {...dragHandleProps}>
        ⠿
      </span>
      <button
        className={`check-btn ${item.packed ? "check-btn-checked" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleItem(item.id);
        }}
        aria-label={item.packed ? "Mark as unpacked" : "Mark as packed"}
      >
        {item.packed ? "✓" : ""}
      </button>
      <span className={item.packed ? "item-text item-packed" : "item-text"}>
        {item.quantity} x {item.name}
        {item.note && <span className="item-note">— {item.note}</span>}
      </span>
      <button className="edit-btn" onClick={() => setIsEditing(true)}>
        ✏️
      </button>
      <button className="delete-btn" onClick={handleDelete}>
        ❌
      </button>
    </li>
  );
}
