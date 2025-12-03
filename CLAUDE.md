# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Steal a Brainrot** is a web application that displays brainrot collectibles from the Roblox game "Steal a Brainrot" (Game ID: 109983668079237). The application scrapes data from the Steal a Brainrot Fandom Wiki to fetch all brainrot items with details (currently 299), stores them in PostgreSQL, and displays them in a modern Next.js frontend with search, filters, statistics, detail modals, and rarity-based visual design.

## Architecture

### Three-Tier Architecture
- **Frontend**: Next.js 14+ with React, Framer Motion for animations, Tailwind CSS for styling, rarity-based visual design, search & filter UI
- **Backend**: Node.js/Express.js REST API with Fandom Wiki scraper (Cheerio-based)
- **Database**: PostgreSQL with enhanced schema (rarity, metadata JSONB, data_source tracking)
- **Automation**: node-cron scheduler for weekly data sync (Sundays at 2 AM)

### Data Flow
1. FandomScraper fetches all brainrots from Steal a Brainrot Fandom Wiki (`https://stealabrainrot.fandom.com/wiki/Brainrots`)
2. Parses 280+ brainrot pages with 1-second rate limiting (respectful scraping)
3. Images downloaded from wiki and stored locally in `/backend/src/images/`
4. Rarity extracted from wiki infoboxes (12 tiers: Common, Rare, Epic, Legendary, Mythic, Brainrot God, Secret, OG, Admin, Taco, Festive, and special cases)
5. Data stored in PostgreSQL (currently 299 brainrots - count varies as wiki is updated)
6. Frontend fetches data via REST API with search/filter/stats capabilities
7. Weekly cron job automatically syncs latest brainrot data

### Key Design Decisions
- **Data Source**: Fandom Wiki scraping (official wiki, most complete data) - Pivoted from Roblox Badges API which returned empty
- **Why Fandom Wiki**: Comprehensive brainrot database with names, rarities, prices, images, and descriptions
- **Rarity System**: 12 tiers discovered from wiki data (Secret is most common with ~111 brainrots, Taco/Festive are rarest with 1 each)
- **Rarity Color Coding**: Each rarity has distinct Tailwind color class:
  - Common: `text-gray-400` / `border-gray-400`
  - Rare: `text-blue-400` / `border-blue-400`
  - Epic: `text-purple-500` / `border-purple-500`
  - Legendary: `text-yellow-400` / `border-yellow-400`
  - Mythic: `text-red-500` / `border-red-500`
  - Brainrot God: `text-pink-500` / `border-pink-500`
  - Secret: `text-cyan-400` / `border-cyan-400`
  - OG: `text-orange-500` / `border-orange-500`
  - Admin: `text-indigo-600` / `border-indigo-600`
  - Taco: `text-amber-600` / `border-amber-600`
  - Festive: `text-green-500` / `border-green-500`
  - Default/Unknown: `text-gray-500` / `border-gray-500`
- **Animation Format**: CSS/JavaScript animations using Framer Motion with rarity-specific effects
- **Deployment**: Docker-based with docker-compose for local WSL2 environment
- **Update Strategy**: Weekly automated sync, manual trigger available, 1-second rate limiting for respectful scraping

## Current Development Phase

**Active Phase:** Phase 7 - UI/UX Polish & Advanced Features

**Current Status:**
- Phase 7 Task 7.1 (Detail Modal) ✅ COMPLETE
- Phase 7 Task 7.2 (Advanced Filtering) ⏳ NEXT UP
- See `PHASE7_PLAN.md` for complete roadmap
- See `SESSION_STATUS.md` for latest status

**Next Priorities:**
1. Advanced filtering & sorting (sortBy, multi-rarity, price range)
2. Performance optimization (image lazy loading, bundle optimization)
3. Testing suite (>80% coverage target)
4. Accessibility improvements (WCAG AA compliance)

## Development Commands

### Docker (Recommended)

Start all services in development mode with hot-reload:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Start in production mode:
```bash
docker-compose up --build
```

Stop all services:
```bash
docker-compose down
```

View logs:
```bash
docker-compose logs -f              # All services
docker-compose logs -f backend      # Backend only
docker-compose logs -f frontend     # Frontend only
docker-compose logs -f postgres     # Database only
```

### Backend

