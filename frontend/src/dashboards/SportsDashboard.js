// src/dashboards/SportsDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopCountriesChart from '../features/SportTopCountries';
import WorldMapMedalDistribution from '../features/SportMapMedalDistribution';
import AthleteProfileAnalysis from '../features/SportAthleteProfileAnalysis';
import CrossSportCorrelation from '../features/SportCrossCorrelation';

export default function SportsDashboard() {
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch list of sports on initial load
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sports/dashboard');
        setSports(response.data.sports);
        
        // Change this part to set Badminton as the default
        if (response.data.sports.includes('Badminton')) {
          setSelectedSport('Badminton');
        } else if (response.data.sports.length > 0) {
          // Fallback to first sport if Badminton is not available
          setSelectedSport(response.data.sports[0]);
        }
      } catch (err) {
        console.error('Error fetching sports:', err);
        setError('Failed to load sports list');
      }
    };
    
    fetchSports();
  }, []);

  // Fetch data when sport changes
  useEffect(() => {
    if (!selectedSport) return;
    
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/sports/dashboard?sport=${selectedSport}`);
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sport data:', err);
        setError('Failed to load sport data');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [selectedSport]);

  const handleSportChange = (e) => {
    setSelectedSport(e.target.value);
  };

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Olympic Sports Analysis</h1>
        
        <div className="flex items-center">
          <label htmlFor="sport-select" className="mr-2">Select Sport:</label>
          <select 
            id="sport-select"
            value={selectedSport}
            onChange={handleSportChange}
            className="p-2 border rounded"
            disabled={loading || sports.length === 0}
          >
            {sports.map(sport => (
              <option key={sport} value={sport}>{sport}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading sport data...</div>
      ) : dashboardData ? (
        <>
          {/* First row of visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Countries Chart */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Top Countries in {selectedSport}</h2>
              <TopCountriesChart data={dashboardData.topCountries} />
            </div>

            {/* World Map Visualization */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Global Excellence in {selectedSport}</h2>
              <WorldMapMedalDistribution data={dashboardData.worldMapData} />
            </div>
          </div>

          {/* Second row of visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Athlete Demographics */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Athlete Profiles in {selectedSport}</h2>
              <AthleteProfileAnalysis data={dashboardData.athleteDemographics} />
            </div>

            {/* Cross-Sport Correlation */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Sports Related to {selectedSport}</h2>
              <CrossSportCorrelation 
                data={dashboardData.relatedSports} 
                sport={selectedSport} 
              />
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10">Select a sport to view analysis</div>
      )}
    </div>
  );
}