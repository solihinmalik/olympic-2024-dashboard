import React, { useEffect, useState } from 'react';

const AthleteTable = () => {
  const [athletes, setAthletes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;
  const MAX_VISIBLE_PAGES = 5;

  const totalPages = Math.ceil(athletes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedAthletes = athletes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getPaginationGroup = () => {
    let start = Math.max(currentPage - Math.floor(MAX_VISIBLE_PAGES / 2), 1);
    let end = start + MAX_VISIBLE_PAGES - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - MAX_VISIBLE_PAGES + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/athletes')
      .then((res) => res.json())
      .then((data) => setAthletes(data))
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Athletes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Nationality</th>
              <th className="p-2 text-left">Sport</th>
              <th className="p-2 text-left">Discipline</th>
              <th className="p-2 text-left">Gender</th>
            </tr>
          </thead>
          <tbody>
            {selectedAthletes.length > 0 ? (
              selectedAthletes.map((athlete, idx) => (
                <tr key={idx} className="even:bg-gray-100">
                  <td className="p-2">{athlete.name}</td>
                  <td className="p-2">{athlete.country}</td>
                  <td className="p-2">{athlete.function}</td>
                  <td className="p-2">{athlete.discipline}</td>
                  <td className="p-2">{athlete.gender}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-red-500">No athletes to display.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center items-center space-x-1 text-sm">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          First
        </button>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {getPaginationGroup().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`px-3 py-1 border rounded \${pageNum === currentPage
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            {pageNum}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default AthleteTable;
