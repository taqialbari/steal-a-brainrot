/**
 * Test script to sync a small sample of brainrots
 */

const UpdateService = require('./src/services/updateService');
const Brainrot = require('./src/models/Brainrot');

async function testSync() {
  try {
    console.log('Starting test sync with 20 brainrots...\n');

    // Create update service
    const updateService = new UpdateService();

    // Temporarily modify the scraper to only process 20 brainrots
    const originalSync = updateService.scraper.syncBrainrots;
    updateService.scraper.syncBrainrots = async function() {
      const brainrotList = await this.parseMainListPage();
      const limitedList = brainrotList.slice(0, 20);

      console.log(`\n📊 Processing ${limitedList.length} brainrots (limited for testing)...\n`);

      const processedBrainrots = [];
      for (let i = 0; i < limitedList.length; i++) {
        const brainrot = limitedList[i];
        try {
          console.log(`[${i + 1}/${limitedList.length}] ${brainrot.name}`);
          const detailed = await this.parseBrainrotPage(brainrot);
          processedBrainrots.push(detailed);
        } catch (error) {
          console.error(`  Error: ${error.message}`);
        }
      }

      return processedBrainrots;
    };

    // Run update
    const result = await updateService.updateBrainrots();

    console.log('\n\n=== SYNC RESULTS ===');
    console.log('Success:', result.success);
    console.log('Total:', result.count);
    console.log('Created:', result.results.created);
    console.log('Updated:', result.results.updated);
    console.log('Errors:', result.results.errors);
    console.log('Duration:', (result.duration / 1000).toFixed(2) + 's');

    // Check database
    console.log('\n=== DATABASE CHECK ===');
    const count = await Brainrot.count();
    console.log('Total brainrots in database:', count);

    const rarities = await Brainrot.getRarities();
    console.log('\nRarity breakdown:');
    rarities.forEach(r => {
      console.log(`  ${r.rarity}: ${r.count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testSync();
