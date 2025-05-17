import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import axios from 'axios';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMapWithMedals = () => {
  const [medalData, setMedalData] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/medals/by-country')
      .then((res) => {
        console.log("✅ Medal data:", res.data);
        setMedalData(res.data);
      })
      .catch((err) => console.error("❌ Medal data fetch failed:", err));
  }, []);

  const getCountryMedals = (countryName) => {
    return medalData.find(
      (entry) => entry.country.toLowerCase() === countryName.toLowerCase()
    );
  };

  return (
    <div className="relative w-full h-full px-4 py-6">
      <h2 className="text-center text-2xl font-semibold mb-4">
        🗺️ Olympic Medals by Country
      </h2>

      <ComposableMap
        projectionConfig={{ scale: 150 }}
        width={980}
        height={500}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties.name; // or NAME depending on geo source
              const countryMedals = getCountryMedals(name) || {};

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHoveredCountry({ name, ...countryMedals })}
                  onMouseLeave={() => setHoveredCountry(null)}
                  style={{
                    default: {
                      fill: countryMedals.total ? '#f59e0b' : '#e5e7eb',
                      stroke: '#fff',
                      outline: 'none'
                    },
                    hover: {
                      fill: '#f97316',
                      stroke: '#fff',
                      outline: 'none'
                    },
                    pressed: {
                      fill: '#ea580c',
                      stroke: '#fff',
                      outline: 'none'
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {hoveredCountry && (
        <div className="absolute top-4 right-4 bg-white border shadow-lg rounded p-4 text-sm z-50 w-64">
          <strong>{hoveredCountry.name}</strong>
          <div>🥇 Gold: {hoveredCountry.gold || 0}</div>
          <div>🥈 Silver: {hoveredCountry.silver || 0}</div>
          <div>🥉 Bronze: {hoveredCountry.bronze || 0}</div>
          <div>Total: {hoveredCountry.total || 0}</div>
        </div>
      )}
    </div>
  );

};

export default WorldMapWithMedals;
