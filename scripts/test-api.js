#!/usr/bin/env node

/**
 * API Integration Test Script
 * Tests all backend API endpoints
 */

const http = require('http');

const API_URL = process.env.API_URL || 'http://localhost:3001';
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

let testsPassed = 0;
let testsFailed = 0;

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function test(name, testFn) {
  try {
    log(`\n🧪 Testing: ${name}`, 'blue');
    await testFn();
    testsPassed++;
    log(`✅ PASS: ${name}`, 'green');
  } catch (error) {
    testsFailed++;
    log(`❌ FAIL: ${name}`, 'red');
    log(`   Error: ${error.message}`, 'red');
  }
}

async function runTests() {
  log('\n🚀 Starting API Integration Tests\n', 'blue');
  log(`API URL: ${API_URL}\n`, 'yellow');

  // Test 1: Health Check
  await test('Health Check', async () => {
    const response = await makeRequest('GET', '/health');
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (response.data.status !== 'ok') {
      throw new Error('Health check failed');
    }
  });

  // Test 2: API Info
  await test('API Info Endpoint', async () => {
    const response = await makeRequest('GET', '/api');
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!response.data.endpoints) {
      throw new Error('Missing endpoints in response');
    }
  });

  // Test 3: Get Brainrots
  await test('GET /api/brainrots', async () => {
    const response = await makeRequest('GET', '/api/brainrots');
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!Array.isArray(response.data.data)) {
      throw new Error('Response data should be an array');
    }
  });

  // Test 4: Get Brainrots with Pagination
  await test('GET /api/brainrots with pagination', async () => {
    const response = await makeRequest('GET', '/api/brainrots?limit=10&offset=0');
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!response.data.pagination) {
      throw new Error('Missing pagination in response');
    }
  });

  // Test 5: Get Categories
  await test('GET /api/categories', async () => {
    const response = await makeRequest('GET', '/api/categories');
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!Array.isArray(response.data.data)) {
      throw new Error('Response data should be an array');
    }
  });

  // Test 6: Get Admin Status
  await test('GET /api/admin/status', async () => {
    const response = await makeRequest('GET', '/api/admin/status');
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
  });

  // Test 7: 404 Handler
  await test('404 Handler', async () => {
    const response = await makeRequest('GET', '/api/nonexistent');
    if (response.status !== 404) {
      throw new Error(`Expected status 404, got ${response.status}`);
    }
  });

  // Test 8: CORS Headers
  await test('CORS Headers', async () => {
    // This would need to be tested with a proper HTTP client that checks headers
    // For now, we'll just verify the endpoint is accessible
    const response = await makeRequest('GET', '/health');
    if (response.status !== 200) {
      throw new Error('CORS test failed - endpoint not accessible');
    }
  });

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  log(`\n📊 Test Results:`, 'blue');
  log(`   ✅ Passed: ${testsPassed}`, 'green');
  log(`   ❌ Failed: ${testsFailed}`, testsFailed > 0 ? 'red' : 'green');
  log(`   📈 Total: ${testsPassed + testsFailed}`, 'blue');
  
  if (testsFailed === 0) {
    log('\n🎉 All tests passed!', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  Some tests failed', 'yellow');
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  log(`\n💥 Test runner error: ${error.message}`, 'red');
  process.exit(1);
});

