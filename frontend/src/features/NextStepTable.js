// src/components/NextStepsTable.js
import React from 'react';

const data = [
  { name: 'Athlete A', country: 'USA', openDate: '2024-03-01', focusArea: '100m Sprint', score: 'Top 3' },
  { name: 'Athlete B', country: 'JPN', openDate: '2024-02-18', focusArea: 'Marathon', score: 'Top 5' },
  { name: 'Athlete C', country: 'KEN', openDate: '2024-01-25', focusArea: '1500m', score: 'Top 10' },
  { name: 'Athlete D', country: 'GBR', openDate: '2024-03-03', focusArea: 'Swimming', score: 'Top 5' },
];

const NextStepsTable = () => (
  <div className="bg-white p-4 rounded shadow overflow-x-auto">
    <h2 className="text-lg font-semibold text-gray-700 mb-3">Where to Focus Next (Upcoming 90 Days)</h2>
    <table className="min-w-full table-auto text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2">Name</th>
          <th className="p-2">Country</th>
          <th className="p-2">Open Date</th>
          <th className="p-2">Focus Area</th>
          <th className="p-2">Score Forecast</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="border-b hover:bg-gray-50">
            <td className="p-2">{row.name}</td>
            <td className="p-2">{row.country}</td>
            <td className="p-2">{row.openDate}</td>
            <td className="p-2">{row.focusArea}</td>
            <td className="p-2 font-medium text-purple-600">{row.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default NextStepsTable;
