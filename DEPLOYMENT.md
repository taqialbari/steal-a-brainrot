# Deployment Guide
## Steal a Brainrot - Docker Deployment

Complete guide for deploying the Steal a Brainrot application using Docker.

---

## 📋 Prerequisites

- Docker Desktop installed and running
- WSL2 configured (for Windows)
- At least 4GB RAM available
- 10GB free disk space

---

## 🚀 Quick Start

### Development Mode

```bash
# Start all services in development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Production Mode

```bash
# Start all services in production mode
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🐳 Docker Services

### 1. PostgreSQL Database

**Container:** `steal-a-brainrot-db`  
**Port:** 5432  
**Volume:** `postgres_data` (persistent)

**Features:**
- Automatic schema initialization
- Health checks
- Data persistence

### 2. Backend API

**Container:** `steal-a-brainrot-backend`  
**Port:** 3001  
**Volumes:**
- `./backend:/app` (code)
- `./images:/app/images` (images)

**Features:**
- Puppeteer support
- Health checks
- Auto-restart on failure

### 3. Frontend

**Container:** `steal-a-brainrot-frontend`  
**Port:** 3000  
**Volumes:**
- `./frontend:/app` (code)
- `./frontend/.next` (build cache)

**Features:**
- Next.js optimized build
- Health checks
- Auto-restart on failure

---

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```env
NODE_ENV=production
PORT=3001
DB_HOST=postgres
DB_PORT=5432
DB_NAME=steal_a_brainrot
DB_USER=postgres
DB_PASSWORD=postgres
FRONTEND_URL=http://localhost:3000
ROBLOX_GAME_URL=https://www.roblox.com/games/109983668079237/Steal-a-Brainrot
ENABLE_CRON=true
CRON_SCHEDULE=0 2 * * 0
```

#### Frontend (.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Steal a Brainrot
NODE_ENV=production
```

---

## 📦 Building Images

### Build Individual Services

```bash
# Build backend
docker-compose build backend

# Build frontend
docker-compose build frontend

# Build all
docker-compose build
```

### Build with No Cache

```bash
docker-compose build --no-cache
```

---

## 🗄️ Database Management

### Run Migrations

```bash
# Run migrations
docker-compose exec backend npm run migrate

# Seed database
docker-compose exec backend npm run seed
```

### Database Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres steal_a_brainrot > backup_$(date +%Y%m%d).sql

# Restore backup
docker-compose exec -T postgres psql -U postgres steal_a_brainrot < backup_20231201.sql
```

### Access Database

```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d steal_a_brainrot

# Run SQL commands
docker-compose exec postgres psql -U postgres -d steal_a_brainrot -c "SELECT COUNT(*) FROM brainrots;"
```

---

## 🔍 Monitoring & Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Container Status

```bash
# Check running containers
docker-compose ps

# Check resource usage
docker stats

# Inspect container
docker inspect steal-a-brainrot-backend
```

### Health Checks

```bash
# Check health status
docker-compose ps

# Manual health check
curl http://localhost:3001/health
curl http://localhost:3000
```

---

## 🔄 Updates & Maintenance

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up --build -d

# Or restart specific service
docker-compose restart backend
```

### Clear Volumes

```bash
# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# Remove only specific volume
docker volume rm steal-a-brainrot_postgres_data
```

### Clean Up

```bash
# Remove stopped containers
docker-compose down

# Remove unused images
docker image prune

# Remove all unused resources
docker system prune -a
```

---

## 🐛 Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs

# Check if ports are in use
sudo lsof -i :3000
sudo lsof -i :3001
sudo lsof -i :5432

# Restart Docker
sudo systemctl restart docker
```

### Database Connection Issues

```bash
# Check if database is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Backend Issues

```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Rebuild backend
docker-compose up --build -d backend
```

### Frontend Issues

```bash
# Check frontend logs
docker-compose logs frontend

# Clear Next.js cache
docker-compose exec frontend rm -rf .next

# Rebuild frontend
docker-compose up --build -d frontend
```

### Puppeteer Issues

```bash
# Check if Chromium is installed
docker-compose exec backend chromium --version

# Check Puppeteer environment
docker-compose exec backend node -e "console.log(process.env.PUPPETEER_EXECUTABLE_PATH)"
```

---

## 🔒 Security Considerations

### Production Checklist

- [ ] Change default database password
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS (use reverse proxy)
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity
- [ ] Backup database regularly

### Environment Variables Security

```bash
# Use Docker secrets or environment files
# Never commit .env files to git
# Use strong passwords
# Rotate credentials regularly
```

---

## 📊 Performance Optimization

### Resource Limits

Add to `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### Image Optimization

- Use multi-stage builds (already implemented)
- Remove unnecessary dependencies
- Use .dockerignore files
- Cache layers effectively

---

## 🚢 WSL2 Specific Notes

### WSL2 Configuration

```bash
# Ensure WSL2 is set as default
wsl --set-default-version 2

# Check Docker integration
docker info

# If issues, restart Docker Desktop
```

### File Permissions

```bash
# Fix permissions if needed
sudo chown -R $USER:$USER .
```

### Performance

- Store project in WSL2 filesystem (not Windows)
- Use WSL2 backend in Docker Desktop
- Allocate sufficient memory to WSL2

---

## 📝 Deployment Checklist

### Pre-Deployment

- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Images optimized
- [ ] Security reviewed

### Deployment

- [ ] Build Docker images
- [ ] Start services
- [ ] Run migrations
- [ ] Verify health checks
- [ ] Test endpoints
- [ ] Check logs

### Post-Deployment

- [ ] Monitor logs
- [ ] Test functionality
- [ ] Verify data persistence
- [ ] Check performance
- [ ] Set up backups

---

## 🔗 Useful Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# Execute command in container
docker-compose exec backend npm run migrate

# Scale services (if needed)
docker-compose up -d --scale backend=2
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)

---

**Last Updated:** Phase 6 - Docker Setup & Deployment

