#!/usr/bin/env node

/**
 * Frontend Integration Test Script
 * Tests frontend API connectivity
 */

const http = require('http');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'http://localhost:3001';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEndpoint(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      resolve({ status: res.statusCode, url });
    });

    req.on('error', (error) => {
      reject({ error: error.message, url });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject({ error: 'Timeout', url });
    });
  });
}

async function runTests() {
  log('\n🚀 Starting Frontend Integration Tests\n', 'blue');
  log(`Frontend URL: ${FRONTEND_URL}`, 'yellow');
  log(`API URL: ${API_URL}\n`, 'yellow');

  const tests = [
    { name: 'Frontend Server', url: FRONTEND_URL },
    { name: 'Backend API Health', url: `${API_URL}/health` },
    { name: 'Backend API Info', url: `${API_URL}/api` },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      log(`🧪 Testing: ${test.name}...`, 'blue');
      const result = await checkEndpoint(test.url);
      if (result.status >= 200 && result.status < 400) {
        log(`✅ ${test.name} is accessible (${result.status})`, 'green');
        passed++;
      } else {
        log(`⚠️  ${test.name} returned status ${result.status}`, 'yellow');
        failed++;
      }
    } catch (error) {
      log(`❌ ${test.name} failed: ${error.error}`, 'red');
      failed++;
    }
  }

  log('\n' + '='.repeat(50), 'blue');
  log(`\n📊 Test Results:`, 'blue');
  log(`   ✅ Passed: ${passed}`, 'green');
  log(`   ❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`   📈 Total: ${passed + failed}`, 'blue');

  if (failed === 0) {
    log('\n🎉 All endpoints are accessible!', 'green');
    log('\n💡 Next steps:', 'blue');
    log('   1. Open http://localhost:3000 in your browser', 'yellow');
    log('   2. Check browser console for any errors', 'yellow');
    log('   3. Verify brainrots are loading correctly', 'yellow');
    process.exit(0);
  } else {
    log('\n⚠️  Some endpoints are not accessible', 'yellow');
    log('   Make sure all services are running:', 'yellow');
    log('   docker-compose up', 'yellow');
    process.exit(1);
  }
}

runTests();

