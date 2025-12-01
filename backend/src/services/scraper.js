/**
 * Web Scraper Service
 * Scrapes brainrot data from Roblox game page using Puppeteer
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');
require('dotenv').config();

class ScraperService {
  constructor() {
    this.gameUrl = process.env.ROBLOX_GAME_URL || 'https://www.roblox.com/games/109983668079237/Steal-a-Brainrot';
    this.delay = parseInt(process.env.SCRAPING_DELAY_MS) || 3000;
    this.timeout = parseInt(process.env.SCRAPING_TIMEOUT_MS) || 30000;
    this.imagesDir = path.join(__dirname, '../../images');
  }

  /**
   * Initialize browser
   */
  async initBrowser() {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
    });

    return browser;
  }

  /**
   * Scrape brainrots from Roblox game page
   * @returns {Promise<Array>} Array of brainrot data
   */
  async scrapeBrainrots() {
    let browser;
    try {
      console.log('🔍 Starting web scraping...');
      browser = await this.initBrowser();
      const page = await browser.newPage();

      // Set user agent
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      // Navigate to game page
      console.log(`📡 Navigating to ${this.gameUrl}...`);
      await page.goto(this.gameUrl, {
        waitUntil: 'networkidle2',
        timeout: this.timeout
      });

      // Wait a bit for dynamic content
      await page.waitForTimeout(this.delay);

      // Monitor network requests for API endpoints
      const apiData = [];
      page.on('response', async (response) => {
        const url = response.url();
        if (url.includes('catalog') || url.includes('items') || url.includes('inventory')) {
          try {
            const data = await response.json();
            if (data.items || data.data || Array.isArray(data)) {
              apiData.push(data);
            }
          } catch (e) {
            // Not JSON, skip
          }
        }
      });

      // Extract data from page
      const brainrots = await page.evaluate(() => {
        const results = [];
        
        // Try multiple selector strategies
        // Strategy 1: Look for common item containers
        const itemSelectors = [
          '[data-item]',
          '[data-brainrot]',
          '.item',
          '.brainrot',
          '[class*="item"]',
          '[class*="brainrot"]'
        ];

        for (const selector of itemSelectors) {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            elements.forEach((el) => {
              const name = el.querySelector('[class*="name"]')?.textContent?.trim() ||
                        el.querySelector('h3')?.textContent?.trim() ||
                        el.getAttribute('data-name') ||
                        el.textContent?.trim();
              
              const category = el.querySelector('[class*="category"]')?.textContent?.trim() ||
                              el.getAttribute('data-category');
              
              const priceText = el.querySelector('[class*="price"]')?.textContent?.trim() ||
                               el.getAttribute('data-price');
              const price = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : null;
              
              const imageUrl = el.querySelector('img')?.src ||
                              el.querySelector('[class*="image"]')?.style.backgroundImage?.match(/url\(["']?(.+?)["']?\)/)?.[1];

              if (name) {
                results.push({
                  name,
                  category: category || 'Unknown',
                  price,
                  imageUrl: imageUrl || null,
                  animationData: null // Will be set based on CSS classes or data attributes
                });
              }
            });
            break; // Found items, stop trying other selectors
          }
        }

        // Strategy 2: Look for JSON data in script tags
        const scriptTags = document.querySelectorAll('script[type="application/json"]');
        scriptTags.forEach((script) => {
          try {
            const data = JSON.parse(script.textContent);
            if (data.items || data.brainrots || Array.isArray(data)) {
              const items = data.items || data.brainrots || data;
              items.forEach((item) => {
                if (item.name) {
                  results.push({
                    name: item.name,
                    category: item.category || 'Unknown',
                    price: item.price || null,
                    imageUrl: item.imageUrl || item.image || null,
                    animationData: item.animationData || null
                  });
                }
              });
            }
          } catch (e) {
            // Not valid JSON, skip
          }
        });

        return results;
      });

      // Process API data if found
      if (apiData.length > 0) {
        console.log('📦 Found API data, processing...');
        // Process API responses (implementation depends on actual API structure)
      }

      // Remove duplicates
      const uniqueBrainrots = [];
      const seen = new Set();
      for (const brainrot of brainrots) {
        const key = brainrot.name.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          uniqueBrainrots.push(brainrot);
        }
      }

      console.log(`✅ Scraped ${uniqueBrainrots.length} brainrots`);
      return uniqueBrainrots;

    } catch (error) {
      console.error('❌ Scraping error:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Download and save image
   * @param {string} imageUrl - Image URL
   * @param {string} brainrotName - Brainrot name for filename
   * @returns {Promise<string>} Local image path
   */
  async downloadImage(imageUrl, brainrotName) {
    if (!imageUrl) return null;

    try {
      // Ensure images directory exists
      await fs.mkdir(this.imagesDir, { recursive: true });

      // Generate safe filename
      const safeName = brainrotName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const ext = path.extname(new URL(imageUrl).pathname) || '.jpg';
      const filename = `${safeName}${ext}`;
      const filepath = path.join(this.imagesDir, filename);

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
        writer.on('finish', () => resolve(`/images/${filename}`));
        writer.on('error', reject);
      });

    } catch (error) {
      console.error(`Failed to download image for ${brainrotName}:`, error.message);
      return null;
    }
  }

  /**
   * Scrape and process brainrots with image downloads
   * @returns {Promise<Array>} Processed brainrot data
   */
  async scrapeAndProcess() {
    const brainrots = await this.scrapeBrainrots();
    
    // Download images
    console.log('📥 Downloading images...');
    const processedBrainrots = await Promise.all(
      brainrots.map(async (brainrot) => {
        if (brainrot.imageUrl) {
          const localImagePath = await this.downloadImage(brainrot.imageUrl, brainrot.name);
          return {
            ...brainrot,
            imageUrl: localImagePath || brainrot.imageUrl
          };
        }
        return brainrot;
      })
    );

    return processedBrainrots;
  }
}

module.exports = ScraperService;

