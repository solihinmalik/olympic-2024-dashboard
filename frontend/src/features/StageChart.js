// src/components/StageChart.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const StageChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/athletes/count-by-country')
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Fetched chart data:", data); // <-- check this
        if (data.length > 0) {
          setChartData({
            labels: data.map((d) => d.country),
            datasets: [
              {
                label: 'Athletes',
                data: data.map((d) => d.count),
                backgroundColor: '#6C63FF',
              },
            ],
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch chart data", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-400">Loading chart...</p>;
  if (!chartData) return <p className="text-center text-red-500">No data available</p>;


  return (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-lg font-semibold text-gray-700 mb-2">
      Top 10 Countries by Athlete Count
    </h2>
    <div className="h-64">
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        }}
      />
    </div>
  </div>
);


};

export default StageChart;
