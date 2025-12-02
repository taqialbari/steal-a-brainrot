/**
 * Fandom Wiki Scraper
 * Fetches brainrot data from the Steal a Brainrot Fandom wiki
 * Data Source: https://stealabrainrot.fandom.com/wiki/Brainrots
 */

const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

class FandomScraper {
  constructor() {
    this.baseUrl = 'https://stealabrainrot.fandom.com';
    this.wikiUrl = `${this.baseUrl}/wiki`;
    this.imagesDir = path.join(__dirname, '../../images');
    this.requestDelay = 1000; // 1 second between requests (respectful scraping)
  }

  /**
   * Delay helper for rate limiting
   * @param {number} ms - Milliseconds to delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch a wiki page
   * @param {string} pageName - Wiki page name
   * @returns {Promise<string>} HTML content
   */
  async fetchPage(pageName) {
    try {
      const url = `${this.wikiUrl}/${pageName}`;
      console.log(`📡 Fetching: ${url}`);

      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'StealABrainrotApp/1.0 (Educational/Research)'
        }
      });

      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching ${pageName}:`, error.message);
      throw error;
    }
  }

  /**
   * Parse the main Brainrots list page
   * @returns {Promise<Array>} Array of brainrot objects with basic info
   */
  async parseMainListPage() {
    const html = await this.fetchPage('Brainrots');
    const $ = cheerio.load(html);
    const brainrots = [];
    const seen = new Set();

    console.log('\n🔍 Parsing all brainrot links from page...');

    // Get all wiki links on the page
    $('a[href^="/wiki/"]').each((i, elem) => {
      const link = $(elem).attr('href');
      const name = $(elem).attr('title') || $(elem).text().trim();

      // Filter out non-brainrot pages
      if (link && name && !seen.has(name)) {
        // Skip these types of links
        const skipPatterns = [
          /^\/wiki\/File:/i,
          /^\/wiki\/Category:/i,
          /^\/wiki\/Special:/i,
          /^\/wiki\/Template:/i,
          /^\/wiki\/User:/i,
          /^\/wiki\/Talk:/i,
          /\/Gallery$/i,
          /^\/wiki\/(Rebirth|Events|Traits|Mutations|Lucky_Block|Machine|Trader|Dealer|Fuse|Ritual|Fishing|Upcoming)$/i,
          /^\/wiki\/(Steal_a_Brainrot|List_of_Brainrots|Brainrots)$/i
        ];

        const shouldSkip = skipPatterns.some(pattern => pattern.test(link));

        if (!shouldSkip && name.length > 1 && name.length < 100) {
          seen.add(name);
          const pageName = link.replace('/wiki/', '');

          brainrots.push({
            name: name,
            rarity: null, // Will be determined from individual page
            wikiPage: pageName,
            wikiUrl: `${this.baseUrl}${link}`
          });
        }
      }
    });

    console.log(`✅ Found ${brainrots.length} potential brainrot pages`);
    return brainrots;
  }

  /**
   * Parse individual brainrot page for detailed information
   * @param {Object} brainrot - Basic brainrot info
   * @returns {Promise<Object>} Complete brainrot data
   */
  async parseBrainrotPage(brainrot) {
    try {
      await this.delay(this.requestDelay); // Rate limiting

      const html = await this.fetchPage(brainrot.wikiPage);
      const $ = cheerio.load(html);

      // Extract rarity from infobox
      let rarity = brainrot.rarity;
      $('.pi-data-label').each((i, elem) => {
        const label = $(elem).text().trim().toLowerCase();
        if (label.includes('rarity') || label.includes('tier')) {
          rarity = $(elem).next('.pi-data-value').text().trim() || rarity;
        }
      });

      // If no rarity found, default to Common
      if (!rarity) {
        rarity = 'Common';
      }

      // Extract price (usually in the infobox)
      let price = null;
      $('.pi-data-label').each((i, elem) => {
        const label = $(elem).text().trim().toLowerCase();
        if (label.includes('price') || label.includes('cost')) {
          const priceText = $(elem).next('.pi-data-value').text().trim();
          const priceMatch = priceText.match(/[\d,]+/);
          if (priceMatch) {
            price = parseFloat(priceMatch[0].replace(/,/g, ''));
          }
        }
      });

      // Extract image URL
      let imageUrl = null;
      const image = $('.pi-image img, figure.pi-item img, .mw-parser-output img').first();

      if (image.length > 0) {
        imageUrl = image.attr('src') || image.attr('data-src');

        // Remove size parameters to get full resolution
        if (imageUrl) {
          imageUrl = imageUrl.split('/revision/')[0];
          // Ensure full URL
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = 'https:' + imageUrl;
          }
        }
      }

      // Extract description
      const description = $('.mw-parser-output > p').first().text().trim() || '';

      return {
        name: brainrot.name,
        category: rarity, // For backward compatibility
        rarity: rarity,
        price: price,
        imageUrl: imageUrl,
        description: description,
        wikiUrl: brainrot.wikiUrl,
        dataSource: 'fandom_wiki'
      };

    } catch (error) {
      console.error(`  ❌ Error parsing ${brainrot.name}:`, error.message);
      // Return basic info if detailed parsing fails
      return {
        name: brainrot.name,
        category: 'Common',
        rarity: 'Common',
        price: null,
        imageUrl: null,
        description: '',
        wikiUrl: brainrot.wikiUrl,
        dataSource: 'fandom_wiki'
      };
    }
  }

  /**
   * Download and save image locally
   * @param {string} imageUrl - Image URL
   * @param {string} name - Brainrot name for filename
   * @returns {Promise<string|null>} Local image path or null
   */
  async downloadImage(imageUrl, name) {
    if (!imageUrl) {
      return null;
    }

    try {
      // Ensure images directory exists
      await fs.mkdir(this.imagesDir, { recursive: true });

      // Generate safe filename
      const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const ext = imageUrl.includes('.png') ? 'png' : 'jpg';
      const filename = `${safeName}.${ext}`;
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
      console.error(`❌ Failed to download image for ${name}:`, error.message);
      return imageUrl; // Return original URL if download fails
    }
  }

  /**
   * Main sync method: Scrape all brainrots from Fandom wiki
   * @returns {Promise<Array>} Array of processed brainrot objects
   */
  async syncBrainrots() {
    console.log('🚀 Starting brainrot sync from Fandom wiki...');
    const startTime = Date.now();

    try {
      // Step 1: Get list of all brainrots
      const brainrotList = await this.parseMainListPage();

      if (brainrotList.length === 0) {
        console.warn('⚠️  No brainrots found on wiki!');
        return [];
      }

      console.log(`\n📊 Processing ${brainrotList.length} brainrots...`);

      // Step 2: Process each brainrot
      const processedBrainrots = [];
      const errors = [];

      for (let i = 0; i < brainrotList.length; i++) {
        const brainrot = brainrotList[i];

        try {
          console.log(`\n[${i + 1}/${brainrotList.length}] Processing: ${brainrot.name}`);

          // Get detailed information
          const detailedBrainrot = await this.parseBrainrotPage(brainrot);

          // Download image if available
          if (detailedBrainrot.imageUrl) {
            const localImagePath = await this.downloadImage(
              detailedBrainrot.imageUrl,
              detailedBrainrot.name
            );
            detailedBrainrot.imageUrl = localImagePath;
          }

          processedBrainrots.push(detailedBrainrot);

        } catch (error) {
          console.error(`  ❌ Error processing ${brainrot.name}:`, error.message);
          errors.push({ brainrot: brainrot.name, error: error.message });
        }
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      console.log('\n═══════════════════════════════════════');
      console.log('✅ Sync Complete!');
      console.log(`📊 Successfully processed: ${processedBrainrots.length}/${brainrotList.length}`);
      console.log(`❌ Errors: ${errors.length}`);
      console.log(`⏱️  Duration: ${duration}s`);
      console.log('═══════════════════════════════════════\n');

      if (errors.length > 0) {
        console.log('⚠️  Errors encountered:');
        errors.forEach(err => console.log(`  - ${err.brainrot}: ${err.error}`));
      }

      return processedBrainrots;

    } catch (error) {
      console.error('❌ Fatal error during sync:', error);
      throw error;
    }
  }
}

module.exports = FandomScraper;
