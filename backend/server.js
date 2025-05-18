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

// Read Medallists CSV
let medallists = [];
let medallistsLoaded = false;

fs.createReadStream(path.join(__dirname, 'dataset/medallists.csv'))
  .pipe(csv())
  .on('data', (row) => medallists.push(row))
  .on('end', () => {
    medallistsLoaded = true;
    console.log(`✅ Loaded ${medallists.length} medallist records`);
  });

// Update middleware to check for medallists data
app.use((req, res, next) => {
  if (!dataLoaded || !medallistsLoaded) {
    return res.status(503).json({ message: 'Data loading, please try again shortly.' });
  }
  next();
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

// ====================================================================================================================
// MEDAL TRACKER DASHBOARD  
// Medal Data API Route
app.get('/api/medals', (req, res) => {
  // 1. By Country aggregation
  const medalMap = {};
  // 2. By Discipline-Country aggregation
  const breakdown = {};
  // 3. Timeline data
  const timeline = {};

  medals.forEach((row) => {
    const { country, discipline, medal_type, medal_date } = row;
    if (!country) return;

    // 1. By Country aggregation
    if (!medalMap[country]) {
      medalMap[country] = { country, gold: 0, silver: 0, bronze: 0, total: 0 };
    }
    if (medal_type === 'Gold Medal') medalMap[country].gold++;
    else if (medal_type === 'Silver Medal') medalMap[country].silver++;
    else if (medal_type === 'Bronze Medal') medalMap[country].bronze++;
    medalMap[country].total++;

    // 2. By Discipline-Country aggregation
    if (discipline) {
      const key = `${country}||${discipline}`;
      if (!breakdown[key]) {
        breakdown[key] = { country, discipline, gold: 0, silver: 0, bronze: 0, total: 0 };
      }
      if (medal_type === 'Gold Medal') breakdown[key].gold++;
      else if (medal_type === 'Silver Medal') breakdown[key].silver++;
      else if (medal_type === 'Bronze Medal') breakdown[key].bronze++;
      breakdown[key].total++;
    }

    // 3. Timeline data (by country, discipline, date, and medal type)
    if (discipline && medal_date && medal_type) {
      if (!timeline[country]) timeline[country] = {};
      if (!timeline[country][discipline]) timeline[country][discipline] = {};
      if (!timeline[country][discipline][medal_date]) {
        timeline[country][discipline][medal_date] = { gold: 0, silver: 0, bronze: 0 };
      }
      if (medal_type === 'Gold Medal') timeline[country][discipline][medal_date].gold++;
      else if (medal_type === 'Silver Medal') timeline[country][discipline][medal_date].silver++;
      else if (medal_type === 'Bronze Medal') timeline[country][discipline][medal_date].bronze++;
    }
  });

  // Process timeline data into cumulative format
  const processedTimeline = {};
  Object.entries(timeline).forEach(([country, disciplineObj]) => {
    processedTimeline[country] = {};
    Object.entries(disciplineObj).forEach(([discipline, dateCounts]) => {
      const dates = Object.keys(dateCounts).sort();
      let cumulativeGold = 0, cumulativeSilver = 0, cumulativeBronze = 0;
      processedTimeline[country][discipline] = dates.map(date => {
        cumulativeGold += dateCounts[date].gold;
        cumulativeSilver += dateCounts[date].silver;
        cumulativeBronze += dateCounts[date].bronze;
        return {
          date,
          cumulative: cumulativeGold + cumulativeSilver + cumulativeBronze,
          gold: cumulativeGold,
          silver: cumulativeSilver,
          bronze: cumulativeBronze,
          discipline
        };
      });
    });
  });

  // Build timelineByMedalType: cumulative by date, summed across all disciplines (no discipline split)
  const timelineByMedalType = {};
  Object.entries(timeline).forEach(([country, disciplineObj]) => {
    // Gather all unique dates for this country
    const allDatesSet = new Set();
    Object.values(disciplineObj).forEach(dateCounts => {
      Object.keys(dateCounts).forEach(date => allDatesSet.add(date));
    });
    const allDates = Array.from(allDatesSet).sort();

    let cumulativeGold = 0, cumulativeSilver = 0, cumulativeBronze = 0;
    timelineByMedalType[country] = allDates.map(date => {
      let goldThisDate = 0, silverThisDate = 0, bronzeThisDate = 0;
      Object.values(disciplineObj).forEach(dateCounts => {
        if (dateCounts[date]) {
          goldThisDate += dateCounts[date].gold;
          silverThisDate += dateCounts[date].silver;
          bronzeThisDate += dateCounts[date].bronze;
        }
      });
      cumulativeGold += goldThisDate;
      cumulativeSilver += silverThisDate;
      cumulativeBronze += bronzeThisDate;
      return {
        date,
        gold: cumulativeGold,
        silver: cumulativeSilver,
        bronze: cumulativeBronze,
        total: cumulativeGold + cumulativeSilver + cumulativeBronze
      };
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

// MEDAL LISTS API ROUTE
app.get('/api/medallists', (req, res) => {
  res.json(medallists);
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
