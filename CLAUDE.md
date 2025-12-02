# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Steal a Brainrot** is a web application that displays brainrot collectibles from the Roblox game "Steal a Brainrot" (Game ID: 109983668079237, Universe ID: 7709344486). The application uses Roblox's official Badges API to fetch all 217+ brainrot items with complete metadata, stores them in PostgreSQL, and displays them in a modern Next.js frontend with animations and rarity-based visual design.

## Architecture

### Three-Tier Architecture
- **Frontend**: Next.js 14+ with React, Framer Motion for animations, Tailwind CSS for styling, rarity-based visual design
- **Backend**: Node.js/Express.js REST API with Roblox Badges API integration (replaced broken Puppeteer scraper)
- **Database**: PostgreSQL with enhanced schema (badge_id, rarity, metadata JSONB, data_source tracking)
- **Automation**: node-cron scheduler for weekly badge sync (Sundays at 2 AM)

### Data Flow
1. BadgeService fetches all badges from Roblox Badges API (`https://badges.roblox.com/v1/universes/7709344486/badges`)
2. Pagination handles 217+ badges across multiple API pages
3. Badge icons downloaded from Thumbnails API and stored locally in `/backend/src/images/`
4. Rarity determined from win rate statistics (lower win rate = rarer)
5. Data stored in PostgreSQL with metadata (awardedCount, winRate, etc.)
6. Frontend fetches data via enhanced REST API with search/filter capabilities
7. Weekly cron job automatically syncs latest badge data

### Key Design Decisions
- **Data Source**: Roblox Badges API (official, authoritative source) - NOT web scraping
- **Why Badges API**: Steal a Brainrot uses Roblox badge system for collectibles; API provides complete metadata
- **Rarity System**: 8 tiers (Common, Rare, Epic, Legendary, Mythic, Brainrot God, Secret, OG) based on win rate percentages
- **Animation Format**: CSS/JavaScript animations using Framer Motion with rarity-specific effects
- **Deployment**: Docker-based with docker-compose for local WSL2 environment
- **Update Strategy**: Weekly automated badge sync, manual trigger available via admin endpoint

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

Trigger badge sync manually:
```bash
cd backend
node -e "const BadgeService = require('./src/services/badgeService'); const bs = new BadgeService(); bs.syncBrainrots().then(r => console.log('Synced', r.length, 'brainrots'));"
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
│   │   │   ├── badgeService.js      # Roblox Badges API integration (primary)
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
│   │   │   ├── BrainrotGrid.js     # Grid display of brainrots
│   │   │   ├── CategoryFilter.js   # Category filter component
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
- `GET /api/brainrots/rarities` - Get rarity counts and statistics (NEW)
- `GET /api/brainrots/search?q={query}&rarity={rarity}` - Full-text search (PLANNED)
- `GET /api/brainrots/stats` - Overall statistics dashboard (PLANNED)
- `POST /api/brainrots` - Create brainrot (development/admin only)
- `PUT /api/brainrots/:id` - Update brainrot (development/admin only)
- `DELETE /api/brainrots/:id` - Delete brainrot (development/admin only)

### Admin
- `POST /api/admin/sync` - Trigger manual badge sync from Roblox API (PLANNED)
- `GET /api/admin/sync-status` - Get last sync details (PLANNED)
- `POST /api/admin/update` - Legacy scraper trigger (deprecated, use /sync)

### Health
- `GET /health` - Health check endpoint

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

## Data Collection Strategy: Roblox Badges API

### Why Badges API Instead of Web Scraping?

**Previous Approach (Deprecated):** Puppeteer scraping with generic selectors picked up wrong DOM elements, resulting in incomplete data (116 items vs 217+ actual brainrots).

**Current Approach (✅ Implemented):** Roblox Badges API provides official, structured access to all game badges/collectibles.

### Implementation Status

**✅ Complete:**
- BadgeService class fully implemented (backend/src/services/badgeService.js)
- Database migration script ready (database/schema_v2.sql)
- Rarity parsing algorithm implemented
- Image downloading from Thumbnails API
- Pagination handling for 217+ badges
- Rate limiting and error handling

**⏳ Pending Integration:**
- Update updateService.js to use BadgeService instead of scraper
- Update Brainrot model to support new schema fields
- Run database migration
- Add new API endpoints for rarity stats and search
- Update frontend to display rarity information

### BadgeService Implementation (backend/src/services/badgeService.js)

**Key Discovery:** Steal a Brainrot uses Roblox's badge system to represent collectible brainrots.

**API Endpoints:**
- Badges: `https://badges.roblox.com/v1/universes/7709344486/badges`
- Thumbnails: `https://thumbnails.roblox.com/v1/badges/icons`

**Implementation Flow:**
1. `fetchAllBadges()` - Paginate through all badges (100 per page)
2. `fetchBadgeIcon(badgeId)` - Get icon URL from Thumbnails API
3. `parseRarity(badge)` - Determine rarity from win rate statistics
4. `downloadImage(url, name, id)` - Save icon locally with unique filename
5. `syncBrainrots()` - Orchestrate complete sync process

