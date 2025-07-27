export default function Stats({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>Start adding some items to your shopping list - Németh Gábor React Shopping List App 2025</em>
      </p>
    );

  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? <span className="complete">"You got everything! Let's go home!"</span>
          : <span>You have ${numItems} items on your list, and you already packed ${numPacked} (${percentage}%)</span>}
      </em>
      <h4>Németh Gábor - React Shopping List App</h4>
    </footer>
  );
}