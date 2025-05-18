import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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


export default function CountryChart() {
  const [countryData, setCountryData] = useState([]);
  const [medallists, setMedallists] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');

  // Load athletes per country
  useEffect(() => {
    axios.get('http://localhost:5000/api/athletes/by-country')
      .then(res => {
        const sorted = res.data.sort((a, b) => b.count - a.count);
        setCountryData(sorted);
      })
      .catch(err => console.error(err));

    axios.get('http://localhost:5000/api/athletes/top-medallists')
      .then(res => {
        const enriched = res.data.map(m => {
          const iso = countryNameToISO[m.country?.trim()] || null;
          return { ...m, countryCode: iso };
        });
        setMedallists(enriched);
      })
      .catch(err => console.error(err));
  }, []);


  const chartData = {
    labels: countryData.map(c => c.code),
    datasets: [
      {
        label: 'Number of Athletes',
        data: countryData.map(c => c.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'teal',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const country = countryData[context.dataIndex];
            return `${country.code}: ${country.count} athletes`;
          }
        }
      },
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Athletes'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Country Code'
        }
      }
    }
  };

  const getWinRate = (code) => {
    const total = countryData.find(c => c.code === code)?.count || 0;
    const medals = medallists.filter(m => m.countryCode === code).length;
    const rate = total ? medals / total : 0;
    return { total, medals, rate };
  };


  const result = selectedCode ? getWinRate(selectedCode) : null;

  return (
    <div className="flex flex-col mt-6">
      {/* Title */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Olympic 2024: Athletes by Country</h2>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto">
          The bar chart shows how many athletes each country sent to the 2024 Olympic Games. Use the dropdown to explore medal-winning efficiency for individual countries.
        </p>
      </div>

      <div className="flex">
        {/* Bar Chart */}
        <div className="w-2/3 overflow-x-auto pr-4">
          <div style={{ height: '500px', minWidth: '1000px' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Win Rate Analysis */}
        <div className="w-1/3 pl-4">
          <h4 className="text-lg font-semibold mb-3 text-center">Win Rate Analysis</h4>
          <select
            className="p-2 border rounded mb-4 w-full"
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.target.value)}
          >
            <option value="">-- Select Country --</option>
            {countryData.map(c => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>

          {result && (
            <div className="p-4 border rounded bg-gray-50 text-sm">
              <p><strong>Country:</strong> {selectedCode}</p>
              <p><strong>Total Athletes:</strong> {result.total}</p>
              <p><strong>Medallists:</strong> {result.medals}</p>
              <p><strong>Win Rate:</strong> {(result.rate * 100).toFixed(2)}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
