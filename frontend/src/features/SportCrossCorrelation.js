// src/features/SportCrossCorrelation.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Match the color scheme from SportAthleteProfileAnalysis
const colors = {
  primary: "#2196F3",    // Blue to match the male athlete color
  background: "#f0f7ff"  // Light blue background
};

export default function CrossSportCorrelation({ data, sport }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4">No correlation data available for {sport}</div>
    );
  }

  // Custom tooltip that shows medal count
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-lg">
          <h4 className="font-bold text-lg mb-2">{label}</h4>
          <p className="text-sm">
            Total Medals: <span className="font-semibold">{payload[0].value}</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Won by top countries in {sport}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4" style={{ background: colors.background, borderRadius: '8px' }}>
      {/* Top section with title */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-600">Cross-Sport Performance</h2>
        <p className="text-gray-600">Medal correlation with other sports</p>
      </div>

      {/* Simple legend */}
      <div className="flex mb-2">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: colors.primary }}></span>
          <span>Total Medals</span>
        </div>
      </div>

      {/* Chart with matching height */}
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            barSize={72}
            barCategoryGap="10%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis 
              dataKey="sport" 
              tick={{ fontSize: 11 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(1)}K` : value}
              tickCount={5}
              domain={[0, 'auto']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              label={{ 
                value: 'Total Medals', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 12 }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="medals" 
              name="Total Medals" 
              fill={colors.primary}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-sm text-center mt-4 text-gray-600">
        Other sports where top countries in {sport} excel
      </p>
    </div>
  );
}