Development server (with nodemon):
```bash
cd backend
npm run dev
```

Production server:
```bash
cd backend
npm run start
```

Run database migrations:
```bash
cd backend
npm run migrate
```

Seed database:
```bash
cd backend
npm run seed
```

Run tests:
```bash
cd backend
npm test
```

Test API integration:
```bash
cd backend
npm run test:integration
```

Lint code:
```bash
cd backend
npm run lint
```

Trigger Fandom Wiki sync manually:
```bash
cd backend
node -e "const UpdateService = require('./src/services/updateService'); const us = new UpdateService(); us.updateBrainrots().then(r => console.log('Synced', r.count, 'brainrots'));"
```

Test Fandom scraper:
```bash
cd backend
node -e "const FandomScraper = require('./src/services/fandomScraper'); const fs = new FandomScraper(); fs.parseMainListPage().then(list => console.log('Found', list.length, 'brainrot pages'));"
```

### Frontend

Development server (Next.js):
```bash
cd frontend
npm run dev
```

Build for production:
```bash
cd frontend
npm run build
```

Start production server:
```bash
cd frontend
npm run start
```

Lint code:
```bash
cd frontend
npm run lint
```

### Database

Connect to PostgreSQL:
```bash
docker-compose exec postgres psql -U postgres -d steal_a_brainrot
```

Run schema manually:
```bash
docker-compose exec -T postgres psql -U postgres -d steal_a_brainrot < database/schema.sql
```

Backup database:
```bash
docker-compose exec postgres pg_dump -U postgres steal_a_brainrot > backup.sql
```

Restore database:
```bash
docker-compose exec -T postgres psql -U postgres steal_a_brainrot < backup.sql
```

### Testing

Run all tests:
```bash
node scripts/test-all.js
```

Run specific tests:
```bash
node scripts/test-api.js       # API endpoints
node scripts/test-database.js  # Database connectivity
node scripts/test-frontend.js  # Frontend accessibility
node scripts/test-docker.js    # Docker services
```

Quick health check:
```bash
# Check if all services are healthy
docker-compose ps

# Test API is responding
curl http://localhost:3001/health

# Test frontend is accessible
curl -I http://localhost:3000

# Check database connectivity
docker-compose exec postgres psql -U postgres -d steal_a_brainrot -c "SELECT COUNT(*) FROM brainrots;"
```

## Project Structure

```
steal-a-brainrot/
├── backend/                           # Node.js/Express backend
│   ├── src/
│   │   ├── index.js                  # Main server entry point
│   │   ├── routes/                   # API route handlers
│   │   │   ├── brainrots.js         # Brainrot CRUD endpoints
│   │   │   ├── categories.js        # Category endpoints
│   │   │   ├── admin.js             # Admin endpoints (trigger scraping)
│   │   │   └── images.js            # Static image serving
│   │   ├── models/                   # Data models
│   │   │   └── Brainrot.js          # Brainrot model with DB operations
│   │   ├── services/                 # Business logic
│   │   │   ├── fandomScraper.js     # Fandom Wiki scraping service (primary)
│   │   │   ├── badgeService.js      # Roblox Badges API integration (deprecated - returns empty)
│   │   │   ├── scraper.js           # Puppeteer web scraping service (deprecated)
│   │   │   └── updateService.js     # Data update orchestration
│   │   ├── cron/                     # Scheduled tasks
│   │   │   └── scheduler.js         # Weekly update cron job
│   │   ├── database/                 # Database utilities
│   │   │   ├── connection.js        # PostgreSQL connection pool
│   │   │   ├── migrate.js           # Migration runner
│   │   │   └── seed.js              # Database seeder
│   │   └── middleware/               # Express middleware
│   │       └── errorHandler.js      # Global error handler
│   └── Dockerfile.dev               # Development Docker configuration
│
├── frontend/                         # Next.js frontend
│   ├── src/
│   │   ├── app/                     # Next.js 14+ app directory
│   │   │   ├── layout.js           # Root layout component
│   │   │   ├── page.js             # Main page (home)
│   │   │   └── globals.css         # Global Tailwind CSS styles
│   │   ├── components/              # React components
│   │   │   ├── Header.js           # Page header
│   │   │   ├── Footer.js           # Page footer
│   │   │   ├── BrainrotCard.js     # Individual brainrot card with animations
│   │   │   ├── BrainrotGrid.js     # Grid display of brainrots
│   │   │   ├── BrainrotModal.js    # Detail modal with keyboard navigation (Phase 7)
│   │   │   ├── SearchAndFilter.js  # Search bar and rarity filter
│   │   │   ├── Stats.js            # Collection statistics display
│   │   │   ├── CategoryFilter.js   # Category filter component (deprecated)
│   │   │   ├── Loading.js          # Loading state component
│   │   │   └── Error.js            # Error state component
│   │   ├── hooks/                   # Custom React hooks
│   │   │   └── useBrainrots.js     # Hook for fetching brainrot data
│   │   └── lib/                     # Utilities
│   │       └── api.js              # API client with axios
│   └── Dockerfile.dev              # Development Docker configuration
│
├── database/                         # Database files
│   ├── schema.sql                   # Database schema definition
│   └── init.sql                     # Initialization script
│
└── docker-compose.dev.yml           # Development Docker Compose overrides
```

