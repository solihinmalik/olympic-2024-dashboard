// src/features/AthleteGenderAgeChart.js
import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { User, UserRound } from 'lucide-react';

export default function AthleteGenderAgeChart() {
    const [data, setData] = useState([]);
    const [totals, setTotals] = useState({ Male: 0, Female: 0 });

    useEffect(() => {
        fetch('/api/athletes/top-medallists')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(athletes => {
                console.log("✅ Fetched Data:", athletes);
                const buckets = {
                    'Under 15': { ageGroup: 'Under 15', Male: 0, Female: 0 },
                    '15-20': { ageGroup: '15-20', Male: 0, Female: 0 },
                    '21-25': { ageGroup: '21-25', Male: 0, Female: 0 },
                    '26-30': { ageGroup: '26-30', Male: 0, Female: 0 },
                    '31-35': { ageGroup: '31-35', Male: 0, Female: 0 },
                    '36-40': { ageGroup: '36-40', Male: 0, Female: 0 },
                    '41-45': { ageGroup: '41-45', Male: 0, Female: 0 },
                    '46-50': { ageGroup: '46-50', Male: 0, Female: 0 },
                    '51+': { ageGroup: '51+', Male: 0, Female: 0 }
                };

                let maleCount = 0;
                let femaleCount = 0;

                athletes.forEach(({ age, gender }) => {
                    const numAge = parseInt(age);
                    if (!gender || isNaN(numAge)) return;

                    let group = '51+';
                    if (numAge < 15) group = 'Under 15';
                    else if (numAge <= 20) group = '15-20';
                    else if (numAge <= 25) group = '21-25';
                    else if (numAge <= 30) group = '26-30';
                    else if (numAge <= 35) group = '31-35';
                    else if (numAge <= 40) group = '36-40';
                    else if (numAge <= 45) group = '41-45';
                    else if (numAge <= 50) group = '46-50';

                    const g = gender?.toLowerCase().trim();
                    if (g === 'm' || g === 'male') {
                        buckets[group].Male++;
                        maleCount++;
                    } else if (g === 'f' || g === 'female') {
                        buckets[group].Female++;
                        femaleCount++;
                    }

                });

                setData(Object.values(buckets));
                setTotals({ Male: maleCount, Female: femaleCount });
            });
    }, []);

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Top Performing Olympic Athletes by Age and Gender
                </h2>
                <p className="mt-1 text-sm text-gray-600 max-w-3xl">
                    This chart displays the age and gender distribution of elite Olympic athletes who have achieved outstanding success by winning <span className="font-medium">two or more medals</span>. It reveals which age groups dominate high performance and highlights gender representation across these peak athletic years.
                </p>
                <div className="mt-2 text-xs text-blue-600 italic">
                    Note: Includes only athletes with 2+ medals.
                </div>

                {/* Legend and totals */}
                <div className="flex justify-between items-center mt-6">
                    <div className="flex space-x-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span> Male
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500"></span> Female
                        </div>
                    </div>

                    <div className="flex gap-6 items-center">
                        <div className="text-center">
                            <User className="w-8 h-8 text-blue-500 mx-auto" />
                            <div className="font-semibold text-gray-800">{totals.Male}</div>
                            <div className="text-xs text-gray-500">Male</div>
                        </div>
                        <div className="text-center">
                            <UserRound className="w-8 h-8 text-red-500 mx-auto" />
                            <div className="font-semibold text-gray-800">{totals.Female}</div>
                            <div className="text-xs text-gray-500">Female</div>
                        </div>
                    </div>
                </div>
            </div>


            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ageGroup" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Male" stackId="a" fill="#4285F4" />
                    <Bar dataKey="Female" stackId="a" fill="#DB4437" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
