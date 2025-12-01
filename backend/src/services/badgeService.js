/**
 * Badge Service
 * Fetches brainrot data from Roblox Badges API
 * Replaces the broken Puppeteer scraper with official API integration
 */

const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

class BadgeService {
  constructor() {
    this.baseUrl = 'https://badges.roblox.com/v1';
    this.thumbnailsUrl = 'https://thumbnails.roblox.com/v1/badges/icons';
    this.universeId = '7709344486'; // Steal a Brainrot universe ID
    this.imagesDir = path.join(__dirname, '../../images');
    this.requestDelay = parseInt(process.env.BADGE_API_DELAY) || 100; // 100ms between requests
  }

  /**
   * Delay helper for rate limiting
   * @param {number} ms - Milliseconds to delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch a single page of badges from Roblox API
   * @param {string|null} cursor - Pagination cursor
   * @returns {Promise<Object>} Badge page data
   */
  async fetchBadgesPage(cursor = null) {
    try {
      const params = {
        limit: 100,
        sortOrder: 'Asc'
      };

      if (cursor) {
        params.cursor = cursor;
      }

      console.log(`📡 Fetching badges page${cursor ? ` (cursor: ${cursor.substring(0, 20)}...)` : ' (first page)'}...`);

      const response = await axios.get(
        `${this.baseUrl}/universes/${this.universeId}/badges`,
        {
          params,
          timeout: 10000,
          headers: {
            'User-Agent': 'StealABrainrotApp/1.0'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ Error fetching badges page:', error.message);
      throw new Error(`Failed to fetch badges: ${error.message}`);
    }
  }

  /**
   * Fetch all badges with pagination
   * @returns {Promise<Array>} Array of all badges
   */
  async fetchAllBadges() {
    let allBadges = [];
    let cursor = null;
    let pageCount = 0;

    console.log('🔄 Starting to fetch all badges from Roblox API...');

    do {
      try {
        const page = await this.fetchBadgesPage(cursor);

        if (!page.data || !Array.isArray(page.data)) {
          console.warn('⚠️  Invalid page data structure, stopping pagination');
          break;
        }

        allBadges = allBadges.concat(page.data);
        cursor = page.nextPageCursor;
        pageCount++;

        console.log(`📦 Fetched page ${pageCount}: ${page.data.length} badges (total so far: ${allBadges.length})`);

        // Rate limiting: wait between requests
        if (cursor) {
          await this.delay(this.requestDelay);
        }

      } catch (error) {
        console.error(`❌ Error on page ${pageCount + 1}:`, error.message);
        // Continue with what we have so far
        break;
      }
    } while (cursor);

    console.log(`✅ Finished fetching badges: ${allBadges.length} total badges across ${pageCount} pages`);
    return allBadges;
  }

  /**
   * Fetch badge icon URL from Roblox Thumbnails API
   * @param {number} badgeId - Badge ID
   * @returns {Promise<string|null>} Image URL or null
   */
  async fetchBadgeIcon(badgeId) {
    try {
      const response = await axios.get(this.thumbnailsUrl, {
        params: {
          badgeIds: badgeId,
          size: '150x150',
          format: 'Png'
        },
        timeout: 5000
      });

      if (response.data && response.data.data && response.data.data.length > 0) {
        const iconUrl = response.data.data[0].imageUrl;
        return iconUrl;
      }

      console.warn(`⚠️  No icon found for badge ${badgeId}`);
      return null;

    } catch (error) {
      console.error(`❌ Error fetching icon for badge ${badgeId}:`, error.message);
      return null;
    }
  }

  /**
   * Parse rarity tier from badge statistics
   * @param {Object} badge - Badge object from API
   * @returns {string} Rarity tier name
   */
  parseRarity(badge) {
    const winRate = badge.statistics?.winRatePercentage;

    // If no win rate data, try parsing from description
    if (winRate === null || winRate === undefined) {
      const descRarity = this.parseRarityFromDescription(badge.description || badge.displayDescription || '');
      if (descRarity) return descRarity;
      return 'Common'; // Default
    }

    // Rarity based on win rate (lower win rate = rarer)
    if (winRate >= 20) return 'Common';
    if (winRate >= 10) return 'Rare';
    if (winRate >= 5) return 'Epic';
    if (winRate >= 2) return 'Legendary';
    if (winRate >= 0.5) return 'Mythic';
    if (winRate >= 0.1) return 'Brainrot God';
    return 'Secret';
  }

  /**
   * Parse rarity from badge description text
   * @param {string} description - Badge description
   * @returns {string|null} Rarity tier or null
   */
  parseRarityFromDescription(description) {
    const lowerDesc = description.toLowerCase();

    const rarityKeywords = {
      'Secret': /secret|hidden|exclusive/i,
      'Brainrot God': /god|divine|ultimate/i,
      'Mythic': /mythic/i,
      'Legendary': /legendary/i,
      'Epic': /epic/i,
      'Rare': /rare/i,
      'OG': /og|original|first/i,
      'Common': /common|basic/i
    };

    for (const [rarity, pattern] of Object.entries(rarityKeywords)) {
      if (pattern.test(lowerDesc)) {
        return rarity;
      }
    }

    return null;
  }

  /**
   * Download and save badge icon image locally
   * @param {string} imageUrl - Image URL
   * @param {string} badgeName - Badge name for filename
   * @param {number} badgeId - Badge ID for unique filename
   * @returns {Promise<string|null>} Local image path or null
   */
  async downloadImage(imageUrl, badgeName, badgeId) {
    if (!imageUrl) {
      console.warn(`⚠️  No image URL for badge: ${badgeName}`);
      return null;
    }

    try {
      // Ensure images directory exists
      await fs.mkdir(this.imagesDir, { recursive: true });

      // Generate safe filename using badge ID and sanitized name
      const safeName = badgeName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `badge_${badgeId}_${safeName}.png`;
      const filepath = path.join(this.imagesDir, filename);

      // Check if file already exists
      try {
        await fs.access(filepath);
        console.log(`  📁 Image already exists: ${filename}`);
        return `/images/${filename}`;
      } catch {
        // File doesn't exist, continue with download
      }

      // Download image
      const response = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream',
        timeout: 10000
      });

      const writer = require('fs').createWriteStream(filepath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          console.log(`  💾 Downloaded: ${filename}`);
          resolve(`/images/${filename}`);
        });
        writer.on('error', (error) => {
          console.error(`  ❌ Failed to write image: ${error.message}`);
          reject(error);
        });
      });

    } catch (error) {
      console.error(`❌ Failed to download image for ${badgeName}:`, error.message);
      return null;
    }
  }

  /**
   * Main sync method: Fetch all badges and process them into brainrot format
   * @returns {Promise<Array>} Array of processed brainrot objects
   */
  async syncBrainrots() {
    console.log('🚀 Starting brainrot sync from Roblox Badges API...');
    const startTime = Date.now();

    try {
      // Step 1: Fetch all badges
      const badges = await this.fetchAllBadges();

      if (badges.length === 0) {
        console.warn('⚠️  No badges found!');
        return [];
      }

      console.log(`\n📊 Processing ${badges.length} badges...`);

      // Step 2: Process each badge
      const processedBrainrots = [];
      const errors = [];

      for (let i = 0; i < badges.length; i++) {
        const badge = badges[i];

        try {
          console.log(`\n[${i + 1}/${badges.length}] Processing: ${badge.displayName || badge.name}`);

          // Fetch icon URL
          const iconUrl = await this.fetchBadgeIcon(badge.id);

          // Download image (will skip if already exists)
          const localImagePath = await this.downloadImage(iconUrl, badge.name, badge.id);

          // Parse rarity
          const rarity = this.parseRarity(badge);

          // Build brainrot object
          const brainrot = {
            name: badge.displayName || badge.name,
            category: rarity, // For backward compatibility
            rarity: rarity,
            price: null, // Price not available from badges API
            imageUrl: localImagePath,
            description: badge.displayDescription || badge.description || '',
            badgeId: badge.id,
            metadata: {
              awardedCount: badge.statistics?.awardedCount || 0,
              pastDayAwardedCount: badge.statistics?.pastDayAwardedCount || 0,
              winRate: badge.statistics?.winRatePercentage || null,
              iconImageId: badge.displayIconImageId || badge.iconImageId,
              created: badge.created,
              updated: badge.updated
            },
            dataSource: 'badges_api',
            gameId: '109983668079237'
          };

          processedBrainrots.push(brainrot);

          console.log(`  ✅ Rarity: ${rarity} | Win Rate: ${brainrot.metadata.winRate?.toFixed(2)}%`);

          // Rate limiting between badge processing
          if (i < badges.length - 1) {
            await this.delay(this.requestDelay);
          }

        } catch (error) {
          console.error(`  ❌ Error processing badge ${badge.name}:`, error.message);
          errors.push({ badge: badge.name, error: error.message });
        }
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      console.log('\n═══════════════════════════════════════');
      console.log('✅ Sync Complete!');
      console.log(`📊 Successfully processed: ${processedBrainrots.length}/${badges.length}`);
      console.log(`❌ Errors: ${errors.length}`);
      console.log(`⏱️  Duration: ${duration}s`);
      console.log('═══════════════════════════════════════\n');

      if (errors.length > 0) {
        console.log('⚠️  Errors encountered:');
        errors.forEach(err => console.log(`  - ${err.badge}: ${err.error}`));
      }

      return processedBrainrots;

    } catch (error) {
      console.error('❌ Fatal error during sync:', error);
      throw error;
    }
  }

  /**
   * Get summary statistics from badges
   * @returns {Promise<Object>} Statistics object
   */
  async getStatistics() {
    try {
      const badges = await this.fetchAllBadges();

      const stats = {
        totalBadges: badges.length,
        rarityBreakdown: {},
        avgWinRate: 0,
        avgAwardCount: 0,
        totalAwarded: 0
      };

      let winRateSum = 0;
      let winRateCount = 0;

      badges.forEach(badge => {
        const rarity = this.parseRarity(badge);
        stats.rarityBreakdown[rarity] = (stats.rarityBreakdown[rarity] || 0) + 1;

        if (badge.statistics?.winRatePercentage !== null) {
          winRateSum += badge.statistics.winRatePercentage;
          winRateCount++;
        }

        stats.totalAwarded += badge.statistics?.awardedCount || 0;
      });

      stats.avgWinRate = winRateCount > 0 ? winRateSum / winRateCount : 0;
      stats.avgAwardCount = badges.length > 0 ? stats.totalAwarded / badges.length : 0;

      return stats;

    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    }
  }
}

module.exports = BadgeService;
