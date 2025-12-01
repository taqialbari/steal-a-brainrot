#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests database connectivity and schema
 */

require('dotenv').config({ path: require('path').join(__dirname, '../backend/.env') });
const { query } = require('../backend/src/database/connection');

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

async function runTests() {
  log('\n🚀 Starting Database Tests\n', 'blue');

  let passed = 0;
  let failed = 0;

  // Test 1: Connection
  try {
    log('🧪 Testing: Database Connection...', 'blue');
    await query('SELECT 1');
    log('✅ Database connection successful', 'green');
    passed++;
  } catch (error) {
    log(`❌ Database connection failed: ${error.message}`, 'red');
    failed++;
    log('\n⚠️  Make sure PostgreSQL is running:', 'yellow');
    log('   docker-compose up postgres -d', 'yellow');
    process.exit(1);
  }

  // Test 2: Schema Check
  try {
    log('\n🧪 Testing: Database Schema...', 'blue');
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tables = result.rows.map(r => r.table_name);
    log(`   Found tables: ${tables.join(', ')}`, 'yellow');
    
    if (tables.includes('brainrots')) {
      log('✅ brainrots table exists', 'green');
      passed++;
    } else {
      log('❌ brainrots table not found', 'red');
      log('   Run: npm run migrate (in backend directory)', 'yellow');
      failed++;
    }

    if (tables.includes('categories')) {
      log('✅ categories table exists', 'green');
      passed++;
    } else {
      log('⚠️  categories table not found (optional)', 'yellow');
    }
  } catch (error) {
    log(`❌ Schema check failed: ${error.message}`, 'red');
    failed++;
  }

  // Test 3: Brainrots Count
  try {
    log('\n🧪 Testing: Brainrots Data...', 'blue');
    const result = await query('SELECT COUNT(*) as count FROM brainrots');
    const count = parseInt(result.rows[0].count, 10);
    log(`   Found ${count} brainrots in database`, 'yellow');
    
    if (count >= 0) {
      log('✅ Brainrots query successful', 'green');
      passed++;
    }
  } catch (error) {
    log(`❌ Brainrots query failed: ${error.message}`, 'red');
    log('   Table may not exist. Run migrations first.', 'yellow');
    failed++;
  }

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  log(`\n📊 Test Results:`, 'blue');
  log(`   ✅ Passed: ${passed}`, 'green');
  log(`   ❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`   📈 Total: ${passed + failed}`, 'blue');

  if (failed === 0) {
    log('\n🎉 All database tests passed!', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  Some tests failed', 'yellow');
    process.exit(1);
  }
}

runTests().catch((error) => {
  log(`\n💥 Test runner error: ${error.message}`, 'red');
  process.exit(1);
});

