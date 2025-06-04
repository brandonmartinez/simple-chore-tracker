import React, { useEffect, useState } from 'react';

export default function App() {
  const [chores, setChores] = useState([]);

  useEffect(() => {
    fetch('/api/chores')
      .then(res => res.json())
      .then(setChores);
  }, []);

  return (
    <div>
      <h1>Simple Chore Tracker</h1>
      <ul>
        {chores.map(chore => (
          <li key={chore.id}>{chore.title}</li>
        ))}
      </ul>
    </div>
  );
}
