const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());


// Middleware to parse JSON requests
let athletes = [];
let dataLoaded = false;

// Read CSV
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

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
