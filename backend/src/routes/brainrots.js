/**
 * Brainrots Routes
 * API endpoints for brainrot operations
 */

const express = require('express');
const router = express.Router();
const Brainrot = require('../models/Brainrot');
const { body, param, query, validationResult } = require('express-validator');

/**
 * GET /api/brainrots
 * Get all brainrots with optional filtering, sorting, and pagination
 */
router.get(
  '/',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    query('category').optional().isString().trim(),
    query('rarity').optional().isString().trim(),
    query('rarities').optional().isArray(),
    query('rarities.*').optional().isString().trim(),
    query('priceMin').optional().isFloat({ min: 0 }).toFloat(),
    query('priceMax').optional().isFloat({ min: 0 }).toFloat(),
    query('sortBy').optional().isIn(['name', 'rarity', 'price', 'created_at', 'updated_at']),
    query('sortOrder').optional().isIn(['ASC', 'DESC', 'asc', 'desc'])
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        limit = 50,
        offset = 0,
        category = null,
        rarity = null,
        rarities = null,
        priceMin = null,
        priceMax = null,
        sortBy = 'updated_at',
        sortOrder = 'DESC'
      } = req.query;

      const [brainrots, total] = await Promise.all([
        Brainrot.findAll({
          limit: parseInt(limit),
          offset: parseInt(offset),
          category,
          rarity,
          rarities,
          priceMin,
          priceMax,
          sortBy,
          sortOrder: sortOrder.toUpperCase()
        }),
        Brainrot.count(category)
      ]);

      res.json({
        data: brainrots,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + brainrots.length) < total
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/brainrots/categories/list
 * Get all available categories
 */
router.get('/categories/list', async (req, res, next) => {
  try {
    const categories = await Brainrot.getCategories();
    res.json({ data: categories });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/brainrots/rarities
 * Get all available rarities with counts
 */
router.get('/rarities', async (req, res, next) => {
  try {
    const rarities = await Brainrot.getRarities();
    res.json({ data: rarities });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/brainrots/search
 * Search brainrots by name or description
 */
router.get('/search', [
  query('q').notEmpty().trim().isLength({ min: 1, max: 100 }),
  query('rarity').optional().isString().trim(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { q, rarity = null, limit = 50 } = req.query;

    // Build search query
    let sql = `
      SELECT * FROM brainrots
      WHERE (
        LOWER(name) LIKE LOWER($1) OR
        LOWER(description) LIKE LOWER($1)
      )
    `;
    const params = [`%${q}%`];

    if (rarity) {
      sql += ' AND rarity = $2';
      params.push(rarity);
    }

    sql += ' ORDER BY name ASC LIMIT $' + (params.length + 1);
    params.push(parseInt(limit));

    const { query: dbQuery } = require('../database/connection');
    const result = await dbQuery(sql, params);

    res.json({
      data: result.rows,
      query: q,
      count: result.rows.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/brainrots/:id
 * Get a single brainrot by ID
 */
router.get(
  '/:id',
  [param('id').isInt({ min: 1 })],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const brainrot = await Brainrot.findById(parseInt(req.params.id));

      if (!brainrot) {
        return res.status(404).json({ error: 'Brainrot not found' });
      }

      res.json({ data: brainrot });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/brainrots
 * Create a new brainrot (admin/development only)
 */
router.post(
  '/',
  [
    body('name').notEmpty().trim().isLength({ min: 1, max: 255 }),
    body('category').optional().isString().trim(),
    body('price').optional().isFloat({ min: 0 }).toFloat(),
    body('imageUrl').optional().isURL(),
    body('description').optional().isString().trim(),
    body('gameId').optional().isString()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const brainrot = await Brainrot.create(req.body);
      res.status(201).json({ data: brainrot });
    } catch (error) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Brainrot with this name already exists' });
      }
      next(error);
    }
  }
);

/**
 * PUT /api/brainrots/:id
 * Update a brainrot (admin/development only)
 */
router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }),
    body('name').optional().notEmpty().trim(),
    body('category').optional().isString().trim(),
    body('price').optional().isFloat({ min: 0 }).toFloat(),
    body('imageUrl').optional().isURL(),
    body('description').optional().isString().trim()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const brainrot = await Brainrot.update(parseInt(req.params.id), req.body);
      
      if (!brainrot) {
        return res.status(404).json({ error: 'Brainrot not found' });
      }

      res.json({ data: brainrot });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/brainrots/:id
 * Delete a brainrot (admin/development only)
 */
router.delete(
  '/:id',
  [param('id').isInt({ min: 1 })],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const deleted = await Brainrot.delete(parseInt(req.params.id));
      
      if (!deleted) {
        return res.status(404).json({ error: 'Brainrot not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

