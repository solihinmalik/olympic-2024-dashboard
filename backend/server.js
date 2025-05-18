const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Read Medals CSV
const medals = [];

fs.createReadStream(path.join(__dirname, 'dataset/medals.csv'))
  .pipe(csv())
  .on('data', (row) => medals.push(row))
  .on('end', () => {
    console.log(`✅ Loaded ${medals.length} medal records`);
  });


// Middleware to parse JSON requests
let athletes = [];
let dataLoaded = false;

// Read Athlete CSV
fs.createReadStream(path.join(__dirname, 'dataset/athletes.csv'))
  .pipe(csv())
  .on('data', (row) => athletes.push(row))
  .on('end', () => {
    dataLoaded = true;
    console.log(`✅ Loaded ${athletes.length} athletes`);
  });

// Middleware to delay requests until data is ready
app.use((req, res, next) => {
  if (!dataLoaded) {
    return res.status(503).json({ message: 'Data loading, please try again shortly.' });
  }
  next();
});

// Root Route (Athlete Data)
app.get('/', (req, res) => {
  res.send('Welcome to the Olympics 2024 Dashboard API');
});

// Athlete API Route
app.get('/api/athletes', (req, res) => {
  res.json(athletes);
});

// Country API Route (Count by Country)
app.get('/api/athletes/count-by-country', (req, res) => {
  const countryCount = {};

  athletes.forEach(athlete => {
    const country = athlete.country || 'Unknown';
    countryCount[country] = (countryCount[country] || 0) + 1;
  });

  // Sort and return top 10 countries only
  const sorted = Object.entries(countryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({ country, count }));

  res.json(sorted);
});

  // Medals by Country API Route
  app.get('/api/medals/by-country', (req, res) => {
  const medalMap = {};

  medals.forEach(({ country, medal_type }) => {
    if (!country) return;

    if (!medalMap[country]) {
      medalMap[country] = { country, gold: 0, silver: 0, bronze: 0, total: 0 };
    }

    if (medal_type === 'Gold Medal') medalMap[country].gold++;
    else if (medal_type === 'Silver Medal') medalMap[country].silver++;
    else if (medal_type === 'Bronze Medal') medalMap[country].bronze++;

    medalMap[country].total++;
  });

  const result = Object.values(medalMap);
  res.json(result);
});

// ######################################################Sport Dashboard Code######################################################
app.get('/api/sports/dashboard', (req, res) => {
  const sport = req.query.sport;
  
  if (!sport) {
    // If no sport is specified, return the list of available sports
    const sportSet = new Set();
    medals.forEach(medal => {
      if (medal.discipline) {
        sportSet.add(medal.discipline);
      }
    });
    return res.json({ 
      sports: Array.from(sportSet).sort() 
    });
  }
  
  // Process data for the selected sport
  
  // 1. Top 10 countries in this sport
  const sportMedals = medals.filter(medal => medal.discipline === sport);
  const countryMedals = {};
  
  sportMedals.forEach(medal => {
    const country = medal.country;
    const medalType = medal.medal_type;
    
    if (!country) return;
    
    if (!countryMedals[country]) {
      countryMedals[country] = { 
        country, 
        countryCode: medal.country_code, 
        gold: 0, 
        silver: 0, 
        bronze: 0, 
        total: 0 
      };
    }
    
    if (medalType === 'Gold Medal') countryMedals[country].gold++;
    else if (medalType === 'Silver Medal') countryMedals[country].silver++;
    else if (medalType === 'Bronze Medal') countryMedals[country].bronze++;
    
    countryMedals[country].total++;
  });
  
  const topCountries = Object.values(countryMedals)
    .sort((a, b) => b.total - a.total || b.gold - a.gold)
    .slice(0, 10);
  
  // Get the country codes of top 10 countries for filtering
  const topCountryCodes = topCountries.map(c => c.countryCode);
  
    // 2. World map data - CHANGE THIS SECTION
    const worldMapData = Object.values(countryMedals).map(country => ({
      countryCode: country.countryCode,
      country: country.country,
      gold: country.gold,      // Add this - include medal breakdowns
      silver: country.silver,  // Add this
      bronze: country.bronze,  // Add this
      total: country.total
    }));
  
  // 3. Athlete demographics (simplified to age and gender only for top countries)
  // Helper for age calculation
  const calculateAge = (birthDateString) => {
    if (!birthDateString) return null;
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) return null;
    
    const olympicDate = new Date(2024, 7, 1);
    let age = olympicDate.getFullYear() - birthDate.getFullYear();
    if (olympicDate.getMonth() < birthDate.getMonth() || 
        (olympicDate.getMonth() === birthDate.getMonth() && olympicDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  // Helper for disciplines parsing
  const parseAthletesDisciplines = (str) => {
    if (!str) return [];
    try {
      return str.replace(/[\[\]']/g, '').split(',').map(d => d.trim());
    } catch (e) {
      return [];
    }
  };
  
  // Filter athletes by sport and top countries
  const sportAthletes = athletes.filter(athlete => {
    const disciplines = parseAthletesDisciplines(athlete.disciplines);
    return disciplines.some(d => d === sport) && 
           topCountryCodes.includes(athlete.country_code);
  });
  
  //demographics
  const genderDistribution = { Male: 0, Female: 0 };
  const ageGroups = { 
    "Under 20": 0, 
    "20-24": 0, 
    "25-29": 0, 
    "30-34": 0, 
    "35+": 0 
  };
    
  sportAthletes.forEach(athlete => {
    // Gender count
    if (athlete.gender === 'Male') genderDistribution.Male++;
    else if (athlete.gender === 'Female') genderDistribution.Female++;
    
    // Age count with more groups
    const age = calculateAge(athlete.birth_date);
    if (age) {
      if (age < 20) ageGroups["Under 20"]++;
      else if (age < 25) ageGroups["20-24"]++;
      else if (age < 30) ageGroups["25-29"]++;
      else if (age < 35) ageGroups["30-34"]++;
      else ageGroups["35+"]++;
    }
  });
  
// Modify the relatedSports section of your server.js code:

  // 4. Cross-sport correlation
  const top3CountryCodes = topCountryCodes.slice(0, 3);

  // Find medals won by top 3 countries in other sports
  const sportCounts = {};

  medals.forEach(medal => {
    if (medal.discipline === sport) return; // Skip the current sport
    if (!top3CountryCodes.includes(medal.country_code)) return; // Skip countries not in top 3
    
    const discipline = medal.discipline;
    
    // Initialize sport data if not exists
    if (!sportCounts[discipline]) {
      sportCounts[discipline] = 0;
    }
    
    // Add to total medal count
    sportCounts[discipline]++;
  });

  // Convert to array, sort and take top 5
  const relatedSports = Object.entries(sportCounts)
    .map(([sport, medals]) => ({ sport, medals }))
    .sort((a, b) => b.medals - a.medals)
    .slice(0, 5);

  // Send all the data in one response
  res.json({
    sport,
    topCountries,
    worldMapData,
    athleteDemographics: {
      total: sportAthletes.length,
      genderDistribution,
      ageGroups
    },
    relatedSports
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
