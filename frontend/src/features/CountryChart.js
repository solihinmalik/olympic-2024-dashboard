import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function CountryChart() {
  const [countryData, setCountryData] = useState([]);
  const [medalTotals, setMedalTotals] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [countryRes, medalRes] = await Promise.all([
          axios.get('http://localhost:5000/api/athletes/by-country'),
          axios.get('http://localhost:5000/api/medals/totals-by-country')
        ]);
        
        const sorted = countryRes.data.sort((a, b) => b.count - a.count);
        setCountryData(sorted);
        setMedalTotals(medalRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-6">Loading data...</div>;
  if (error) return <div className="text-center py-6 text-red-500">{error}</div>;
  const getWinRate = (code) => {
    const total = countryData.find(c => c.code === code)?.count || 0;
    const medals = medalTotals.find(m => m.country_code === code)?.Total || 0;
    const rate = total ? medals / total : 0;
    return { total, medals, rate };
  };

  const result = selectedCode ? getWinRate(selectedCode) : null;

  const filteredData = selectedCode
    ? countryData.filter(c => c.code === selectedCode)
    : countryData;

  const goldCounts = filteredData.map(c => {
    const row = medalTotals.find(m => m.country_code === c.code);
    return row ? row["Gold Medal"] : 0;
  });
  const silverCounts = filteredData.map(c => {
    const row = medalTotals.find(m => m.country_code === c.code);
    return row ? row["Silver Medal"] : 0;
  });
  const bronzeCounts = filteredData.map(c => {
    const row = medalTotals.find(m => m.country_code === c.code);
    return row ? row["Bronze Medal"] : 0;
  });

  const athleteCounts = filteredData.map(c => c.count);

  const chartData = {
    labels: filteredData.map(c => c.code),
    datasets: [
      {
        label: 'Athletes',
        data: athleteCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        stack: 'Group 0'
      },
      {
        label: 'Gold',
        data: goldCounts,
        backgroundColor: '#FFD700',
        stack: 'Group 1'
      },
      {
        label: 'Silver',
        data: silverCounts,
        backgroundColor: '#C0C0C0',
        stack: 'Group 1'
      },
      {
        label: 'Bronze',
        data: bronzeCounts,
        backgroundColor: '#CD7F32',
        stack: 'Group 1'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Country Code'
        }
      },
      y: {
        stacked: false,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count'
        }
      }
    }
  };


  return (
    <div className="p-6">
      {/* Title and description */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Olympic 2024: Athletes by Country</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm">
          The bar chart shows how many athletes each country sent to the 2024 Olympic Games.
          Use the dropdown to explore medal-winning efficiency for individual countries.
        </p>
      </div>

      {/* Main layout */}
      <div className="flex bg-white p-6 rounded-xl shadow-md gap-6">
        {/* Chart Section */}
        <div className="w-2/3 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Top 10 Countries Athlete</h3>
          <div style={{ height: '500px', minWidth: '1000px' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Analysis Panel */}
        <div className="w-1/3 flex flex-col justify-start">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span role="img" aria-label="trophy">🏆</span> Win Rate Analysis
          </h2>

          {/* Dropdown */}
          <select
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.target.value)}
            className="w-full p-3 mb-4 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select a country</option>
            {countryData.map((country) => (
              <option key={country.code} value={country.code}>
                {country.code}
              </option>
            ))}
          </select>

          {selectedCode && (
            <button
              onClick={() => setSelectedCode('')}
              className="mb-4 text-sm text-blue-500 hover:underline"
            >
              Reset to all countries
            </button>
          )}

          {/* Stats Box */}
          {result && (
            <div className="bg-gray-50 p-5 rounded-lg shadow-inner border border-gray-200 space-y-3">
              <p><span className="font-semibold">🌍 Country:</span> {selectedCode}</p>
              <p><span className="font-semibold">👥 Total Athletes:</span> {result.total}</p>
              <p><span className="font-semibold">🥇 Medals:</span> {result.medals}</p>
              <p><span className="font-semibold">📊 Win Rate:</span> {(result.rate * 100).toFixed(2)}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}