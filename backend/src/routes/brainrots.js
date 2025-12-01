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
 * Get all brainrots with optional filtering and pagination
 */
router.get(
  '/',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    query('category').optional().isString().trim()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { limit = 50, offset = 0, category = null } = req.query;
      
      const [brainrots, total] = await Promise.all([
        Brainrot.findAll({ limit: parseInt(limit), offset: parseInt(offset), category }),
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