## API Endpoints

### Brainrots
- `GET /api/brainrots` - Get all brainrots (supports pagination, filtering, sorting)
  - Query params: `limit`, `offset`, `category`, `rarity`, `sortBy`
  - Returns: `{ data: [], pagination: { total, limit, offset, hasMore } }`
- `GET /api/brainrots/:id` - Get single brainrot by ID
- `GET /api/brainrots/categories/list` - Get all categories (legacy)
- `GET /api/brainrots/rarities` - Get rarity counts and statistics ✅ IMPLEMENTED
  - Returns: `{ data: [{ rarity: "Secret", count: "111" }, ...] }`
- `GET /api/brainrots/search?q={query}&rarity={rarity}&limit={limit}` - Full-text search ✅ IMPLEMENTED
  - Searches in name and description fields
  - Optional rarity filter
  - Returns: `{ data: [], query: "search term", count: 5 }`
- `POST /api/brainrots` - Create brainrot (development/admin only)
- `PUT /api/brainrots/:id` - Update brainrot (development/admin only)
- `DELETE /api/brainrots/:id` - Delete brainrot (development/admin only)

### Admin
- `POST /api/admin/update` - Trigger manual Fandom Wiki sync
  - Scrapes all 280+ brainrot pages from Fandom Wiki
  - Takes ~5-6 minutes with 1-second rate limiting
  - Returns: `{ success: true, count: 289, results: { created, updated, errors } }`

### Health
- `GET /health` - Health check endpoint
  - Returns: `{ status: "ok", timestamp, service: "steal-a-brainrot-backend" }`

## Database Schema

### brainrots Table (Enhanced v2)
```sql
id              SERIAL PRIMARY KEY
name            VARCHAR(255) NOT NULL
category        VARCHAR(100)                      -- Legacy, kept for backward compatibility
rarity          VARCHAR(50)                       -- NEW: Specific rarity tier
price           DECIMAL(10, 2)
image_url       TEXT
animation_data  JSONB
description     TEXT
game_id         VARCHAR(50) NOT NULL DEFAULT '109983668079237'
badge_id        BIGINT UNIQUE                     -- NEW: Roblox badge ID
metadata        JSONB                             -- NEW: Statistics (awardedCount, winRate, etc.)
data_source     VARCHAR(50) DEFAULT 'badges_api'  -- NEW: Track data origin
created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
UNIQUE(name, game_id)
UNIQUE(badge_id) WHERE badge_id IS NOT NULL
```

**New Indexes:**
- `idx_brainrots_badge_id` - Badge ID lookups
- `idx_brainrots_rarity` - Rarity filtering
- `idx_brainrots_metadata` - JSONB queries (GIN index)
- `idx_brainrots_data_source` - Source tracking

**Metadata JSONB Structure:**
```json
{
  "awardedCount": 10000,
  "pastDayAwardedCount": 100,
  "winRate": 5.5,
  "iconImageId": 987654321,
  "created": "2024-01-01T00:00:00.000Z",
  "updated": "2024-01-01T00:00:00.000Z"
}
```

**Migration:** Run `/database/schema_v2.sql` to add new columns and indexes

### categories Table
```sql
id             SERIAL PRIMARY KEY
name           VARCHAR(100) NOT NULL UNIQUE
description    TEXT
created_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
```

