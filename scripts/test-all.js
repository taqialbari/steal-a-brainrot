#!/usr/bin/env node

/**
 * Run All Integration Tests
 * Executes all test scripts in sequence
 */

const { spawn } = require('child_process');
const path = require('path');

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

function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, scriptName);
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`Running: ${scriptName}`, 'blue');
    log('='.repeat(60), 'blue');

    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      cwd: __dirname
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${scriptName} failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function runAllTests() {
  log('\n🧪 Starting All Integration Tests\n', 'blue');

  const tests = [
    'test-database.js',
    'test-api.js',
    'test-frontend.js'
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      await runScript(test);
      passed++;
    } catch (error) {
      failed++;
      log(`\n❌ ${test} failed: ${error.message}`, 'red');
    }
  }

  log('\n' + '='.repeat(60), 'blue');
  log(`\n📊 Final Results:`, 'blue');
  log(`   ✅ Passed: ${passed}/${tests.length}`, 'green');
  log(`   ❌ Failed: ${failed}/${tests.length}`, failed > 0 ? 'red' : 'green');

  if (failed === 0) {
    log('\n🎉 All integration tests passed!', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  Some tests failed', 'yellow');
    process.exit(1);
  }
}

runAllTests();

