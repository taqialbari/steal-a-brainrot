/**
 * Admin Routes
 * Administrative endpoints for data management
 */

const express = require('express');
const router = express.Router();
const UpdateService = require('../services/updateService');

const updateService = new UpdateService();

/**
 * POST /api/admin/update
 * Trigger manual data update
 */
router.post('/update', async (req, res, next) => {
  try {
    const status = updateService.getStatus();
    
    if (status.isUpdating) {
      return res.status(409).json({
        error: 'Update already in progress',
        status
      });
    }

    // Run update asynchronously
    updateService.updateBrainrots()
      .then((result) => {
        console.log('Update completed:', result);
      })
      .catch((error) => {
        console.error('Update failed:', error);
      });

    res.json({
      message: 'Update started',
      status: updateService.getStatus()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/status
 * Get update status
 */
router.get('/status', (req, res) => {
  res.json({
    status: updateService.getStatus()
  });
});

module.exports = router;

