# Backend API Documentation
## Steal a Brainrot Backend

### Overview

Node.js/Express backend API for the Steal a Brainrot web application.

### Project Structure

```
backend/
├── src/
│   ├── index.js              # Main server entry point
│   ├── models/               # Database models
│   │   └── Brainrot.js       # Brainrot model
│   ├── routes/               # API routes
│   │   ├── brainrots.js      # Brainrot endpoints
│   │   ├── categories.js     # Category endpoints
│   │   ├── admin.js          # Admin endpoints
│   │   └── images.js         # Image serving
│   ├── services/             # Business logic
│   │   ├── scraper.js        # Web scraping service
│   │   └── updateService.js  # Data update service
│   ├── database/             # Database utilities
│   │   ├── connection.js     # DB connection
│   │   ├── migrate.js        # Migration script
│   │   └── seed.js           # Seed script
│   ├── cron/                 # Scheduled tasks
│   │   └── scheduler.js      # Cron scheduler
│   └── middleware/           # Express middleware
│       └── errorHandler.js   # Error handling
├── images/                   # Downloaded images (created at runtime)
├── package.json
├── Dockerfile
└── Dockerfile.dev
```

---

## API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Brainrots
- **GET** `/api/brainrots` - Get all brainrots (with pagination and filtering)
  - Query params: `limit`, `offset`, `category`
- **GET** `/api/brainrots/:id` - Get single brainrot by ID
- **GET** `/api/brainrots/categories/list` - Get all categories
- **POST** `/api/brainrots` - Create new brainrot
- **PUT** `/api/brainrots/:id` - Update brainrot
- **DELETE** `/api/brainrots/:id` - Delete brainrot

### Categories
- **GET** `/api/categories` - Get all categories with counts

### Admin
- **POST** `/api/admin/update` - Trigger manual data update
- **GET** `/api/admin/status` - Get update status

### Images
- **GET** `/api/images/:filename` - Serve brainrot images

---

## Environment Variables

See `.env.example` for all available environment variables.

Key variables:
- `PORT` - Server port (default: 3001)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `ROBLOX_GAME_URL` - Roblox game URL to scrape
- `CRON_SCHEDULE` - Cron schedule for updates (default: `0 2 * * 0`)
- `ENABLE_CRON` - Enable cron scheduler (set to `true`)

---

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Run Migrations
```bash
npm run migrate
```

### Seed Database
```bash
npm run seed
```

### Run Tests
```bash
npm test
```

---

## Web Scraping

The scraper uses Puppeteer to extract brainrot data from the Roblox game page.

### Features
- JavaScript rendering support
- Network request monitoring
- Image downloading and storage
- Multiple selector strategies
- Error handling and retries

### Manual Update
Trigger a manual update via API:
```bash
curl -X POST http://localhost:3001/api/admin/update
```

### Scheduled Updates
Weekly updates are scheduled via node-cron. Default: Sunday 2 AM.

---

## Database

### Schema
See `../database/schema.sql` for the complete database schema.

### Connection
The database connection is configured via environment variables and uses connection pooling.

---

## Docker

### Build
```bash
docker build -t steal-a-brainrot-backend .
```

### Run
```bash
docker run -p 3001:3001 steal-a-brainrot-backend
```

---

## Notes

- Images are stored in `./images` directory
- Puppeteer requires Chromium (included in Docker image)
- Database migrations run automatically on container start
- Cron scheduler is disabled by default (set `ENABLE_CRON=true`)

