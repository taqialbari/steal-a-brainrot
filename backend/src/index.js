/**
 * Backend API Server
 * Steal a Brainrot - Main Entry Point
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { startScheduler } = require('./cron/scheduler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (images)
const path = require('path');
const imagesDir = path.join(__dirname, 'images');
app.use('/images', express.static(imagesDir));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'steal-a-brainrot-backend'
  });
});

// API Routes
const brainrotsRoutes = require('./routes/brainrots');
const categoriesRoutes = require('./routes/categories');
const adminRoutes = require('./routes/admin');

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Steal a Brainrot API',
    version: '1.0.0',
    endpoints: {
      brainrots: '/api/brainrots',
      categories: '/api/categories',
      admin: '/api/admin',
      health: '/health'
    }
  });
});

// Mount routes
const imagesRoutes = require('./routes/images');
app.use('/api/brainrots', brainrotsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/images', imagesRoutes);

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  
  // Test database connection
  try {
    const { query } = require('./database/connection');
    await query('SELECT 1');
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
  
  // Start cron scheduler (only in production or if enabled)
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_CRON === 'true') {
    startScheduler();
  } else {
    console.log('⏸️  Cron scheduler disabled (set ENABLE_CRON=true to enable)');
  }
});

module.exports = app;

