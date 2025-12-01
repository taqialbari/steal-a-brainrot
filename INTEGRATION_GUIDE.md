# Integration & Testing Guide
## Phase 5: Integration & Testing

This guide covers how to test and verify the integration between all components.

---

## 🧪 Test Scripts

### Available Test Scripts

1. **test-database.js** - Tests database connectivity and schema
2. **test-api.js** - Tests all backend API endpoints
3. **test-frontend.js** - Tests frontend connectivity
4. **test-all.js** - Runs all tests in sequence

### Running Tests

#### Individual Tests

```bash
# Test database
node scripts/test-database.js

# Test API
node scripts/test-api.js

# Test frontend
node scripts/test-frontend.js
```

#### All Tests

```bash
node scripts/test-all.js
```

#### From Backend Directory

```bash
cd backend
npm run test:integration
```

---

## ✅ Integration Checklist

### 1. Database Integration

- [ ] PostgreSQL container is running
- [ ] Database connection successful
- [ ] Schema tables exist (brainrots, categories)
- [ ] Migrations run successfully
- [ ] Can query brainrots data

**Test:**
```bash
node scripts/test-database.js
```

### 2. Backend API Integration

- [ ] Backend server starts successfully
- [ ] Health check endpoint works
- [ ] All API endpoints respond correctly
- [ ] CORS headers are set properly
- [ ] Error handling works

**Test:**
```bash
node scripts/test-api.js
```

**Manual Test:**
```bash
# Health check
curl http://localhost:3001/health

# Get brainrots
curl http://localhost:3001/api/brainrots

# Get categories
curl http://localhost:3001/api/categories
```

### 3. Frontend Integration

- [ ] Frontend server starts successfully
- [ ] Frontend can connect to backend API
- [ ] API calls work correctly
- [ ] Images load properly
- [ ] No CORS errors in browser console

**Test:**
```bash
node scripts/test-frontend.js
```

**Manual Test:**
1. Open http://localhost:3000 in browser
2. Check browser console for errors
3. Verify brainrots are displayed
4. Test category filtering
5. Check network tab for API calls

### 4. Image Serving

- [ ] Images directory exists
- [ ] Images are served correctly
- [ ] Image URLs are accessible
- [ ] Fallback images work

**Test:**
```bash
# Check if images directory exists
ls -la backend/images/

# Test image endpoint
curl http://localhost:3001/api/images/test.jpg
```

### 5. End-to-End Flow

- [ ] Start all services
- [ ] Frontend loads
- [ ] API calls succeed
- [ ] Brainrots display
- [ ] Images load
- [ ] Filters work
- [ ] Animations work

**Test:**
```bash
# Start all services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# In another terminal, run tests
node scripts/test-all.js
```

---

## 🔧 Common Issues & Fixes

### Issue: Database Connection Failed

**Symptoms:**
- `Database connection failed` error
- Backend can't connect to PostgreSQL

**Fix:**
```bash
# Start PostgreSQL
docker-compose up postgres -d

# Wait for it to be ready
docker-compose ps postgres

# Run migrations
docker-compose exec backend npm run migrate
```

### Issue: CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- API calls fail from frontend

**Fix:**
1. Check `FRONTEND_URL` in backend `.env`
2. Verify CORS configuration in `backend/src/index.js`
3. Ensure frontend URL matches exactly

### Issue: Images Not Loading

**Symptoms:**
- Images show broken/placeholder
- 404 errors for images

**Fix:**
```bash
# Check images directory
ls -la backend/images/

# Ensure images volume is mounted in docker-compose.yml
# Check image serving route in backend/src/routes/images.js
```

### Issue: API Endpoints Not Found

**Symptoms:**
- 404 errors for API calls
- Endpoints not responding

**Fix:**
1. Verify backend is running: `docker-compose ps backend`
2. Check backend logs: `docker-compose logs backend`
3. Verify routes are mounted in `backend/src/index.js`

---

## 📊 Performance Testing

### Backend Performance

```bash
# Test API response times
time curl http://localhost:3001/api/brainrots

# Load test (if you have Apache Bench)
ab -n 100 -c 10 http://localhost:3001/api/brainrots
```

### Frontend Performance

1. Open browser DevTools
2. Go to Network tab
3. Check load times
4. Verify images are optimized
5. Check bundle size

---

## 🐛 Debugging

### Backend Logs

```bash
# View backend logs
docker-compose logs -f backend

# View specific service logs
docker-compose logs backend | tail -50
```

### Frontend Logs

```bash
# View frontend logs
docker-compose logs -f frontend
```

### Database Logs

```bash
# View database logs
docker-compose logs -f postgres
```

### Database Connection

```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d steal_a_brainrot

# Check tables
\dt

# Check brainrots
SELECT COUNT(*) FROM brainrots;
```

---

## ✅ Success Criteria

All integration tests should pass:
- ✅ Database connection successful
- ✅ All API endpoints respond correctly
- ✅ Frontend can connect to backend
- ✅ Images are served correctly
- ✅ No CORS errors
- ✅ Data flows end-to-end
- ✅ Error handling works
- ✅ Loading states work

---

## 📝 Next Steps

After integration testing:
1. Fix any issues found
2. Run performance tests
3. Optimize slow endpoints
4. Add more test coverage
5. Document any issues

---

**Last Updated:** Phase 5 - Integration & Testing

