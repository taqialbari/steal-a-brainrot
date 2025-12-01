# Setup Guide
## Steal a Brainrot - Development Environment

This guide will help you set up the development environment for the Steal a Brainrot web application.

---

## 📋 Prerequisites

### Required Software

1. **WSL2** (Windows Subsystem for Linux 2)
   - Already installed and configured ✅

2. **Docker Desktop**
   - Version: 29.0.1 ✅
   - Docker Compose: v2.40.3 ✅
   - Verified working ✅

3. **Node.js** (for local development - optional)
   - Recommended: Node.js 18+ and npm 9+
   - **Note:** Node.js is not required if using Docker only
   - Install from: https://nodejs.org/

4. **Git**
   - Already initialized ✅

---

## 🚀 Quick Start (Docker)

### Option 1: Development Mode (Recommended)

1. **Start all services:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

3. **Stop services:**
   ```bash
   docker-compose down
   ```

### Option 2: Production Mode

1. **Start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

---

## 🛠️ Manual Setup (Without Docker)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Database Setup

1. **Start PostgreSQL (using Docker):**
   ```bash
   docker-compose up postgres -d
   ```

2. **Run database migrations:**
   ```bash
   # From backend directory
   npm run migrate
   ```

3. **Seed database (optional):**
   ```bash
   npm run seed
   ```

---

## 📁 Project Structure

```
steal-a-brainrot/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   └── index.js      # Main server file
│   ├── package.json
│   ├── Dockerfile
│   └── Dockerfile.dev
├── frontend/             # Next.js application
│   ├── src/
│   │   └── app/          # Next.js app directory
│   ├── package.json
│   ├── Dockerfile
│   └── Dockerfile.dev
├── database/             # Database files
│   ├── schema.sql        # Database schema
│   └── init.sql          # Initialization script
├── docker/               # Docker configurations
├── scripts/              # Utility scripts
├── docs/                 # Documentation
├── docker-compose.yml    # Production Docker Compose
└── docker-compose.dev.yml # Development Docker Compose
```

---

## 🔧 Environment Variables

### Backend (.env)

Create `backend/.env` from `backend/.env.example`:

```env
PORT=3001
NODE_ENV=development
DB_HOST=postgres
DB_PORT=5432
DB_NAME=steal_a_brainrot
DB_USER=postgres
DB_PASSWORD=postgres
API_BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
ROBLOX_GAME_URL=https://www.roblox.com/games/109983668079237/Steal-a-Brainrot
SCRAPING_DELAY_MS=3000
CRON_SCHEDULE=0 2 * * 0
```

### Frontend (.env)

Create `frontend/.env` from `frontend/.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Steal a Brainrot
NODE_ENV=development
```

---

## 🐳 Docker Commands

### Build and Start
```bash
# Development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Production
docker-compose up --build
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Execute Commands in Containers
```bash
# Backend
docker-compose exec backend npm run migrate

# Database
docker-compose exec postgres psql -U postgres -d steal_a_brainrot
```

### Clean Up
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

---

## 🗄️ Database Management

### Connect to Database

```bash
# Using Docker
docker-compose exec postgres psql -U postgres -d steal_a_brainrot

# Or from host (if port is exposed)
psql -h localhost -U postgres -d steal_a_brainrot
```

### Run Migrations

```bash
# From backend container
docker-compose exec backend npm run migrate

# Or locally (if Node.js is installed)
cd backend && npm run migrate
```

### Backup Database

```bash
docker-compose exec postgres pg_dump -U postgres steal_a_brainrot > backup.sql
```

### Restore Database

```bash
docker-compose exec -T postgres psql -U postgres steal_a_brainrot < backup.sql
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🐛 Troubleshooting

### Docker Issues

**Problem:** Port already in use
```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :3001
sudo lsof -i :5432

# Kill process or change port in docker-compose.yml
```

**Problem:** Docker build fails
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

**Problem:** Puppeteer fails in Docker
- Ensure Chromium dependencies are installed (already in Dockerfile)
- Check `PUPPETEER_EXECUTABLE_PATH` environment variable

### Database Issues

**Problem:** Cannot connect to database
```bash
# Check if database is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

**Problem:** Migration fails
```bash
# Check database connection
docker-compose exec postgres psql -U postgres -c "SELECT 1;"

# Run schema manually
docker-compose exec -T postgres psql -U postgres -d steal_a_brainrot < database/schema.sql
```

### Node.js Issues

**Problem:** npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Next Steps

After setup is complete:

1. ✅ Verify all services are running
2. [ ] Test backend API endpoints
3. [ ] Test frontend connection to backend
4. [ ] Set up database schema
5. [ ] Implement web scraping module
6. [ ] Test data collection
7. [ ] Implement frontend components

---

## 🔗 Useful Links

- [Docker Documentation](https://docs.docker.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Puppeteer Documentation](https://pptr.dev/)

---

**Last Updated:** Environment setup phase

