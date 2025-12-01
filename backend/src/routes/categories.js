/**
 * Categories Routes
 * API endpoints for category operations
 */

const express = require('express');
const router = express.Router();
const Brainrot = require('../models/Brainrot');

/**
 * GET /api/categories
 * Get all categories with brainrot counts
 */
router.get('/', async (req, res, next) => {
  try {
    const categories = await Brainrot.getCategories();
    const categoryData = await Promise.all(
      categories.map(async (category) => {
        const count = await Brainrot.count(category);
        return { name: category, count };
      })
    );

    res.json({ data: categoryData });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

