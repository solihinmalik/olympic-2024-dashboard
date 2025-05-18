const countryNameToISO = {
  "Afghanistan": "AFG",
  "Albania": "ALB",
  "Algeria": "DZA",
  "American Samoa": "ASM",
  "Andorra": "AND",
  "Angola": "AGO",
  "Antigua and Barbuda": "ATG",
  "Argentina": "ARG",
  "Armenia": "ARM",
  "Aruba": "ABW",
  "Australia": "AUS",
  "Austria": "AUT",
  "Azerbaijan": "AZE",
  "Bahamas": "BHS",
  "Bahrain": "BHR",
  "Bangladesh": "BGD",
  "Barbados": "BRB",
  "Belgium": "BEL",
  "Belize": "BLZ",
  "Benin": "BEN",
  "Bermuda": "BMU",
  "Bhutan": "BTN",
  "Bolivia": "BOL",
  "Bosnia & Herzegovina": "BIH",
  "Botswana": "BWA",
  "Brazil": "BRA",
  "Brunei Darussalam": "BRN",
  "Bulgaria": "BGR",
  "Burkina Faso": "BFA",
  "Burundi": "BDI",
  "Cabo Verde": "CPV",
  "Cambodia": "KHM",
  "Cameroon": "CMR",
  "Canada": "CAN",
  "Cayman Islands": "CYM",
  "Central African Republic": "CAF",
  "Chad": "TCD",
  "Chile": "CHL",
  "China": "CHN",
  "Chinese Taipei": "TPE",
  "Colombia": "COL",
  "Comoros": "COM",
  "Congo": "COG",
  "Costa Rica": "CRI",
  "Croatia": "HRV",
  "Cuba": "CUB",
  "Cyprus": "CYP",
  "Czech Republic": "CZE",
  "Democratic Republic of the Congo": "COD",
  "Denmark": "DNK",
  "Djibouti": "DJI",
  "Dominica": "DMA",
  "Dominican Republic": "DOM",
  "DPR Korea": "PRK",
  "Ecuador": "ECU",
  "Egypt": "EGY",
  "El Salvador": "SLV",
  "Equatorial Guinea": "GNQ",
  "Eritrea": "ERI",
  "Estonia": "EST",
  "Eswatini": "SWZ",
  "Ethiopia": "ETH",
  "Fiji": "FJI",
  "Finland": "FIN",
  "France": "FRA",
  "Gabon": "GAB",
  "Gambia": "GMB",
  "Georgia": "GEO",
  "Germany": "DEU",
  "Ghana": "GHA",
  "Great Britain": "GBR",
  "Greece": "GRC",
  "Grenada": "GRD",
  "Guam": "GUM",
  "Guatemala": "GTM",
  "Guinea": "GIN",
  "Guinea-Bissau": "GNB",
  "Guyana": "GUY",
  "Haiti": "HTI",
  "Honduras": "HND",
  "Hong Kong, China": "HKG",
  "Hungary": "HUN",
  "Iceland": "ISL",
  "India": "IND",
  "Indonesia": "IDN",
  "IR Iran": "IRN",
  "Iraq": "IRQ",
  "Ireland": "IRL",
  "Israel": "ISR",
  "Italy": "ITA",
  "Ivory Coast": "CIV",
  "Jamaica": "JAM",
  "Japan": "JPN",
  "Jordan": "JOR",
  "Kazakhstan": "KAZ",
  "Kenya": "KEN",
  "Kiribati": "KIR",
  "Korea": "KOR",
  "Kosovo": "XKX",
  "Kuwait": "KWT",
  "Kyrgyzstan": "KGZ",
  "Lao PDR": "LAO",
  "Latvia": "LVA",
  "Lebanon": "LBN",
  "Lesotho": "LSO",
  "Liberia": "LBR",
  "Libya": "LBY",
  "Liechtenstein": "LIE",
  "Lithuania": "LTU",
  "Luxembourg": "LUX",
  "Madagascar": "MDG",
  "Malawi": "MWI",
  "Malaysia": "MYS",
  "Maldives": "MDV",
  "Mali": "MLI",
  "Malta": "MLT",
  "Marshall Islands": "MHL",
  "Mauritania": "MRT",
  "Mauritius": "MUS",
  "Mexico": "MEX",
  "Micronesia": "FSM",
  "Moldova": "MDA",
  "Monaco": "MCO",
  "Mongolia": "MNG",
  "Montenegro": "MNE",
  "Morocco": "MAR",
  "Mozambique": "MOZ",
  "Myanmar": "MMR",
  "Namibia": "NAM",
  "Nauru": "NRU",
  "Nepal": "NPL",
  "Netherlands": "NLD",
  "New Zealand": "NZL",
  "Nicaragua": "NIC",
  "Niger": "NER",
  "Nigeria": "NGA",
  "North Macedonia": "MKD",
  "Norway": "NOR",
  "Oman": "OMN",
  "Pakistan": "PAK",
  "Palau": "PLW",
  "Palestine": "PSE",
  "Panama": "PAN",
  "Papua New Guinea": "PNG",
  "Paraguay": "PRY",
  "Peru": "PER",
  "Philippines": "PHL",
  "Poland": "POL",
  "Portugal": "PRT",
  "Puerto Rico": "PRI",
  "Qatar": "QAT",
  "Republic of the Congo": "COG",
  "Romania": "ROU",
  "Russian Federation": "RUS",
  "Rwanda": "RWA",
  "Saint Kitts and Nevis": "KNA",
  "Saint Lucia": "LCA",
  "Saint Vincent and the Grenadines": "VCT",
  "Samoa": "WSM",
  "San Marino": "SMR",
  "Sao Tome & Principe": "STP",
  "Saudi Arabia": "SAU",
  "Senegal": "SEN",
  "Serbia": "SRB",
  "Seychelles": "SYC",
  "Sierra Leone": "SLE",
  "Singapore": "SGP",
  "Slovakia": "SVK",
  "Slovenia": "SVN",
  "Solomon Islands": "SLB",
  "Somalia": "SOM",
  "South Africa": "ZAF",
  "South Korea": "KOR",
  "South Sudan": "SSD",
  "Spain": "ESP",
  "Sri Lanka": "LKA",
  "Sudan": "SDN",
  "Suriname": "SUR",
  "Sweden": "SWE",
  "Switzerland": "CHE",
  "Syrian Arab Republic": "SYR",
  "Syria": "SYR",
  "Tajikistan": "TJK",
  "Thailand": "THA",
  "Timor-Leste": "TLS",
  "Togo": "TGO",
  "Tonga": "TON",
  "Trinidad and Tobago": "TTO",
  "Tunisia": "TUN",
  "Türkiye": "TUR",
  "Turkmenistan": "TKM",
  "Tuvalu": "TUV",
  "Uganda": "UGA",
  "Ukraine": "UKR",
  "United Arab Emirates": "ARE",
  "United Kingdom": "GBR",
  "United States": "USA",
  "Uruguay": "URY",
  "Uzbekistan": "UZB",
  "Vanuatu": "VUT",
  "Venezuela": "VEN",
  "Vietnam": "VNM",
  "Virgin Islands, US": "VIR",
  "Yemen": "YEM",
  "Zambia": "ZMB",
  "Zimbabwe": "ZWE",
  "EOR": "ZZE",
  "AIN": "ZZZ"
};

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Athlete Performance Data (Read Medallists and Athletes CSV files)
const medals = [];
const athletes = [];
let medalsLoaded = false;
let athletesLoaded = false;

