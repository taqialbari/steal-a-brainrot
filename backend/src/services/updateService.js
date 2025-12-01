/**
 * Update Service
 * Handles data updates from scraping
 */

const ScraperService = require('./scraper');
const Brainrot = require('../models/Brainrot');
const { query } = require('../database/connection');

class UpdateService {
  constructor() {
    this.scraper = new ScraperService();
    this.isUpdating = false;
  }

  /**
   * Update all brainrots from scraping
   * @returns {Promise<Object>} Update results
   */
  async updateBrainrots() {
    if (this.isUpdating) {
      throw new Error('Update already in progress');
    }

    this.isUpdating = true;
    const startTime = Date.now();

    try {
      console.log('🔄 Starting brainrot data update...');

      // Scrape data
      const scrapedData = await this.scraper.scrapeAndProcess();

      if (scrapedData.length === 0) {
        console.log('⚠️  No data scraped');
        return {
          success: false,
          message: 'No data scraped',
          count: 0,
          duration: Date.now() - startTime
        };
      }

      // Upsert brainrots
      console.log('💾 Saving brainrots to database...');
      const results = {
        created: 0,
        updated: 0,
        errors: 0
      };

      for (const data of scrapedData) {
        try {
          const existing = await Brainrot.findByName(data.name, data.gameId || '109983668079237');
          
          if (existing) {
            await Brainrot.update(existing.id, data);
            results.updated++;
          } else {
            await Brainrot.create(data);
            results.created++;
          }
        } catch (error) {
          console.error(`Error processing ${data.name}:`, error.message);
          results.errors++;
        }
      }

      const duration = Date.now() - startTime;
      console.log(`✅ Update completed in ${duration}ms`);
      console.log(`   Created: ${results.created}, Updated: ${results.updated}, Errors: ${results.errors}`);

      return {
        success: true,
        message: 'Update completed successfully',
        count: scrapedData.length,
        results,
        duration
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