## Data Collection Strategy: Fandom Wiki Scraping

### Current Implementation (✅ Active)

**Data Source:** Steal a Brainrot Fandom Wiki (`https://stealabrainrot.fandom.com/wiki/Brainrots`)

**Why Fandom Wiki:**
- Most comprehensive and up-to-date brainrot database (289 items)
- Contains complete information: names, rarities, prices, images, descriptions
- Well-structured HTML with consistent infobox format
- Roblox Badges API returned empty results (game uses badges differently)

### FandomScraper Implementation (backend/src/services/fandomScraper.js)

**Implementation Flow:**
1. `parseMainListPage()` - Fetch main brainrots list page to get all brainrot page URLs
2. `parseBrainrotPage(pageName)` - Parse individual brainrot pages for detailed data
3. `extractFromInfobox($)` - Extract structured data from wiki infoboxes
4. `downloadImage(url, name)` - Download and save images locally
5. `scrapeAllBrainrots()` - Orchestrate complete scraping process with rate limiting

**Rarity Extraction:**
- Rarities are extracted directly from wiki infoboxes
- 11 tiers identified: Common, Rare, Epic, Legendary, Mythic, Brainrot God, Secret, OG, Admin, Taco, Festive
- Distribution: Secret (111), Common (51), Rare (35), Epic (29), Legendary (22), etc.

**Rate Limiting & Best Practices:**
- **CRITICAL:** 1-second delay between page requests (`requestDelay` in fandomScraper.js)
  - Never reduce below 1 second to avoid overwhelming the wiki server
  - Complete sync takes ~5-6 minutes for 280+ pages - this is intentional and respectful
- Proper User-Agent header identification: "steal-a-brainrot-scraper"
- Timeout handling (10 seconds per request)
- Error handling with detailed logging and graceful degradation
- Respectful scraping practices compliant with wiki terms
- Manual sync command: `POST /api/admin/update` (use sparingly, not during development testing)

### Historical Context (Deprecated Approaches)

**Puppeteer Scraping (Deprecated):** Generic selectors picked up wrong DOM elements, incomplete data

**Roblox Badges API (Deprecated):** Attempted integration but API returned empty results for this game

## Environment Variables

### Backend (.env)
```
PORT=3001
NODE_ENV=development
DB_HOST=postgres
DB_PORT=5432
DB_NAME=steal_a_brainrot
DB_USER=postgres
DB_PASSWORD=postgres
FRONTEND_URL=http://localhost:3000
ROBLOX_GAME_URL=https://www.roblox.com/games/109983668079237/Steal-a-Brainrot
SCRAPING_DELAY_MS=3000
SCRAPING_TIMEOUT_MS=30000
CRON_SCHEDULE=0 2 * * 0
ENABLE_CRON=false
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Steal a Brainrot
NODE_ENV=development
```

## Cron Scheduling

The backend includes an automated weekly update system using node-cron:
- **Schedule**: Every Sunday at 2:00 AM (configurable via `CRON_SCHEDULE`)
- **Timezone**: America/New_York (configurable in `backend/src/cron/scheduler.js`)
- **Enabled**: Only in production or when `ENABLE_CRON=true`
- **Location**: `backend/src/cron/scheduler.js`

To manually trigger an update:
```javascript
const { runUpdateNow } = require('./src/cron/scheduler');
await runUpdateNow();
```

## Docker Configuration

### Development Mode
- Volume mounts for hot-reload: `./backend:/app` and `./frontend:/app`
- `node_modules` excluded from mounts for performance
- Development-specific Dockerfiles: `Dockerfile.dev`
- Command override: `npm run dev`

### WSL2 Considerations
- Puppeteer requires `--no-sandbox` flag in WSL2
- Chromium dependencies included in Docker image
- `PUPPETEER_EXECUTABLE_PATH` set to system Chromium

## Common Development Tasks

### Adding a New API Endpoint
1. Create route handler in `backend/src/routes/`
2. Add validation using express-validator
3. Implement business logic in `backend/src/models/` or `backend/src/services/`
4. Mount route in `backend/src/index.js`
5. Update API client in `frontend/src/lib/api.js`

