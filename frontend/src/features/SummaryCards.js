// src/components/SummaryCards.js
import React, { useEffect, useState } from 'react';

const SummaryCards = () => {
  const [athletes, setAthletes] = useState([]);
  const [topCountry, setTopCountry] = useState({ country: 'Loading...', count: 0 });

  useEffect(() => {
    fetch('/api/athletes')
      .then(res => res.json())
      .then(data => setAthletes(data));

    fetch('/api/athletes/count-by-country')
      .then(res => res.json())
      .then(data => setTopCountry(data[0]));
  }, []);

  const uniqueCountries = new Set(athletes.map(a => a.nationality || a.Country)).size;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card title="Total Athletes" value={athletes.length} />
      <Card title="Countries Represented" value={uniqueCountries} />
      <Card title="Top Country" value={topCountry.country} />
      <Card title="Top Country Count" value={topCountry.count} />
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-bold text-gray-800">{value}</p>
  </div>
);

export default SummaryCards;
