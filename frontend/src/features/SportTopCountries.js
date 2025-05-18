// src/features/TopCountriesChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Medal colors with slightly muted tones to match the design system
const colors = {
  gold: "#FCB131",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
  background: "#f0f7ff"  // Light blue background to match
};

export default function TopCountriesChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-4">No country data available</div>;
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-lg">
          <h4 className="font-bold text-lg mb-2">{label}</h4>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm">
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4" style={{ background: colors.background, borderRadius: '8px' }}>
      {/* Top section with title */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-600">Top Countries</h2>
        <p className="text-gray-600">Medal distribution by nation</p>
      </div>

      {/* Simple legend */}
      <div className="flex mb-2">
        {Object.entries(colors).slice(0, 3).map(([medal, color]) => (
          <div key={medal} className="mr-4 flex items-center">
            <span 
              className="inline-block w-3 h-3 mr-1 rounded-sm" 
              style={{ backgroundColor: color }}
            ></span>
            <span className="capitalize">{medal}</span>
          </div>
        ))}
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 10, left: 80, bottom: 20 }}
            barSize={36}
            barGap={0}
            barCategoryGap="35%"
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              horizontal={false} 
              stroke="#eee" 
            />
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(1)}K` : value}
            />
            <YAxis 
              dataKey="country" 
              type="category" 
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="gold" 
              name="Gold" 
              stackId="a" 
              fill={colors.gold}
              radius={[0, 4, 4, 0]}
              animationDuration={1500}
            />
            <Bar 
              dataKey="silver" 
              name="Silver" 
              stackId="a" 
              fill={colors.silver}
              radius={[0, 4, 4, 0]}
              animationDuration={1500}
            />
            <Bar 
              dataKey="bronze" 
              name="Bronze" 
              stackId="a" 
              fill={colors.bronze}
              radius={[0, 4, 4, 0]}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-sm text-center mt-4 text-gray-600">
        Distribution of medals among top performing nations
      </p>
    </div>
  );
}