### Adding a New Frontend Component
1. Create component in `frontend/src/components/`
2. Use Framer Motion for animations (see BrainrotModal.js for reference)
3. Follow Tailwind CSS utility-first approach
4. Use rarity color mapping (see Key Design Decisions section for color classes)
5. Ensure responsive design (mobile, tablet, desktop)
6. Add keyboard navigation where appropriate (ESC to close, arrows for navigation)
7. Include ARIA labels for accessibility
8. Import and use in page components

### Modifying Scraping Logic
1. Update parsing logic in `backend/src/services/fandomScraper.js`
2. Key methods: `extractFromInfobox($)` for data extraction, `parseMainListPage()` for page list
3. Test with manual scraper command or trigger via `POST /api/admin/update`
4. Monitor console logs for extraction success rate (should see progress for 280+ pages)
5. Update error handling if wiki structure changes

### Database Schema Changes
1. Update `database/schema.sql`
2. Create migration script if needed
3. Run migration: `npm run migrate` (backend)
4. Update model in `backend/src/models/Brainrot.js`
5. Restart services

## Important Implementation Patterns

### Rarity Color Mapping
When working with rarity colors in components, use this helper function pattern (see BrainrotCard.js and BrainrotModal.js):

```javascript
const getRarityColor = (rarity) => {
  const colors = {
    'Common': 'text-gray-400 border-gray-400',
    'Rare': 'text-blue-400 border-blue-400',
    'Epic': 'text-purple-500 border-purple-500',
    'Legendary': 'text-yellow-400 border-yellow-400',
    'Mythic': 'text-red-500 border-red-500',
    'Brainrot God': 'text-pink-500 border-pink-500',
    'Secret': 'text-cyan-400 border-cyan-400',
    'OG': 'text-orange-500 border-orange-500',
    'Admin': 'text-indigo-600 border-indigo-600',
    'Taco': 'text-amber-600 border-amber-600',
    'Festive': 'text-green-500 border-green-500',
  };
  return colors[rarity] || 'text-gray-500 border-gray-500';
};
```

### Modal Navigation Pattern
For implementing navigation between items in modals or galleries, use this circular navigation pattern:

```javascript
// Navigate to next/previous item with circular wrapping
const handleNext = () => {
  const currentIndex = allItems.findIndex(item => item.id === selectedItem.id);
  const nextIndex = (currentIndex + 1) % allItems.length; // Wraps to 0 after last
  setSelectedItem(allItems[nextIndex]);
};

const handlePrevious = () => {
  const currentIndex = allItems.findIndex(item => item.id === selectedItem.id);
  const prevIndex = (currentIndex - 1 + allItems.length) % allItems.length; // Wraps to last from 0
  setSelectedItem(allItems[prevIndex]);
};

// Keyboard event handling
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrevious();
  };
  if (isOpen) {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }
}, [isOpen, selectedItem]);
```

### Image Handling Pattern
Images from Fandom Wiki may have CORS issues or be missing. Always include fallback:

```javascript
<img
  src={imageUrl || '/placeholder-brainrot.png'}
  alt={name}
  onError={(e) => { e.target.src = '/placeholder-brainrot.png'; }}
/>
```

### API Response Caching
The useBrainrots hook manages data fetching. When adding filters/search, preserve the existing data while fetching:

```javascript
const [brainrots, setBrainrots] = useState([]);
const [loading, setLoading] = useState(true);

// Don't clear brainrots immediately when filtering - show stale data while loading
const fetchBrainrots = async (filters) => {
  setLoading(true);
  // Keep existing brainrots displayed
  const data = await api.getBrainrots(filters);
  setBrainrots(data);
  setLoading(false);
};
```

## Important Notes

### Security Considerations
- Input validation on all API endpoints using express-validator
- CORS configured to only allow frontend origin
- Helmet.js for security headers
- No authentication yet (planned for future)

### Scraping Legal Compliance
- Respect Fandom Wiki Terms of Service and robots.txt
- Rate limiting implemented (1-second delays between requests)
- Proper User-Agent identification
- Weekly update frequency to minimize server load
- No aggressive scraping or DoS patterns
- Educational/research purpose clearly identified

### Image Handling
- Images downloaded and stored locally in Docker volume
- Served via Express static middleware at `/images`
- Filename sanitization to prevent path traversal
- 10-second timeout for image downloads

### Performance Optimization
- Database indexes on `category`, `game_id`, `name`, `updated_at`
- Pagination support in API (default 50 items per page)
- Image lazy loading on frontend (handled by Next.js)
- Connection pooling for PostgreSQL

