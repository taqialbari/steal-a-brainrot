/**
 * Database Seed Script
 * Populates database with sample data (for development)
 */

const Brainrot = require('../models/Brainrot');

const sampleBrainrots = [
  {
    name: 'Sample Brainrot 1',
    category: 'Common',
    price: 100,
    imageUrl: '/images/sample1.jpg',
    description: 'A sample brainrot for testing',
    gameId: '109983668079237'
  },
  {
    name: 'Sample Brainrot 2',
    category: 'Rare',
    price: 500,
    imageUrl: '/images/sample2.jpg',
    description: 'Another sample brainrot',
    gameId: '109983668079237'
  }
];

async function seed() {
  try {
    console.log('🌱 Seeding database...');
    
    for (const brainrot of sampleBrainrots) {
      await Brainrot.upsert(brainrot);
      console.log(`✅ Seeded: ${brainrot.name}`);
    }
    
    console.log('✅ Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seed();
}

module.exports = { seed };

