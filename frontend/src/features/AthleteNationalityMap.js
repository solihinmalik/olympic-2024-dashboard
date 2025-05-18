import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import axios from 'axios';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMapWithAthletes = () => {
  const [athleteData, setAthleteData] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/athletes/by-country')
      .then((res) => {
        console.log("✅ Athlete data:", res.data);
        setAthleteData(res.data);
      })
      .catch((err) => {
        console.error("❌ Athlete data fetch failed:", err);
        setError("Failed to load athlete data");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-6">Loading athlete data...</div>;
  if (error) return <div className="text-center py-6 text-red-500">{error}</div>;

  const getCountryInfo = (iso3) =>
    athleteData.find(entry => entry.code === iso3);

  return (
    <div className="relative w-full h-full px-4 py-6">
      <h2 className="text-center text-2xl font-semibold mb-4">
        🧍 Athlete Representation by Country
      </h2>

      <ComposableMap
        projectionConfig={{ scale: 150 }}
        width={980}
        height={500}
        style={{ width: "100%", height: "auto" }}
      >
        <ZoomableGroup zoom={1} center={[0, 20]}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const iso3 = geo.properties.ISO_A3;
                const name = geo.properties.NAME;
                const countryInfo = getCountryInfo(iso3) || {};
                const count = parseInt(countryInfo.count) || 0;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() =>
                      setHoveredCountry({ name, count })
                    }
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{
                      default: {
                        fill: count > 0 ? '#2563eb' : '#e5e7eb',
                        stroke: '#fff',
                        outline: 'none'
                      },
                      hover: {
                        fill: '#1d4ed8',
                        stroke: '#fff',
                        outline: 'none'
                      },
                      pressed: {
                        fill: '#1e40af',
                        stroke: '#fff',
                        outline: 'none'
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {hoveredCountry && (
        <div className="absolute top-4 right-4 bg-white border shadow-lg rounded p-4 text-sm z-50 w-64">
          <strong>{hoveredCountry.name}</strong>
          <div>👥 Athletes: {hoveredCountry.count}</div>
        </div>
      )}
    </div>
  );
};

export default WorldMapWithAthletes;
