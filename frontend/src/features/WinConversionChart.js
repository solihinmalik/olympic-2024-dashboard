// src/components/WinConversionChart.js
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const WinConversionChart = () => {
  const winRate = 48.9;      // Mock data
  const conversionRate = 46.2; // Mock data

  const donutOptions = {
    cutout: '70%',
    plugins: {
      legend: { display: false },
    },
  };

  const createChartData = (value) => ({
    labels: ['Value', 'Remaining'],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: ['#6C63FF', '#e5e7eb'],
        borderWidth: 0,
      },
    ],
  });

  return (
    <div className="bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-6">
      <Donut title="Win Rate" value={winRate} data={createChartData(winRate)} options={donutOptions} />
      <Donut title="Conversion Rate" value={conversionRate} data={createChartData(conversionRate)} options={donutOptions} />
    </div>
  );
};

const Donut = ({ title, value, data, options }) => (
  <div className="flex flex-col items-center">
    <div className="w-32 h-32">
      <Doughnut data={data} options={options} />
    </div>
    <p className="text-center text-sm text-gray-500 mt-2">{title}</p>
    <p className="text-lg font-bold text-gray-800">{value}%</p>
  </div>
);

export default WinConversionChart;
