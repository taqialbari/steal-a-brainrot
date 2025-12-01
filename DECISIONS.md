# Project Decisions
## Steal a Brainrot Web Application

This document captures all major decisions made during the planning phase.

## ✅ Finalized Decisions

### 1. Data Source: Web Scraping
**Decision:** Use web scraping to extract brainrot data from the Roblox game page.

**Rationale:**
- Roblox API may not provide direct access to game-specific items
- Web scraping allows direct access to displayed data
- More control over data extraction
- Can be automated for regular updates

**Implementation:**
- **Tool:** Puppeteer (for JavaScript-rendered content) or Cheerio (for static HTML)
- **Target:** https://www.roblox.com/games/109983668079237/Steal-a-Brainrot
- **Frequency:** Weekly automated updates
- **Best Practices:**
  - Rate limiting between requests
  - Proper User-Agent headers
  - Respect robots.txt
  - Error handling and retries

---

### 2. Animation Format: CSS/JavaScript
**Decision:** Use CSS/JavaScript animations instead of GIFs or videos.

**Rationale:**
- Better performance (GPU-accelerated CSS transforms)
- Smaller file sizes
- More flexible and customizable
- Better user experience with smooth transitions
- Can be responsive and interactive

**Implementation:**
- **Library:** Framer Motion (React/Next.js compatible)
- **Types of Animations:**
  - Card hover effects
  - Image transitions
  - Loading states
  - Page transitions
  - Entrance animations

**Performance Considerations:**
- Use CSS transforms (GPU accelerated)
- Implement `will-change` hints
- Lazy load animations
- Target 60fps performance

---

### 3. Technology Stack

#### Frontend: Next.js 14+
**Rationale:**
- Modern React framework
- Excellent developer experience
- Built-in SSR/SSG for performance
- Great ecosystem and community
- TypeScript support
- Optimized for production

#### Backend: Node.js with Express.js
**Rationale:**
- Same language as frontend (JavaScript/TypeScript)
- Lightweight and fast
- Great ecosystem for web scraping
- Easy integration with Puppeteer/Cheerio
- Simple API development

#### Database: PostgreSQL
**Rationale:**
- Robust and reliable
- Excellent for structured data
- Strong community support
- Great Docker support
- ACID compliance
- Good performance

#### Web Scraping: Puppeteer ✅
**Decision:** Use Puppeteer for web scraping

**Rationale:**
- Roblox game pages require JavaScript to render content
- Page shows "Please enable Javascript" message when JS is disabled
- Content is dynamically loaded via JavaScript/API calls
- Cheerio cannot execute JavaScript and will miss dynamic content
- Puppeteer can monitor network requests to discover API endpoints

**Implementation:**
- Use Puppeteer with headless Chrome
- Configure for WSL/Docker environment
- Monitor network requests for potential API discovery
- Implement rate limiting and respectful scraping practices

#### Task Scheduler: node-cron
**Rationale:**
- Simple and reliable
- Native Node.js solution
- Easy to configure
- Perfect for weekly updates

---

### 4. Update Frequency: Weekly
**Decision:** Automatically update data once per week.

**Rationale:**
- Balance between data freshness and server load
- Reduces scraping frequency (respectful to Roblox)
- Sufficient for game item updates
- Can be adjusted if needed

**Implementation:**
- Use node-cron to schedule weekly updates
- Run updates during off-peak hours
- Log update results
- Handle failures gracefully
- Prevent concurrent updates

---

### 5. Deployment: Local Docker (WSL2)
**Decision:** Deploy locally using Docker in WSL2 environment.

**Rationale:**
- Matches development environment
- Easy to set up and maintain
- Isolated services
- Easy to reproduce
- Can be extended to cloud later

**Implementation:**
- Docker Compose for multi-service orchestration
- Separate containers for:
  - Frontend (Next.js)
  - Backend (Node.js/Express)
  - Database (PostgreSQL)
- Docker volumes for data persistence
- Environment variables for configuration
- Health checks for services

---

## ✅ Decisions Completed

### Scraping Tool Selection ✅
**Status:** Completed - Puppeteer selected
- ✅ Analyzed Roblox game page structure
- ✅ Confirmed JavaScript rendering is required
- ✅ Selected Puppeteer over Cheerio
- See [PAGE_ANALYSIS.md](./docs/PAGE_ANALYSIS.md) for detailed analysis

### Animation Library Details
**Status:** Pending implementation
- Confirm Framer Motion setup
- Define animation presets
- Create animation style guide

### Image Storage Strategy
**Status:** Pending implementation
- Confirm local storage approach
- Define image organization structure
- Plan for future CDN migration (if needed)

---

## 📝 Notes

- All decisions are documented for future reference
- Decisions can be revisited if technical constraints arise
- Implementation details will be refined during development
- Best practices will be followed for web scraping and animations

---

**Last Updated:** Planning phase complete

