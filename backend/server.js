const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Data stores
const athletes = [];
const medals = [];
const medallists = [];

const dataLoaded = {
  athletes: false,
  medals: false,
  medallists: false
};

const countryNameToISO = require('./countryNameToISO.json');

function loadCSVData(filePath, array, dataKey) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, filePath))
      .on('error', reject)
      .pipe(csv())
      .on('data', (row) => array.push(row))
      .on('end', () => {
        dataLoaded[dataKey] = true;
        console.log(`✅ Loaded ${array.length} ${dataKey} records`);
        resolve();
      })
      .on('error', reject);
  });
}

Promise.all([
  loadCSVData('dataset/athletes_clean.csv', athletes, 'athletes'),
  loadCSVData('dataset/medals.csv', medals, 'medals'),
  loadCSVData('dataset/medallists_clean.csv', medallists, 'medallists')
]).catch((err) => console.error('🚨 Failed to load data:', err));

app.use((req, res, next) => {
  if (!Object.values(dataLoaded).every(Boolean)) {
    return res.status(503).json({ message: '⏳ Data loading...', status: dataLoaded });
  }
  next();
});

// ==========================================================
// 🏅 Medals Dashboard APIs
// ==========================================================

app.get('/api/medals', (req, res) => {
  const medalMap = {};
  const breakdown = {};
  const timeline = {};

  medals.forEach((row) => {
    const { country, discipline, medal_type, medal_date } = row;
    if (!country) return;

    // byCountry
    if (!medalMap[country]) medalMap[country] = { country, gold: 0, silver: 0, bronze: 0, total: 0 };
    if (medal_type === 'Gold Medal') medalMap[country].gold++;
    else if (medal_type === 'Silver Medal') medalMap[country].silver++;
    else if (medal_type === 'Bronze Medal') medalMap[country].bronze++;
    medalMap[country].total++;

    // byDisciplineCountry
    if (discipline) {
      const key = `${country}||${discipline}`;
      if (!breakdown[key]) breakdown[key] = { country, discipline, gold: 0, silver: 0, bronze: 0, total: 0 };
      if (medal_type === 'Gold Medal') breakdown[key].gold++;
      else if (medal_type === 'Silver Medal') breakdown[key].silver++;
      else if (medal_type === 'Bronze Medal') breakdown[key].bronze++;
      breakdown[key].total++;
    }

    // timeline
    if (discipline && medal_date && medal_type) {
      if (!timeline[country]) timeline[country] = {};
      if (!timeline[country][discipline]) timeline[country][discipline] = {};
      if (!timeline[country][discipline][medal_date])
        timeline[country][discipline][medal_date] = { gold: 0, silver: 0, bronze: 0 };
      if (medal_type === 'Gold Medal') timeline[country][discipline][medal_date].gold++;
      else if (medal_type === 'Silver Medal') timeline[country][discipline][medal_date].silver++;
      else if (medal_type === 'Bronze Medal') timeline[country][discipline][medal_date].bronze++;
    }
  });

  const processedTimeline = {};
  Object.entries(timeline).forEach(([country, discObj]) => {
    processedTimeline[country] = {};
    Object.entries(discObj).forEach(([disc, dateCounts]) => {
      const dates = Object.keys(dateCounts).sort();
      let cg = 0, cs = 0, cb = 0;
      processedTimeline[country][disc] = dates.map(date => {
        cg += dateCounts[date].gold;
        cs += dateCounts[date].silver;
        cb += dateCounts[date].bronze;
        return { date, cumulative: cg + cs + cb, gold: cg, silver: cs, bronze: cb, discipline: disc };
      });
    });
  });

  const timelineByMedalType = {};
  Object.entries(timeline).forEach(([country, discObj]) => {
    const allDatesSet = new Set();
    Object.values(discObj).forEach(dates => Object.keys(dates).forEach(d => allDatesSet.add(d)));
    const allDates = Array.from(allDatesSet).sort();
    let cg = 0, cs = 0, cb = 0;
    timelineByMedalType[country] = allDates.map(date => {
      let g = 0, s = 0, b = 0;
      Object.values(discObj).forEach(dates => {
        if (dates[date]) {
          g += dates[date].gold; s += dates[date].silver; b += dates[date].bronze;
        }
      });
      cg += g; cs += s; cb += b;
      return { date, gold: cg, silver: cs, bronze: cb, total: cg + cs + cb };
    });
  });

  res.json({
    byCountry: Object.values(medalMap),
    byDisciplineCountry: Object.values(breakdown),
    timeline: processedTimeline,
    timelineByMedalType,
    medals
  });
});

app.get('/api/medals/totals-by-country', (req, res) => {
  const result = [];

  fs.createReadStream(path.join(__dirname, 'dataset/medals_total.csv'))
    .pipe(csv())
    .on('data', (row) => {
      const code = row.country_code?.trim().toUpperCase();
      const total = parseInt(row.Total || row.total_medals || 0, 10);

      if (code && total) {
        result.push({
          country_code: code,
          "Gold Medal": parseInt(row["Gold Medal"] || 0, 10),
          "Silver Medal": parseInt(row["Silver Medal"] || 0, 10),
          "Bronze Medal": parseInt(row["Bronze Medal"] || 0, 10),
          Total: total
        });
      }
    })
    .on('end', () => {
      res.json(result);
    });
});

