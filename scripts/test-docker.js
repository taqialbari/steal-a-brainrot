#!/usr/bin/env node

/**
 * Docker Test Script
 * Tests Docker setup and deployment
 */

const { execSync } = require('child_process');
const http = require('http');

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

function runCommand(command, options = {}) {
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function checkEndpoint(url, timeout = 5000) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve({ success: true, status: res.statusCode });
    });

    req.on('error', () => {
      resolve({ success: false, status: null });
    });

    req.setTimeout(timeout, () => {
      req.destroy();
      resolve({ success: false, status: null, timeout: true });
    });
  });
}

async function runTests() {
  log('\n🐳 Starting Docker Deployment Tests\n', 'blue');

  let passed = 0;
  let failed = 0;

  // Test 1: Docker is running
  log('\n🧪 Test 1: Docker is running...', 'blue');
  const dockerCheck = runCommand('docker info', { silent: true });
  if (dockerCheck.success) {
    log('✅ Docker is running', 'green');
    passed++;
  } else {
    log('❌ Docker is not running', 'red');
    log('   Start Docker Desktop and try again', 'yellow');
    failed++;
    process.exit(1);
  }

  // Test 2: Docker Compose is available
  log('\n🧪 Test 2: Docker Compose is available...', 'blue');
  const composeCheck = runCommand('docker-compose --version', { silent: true });
  if (composeCheck.success) {
    log('✅ Docker Compose is available', 'green');
    passed++;
  } else {
    log('❌ Docker Compose not found', 'red');
    failed++;
  }

  // Test 3: Check if containers are running
  log('\n🧪 Test 3: Checking running containers...', 'blue');
  const containers = runCommand('docker-compose ps', { silent: true });
  if (containers.success) {
    const output = containers.output || '';
    const runningCount = (output.match(/Up/g) || []).length;
    log(`   Found ${runningCount} running container(s)`, 'yellow');
    
    if (runningCount >= 3) {
      log('✅ All services are running', 'green');
      passed++;
    } else {
      log('⚠️  Some services may not be running', 'yellow');
      log('   Run: docker-compose up -d', 'yellow');
      failed++;
    }
  } else {
    log('⚠️  Could not check containers', 'yellow');
    log('   Run: docker-compose up -d', 'yellow');
    failed++;
  }

  // Test 4: Backend health check
  log('\n🧪 Test 4: Backend health check...', 'blue');
  const backendHealth = await checkEndpoint('http://localhost:3001/health');
  if (backendHealth.success && backendHealth.status === 200) {
    log('✅ Backend is healthy', 'green');
    passed++;
  } else {
    log('❌ Backend health check failed', 'red');
    log('   Check: docker-compose logs backend', 'yellow');
    failed++;
  }

  // Test 5: Frontend accessibility
  log('\n🧪 Test 5: Frontend accessibility...', 'blue');
  const frontendCheck = await checkEndpoint('http://localhost:3000');
  if (frontendCheck.success) {
    log('✅ Frontend is accessible', 'green');
    passed++;
  } else {
    log('❌ Frontend is not accessible', 'red');
    log('   Check: docker-compose logs frontend', 'yellow');
    failed++;
  }

  // Test 6: Database connectivity
  log('\n🧪 Test 6: Database connectivity...', 'blue');
  const dbCheck = runCommand('docker-compose exec -T postgres pg_isready -U postgres', { silent: true });
  if (dbCheck.success) {
    log('✅ Database is ready', 'green');
    passed++;
  } else {
    log('❌ Database is not ready', 'red');
    log('   Check: docker-compose logs postgres', 'yellow');
    failed++;
  }

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  log(`\n📊 Test Results:`, 'blue');
  log(`   ✅ Passed: ${passed}`, 'green');
  log(`   ❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`   📈 Total: ${passed + failed}`, 'blue');

  if (failed === 0) {
    log('\n🎉 All Docker tests passed!', 'green');
    log('\n💡 Your application is ready:', 'blue');
    log('   Frontend: http://localhost:3000', 'yellow');
    log('   Backend: http://localhost:3001', 'yellow');
    process.exit(0);
  } else {
    log('\n⚠️  Some tests failed', 'yellow');
    log('\n💡 Troubleshooting:', 'blue');
    log('   1. Start services: docker-compose up -d', 'yellow');
    log('   2. Check logs: docker-compose logs', 'yellow');
    log('   3. Rebuild: docker-compose up --build -d', 'yellow');
    process.exit(1);
  }
}

runTests();

