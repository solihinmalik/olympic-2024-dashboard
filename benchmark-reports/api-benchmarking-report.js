const autocannon = require('autocannon');
const fs = require('fs');

// Basic list of API endpoints to test (one per category)
const endpoints = [
  // Server Health
  { url: 'http://localhost:5000/', title: 'API Home', category: 'Server' },
  
  // Medals APIs
  { url: 'http://localhost:5000/api/medals', title: 'Medals Data', category: 'Medals' },
  { url: 'http://localhost:5000/api/medals/totals-by-country', title: 'Medal Totals by Country', category: 'Medals' },
  
  // Athletes APIs
  { url: 'http://localhost:5000/api/athletes', title: 'All Athletes', category: 'Athletes' },
  { url: 'http://localhost:5000/api/athletes/by-country', title: 'Athletes by Country', category: 'Athletes' },
  { url: 'http://localhost:5000/api/athletes/top-medallists?min=2', title: 'Top Medallists', category: 'Athletes' },
  { url: 'http://localhost:5000/api/athletes/medallists', title: 'All Medallists', category: 'Athletes' },
  
  // Sports API
  { url: 'http://localhost:5000/api/sports/dashboard', title: 'Sports List', category: 'Sports' },
  { url: 'http://localhost:5000/api/sports/dashboard?sport=Badminton', title: 'Sport Details (Badminton)', category: 'Sports' }
];

// Test configurations
const testConfigs = [
  { connections: 1, duration: 3, name: 'Single User' },
  { connections: 10, duration: 3, name: '10 Users' },
  { connections: 50, duration: 3, name: '50 Users' }
];

// Helper function to safely format numbers
function formatNumber(num, decimals = 2) {
  if (num === undefined || num === null) return 'N/A';
  return Number(num).toFixed(decimals);
}

async function runTest(endpoint, config) {
  console.log(`Testing ${endpoint.title} with ${config.name} configuration...`);
  
  try {
    return await autocannon({
      url: endpoint.url,
      connections: config.connections,
      duration: config.duration,
      headers: { 'Accept': 'application/json' }
    });
  } catch (error) {
    console.error(`Error testing ${endpoint.title}: ${error.message}`);
    return {
      requests: { average: 0 },
      latency: { average: 0 }
    };
  }
}

async function generateReport() {
  console.log('Starting API benchmark...\n');
  
  const results = [];
  const startTime = Date.now();
  
  for (const endpoint of endpoints) {
    for (const config of testConfigs) {
      try {
        const result = await runTest(endpoint, config);
        
        results.push({
          endpoint: endpoint.title,
          category: endpoint.category,
          load: config.name,
          requestsPerSec: result.requests?.average || 0,
          responseTime: result.latency?.average || 0
        });
      } catch (error) {
        console.error(`Failed to test ${endpoint.title}: ${error.message}`);
      }
    }
  }
  
  const totalDuration = (Date.now() - startTime) / 1000;
  console.log(`\nBenchmark completed in ${totalDuration.toFixed(1)} seconds`);
  
  // Generate a simple HTML report
  const htmlReport = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Olympic API Benchmarking Report</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      h1 { color: #0081C8; }
      h2 { color: #00A651; margin-top: 20px; }
      table { border-collapse: collapse; width: 100%; margin: 15px 0; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
      tr:nth-child(even) { background-color: #f9f9f9; }
      .summary { margin-top: 20px; font-weight: bold; }
    </style>
  </head>
  <body>
    <h1>Olympic Dashboard API Benchmarking Report</h1>
    <p>Generated on: ${new Date().toLocaleString()}</p>
    
    <h2>Response Times by Load</h2>
    <table>
      <tr>
        <th>Endpoint</th>
        <th>Category</th>
        <th>Single User (ms)</th>
        <th>10 Users (ms)</th>
        <th>50 Users (ms)</th>
      </tr>
      ${endpoints.map(endpoint => {
        const endpointResults = results.filter(r => r.endpoint === endpoint.title);
        const singleUserResult = endpointResults.find(r => r.load === 'Single User');
        const tenUsersResult = endpointResults.find(r => r.load === '10 Users');
        const fiftyUsersResult = endpointResults.find(r => r.load === '50 Users');
        
        return `
          <tr>
            <td>${endpoint.title}</td>
            <td>${endpoint.category}</td>
            <td>${formatNumber(singleUserResult?.responseTime)}</td>
            <td>${formatNumber(tenUsersResult?.responseTime)}</td>
            <td>${formatNumber(fiftyUsersResult?.responseTime)}</td>
          </tr>
        `;
      }).join('')}
    </table>
    
    <h2>Requests Per Second by Load</h2>
    <table>
      <tr>
        <th>Endpoint</th>
        <th>Category</th>
        <th>Single User</th>
        <th>10 Users</th>
        <th>50 Users</th>
      </tr>
      ${endpoints.map(endpoint => {
        const endpointResults = results.filter(r => r.endpoint === endpoint.title);
        const singleUserResult = endpointResults.find(r => r.load === 'Single User');
        const tenUsersResult = endpointResults.find(r => r.load === '10 Users');
        const fiftyUsersResult = endpointResults.find(r => r.load === '50 Users');
        
        return `
          <tr>
            <td>${endpoint.title}</td>
            <td>${endpoint.category}</td>
            <td>${formatNumber(singleUserResult?.requestsPerSec)}</td>
            <td>${formatNumber(tenUsersResult?.requestsPerSec)}</td>
            <td>${formatNumber(fiftyUsersResult?.requestsPerSec)}</td>
          </tr>
        `;
      }).join('')}
    </table>
    
    <div class="summary">
      <p>Total endpoints tested: ${endpoints.length}</p>
      <p>Test configurations: ${testConfigs.length}</p>
      <p>Total test runs: ${results.length}</p>
      <p>Total benchmark time: ${totalDuration.toFixed(1)} seconds</p>
    </div>
  </body>
  </html>
  `;
  
  // Save the report
  const reportFilename = `api-benchmark-report-${new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)}.html`;
  fs.writeFileSync(reportFilename, htmlReport);
  console.log(`\nBenchmark report generated: ${reportFilename}`);
  
  // Also save results as JSON
  fs.writeFileSync('benchmark-results.json', JSON.stringify(results, null, 2));
  console.log('Raw results saved to benchmark-results.json');
}

// Run the benchmark
generateReport();