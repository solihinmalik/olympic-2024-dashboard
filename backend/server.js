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
// Endpoint to return medals by country
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
  
    // 2. World map data 
    const worldMapData = Object.values(countryMedals).map(country => ({
      countryCode: country.countryCode,
      country: country.country,
      gold: country.gold,      
      silver: country.silver,  
      bronze: country.bronze,  
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

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
