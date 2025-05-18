// src/components/SummaryCards.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SummaryCard = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
      <div className="text-gray-400">
        {icon}
      </div>
    </div>
  </div>
);

export default function SummaryCards({ selectedCountry }) {
  const [stats, setStats] = useState({
    totalCountries: 0,
    totalDisciplines: 0,
    totalMedallists: 0,
    totalAthletes: 0,
    totalEvents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medalsRes, medallistsRes, athletesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/medals'),
          axios.get('http://localhost:5000/api/athletes/medallists'),
          axios.get('http://localhost:5000/api/athletes')
        ]);

        let medalsData = medalsRes.data;
        let medallistsData = medallistsRes.data;
        let athletesData = athletesRes.data;

        // Filter by country if selected
        if (selectedCountry) {
          // Filter medals
          const filteredByCountry = medalsData.byCountry.filter(d => d.country === selectedCountry);
          const filteredByDisciplineCountry = medalsData.byDisciplineCountry.filter(d => d.country === selectedCountry);

          medalsData = {
            ...medalsData,
            byCountry: filteredByCountry,
            byDisciplineCountry: filteredByDisciplineCountry
          };

          // Filter medallists
          medallistsData = medallistsData.filter(d => d.country === selectedCountry);

          // Filter athletes
          athletesData = athletesData.filter(d => d.country === selectedCountry);
        }

        // Calculate statistics
        const uniqueCountries = new Set(medalsData.byCountry.map(d => d.country)).size;
        const uniqueDisciplines = new Set(medalsData.byDisciplineCountry.map(d => d.discipline)).size;
        const totalMedallists = medallistsData.length;
        const totalAthletes = athletesData.length;
        // Calculate unique events from medallistsData
        // const uniqueEvents = new Set(medallistsData.map(d => d.event).filter(Boolean));
        const uniqueEvents = new Set(medalsData.medals.map(d => d.event).filter(Boolean));
        const totalEvents = uniqueEvents.size;

        setStats({
          totalCountries: uniqueCountries,
          totalDisciplines: uniqueDisciplines,
          totalMedallists,
          totalAthletes,
          totalEvents
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching summary data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCountry]);

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
      <SummaryCard
        title="Total Countries"
        value={stats.totalCountries}
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <SummaryCard
        title="Total Disciplines"
        value={stats.totalDisciplines}
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        }
      />
      <SummaryCard
        title="Total Events"
        value={stats.totalEvents}
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        }
      />
      <SummaryCard
        title="Total Medallists"
        value={stats.totalMedallists}
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        }
      />
      <SummaryCard
        title="Total Athletes"
        value={stats.totalAthletes}
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />
    </div>
  );
}