fs.createReadStream(path.join(__dirname, 'dataset/athletes_clean.csv'))
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
    athletesLoaded = true;
    console.log(`✅ Loaded ${athletes.length} cleaned athlete records`);
  });

fs.createReadStream(path.join(__dirname, 'dataset/medallists_clean.csv'))
  .pipe(csv())
  .on('data', (row) => medals.push(row))
  .on('end', () => {
    medalsLoaded = true;
    console.log(`✅ Loaded ${medals.length} cleaned medallist records`);
  });

// Middleware to check if data is loaded (API Athlete Performance)
app.use((req, res, next) => {
  if (!medalsLoaded || !athletesLoaded) {
    return res.status(503).json({ message: 'Data loading, try again soon' });
  }
  next();
});

// ######################################################Athelete Dashboard Code######################################################


// API Endpoints #1 : Athlete Performance Data
// Modified API to include ALL medallists (1+ medals)
app.get('/api/athletes/top-medallists', (req, res) => {
  const medalByAthlete = {};

  medals.forEach((medal) => {
    const key = medal.name || medal.full_name;
    if (!key) return;

    if (!medalByAthlete[key]) {
      medalByAthlete[key] = {
        name: key,
        medals: [],
        medal_count: 0
      };
    }

    medalByAthlete[key].medals.push({
      type: medal.medal_type || medal.medal,
      event: medal.event || medal.event_name,
      discipline: medal.discipline || medal.sport
    });

    medalByAthlete[key].medal_count++;
  });

  const enriched = Object.values(medalByAthlete)
    .filter((a) => a.medal_count >= 1) // Changed from >= 2 to >= 1
    .map((athlete) => {
      const normalizeName = (name) =>
        name?.toString().toLowerCase().trim() || '';

      const normalizedAthleteName = normalizeName(athlete.name);

      const demo = athletes.find((p) => {
        const nameClean = normalizeName(p.name_clean);
        const fullNameClean = normalizeName(p.full_name_clean);
        return (
          normalizedAthleteName === nameClean ||
          normalizedAthleteName === fullNameClean
        );
      }) || {};

      return {
        ...athlete,
        name_formatted: demo.name_formatted || athlete.name,
        country: demo.country || demo.nationality || 'Unknown',
        gender: demo.gender || '',
        age: demo.age || '',
        sport: demo.sport || demo.discipline || '',
        height: demo.height || '',
        weight: demo.weight || ''
      };
    });

  res.json(enriched);
});


// API Endpoints #2 : Athlete by Country
app.get('/api/athletes/by-country', (req, res) => {
  const results = {};
  fs.createReadStream(path.join(__dirname, 'dataset/athletes_clean.csv'))
    .pipe(csv())
    .on('data', (row) => {
      const name = row.country?.trim();
      const code = countryNameToISO[name];
      if (row.function === 'Athlete' && code) {
        results[code] = (results[code] || 0) + 1;
      }
    })
    .on('end', () => {
      const response = Object.entries(results).map(([code, count]) => ({ code, count }));
      res.json(response);
    });
});

//A API Endpoints #3 : Total Medals by Country
app.get('/api/medals/totals-by-country', (req, res) => {
  const medals = [];

  fs.createReadStream(path.join(__dirname, 'dataset/medals_total.csv'))
    .pipe(csv())
    .on('data', (row) => {
      const code = row.country_code?.trim().toUpperCase();
      const total = parseInt(row.Total || row.total_medals || 0, 10);
      if (code && total) {
        medals.push({
          country_code: code,
          "Gold Medal": parseInt(row["Gold Medal"] || 0, 10),
          "Silver Medal": parseInt(row["Silver Medal"] || 0, 10),
          "Bronze Medal": parseInt(row["Bronze Medal"] || 0, 10),
          Total: total
        });
      }
    })
    .on('end', () => {
      res.json(medals);
    });
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
