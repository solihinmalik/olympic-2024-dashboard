// src/features/SportMapMedalDistribution.js
import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

// Use the same URL as in your working WorldMapMedals.js
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function SportWorldMap({ data }) {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  if (!data || data.length === 0) {
    return <div className="text-center py-4">No medal data available for this sport</div>;
  }

  // Create a lookup map for faster access
  const countryLookup = {};
  data.forEach(item => {
    if (item.country) {
      countryLookup[item.country.toLowerCase()] = item;
      // Also add by code for alternative lookup
      if (item.countryCode) {
        countryLookup[item.countryCode.toLowerCase()] = item;
      }
    }
  });

  // Logger for debugging
  console.log("World map data:", data);
  console.log("Country lookup:", countryLookup);

  return (
    <div className="p-4" style={{ background: "#f0f7ff", borderRadius: '8px' }}>
      {/* Top section with title */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-600">Global Distribution</h2>
        <p className="text-gray-600">Medal achievements worldwide</p>
      </div>

      <div className="h-[400px] relative">
        <ComposableMap
          projectionConfig={{ 
            scale: 150,  // Increased scale for better fit in larger height
            center: [0, 15]  // Adjusted center point to better position the map vertically
          }}
          width={800}
          height={400}  // Match the new height
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.name;
                const iso = geo.properties.iso_a3 || geo.properties.iso_a2;
                
                // Try to find country by name or ISO code
                const countryData = 
                  countryLookup[name?.toLowerCase()] || 
                  countryLookup[iso?.toLowerCase()] ||
                  {};
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      // Log to debug
                      console.log("Hovered:", name, iso, countryData);
                      setHoveredCountry({ 
                        name, 
                        ...countryData
                      });
                    }}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{
                      default: {
                        fill: countryData.total ? '#2196F3' : '#e5e7eb', // Changed to match the blue theme
                        stroke: '#fff',
                        strokeWidth: 0.5,
                        outline: 'none'
                      },
                      hover: {
                        fill: '#1976D2', // Darker blue on hover
                        stroke: '#fff',
                        strokeWidth: 0.5,
                        outline: 'none'
                      },
                      pressed: {
                        fill: '#0D47A1', // Even darker blue when pressed
                        stroke: '#fff',
                        strokeWidth: 0.5,
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
          <div className="absolute top-2 right-2 bg-white p-3 border rounded-md shadow-lg text-sm">
            <strong>{hoveredCountry.country || hoveredCountry.name}</strong>
            <div className="mt-1">
              {hoveredCountry.gold > 0 && <div>🥇 Gold: {hoveredCountry.gold}</div>}
              {hoveredCountry.silver > 0 && <div>🥈 Silver: {hoveredCountry.silver}</div>}
              {hoveredCountry.bronze > 0 && <div>🥉 Bronze: {hoveredCountry.bronze}</div>}
              <div className="font-semibold mt-1">Total: {hoveredCountry.total || 0}</div>
            </div>
          </div>
        )}
      </div>
      
      <p className="text-sm text-center mt-4 text-gray-600">
        Hover over countries to see medal details
      </p>
    </div>
  );
}