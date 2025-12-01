#!/usr/bin/env node

/**
 * Add Sample Data Script
 * Adds sample brainrots for testing
 */

require('dotenv').config({ path: require('path').join(__dirname, '../backend/.env') });
const Brainrot = require('../backend/src/models/Brainrot');

const sampleBrainrots = [
  {
    name: 'Common Brainrot',
    category: 'Common',
    price: 100,
    description: 'A common brainrot item from the game',
    imageUrl: null,
    gameId: '109983668079237'
  },
  {
    name: 'Rare Brainrot',
    category: 'Rare',
    price: 500,
    description: 'A rare brainrot item with special properties',
    imageUrl: null,
    gameId: '109983668079237'
  },
  {
    name: 'Epic Brainrot',
    category: 'Epic',
    price: 1000,
    description: 'An epic brainrot item that is highly sought after',
    imageUrl: null,
    gameId: '109983668079237'
  },
  {
    name: 'Legendary Brainrot',
    category: 'Legendary',
    price: 5000,
    description: 'The most powerful legendary brainrot in the game',
    imageUrl: null,
    gameId: '109983668079237'
  },
  {
    name: 'Mystery Brainrot',
    category: 'Unknown',
    price: null,
    description: 'A mysterious brainrot with unknown properties',
    imageUrl: null,
    gameId: '109983668079237'
  }
];

async function addSampleData() {
  try {
    console.log('📝 Adding sample brainrots...\n');
    
    for (const brainrot of sampleBrainrots) {
      try {
        await Brainrot.upsert(brainrot);
        console.log(`✅ Added: ${brainrot.name} (${brainrot.category})`);
      } catch (error) {
        console.error(`❌ Failed to add ${brainrot.name}:`, error.message);
      }
    }
    
    const count = await Brainrot.count();
    console.log(`\n✅ Sample data added! Total brainrots: ${count}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    process.exit(1);
  }
}

addSampleData();

