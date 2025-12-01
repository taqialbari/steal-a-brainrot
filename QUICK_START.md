# Quick Start Guide
## Get Started in 5 Minutes

### Prerequisites Check ✅
- ✅ WSL2 installed
- ✅ Docker Desktop installed and running
- ✅ Git repository initialized

---

## 🚀 Start the Application

### Step 1: Start All Services

```bash
# Development mode (with hot reload)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Or production mode
docker-compose up --build
```

### Step 2: Wait for Services to Start

You should see:
- ✅ PostgreSQL database starting
- ✅ Backend API starting on port 3001
- ✅ Frontend starting on port 3000

### Step 3: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

---

## 🛑 Stop the Application

Press `Ctrl+C` or run:
```bash
docker-compose down
```

---

## 📝 Next Steps

1. ✅ Environment setup complete
2. [ ] Test backend API endpoints
3. [ ] Implement database schema
4. [ ] Create web scraping module
5. [ ] Build frontend components

---

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Check what's using the port
sudo lsof -i :3000
sudo lsof -i :3001

# Or change ports in docker-compose.yml
```

**Docker build fails?**
```bash
# Clean and rebuild
docker-compose down
docker system prune -a
docker-compose up --build
```

**Need more help?**
See [SETUP.md](./SETUP.md) for detailed setup instructions.

