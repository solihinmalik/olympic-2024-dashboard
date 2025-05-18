// src/dashboards/AthletesDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SummaryCards from '../features/SummaryCards';
import MedalDisciplineStackedBar from '../features/MedalDisciplineStackedBar';
import MedalTimelineChart from '../features/MedalTimelineChart';
import MedalCumulativeStackedChart from '../features/MedalCumulativeStackedChart';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Country Filter Component
const CountryFilter = ({ countries, selectedCountry, onCountryChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor="countryFilter" className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Country
      </label>
      <select
        id="countryFilter"
        value={selectedCountry}
        onChange={(e) => onCountryChange(e.target.value)}
        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Countries</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
    </div>
  );
};

// Medal Country Chart Component
const MedalCountryChart = ({ data, sortDirection, onSortDirectionChange }) => {
  const chartData = {
    labels: data.map(d => d.country),
    datasets: [
      {
        label: 'Gold',
        data: data.map(d => d.gold),
        backgroundColor: 'rgba(255, 215, 0, 0.6)',
        borderColor: 'gold',
        borderWidth: 1
      },
      {
        label: 'Silver',
        data: data.map(d => d.silver),
        backgroundColor: 'rgba(192, 192, 192, 0.6)',
        borderColor: 'silver',
        borderWidth: 1
      },
      {
        label: 'Bronze',
        data: data.map(d => d.bronze),
        backgroundColor: 'rgba(205, 127, 50, 0.6)',
        borderColor: 'brown',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-700">Top 10 Medals Breakdown by Country</h2>
        <button
          onClick={() => onSortDirectionChange(sortDirection === 'desc' ? 'asc' : 'desc')}
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          title={sortDirection === 'desc' ? 'Sort: Highest to Lowest' : 'Sort: Lowest to Highest'}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 text-gray-600 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" 
            />
          </svg>
        </button>
      </div>
      <div className="h-64">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true },
              x: { stacked: true },
              y: { stacked: true }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.raw || 0;
                    return `${label}: ${value}`;
                  }
                }
              },
              datalabels: {
                display: true,
                color: '#000',
                anchor: 'end',
                align: 'end',
                formatter: function(value, context) {
                  // Only show total for the last dataset (Bronze)
                  if (context.datasetIndex === 2) {
                    const total = data[context.dataIndex].total;
                    return total;
                  }
                  return '';
                }
              }
            }
          }}
          plugins={[ChartDataLabels]}
        />
      </div>
    </div>
  );
};

// Medal Discipline Chart Component
const MedalDisciplineChart = ({ data }) => {
  const countries = Array.from(new Set(data.map(d => d.country))).sort();
  const disciplines = Array.from(new Set(data.map(d => d.discipline))).sort();

  const countryDisciplineMap = {};
  data.forEach(d => {
    if (!countryDisciplineMap[d.country]) countryDisciplineMap[d.country] = {};
    countryDisciplineMap[d.country][d.discipline] = d.total;
  });

  const datasets = disciplines.map(discipline => ({
    label: discipline,
    data: countries.map(country => countryDisciplineMap[country]?.[discipline] || 0),
    backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
    borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
    borderWidth: 1
  }));

  const chartData = {
    labels: countries,
    datasets: datasets
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Medals by Country and Discipline' }
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true }
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Medals by Discipline</h2>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default function MedalsDashboard() {
  const [medalData, setMedalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    axios.get('http://localhost:5000/api/medals')
      .then(response => {
        setMedalData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching medal data:', err);
        setError('Failed to load medal data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-4">Loading medal data...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!medalData) return <div className="text-center p-4">No medal data available</div>;

  // Get unique countries for the filter
  const countries = [...new Set(medalData.byCountry.map(d => d.country))].sort();

  // Sort and filter data based on selected country and sort direction
  const filteredByCountry = selectedCountry
    ? medalData.byCountry.filter(d => d.country === selectedCountry)
    : [...medalData.byCountry]
        .sort((a, b) => sortDirection === 'desc' ? b.total - a.total : a.total - b.total)
        .slice(0, 10);

  const filteredByDiscipline = selectedCountry
    ? medalData.byDisciplineCountry.filter(d => d.country === selectedCountry)
    : medalData.byDisciplineCountry;

  return (
    <div>
      <SummaryCards selectedCountry={selectedCountry} />
      <div className="p-4">
        <CountryFilter
          countries={countries}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
        />
        <div className="flex flex-col gap-6">
          <MedalCountryChart 
            data={filteredByCountry} 
            sortDirection={sortDirection}
            onSortDirectionChange={setSortDirection}
          />
          <MedalDisciplineStackedBar data={filteredByDiscipline} />
        </div>
        <div className="mt-6">
          <MedalTimelineChart 
            data={medalData.timeline} 
            selectedCountry={selectedCountry}
          />
        </div>
        <MedalCumulativeStackedChart timelineByMedalType={medalData.timelineByMedalType} />
      </div>
    </div>
  );
}
