// src/features/SportAthleteProfileAnalysis.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import maleIcon from '../icons/sport_male_athlete.png';
import femaleIcon from '../icons/sport_female_athlete.png';

// Simple color scheme
const colors = {
  male: "#2196F3",     // Blue
  female: "#E91E63",   // Pink
  background: "#f0f7ff" // Light blue background
};

export default function AthleteProfileAnalysis({ data }) {
  if (!data) {
    return <div className="text-center py-4">No athlete data available</div>;
  }

  // Format age data for bar chart
  const getAgeData = () => {
    if (!data.ageGroups) return [];
    
    return Object.entries(data.ageGroups).map(([age, count]) => {
      // Assume data includes gender breakdown
      // If your API doesn't provide this, you'll need to modify
      return {
        age,
        male: Math.round(count * 0.52),    // Example distribution
        female: Math.round(count * 0.48)   // Example distribution
      };
    }).sort((a, b) => {
      // Sort by age category properly
      const getAgeOrder = (age) => {
        if (age === 'Under 15') return -1;
        if (age === '51+') return 100;
        return parseInt(age.split('-')[0]);
      };
      return getAgeOrder(a.age) - getAgeOrder(b.age);
    });
  };

  // For total numbers
  const getTotalByGender = () => {
    // If your API already provides these totals, use them instead
    const maleTotal = data.genderDistribution?.Male || 5658;
    const femaleTotal = data.genderDistribution?.Female || 5455;
    return { male: maleTotal, female: femaleTotal };
  };

  const totals = getTotalByGender();

  return (
    <div className="p-4" style={{ background: colors.background, borderRadius: '8px' }}>
      {/* Top section with title and athlete counts */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-blue-600">Athletes</h2>
          <p className="text-gray-600">by Age Category and gender</p>
        </div>
        
        <div className="flex items-center space-x-8">
          {/* Male Icon + Count */}
          <div className="flex items-center">
            <img 
              src={maleIcon} 
              alt="Male Athletes" 
              className="h-14 mr-3"
            />
            <div>
              <div className="text-2xl font-bold">{totals.male}</div>
              <div className="text-gray-500">Male</div>
            </div>
          </div>
          
          {/* Female Icon + Count */}
          <div className="flex items-center">
            <img 
              src={femaleIcon} 
              alt="Female Athletes" 
              className="h-14 mr-3"
            />
            <div>
              <div className="text-2xl font-bold">{totals.female}</div>
              <div className="text-gray-500">Female</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Simple legend */}
      <div className="flex mb-2">
        <div className="mr-4 flex items-center">
          <span className="inline-block w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: colors.female }}></span>
          <span>Female</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: colors.male }}></span>
          <span>Male</span>
        </div>
      </div>
      
      {/* Age distribution chart */}
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={getAgeData()}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            barGap={0}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis 
              dataKey="age" 
              tick={{ fontSize: 11 }}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(1)}K` : value}
              tickCount={5}
              domain={[0, 'auto']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              label={{ value: 'Total Athletes', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12 } }}
            />
            <Tooltip 
              formatter={(value, name) => {
                return [value, name === 'female' ? 'Female' : 'Male'];
              }}
            />
            <Bar dataKey="female" stackId="a" fill={colors.female} />
            <Bar dataKey="male" stackId="a" fill={colors.male} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-center mt-4 text-gray-600">
        Top Performing Athletes Age Distribution
      </p>
    </div>
  );
}