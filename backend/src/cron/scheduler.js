/**
 * Cron Scheduler
 * Sets up weekly automated updates
 */

const cron = require('node-cron');
const UpdateService = require('../services/updateService');
require('dotenv').config();

const updateService = new UpdateService();

/**
 * Schedule weekly updates
 * Default: Every Sunday at 2 AM
 */
const schedule = process.env.CRON_SCHEDULE || '0 2 * * 0'; // Sunday 2 AM

function startScheduler() {
  console.log(`⏰ Scheduling weekly updates: ${schedule}`);
  
  cron.schedule(schedule, async () => {
    console.log('🔄 Starting scheduled brainrot update...');
    try {
      const result = await updateService.updateBrainrots();
      console.log('✅ Scheduled update completed:', result);
    } catch (error) {
      console.error('❌ Scheduled update failed:', error);
      // Could send notification here
    }
  }, {
    scheduled: true,
    timezone: "America/New_York" // Adjust as needed
  });

  console.log('✅ Cron scheduler started');
}

/**
 * Run update immediately (for testing)
 */
async function runUpdateNow() {
  console.log('🔄 Running immediate update...');
  try {
    const result = await updateService.updateBrainrots();
    console.log('✅ Immediate update completed:', result);
    return result;
  } catch (error) {
    console.error('❌ Immediate update failed:', error);
    throw error;
  }
}

module.exports = {
  startScheduler,
  runUpdateNow,
  updateService
};