**Rarity Detection Algorithm:**
```javascript
function parseRarity(winRate) {
  if (winRate >= 20) return 'Common';      // Top 20%
  if (winRate >= 10) return 'Rare';        // 10-20%
  if (winRate >= 5) return 'Epic';         // 5-10%
  if (winRate >= 2) return 'Legendary';    // 2-5%
  if (winRate >= 0.5) return 'Mythic';     // 0.5-2%
  if (winRate >= 0.1) return 'Brainrot God'; // 0.1-0.5%
  return 'Secret';                          // <0.1%
}
```

### Rate Limiting & Best Practices
- 100ms delay between API requests (`BADGE_API_DELAY`)
- Proper User-Agent header identification
- Exponential backoff for retries (planned)
- Response caching (planned)
- Weekly update frequency sufficient for badge data

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
2. Use Framer Motion for animations
3. Follow Tailwind CSS utility-first approach
4. Ensure responsive design (mobile, tablet, desktop)
5. Import and use in page components

### Modifying Scraping Logic
1. Update selectors in `backend/src/services/scraper.js`
2. Test with `npm run test:integration` or manually trigger via admin endpoint
3. Monitor console logs for extraction success rate
4. Update error handling for page structure changes

### Database Schema Changes
1. Update `database/schema.sql`
2. Create migration script if needed
3. Run migration: `npm run migrate` (backend)
4. Update model in `backend/src/models/Brainrot.js`
5. Restart services

## Important Notes

### Security Considerations
- Input validation on all API endpoints using express-validator
- CORS configured to only allow frontend origin
- Helmet.js for security headers
- No authentication yet (planned for future)

### Scraping Legal Compliance
- Respect Roblox Terms of Service
- Rate limiting implemented (3-second delays)
- Proper User-Agent identification
- Weekly update frequency to minimize server load
- No aggressive scraping or DoS patterns

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

### Puppeteer Fails in Docker
- Ensure `--no-sandbox` flag is set
- Check Chromium dependencies in Dockerfile
- Verify `PUPPETEER_EXECUTABLE_PATH` environment variable
- Increase `SCRAPING_TIMEOUT_MS` if network is slow

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

## Important Implementation Notes

### Current Development Phase

The project is currently in **Phase 1: Badges API Integration** (in progress). The BadgeService is fully implemented and ready to use, but needs to be integrated into the existing codebase:

1. **Next Steps for Integration:**
   - Run database migration: `docker-compose exec -T postgres psql -U postgres -d steal_a_brainrot < database/schema_v2.sql`
   - Update `backend/src/services/updateService.js` to call BadgeService instead of scraper
   - Update `backend/src/models/Brainrot.js` to handle new fields (badge_id, rarity, metadata)
   - Add new API endpoints in `backend/src/routes/brainrots.js` for rarity filtering
   - Test the complete sync process

2. **Testing BadgeService Directly:**
   ```bash
   cd backend
   node -e "const BadgeService = require('./src/services/badgeService'); const bs = new BadgeService(); bs.fetchAllBadges().then(b => console.log('Found', b.length, 'badges'));"
   ```

3. **Expected Results After Integration:**
   - 217+ brainrots fetched from Roblox Badges API
   - Each brainrot will have a rarity tier (8 tiers total)
   - Complete metadata including win rates and award counts
   - All badge icons downloaded to `/backend/src/images/`

### Code Architecture Notes

**Data Flow (Current):**
- updateService.js → scraper.js → PostgreSQL → API → Frontend

**Data Flow (After Integration):**
- updateService.js → badgeService.js → PostgreSQL → API → Frontend

**Key Files to Modify:**
- `backend/src/services/updateService.js` - Switch from scraper to badgeService
- `backend/src/models/Brainrot.js` - Add support for badge_id, rarity, metadata fields
- `backend/src/routes/brainrots.js` - Add rarity filtering and search endpoints

## Documentation Files

- `README.md` - Project overview and quick start
- `SETUP.md` - Detailed setup instructions
- `QUICK_START.md` - 5-minute quick start guide
- `SESSION_STATUS.md` - Current implementation status and next steps
- `PDR.md` - Product Design Report with requirements
- `PLAN.md` - Development plan with phases
- `TASKS.md` - Detailed task breakdown
- `TODO.md` - Actionable checklist
- `SCRAPING_STRATEGY.md` - Web scraping implementation strategy
- `DECISIONS.md` - Project decisions with rationale
- `INTEGRATION_GUIDE.md` - Badges API integration guide
- `PHASE4_SUMMARY.md` - Phase 4 completion summary
- `PHASE5_SUMMARY.md` - Phase 5 completion summary
- `PHASE6_SUMMARY.md` - Phase 6 completion summary
- `docs/PAGE_ANALYSIS.md` - Roblox page structure analysis
