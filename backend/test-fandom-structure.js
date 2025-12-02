const axios = require('axios');
const cheerio = require('cheerio');

async function analyzePage() {
  try {
    const response = await axios.get('https://stealabrainrot.fandom.com/wiki/Brainrots', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    console.log('=== PAGE ANALYSIS ===\n');
    console.log('Total HTML length:', response.data.length);

    // Find all divs with "tabber" in class
    const tabbers = $('[class*="tabber"], [class*="Tabber"], [data-tabber]');
    console.log('\nFound elements with tabber:', tabbers.length);

    // Find all wiki links
    const wikiLinks = $('a[href^="/wiki/"]');
    console.log('Total wiki links:', wikiLinks.length);

    // Show first 30 wiki links
    console.log('\n=== FIRST 30 WIKI LINKS ===');
    wikiLinks.slice(0, 30).each((i, elem) => {
      const href = $(elem).attr('href');
      const title = $(elem).attr('title') || $(elem).text().trim();
      console.log(`${i + 1}. ${href} - "${title}"`);
    });

    // Look for specific structures
    console.log('\n=== LOOKING FOR COMMON TAB ===');
    const commonTab = $('#Common, [id*="Common"], [data-tab="Common"]');
    console.log('Found Common tab:', commonTab.length > 0);

    // Look for gallery or grid structures
    console.log('\n=== LOOKING FOR GALLERIES/GRIDS ===');
    const galleries = $('[class*="gallery"], [class*="grid"], .wikia-gallery, .article-gallery');
    console.log('Found galleries:', galleries.length);

    galleries.each((i, elem) => {
      const links = $(elem).find('a[href^="/wiki/"]');
      console.log(`Gallery ${i + 1}: ${links.length} links`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

analyzePage();