// ==========================================================
// 🥇 Athletes Dashboard APIs
// ==========================================================

// GET /api/athletes
app.get('/api/athletes', (req, res) => {
  res.json(athletes);
});

// GET /api/athletes/top-medallists?min=2
app.get('/api/athletes/top-medallists', (req, res) => {
  const min = parseInt(req.query.min || 2, 10);
  const medalByAthlete = {};

  medallists.forEach((entry) => {
    const key = entry.name || entry.full_name;
    if (!key) return;
    if (!medalByAthlete[key]) medalByAthlete[key] = { name: key, medals: [], medal_count: 0 };
    medalByAthlete[key].medals.push({
      type: entry.medal_type || entry.medal,
      event: entry.event || entry.event_name,
      discipline: entry.discipline || entry.sport
    });
    medalByAthlete[key].medal_count++;
  });

  const normalize = (str) => str?.toString().toLowerCase().trim();
  const enriched = Object.values(medalByAthlete)
    .filter((a) => a.medal_count >= min)
    .map((athlete) => {
      const match = athletes.find((a) =>
        normalize(a.name_clean) === normalize(athlete.name) ||
        normalize(a.full_name_clean) === normalize(athlete.name)
      ) || {};
      return { ...athlete, ...match };
    });

  res.json(enriched);
});

// GET /api/athletes/medallists
app.get('/api/athletes/medallists', (req, res) => {
  const medalByAthlete = {};

  medallists.forEach((entry) => {
    const key = entry.name || entry.full_name;
    if (!key) return;
    if (!medalByAthlete[key]) medalByAthlete[key] = { name: key, medals: [], medal_count: 0 };
    medalByAthlete[key].medals.push({
      type: entry.medal_type || entry.medal,
      event: entry.event || entry.event_name,
      discipline: entry.discipline || entry.sport
    });
    medalByAthlete[key].medal_count++;
  });

  const normalize = (str) => str?.toString().toLowerCase().trim();
  const enriched = Object.values(medalByAthlete).map((athlete) => {
    const match = athletes.find((a) =>
      normalize(a.name_clean) === normalize(athlete.name) ||
      normalize(a.full_name_clean) === normalize(athlete.name)
    ) || {};
    return { ...athlete, ...match };
  });

  res.json(enriched);
});

// // First implementation of /api/athletes/by-country
// app.get('/api/athletes/by-country', (req, res) => {
//   const results = {};
//   let rowCount = 0;

//   fs.createReadStream(path.join(__dirname, 'dataset/athletes_clean.csv'))
//     .pipe(csv())
//     .on('data', (row) => {
//       rowCount++;
//       const name = row.country?.trim();
//       const code = countryNameToISO[name];
//       if (row.function === 'Athlete' && code) {
//         results[code] = (results[code] || 0) + 1;
//       }
//     })
//     .on('end', () => {
//       console.log(`🔍 Parsed ${rowCount} rows from athletes_clean.csv`);
//       console.log('✅ Top 10 countries:', Object.entries(results).slice(0, 10));
//       const response = Object.entries(results).map(([code, count]) => ({ code, count }));
//       res.json(response);
//     })
//     .on('error', (err) => {
//       console.error('❌ Error reading athletes_clean.csv:', err);
//       res.status(500).json({ error: 'Failed to process CSV' });
//     });
// });

// // Second implementation of /api/athletes/by-country
// app.get('/api/athletes/by-country', (req, res) => {
//   const results = {};
//   fs.createReadStream(path.join(__dirname, 'dataset/athletes_clean.csv'))
//     .pipe(csv())
//     .on('data', (row) => {
//       const name = row.country?.trim();
//       const code = countryNameToISO[name];
//       if (row.function === 'Athlete' && code) {
//         results[code] = (results[code] || 0) + 1;
//       }
//     })
//     .on('end', () => {
//       const response = Object.entries(results).map(([code, count]) => ({ code, count }));
//       res.json(response);
//     });
// });

// Third implementation of /api/athletes/by-country
app.get('/api/athletes/by-country', (req, res) => {
  const results = {};
  athletes.forEach((athlete) => {
    if (athlete.function === 'Athlete') {
      const code = countryNameToISO[athlete.country?.trim()];
      if (code) results[code] = (results[code] || 0) + 1;
    }
  });
  res.json(Object.entries(results).map(([code, count]) => ({ code, count })));
});

// ==========================================================
// 🎯 Sports Dashboard APIs
// ==========================================================

app.get('/api/sports/dashboard', (req, res) => {
  // Extract the sport parameter from the query string
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
  
  // 2. World map data 
  const worldMapData = Object.values(countryMedals).map(country => ({
    countryCode: country.countryCode,
    country: country.country,
    gold: country.gold,      
    silver: country.silver,  
    bronze: country.bronze,  
    total: country.total
  }));
  
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
  
  // 4. Cross-sport correlation
  const top10CountryCodes = topCountryCodes.slice(0, 10);

  // Find medals won by top 10 countries in other sports
  const sportCounts = {};

  medals.forEach(medal => {
    if (medal.discipline === sport) return; // Skip the current sport
    if (!top10CountryCodes.includes(medal.country_code)) return; 
    
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

// ==========================================================
// Server Startup
// ==========================================================

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Olympics 2024 Dashboard API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});