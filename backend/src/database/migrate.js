/**
 * Database Migration Script
 * Runs the database schema
 */

const fs = require('fs');
const path = require('path');
const { query } = require('./connection');

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    
    // Try multiple possible paths for schema file
    const possiblePaths = [
      path.join(__dirname, '../../../database/schema.sql'),
      path.join(__dirname, '../../database/schema.sql'),
      '/database/schema.sql',
      './database/schema.sql'
    ];
    
    let schemaPath = null;
    for (const p of possiblePaths) {
      try {
        await fs.access(p);
        schemaPath = p;
        break;
      } catch (e) {
        // Try next path
      }
    }
    
    if (!schemaPath) {
      console.log('⚠️  Schema file not found, checking if tables already exist...');
      const result = await query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'brainrots'
      `);
      
      if (result.rows.length > 0) {
        console.log('✅ Database tables already exist');
        process.exit(0);
      } else {
        throw new Error('Schema file not found and tables do not exist');
      }
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    await query(schema);
    
    console.log('✅ Database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };

