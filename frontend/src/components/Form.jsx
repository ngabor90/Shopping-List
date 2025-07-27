import { useState } from "react";

export default function Form({ onAddItems }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name) return;

    const newItem = {
      name,
      quantity,
      note,
      packed: false,
    };

    onAddItems(newItem);

    setName("");
    setQuantity(1);
    setNote("");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you want to buy?</h3>

      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button>Add</button>
    </form>
  );
}
