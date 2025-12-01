#!/usr/bin/env node

/**
 * Page Structure Analysis Script
 * 
 * This script analyzes the Roblox game page to determine if it uses
 * JavaScript rendering (needs Puppeteer) or static HTML (can use Cheerio).
 * 
 * Usage: node scripts/analyze-page-structure.js
 */

const https = require('https');
const { URL } = require('url');

const GAME_URL = 'https://www.roblox.com/games/109983668079237/Steal-a-Brainrot';

console.log('🔍 Analyzing Roblox Game Page Structure...\n');
console.log(`Target URL: ${GAME_URL}\n`);

/**
 * Method 1: Check initial HTML response (without JavaScript)
 */
function checkStaticHTML() {
  return new Promise((resolve, reject) => {
    const url = new URL(GAME_URL);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    console.log('📄 Method 1: Checking static HTML response...');
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const analysis = {
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          htmlLength: data.length,
          hasJavaScriptMessage: /enable.*javascript|javascript.*required/i.test(data),
          hasReact: /react|__REACT/i.test(data),
          hasVue: /vue|__VUE/i.test(data),
          hasAngular: /angular|ng-app/i.test(data),
          hasDataAttributes: /data-.*brainrot|data-.*item/i.test(data),
          hasScriptTags: (data.match(/<script/gi) || []).length,
          hasNoscript: /<noscript/i.test(data),
          sampleHTML: data.substring(0, 1000) // First 1000 chars
        };
        
        resolve(analysis);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

/**
 * Analyze the results and make recommendation
 */
function analyzeResults(staticHTML) {
  console.log('\n📊 Analysis Results:\n');
  console.log('─'.repeat(60));
  console.log(`Status Code: ${staticHTML.statusCode}`);
  console.log(`Content Type: ${staticHTML.contentType}`);
  console.log(`HTML Length: ${staticHTML.htmlLength} bytes`);
  console.log(`Script Tags: ${staticHTML.hasScriptTags}`);
  console.log(`Has <noscript> tag: ${staticHTML.hasNoscript}`);
  console.log('─'.repeat(60));
  
  console.log('\n🔎 Content Indicators:');
  console.log(`JavaScript Required Message: ${staticHTML.hasJavaScriptMessage ? '✅ YES' : '❌ NO'}`);
  console.log(`React Framework: ${staticHTML.hasReact ? '✅ DETECTED' : '❌ NOT DETECTED'}`);
  console.log(`Vue Framework: ${staticHTML.hasVue ? '✅ DETECTED' : '❌ NOT DETECTED'}`);
  console.log(`Angular Framework: ${staticHTML.hasAngular ? '✅ DETECTED' : '❌ NOT DETECTED'}`);
  console.log(`Data Attributes (brainrot/item): ${staticHTML.hasDataAttributes ? '✅ FOUND' : '❌ NOT FOUND'}`);
  
  console.log('\n📝 Sample HTML (first 1000 chars):');
  console.log('─'.repeat(60));
  console.log(staticHTML.sampleHTML);
  console.log('─'.repeat(60));
  
  // Make recommendation
  console.log('\n💡 Recommendation:\n');
  
  const indicators = [];
  if (staticHTML.hasJavaScriptMessage) {
    indicators.push('Page shows JavaScript required message');
  }
  if (staticHTML.hasReact || staticHTML.hasVue || staticHTML.hasAngular) {
    indicators.push('JavaScript framework detected');
  }
  if (staticHTML.hasScriptTags > 5) {
    indicators.push('Multiple script tags found');
  }
  if (staticHTML.hasNoscript) {
    indicators.push('Noscript tag present (fallback content)');
  }
  
  if (indicators.length >= 2) {
    console.log('✅ RECOMMENDATION: Use PUPPETEER');
    console.log('\nReasoning:');
    console.log('- Page requires JavaScript to render content');
    console.log('- Content is dynamically loaded');
    console.log('- Cheerio cannot execute JavaScript');
    console.log('\nPuppeteer will:');
    console.log('  • Execute JavaScript and render the page');
    console.log('  • Wait for dynamic content to load');
    console.log('  • Extract data from rendered DOM');
  } else if (staticHTML.hasDataAttributes && staticHTML.hasScriptTags < 3) {
    console.log('⚠️  RECOMMENDATION: Try CHEERIO first, fallback to PUPPETEER');
    console.log('\nReasoning:');
    console.log('- Some data may be in initial HTML');
    console.log('- Cheerio is faster and lighter');
    console.log('- If data is missing, use Puppeteer');
  } else {
    console.log('✅ RECOMMENDATION: Use PUPPETEER');
    console.log('\nReasoning:');
    console.log('- Modern web applications typically use JavaScript');
    console.log('- Roblox is known to use client-side rendering');
    console.log('- Puppeteer is safer for dynamic content');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Install Puppeteer: npm install puppeteer');
  console.log('2. Create scraping script with Puppeteer');
  console.log('3. Test data extraction');
  console.log('4. Implement rate limiting and error handling');
}

// Run analysis
checkStaticHTML()
  .then((results) => {
    analyzeResults(results);
  })
  .catch((error) => {
    console.error('\n❌ Error during analysis:', error.message);
    console.error('\nThis might indicate:');
    console.error('- Network connectivity issues');
    console.error('- Roblox blocking requests');
    console.error('- SSL/Certificate issues');
    console.error('\n💡 Recommendation: Use PUPPETEER');
    console.log('Puppeteer can handle these scenarios better and');
    console.log('Roblox pages are known to require JavaScript rendering.');
  });

