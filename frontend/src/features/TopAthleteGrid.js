import React, { useEffect, useState } from 'react';

export default function TopAthletesGrid() {
  const [athletes, setAthletes] = useState([]);
  const [page, setPage] = useState(0);
  const [filterCountry, setFilterCountry] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterMedal, setFilterMedal] = useState('');
  const [filterGame, setFilterGame] = useState('');

  const perPage = 6;

  useEffect(() => {
    fetch('/api/athletes/top-medallists')
      .then(res => res.json())
      .then(data => setAthletes(data));
  }, []);

  const getMedalSummary = (medals = []) => {
    return {
      gold: medals.filter(m => m?.type?.toLowerCase().includes('gold')).length,
      silver: medals.filter(m => m?.type?.toLowerCase().includes('silver')).length,
      bronze: medals.filter(m => m?.type?.toLowerCase().includes('bronze')).length,
    };
  };

  const getFlagEmoji = (countryName) => {
    const code = {
      'australia': 'AU', 'belgium': 'BE', 'canada': 'CA', 'france': 'FR', 'italy': 'IT',
      'japan': 'JP', 'korea': 'KR', 'united states': 'US', 'usa': 'US', 'germany': 'DE'
    }[countryName.toLowerCase()] || '';
    return code
      ? String.fromCodePoint(...[...code.toUpperCase()].map(c => 127397 + c.charCodeAt()))
      : '🌍';
  };

  const filteredAthletes = athletes.filter(a => {
    const countryMatch = filterCountry ? a.country.toLowerCase().includes(filterCountry.toLowerCase()) : true;
    const genderMatch = filterGender ? a.gender.toLowerCase() === filterGender.toLowerCase() : true;
    const medalMatch = filterMedal ? a.medals?.some(m => m?.type?.toLowerCase().includes(filterMedal.toLowerCase())) : true;
    const gameMatch = filterGame ? a.medals?.some(m => m?.event?.toLowerCase().includes(filterGame.toLowerCase())) : true;
    return countryMatch && genderMatch && medalMatch && gameMatch;
  });

  const paginated = filteredAthletes.slice(page * perPage, (page + 1) * perPage);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Filter by country"
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
          className="p-2 border rounded text-sm"
        />
        <select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
          className="p-2 border rounded text-sm"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select
          value={filterMedal}
          onChange={(e) => setFilterMedal(e.target.value)}
          className="p-2 border rounded text-sm"
        >
          <option value="">All Medals</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="bronze">Bronze</option>
        </select>
        <input
          type="text"
          placeholder="Filter by game/event"
          value={filterGame}
          onChange={(e) => setFilterGame(e.target.value)}
          className="p-2 border rounded text-sm"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {paginated.map((athlete, index) => {
          const summary = getMedalSummary(athlete.medals);
          const flag = getFlagEmoji(athlete.country);
          return (
            <div key={index} className="p-4 border rounded shadow bg-white">
              <h3 className="text-lg font-semibold">{athlete.name}</h3>
              <p className="text-sm text-gray-500">
                {athlete.age} • {athlete.gender} • {flag} {athlete.country}
              </p>
              <div className="flex gap-2 mt-2">
                <span>🥇 {summary.gold}</span>
                <span>🥈 {summary.silver}</span>
                <span>🥉 {summary.bronze}</span>
              </div>
              <ul className="mt-2 text-sm text-gray-600">
                {athlete.medals?.map((medal, idx) => (
                  <li key={idx}>• {medal.event} – {medal.type}</li>
                )) || <li>No medal data available.</li>}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">Page {page + 1} of {Math.ceil(filteredAthletes.length / perPage)}</span>
        <button
          onClick={() => setPage(prev => (prev + 1 < Math.ceil(filteredAthletes.length / perPage) ? prev + 1 : prev))}
          disabled={(page + 1) * perPage >= filteredAthletes.length}
          className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}