/**
 * Update Service
 * Handles data updates from Fandom Wiki
 */

const FandomScraper = require('./fandomScraper');
const Brainrot = require('../models/Brainrot');
const { query } = require('../database/connection');

class UpdateService {
  constructor() {
    this.scraper = new FandomScraper();
    this.isUpdating = false;
    this.lastUpdate = null;
  }

  /**
   * Update all brainrots from Fandom Wiki
   * @returns {Promise<Object>} Update results
   */
  async updateBrainrots() {
    if (this.isUpdating) {
      throw new Error('Update already in progress');
    }

    this.isUpdating = true;
    const startTime = Date.now();

    try {
      console.log('🔄 Starting brainrot data update from Fandom Wiki...');

      // Fetch data from Fandom Wiki
      const badgeData = await this.scraper.syncBrainrots();

      if (badgeData.length === 0) {
        console.log('⚠️  No brainrots fetched from wiki');
        return {
          success: false,
          message: 'No brainrots fetched from wiki',
          count: 0,
          duration: Date.now() - startTime
        };
      }

      // Upsert brainrots to database
      console.log(`💾 Saving ${badgeData.length} brainrots to database...`);
      const results = {
        created: 0,
        updated: 0,
        errors: 0
      };

      for (const data of badgeData) {
        try {
          // Check if brainrot exists before upserting
          const existing = data.badgeId
            ? await Brainrot.findByBadgeId(data.badgeId)
            : await Brainrot.findByName(data.name, data.gameId || '109983668079237');

          await Brainrot.upsert(data);

          // Track if it was an update or create
          if (existing) {
            results.updated++;
          } else {
            results.created++;
          }
        } catch (error) {
          console.error(`Error processing ${data.name}:`, error.message);
          results.errors++;
        }
      }

      const duration = Date.now() - startTime;
      this.lastUpdate = new Date();

      console.log(`✅ Update completed in ${(duration / 1000).toFixed(2)}s`);
      console.log(`   Total: ${badgeData.length}, Created: ${results.created}, Updated: ${results.updated}, Errors: ${results.errors}`);

      return {
        success: true,
        message: 'Update completed successfully',
        count: badgeData.length,
        results,
        duration,
        lastUpdate: this.lastUpdate
      };

    } catch (error) {
      console.error('❌ Update failed:', error);
      throw error;
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Get update status
   * @returns {Object} Status information
   */
  getStatus() {
    return {
      isUpdating: this.isUpdating,
      lastUpdate: this.lastUpdate || null
    };
  }
}

module.exports = UpdateService;

