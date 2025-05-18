import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function MedalCumulativeStackedChart({ timelineByMedalType }) {
  const countries = Object.keys(timelineByMedalType).sort();
  const [selectedCountry, setSelectedCountry] = useState(countries[0] || '');

  useEffect(() => {
    if (!selectedCountry && countries.length > 0) {
      setSelectedCountry(countries[0]);
    }
  }, [countries, selectedCountry]);

  if (!selectedCountry || !timelineByMedalType[selectedCountry]) {
    return <div className="text-center p-4">No data available for selected country.</div>;
  }

  const dataArr = timelineByMedalType[selectedCountry];
  const labels = dataArr.map(d => d.date);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Gold',
        data: dataArr.map(d => d.gold),
        backgroundColor: 'rgba(255, 215, 0, 0.8)',
        borderColor: 'gold',
        borderWidth: 1,
        stack: 'medals',
      },
      {
        label: 'Silver',
        data: dataArr.map(d => d.silver),
        backgroundColor: 'rgba(192, 192, 192, 0.8)',
        borderColor: 'silver',
        borderWidth: 1,
        stack: 'medals',
      },
      {
        label: 'Bronze',
        data: dataArr.map(d => d.bronze),
        backgroundColor: 'rgba(205, 127, 50, 0.8)',
        borderColor: 'peru',
        borderWidth: 1,
        stack: 'medals',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 20,
          boxHeight: 20,
          font: { size: 14 }
        }
      },
      title: {
        display: true,
        text: `Cumulative Medals by Type for ${selectedCountry}`,
        font: { size: 18 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Date'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 30,
          autoSkip: true,
          maxTicksLimit: 15
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cumulative Medals'
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-8">
      <div className="mb-4">
        <label htmlFor="countrySelect" className="block text-sm font-medium text-gray-700 mb-2">
          Select Country
        </label>
        <select
          id="countrySelect"
          value={selectedCountry}
          onChange={e => setSelectedCountry(e.target.value)}
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>
      <div style={{ height: 400 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
