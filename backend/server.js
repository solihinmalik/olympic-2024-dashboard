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

/**
 * Olympic Sports Dashboard API
 * This endpoint provides comprehensive data for the Olympic sports dashboard.
 * It returns either a list of all available sports (if no sport is specified)
 * or detailed data about a specific sport including medal counts, athlete demographics,
 * and related sports analysis.
 */
app.get('/api/sports/dashboard', (req, res) => {
  // Extract the sport parameter from the query string
  const sport = req.query.sport;
  
  /**
     * MODE 1: Return list of all available sports
     * If no specific sport is requested, return a sorted list of all unique sports
     * in the medals dataset.
     */
  if (!sport) {
    // Create a Set to store unique sport names (removes duplicates)
    const sportSet = new Set();
    medals.forEach(medal => {
      if (medal.discipline) {
        sportSet.add(medal.discipline);
      }
    });
    // Convert to array, sort alphabetically, and return
    return res.json({ 
      sports: Array.from(sportSet).sort() 
    });
  }

  /**
   * MODE 2: Return detailed data for a specific sport
   * The response includes four main sections of data:
   * 1. Top countries in the sport
   * 2. World map medal distribution
   * 3. Athlete demographics
   * 4. Cross-sport correlation
   */
  
  /**
   * SECTION 1: Top Countries Analysis
   * Calculate medal counts by country for the requested sport,
   * and identify the top 10 countries by total medals.
   */
  // Filter medals for the requested sport
  const sportMedals = medals.filter(medal => medal.discipline === sport);
  // Object to store medal counts by country
  const countryMedals = {};
  
  // Count medals by type for each country
  sportMedals.forEach(medal => {
    const country = medal.country;
    const medalType = medal.medal_type;
    
    // Skip medals without country data
    if (!country) return;
    
    // Initialize country entry if it doesn't exist
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
    
    // Increment appropriate medal counter
    if (medalType === 'Gold Medal') countryMedals[country].gold++;
    else if (medalType === 'Silver Medal') countryMedals[country].silver++;
    else if (medalType === 'Bronze Medal') countryMedals[country].bronze++;
    
    // Increment total medal count
    countryMedals[country].total++;
  });
  
  // Sort countries by total medals (with gold as tiebreaker) and take top 10
  const topCountries = Object.values(countryMedals)
    .sort((a, b) => b.total - a.total || b.gold - a.gold)
    .slice(0, 10);
  
  // Extract country codes for filtering athlete data
  const topCountryCodes = topCountries.map(c => c.countryCode);
  
  /**
     * SECTION 2: World Map Data
     * Format medal data for all countries for use in a world map visualization.
     */
  const worldMapData = Object.values(countryMedals).map(country => ({
    countryCode: country.countryCode,
    country: country.country,
    gold: country.gold,      
    silver: country.silver,  
    bronze: country.bronze,  
    total: country.total
  }));
  
/**
   * SECTION 3: Athlete Demographics
   * Analyze age and gender distribution of athletes from top countries
   * who compete in the requested sport.
   */
  
  // Helper function to calculate athlete age relative to Olympics date
  const calculateAge = (birthDateString) => {
    if (!birthDateString) return null;
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) return null;
    
    // Calculate age as of August 1, 2024 (approximate Olympics date)
    const olympicDate = new Date(2024, 7, 1);
    let age = olympicDate.getFullYear() - birthDate.getFullYear();
    // Adjust age if birthday hasn't occurred yet in the Olympic year
    if (olympicDate.getMonth() < birthDate.getMonth() || 
        (olympicDate.getMonth() === birthDate.getMonth() && olympicDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  // Helper function to parse disciplines from string format
  const parseAthletesDisciplines = (str) => {
    if (!str) return [];
    try {
      // Remove brackets and split by comma
      return str.replace(/[\[\]']/g, '').split(',').map(d => d.trim());
    } catch (e) {
      return [];
    }
  };
  
  // Filter athletes who compete in the sport and represent top countries
  const sportAthletes = athletes.filter(athlete => {
    const disciplines = parseAthletesDisciplines(athlete.disciplines);
    return disciplines.some(d => d === sport) && 
           topCountryCodes.includes(athlete.country_code);
  });
  
  // Count athletes by gender and age group
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
    
    // Age group count
    const age = calculateAge(athlete.birth_date);
    if (age) {
      if (age < 20) ageGroups["Under 20"]++;
      else if (age < 25) ageGroups["20-24"]++;
      else if (age < 30) ageGroups["25-29"]++;
      else if (age < 35) ageGroups["30-34"]++;
      else ageGroups["35+"]++;
    }
  });
  
  /**
   * SECTION 4: Cross-Sport Correlation
   * Identify other sports where the top countries from this sport also excel.
   * This helps identify patterns of country specialization across sports.
   */
  
  // Use all top 10 countries for a more comprehensive analysis
  const top10CountryCodes = topCountryCodes.slice(0, 10);

  // Count medals won by these countries in other sports
  const sportCounts = {};

  medals.forEach(medal => {
    // Skip the current sport
    if (medal.discipline === sport) return; 
    // Skip medals not won by top countries
    if (!top10CountryCodes.includes(medal.country_code)) return; 
    
    const discipline = medal.discipline;
    
    // Initialize sport count if not exists
    if (!sportCounts[discipline]) {
      sportCounts[discipline] = 0;
    }
    
    // Increment medal count for this sport
    sportCounts[discipline]++;
  });

  // Convert to array, sort by medal count, and take top 5 related sports
  const relatedSports = Object.entries(sportCounts)
    .map(([sport, medals]) => ({ sport, medals }))
    .sort((a, b) => b.medals - a.medals)
    .slice(0, 5);

  /**
   * Return the complete data package as a JSON response
   * This provides all the data needed for the dashboard visualizations.
   */
  res.json({
    sport,                    // The requested sport
    topCountries,             // Top 10 countries by medal count
    worldMapData,             // Medal data for all countries (for map)
    athleteDemographics: {    // Athlete statistics
      total: sportAthletes.length,
      genderDistribution,
      ageGroups
    },
    relatedSports             // Other sports where top countries excel
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
