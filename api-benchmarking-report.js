const autocannon = require('autocannon');
const fs = require('fs');

// All API endpoints to test
const endpoints = [
  { url: 'http://localhost:5000/', title: 'API Home', category: 'Server' },
  { url: 'http://localhost:5000/api/medals', title: 'Medals Data', category: 'Medals' },
  { url: 'http://localhost:5000/api/medals/totals-by-country', title: 'Medal Totals by Country', category: 'Medals' },
  { url: 'http://localhost:5000/api/athletes', title: 'All Athletes', category: 'Athletes' },
  { url: 'http://localhost:5000/api/athletes/by-country', title: 'Athletes by Country', category: 'Athletes' },
  { url: 'http://localhost:5000/api/athletes/medallists', title: 'Medallists', category: 'Athletes' },
  { url: 'http://localhost:5000/api/athletes/top-medallists?min=2', title: 'Top Medallists', category: 'Athletes' },
  { url: 'http://localhost:5000/api/sports/dashboard?sport=Badminton', title: 'Sport Details (Badminton)', category: 'Sports' }
];

// Test configurations: fixed number of requests with different concurrency
const testConfigs = [
  { connections: 1, amount: 10, name: 'Single User' },
  { connections: 2, amount: 10, name: '2 Users' },
  { connections: 3, amount: 10, name: '3 Users' }
];

// Helper function to safely format numbers
function formatNumber(num, decimals = 2) {
  if (num === undefined || num === null) return 'N/A';
  return Number(num).toFixed(decimals);
}

// Test each endpoint ONE AT A TIME to prevent overloading
async function runTest(endpoint, config) {
  console.log(`Testing ${endpoint.title} with ${config.name} configuration...`);
  
  try {
    return await autocannon({
      url: endpoint.url,
      connections: config.connections,
      amount: config.amount,  // Number of requests instead of duration
      timeout: 30,  // 30 second timeout
      headers: { 'Accept': 'application/json' }
    });
  } catch (error) {
    console.error(`Error testing ${endpoint.title}: ${error.message}`);
    return {
      requests: { average: 0 },
      latency: { average: 0 },
      throughput: { average: 0 }
    };
  }
}

async function generateReport() {
  console.log('🚀 Starting API benchmark with fixed request count...\n');
  
  const results = [];
  const startTime = Date.now();
  
  // Test each endpoint completely before moving to the next one
  for (const endpoint of endpoints) {
    const endpointResults = [];
    
    for (const config of testConfigs) {
      try {
        // Wait 1 second between tests to let system recover
        if (endpointResults.length > 0) {
          console.log("Waiting for system to recover...");
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        const result = await runTest(endpoint, config);
        
        endpointResults.push({
          load: config.name,
          connections: config.connections,
          responseTime: result.latency?.average || 0
        });
        
        console.log(`  Average response time: ${formatNumber(result.latency?.average)} ms`);
      } catch (error) {
        console.error(`Failed to test ${endpoint.title}: ${error.message}`);
        endpointResults.push({
          load: config.name,
          connections: config.connections,
          responseTime: 0
        });
      }
    }
    
    results.push({
      endpoint: endpoint.title,
      category: endpoint.category,
      url: endpoint.url,
      results: endpointResults
    });
    
    // Extra 2 second pause between endpoints
    console.log(`Completed testing ${endpoint.title}. Pausing before next endpoint...\n`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  const totalDuration = (Date.now() - startTime) / 1000;
  console.log(`\nBenchmark completed in ${totalDuration.toFixed(1)} seconds`);
  
  // Generate a simple HTML report - ONLY Response Times by Load
  const htmlReport = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Olympic API Response Time Report</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      h1 { color: #0081C8; }
      table { border-collapse: collapse; width: 100%; margin: 15px 0; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
      tr:nth-child(even) { background-color: #f9f9f9; }
      .good { color: green; }
      .warning { color: orange; }
      .error { color: red; }
    </style>
  </head>
  <body>
    <h1>Response Times by Load</h1>
    <table>
      <tr>
        <th>Endpoint</th>
        <th>Category</th>
        <th>Single User (ms)</th>
        <th>2 Users (ms)</th>
        <th>3 Users (ms)</th>
      </tr>
      ${results.map(endpoint => {
        const singleUserResult = endpoint.results.find(r => r.load === 'Single User');
        const twoUsersResult = endpoint.results.find(r => r.load === '2 Users');
        const threeUsersResult = endpoint.results.find(r => r.load === '3 Users');
        
        // Color coding based on response time
        const getClass = (time) => {
          if (time === 0) return 'error';
          if (time > 2000) return 'error';
          if (time > 500) return 'warning';
          return 'good';
        };
        
        return `
          <tr>
            <td>${endpoint.endpoint}</td>
            <td>${endpoint.category}</td>
            <td class="${getClass(singleUserResult?.responseTime)}">${formatNumber(singleUserResult?.responseTime)}</td>
            <td class="${getClass(twoUsersResult?.responseTime)}">${formatNumber(twoUsersResult?.responseTime)}</td>
            <td class="${getClass(threeUsersResult?.responseTime)}">${formatNumber(threeUsersResult?.responseTime)}</td>
          </tr>
        `;
      }).join('')}
    </table>
  </body>
  </html>
  `;
  
  // Save the report
  const reportFilename = `api-response-time-report-${new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)}.html`;
  fs.writeFileSync(reportFilename, htmlReport);
  console.log(`\nResponse time report generated: ${reportFilename}`);
}

// Run the benchmark
generateReport();