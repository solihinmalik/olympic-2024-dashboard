import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function getTopDisciplinesAndAllCountries(data, topDisciplinesN = 10) {
  // 1. Calculate total medals per discipline
  const disciplineTotals = {};
  data.forEach(d => {
    disciplineTotals[d.discipline] = (disciplineTotals[d.discipline] || 0) + d.total;
  });

  // 2. Get top N disciplines by total medals
  const topDisciplines = Object.entries(disciplineTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topDisciplinesN)
    .map(([discipline]) => discipline);

  // 3. Get all countries present in the data (for legend and stacks)
  const allCountries = Array.from(new Set(data.map(d => d.country)));

  // 4. Build a lookup for quick access
  const disciplineCountryTotals = {};
  data.forEach(d => {
    if (!disciplineCountryTotals[d.discipline]) disciplineCountryTotals[d.discipline] = {};
    disciplineCountryTotals[d.discipline][d.country] = (disciplineCountryTotals[d.discipline][d.country] || 0) + d.total;
  });

  return { topDisciplines, allCountries, disciplineCountryTotals };
}

export default function MedalDisciplineStackedBar({ data }) {
  const { topDisciplines, allCountries, disciplineCountryTotals } = getTopDisciplinesAndAllCountries(data, 10);

  // Assign a color for each country
  const colors = [
    '#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236',
    '#166a8f', '#00a950', '#58595b', '#8549ba', '#e6194b',
    '#b8860b', '#8b0000', '#4682b4', '#228b22', '#ff69b4',
    '#cd5c5c', '#ffa500', '#40e0d0', '#9932cc', '#ff6347'
  ];

  const datasets = allCountries.map((country, i) => ({
    label: country,
    data: topDisciplines.map(discipline =>
      disciplineCountryTotals[discipline]?.[country] || 0
    ),
    backgroundColor: colors[i % colors.length],
    stack: 'Stack 0'
  }));

  const chartData = {
    labels: topDisciplines,
    datasets
  };

  const options = {
    indexAxis: 'y', // Make the bar chart horizontal
    responsive: true,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          padding: 10, // Increase this value for more space between legend and chart
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: { display: true, text: 'Top 10 Disciplines (Stacked by Country)' }
    },
    scales: {
      x: { stacked: true, beginAtZero: true },
      y: { 
        stacked: true,
        categoryPercentage: 0.6,
        barPercentage: 0.7,
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Medals by Discipline and Top Countries</h2>
      <div style={{ height: 500, marginTop: 10 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}