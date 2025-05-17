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

  useEffect(() => {
    axios.get('http://localhost:5000/api/athletes/count-by-country')
      .then(res => setCountryData(res.data))
      .catch(err => console.error(err));
  }, []);

  const data = {
    labels: countryData.map(c => c.country),
    datasets: [
      {
        label: 'Number of Athletes',
        data: countryData.map(c => c.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'blue',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="mt-5">
      <h4 className="text-center mb-4">Top 10 Countries by Athletes</h4>
      <Bar data={data} />
    </div>
  );
}
