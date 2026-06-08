import { useState } from "react";
import Item from "./Item";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ item, onDeleteItem, onToggleItem, onEditItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Item
        item={item}
        onDeleteItem={onDeleteItem}
        onToggleItem={onToggleItem}
        onEditItem={onEditItem}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export default function ShoppingList({
  items = [],
  onDeleteItem,
  onToggleItem,
  onClearList,
  onEditItem,
  onReorder,
}) {
  const [sortBy, setSortBy] = useState("input");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  let sortedItems = [...items];
  if (sortBy === "name")
    sortedItems.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "packed")
    sortedItems.sort((a, b) => Number(a.packed) - Number(b.packed));

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedItems.findIndex((i) => i.id === active.id);
    const newIndex = sortedItems.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(sortedItems, oldIndex, newIndex);
    onReorder(reordered);
  }

  if (!sortedItems.length) {
    return (
      <div className="list">
        <div className="empty-state">
          <svg
            className="empty-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="3"
              y1="6"
              x2="21"
              y2="6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M16 10a4 4 0 01-8 0"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3>Your list is empty!</h3>
          <p className="empty-text">
            Add items using the form above. You can set the quantity, add a
            note, and check them off as you shop.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="list">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedItems.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul>
            {sortedItems.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                onDeleteItem={onDeleteItem}
                onToggleItem={onToggleItem}
                onEditItem={onEditItem}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

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
