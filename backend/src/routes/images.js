/**
 * Images Routes
 * Serve brainrot images
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

const imagesDir = path.join(__dirname, '../../images');

// Serve static images with proper headers
router.use(express.static(imagesDir, {
  setHeaders: (res, filepath) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
    res.setHeader('Content-Type', getContentType(filepath));
  }
}));

/**
 * GET /api/images/:filename
 * Serve image file (fallback route)
 */
router.get('/:filename', async (req, res, next) => {
  try {
    const filename = req.params.filename;
    
    // Security: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const filepath = path.join(imagesDir, filename);
    
    try {
      await fs.access(filepath);
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.sendFile(filepath);
    } catch (error) {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * Get content type from file extension
 */
function getContentType(filepath) {
  const ext = path.extname(filepath).toLowerCase();
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  };
  return types[ext] || 'application/octet-stream';
}

module.exports = router;