## Troubleshooting

### Scraping Issues
- Check network connectivity to `stealabrainrot.fandom.com`
- Verify rate limiting delay (1 second between requests)
- If wiki structure changes, update selectors in `fandomScraper.js`
- Check console logs for detailed error messages during scraping
- Ensure images directory is writable: `/backend/src/images/`

### Database Connection Fails
- Verify PostgreSQL container is running: `docker-compose ps postgres`
- Check environment variables in docker-compose.yml
- Ensure schema is initialized: check `database/init.sql`
- View logs: `docker-compose logs postgres`

### Frontend Cannot Fetch Data
- Verify backend is running: `curl http://localhost:3001/health`
- Check CORS settings in `backend/src/index.js`
- Ensure `NEXT_PUBLIC_API_URL` matches backend URL
- Check browser console for CORS or network errors

### Port Already in Use
```bash
sudo lsof -i :3000  # Frontend
sudo lsof -i :3001  # Backend
sudo lsof -i :5432  # Database
```
Kill process or change ports in docker-compose.yml

## Implementation Status

### Current State (✅ Production Ready - Phase 7 In Progress)

The application is **fully functional** with Fandom Wiki scraping implementation:

**✅ Completed Features (Phases 1-6):**
- FandomScraper successfully fetches all brainrots from wiki (currently 299)
- Full-text search functionality across name and description fields
- Rarity filtering with 12 tier system
- Statistics dashboard showing rarity distribution
- Responsive frontend with search, filter, and stats UI
- Automated weekly sync via cron job
- Docker-based deployment with hot-reload in development
- Images downloaded and served locally

**✅ Phase 7 Features Completed:**
- Detail modal with keyboard navigation (ESC, ← →)
- Share functionality (Web Share API + clipboard fallback)
- Next/Previous brainrot navigation within modal
- Smooth Framer Motion animations

**⏳ Phase 7 In Progress:**
- Advanced filtering & sorting (next priority)
- Performance optimization
- Comprehensive testing suite
- Accessibility improvements

**Current Architecture:**
```
FandomScraper → PostgreSQL → REST API → Next.js Frontend
     ↓                           ↓
  Images/       →    Express Static Middleware
```

### Testing the Scraper

Test FandomScraper directly:
```bash
cd backend
node -e "const FandomScraper = require('./src/services/fandomScraper'); const fs = new FandomScraper(); fs.parseMainListPage().then(list => console.log('Found', list.length, 'brainrot pages'));"
```

Trigger manual sync:
```bash
cd backend
node -e "const UpdateService = require('./src/services/updateService'); const us = new UpdateService(); us.updateBrainrots().then(r => console.log('Synced', r.count, 'brainrots'));"
```

## Documentation Files

### Current Status & Planning
- `SESSION_STATUS.md` - **START HERE** - Current implementation status, services status, and next steps
- `CLAUDE.md` - This file - Development guide for Claude Code
- `PHASE7_PLAN.md` - Detailed Phase 7 roadmap (UI/UX polish & advanced features)
- `PHASE7_SESSION1_SUMMARY.md` - Phase 7 Session 1 completion summary

### Project Documentation
- `README.md` - Project overview and quick start
- `SETUP.md` - Detailed setup instructions
- `QUICK_START.md` - 5-minute quick start guide
- `PDR.md` - Product Design Report with requirements
- `PLAN.md` - Development plan with phases
- `TASKS.md` - Detailed task breakdown
- `TODO.md` - Actionable checklist

### Implementation Guides
- `SCRAPING_STRATEGY.md` - Web scraping implementation strategy
- `INTEGRATION_GUIDE.md` - Badges API integration guide (deprecated)
- `DEPLOYMENT.md` - Deployment guide
- `DECISIONS.md` - Project decisions with rationale
- `docs/PAGE_ANALYSIS.md` - Roblox page structure analysis

### Phase Summaries
- `PHASE4_SUMMARY.md` - Phase 4 completion summary
- `PHASE5_SUMMARY.md` - Phase 5 completion summary
- `PHASE6_SUMMARY.md` - Phase 6 completion summary
- `PHASE7_SESSION1_SUMMARY.md` - Phase 7 Session 1 summary (detail modal)
