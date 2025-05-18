import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

export default function MedalTimelineChart({ data, selectedCountry }) {
  // Filter data if a country is selected
  const filteredData = selectedCountry
    ? { [selectedCountry]: data[selectedCountry] }
    : data;

  // Get unique dates across all countries and disciplines
  const dates = [...new Set(
    Object.values(filteredData).flatMap(country =>
      Object.values(country).flatMap(disciplineArr =>
        disciplineArr.map(d => d.date)
      )
    )
  )].sort();

  // Build datasets: one per country, cumulative sum across all disciplines per date
  const datasets = Object.entries(filteredData).map(([country, disciplineObj], i) => {
    // For each discipline, build a map of date -> cumulative for that discipline and medal types
    const disciplineCumulatives = {};
    Object.entries(disciplineObj).forEach(([discipline, arr]) => {
      arr
        .sort((a, b) => a.date.localeCompare(b.date))
        .forEach(({ date, cumulative, gold, silver, bronze }) => {
          if (!disciplineCumulatives[date]) {
            disciplineCumulatives[date] = { gold: 0, silver: 0, bronze: 0, total: 0, disciplines: [] };
          }
          disciplineCumulatives[date].gold += gold || 0;
          disciplineCumulatives[date].silver += silver || 0;
          disciplineCumulatives[date].bronze += bronze || 0;
          disciplineCumulatives[date].total += (gold || 0) + (silver || 0) + (bronze || 0);
          if (!disciplineCumulatives[date].disciplines.includes(discipline)) {
            disciplineCumulatives[date].disciplines.push(discipline);
          }
        });
    });

    // For each date, sum the cumulative values across all disciplines
    const dataPoints = dates.map(date => {
      const entry = disciplineCumulatives[date] || { gold: 0, silver: 0, bronze: 0, total: 0, disciplines: [] };
      return {
        x: date,
        y: entry.total,
        gold: entry.gold,
        silver: entry.silver,
        bronze: entry.bronze,
        disciplines: entry.disciplines
      };
    });

    return {
      label: country,
      data: dataPoints,
      borderColor: `hsl(${(i * 47) % 360}, 70%, 50%)`,
      backgroundColor: 'transparent',
      fill: false,
      tension: 0.2,
      pointRadius: 3,
      pointHoverRadius: 6
    };
  });

  const chartData = {
    labels: dates,
    datasets
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: false,
          pointStyle: 'line',
          boxWidth: 40,
          boxHeight: 2
        }
      },
      title: { display: true, text: selectedCountry ? `${selectedCountry} Medal Timeline` : 'Medal Timeline by Country' },
      tooltip: {
        callbacks: {
          label: function(context) {
            const point = context.dataset.data[context.dataIndex];
            const gold = point.gold ?? 0;
            const silver = point.silver ?? 0;
            const bronze = point.bronze ?? 0;
            const disciplines = point.disciplines || [];
            return [
              `${context.dataset.label}: ${context.parsed.y} total medals`,
              disciplines.length > 0 ? `Disciplines: ${disciplines.join(', ')}` : '',
              `Gold: ${gold}`,
              `Silver: ${silver}`,
              `Bronze: ${bronze}`
            ].filter(Boolean);
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        ticks: { autoSkip: true, maxTicksLimit: 15, maxRotation: 45, minRotation: 30 }
      },
      y: { 
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cumulative Medals'
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        {selectedCountry ? `${selectedCountry} Medal Timeline` : 'Medal Timeline by Country'}
      </h2>
      <div style={{ height: '80vh' }}>
        <Line data={chartData} options={{ ...options, maintainAspectRatio: false }} />
      </div>
    </div>
  );
}
