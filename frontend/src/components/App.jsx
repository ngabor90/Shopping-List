import { useState, useEffect } from "react";
import Logo from "./Logo";
import Form from "./Form";
import ShoppingList from "./ShoppingList";
import Stats from "./Stats";

const API_URL = "http://localhost:8000/api/items";

export default function App() {
  const [items, setItems] = useState([]);

  // Backendről betöltés
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  // Új elem hozzáadása backendhez
  function handleAddItems(item) {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
      .then((res) => res.json())
      .then((savedItem) => {
        setItems((items) => [...items, savedItem]);
      })
      .catch((err) => console.error("Error adding item:", err));
  }

  // Elem törlése backendről
  function handleDeleteItem(id) {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setItems((items) => items.filter((item) => item.id !== id));
      })
      .catch((err) => console.error("Error deleting item:", err));
  }

  // Elem "packed" státuszának váltása backend felé
  function handleToggleItem(id) {
    const itemToToggle = items.find((item) => item.id === id);
    if (!itemToToggle) return;

    fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packed: !itemToToggle.packed }),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        setItems((items) =>
          items.map((item) => (item.id === id ? updatedItem : item))
        );
      })
      .catch((err) => console.error("Error toggling item:", err));
  }

  // Lista törlése backendről
  function handleClearList() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all items?"
    );
    if (!confirmed) return;

    // Egyszerűen végig töröljük az elemeket 
    Promise.all(
      items.map((item) =>
        fetch(`${API_URL}/${item.id}`, {
          method: "DELETE",
        })
      )
    )
      .then(() => setItems([]))
      .catch((err) => console.error("Error clearing list:", err));
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <ShoppingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}
