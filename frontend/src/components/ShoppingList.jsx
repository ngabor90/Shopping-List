import { useState } from "react";
import Item from "./Item";

export default function ShoppingList({
  items = [], 
  onDeleteItem,
  onToggleItem,
  onClearList,
}) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems = [...items];

  if (sortBy === "name")
    sortedItems.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "packed")
    sortedItems.sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
            key={item.id}
          />
        ))}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input</option>
          <option value="name">Sort by name</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button className="btn-clear" onClick={onClearList}>
          Clear list
        </button>
      </div>
    </div>
  );
}
