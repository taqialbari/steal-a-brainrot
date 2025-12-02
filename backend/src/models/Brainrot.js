/**
 * Brainrot Model
 * Database operations for brainrots
 */

const { query } = require('../database/connection');

class Brainrot {
  /**
   * Get all brainrots
   * @param {Object} options - Query options (limit, offset, category, rarity)
   * @returns {Promise<Array>}
   */
  static async findAll(options = {}) {
    const { limit = 100, offset = 0, category = null, rarity = null } = options;
    let sql = 'SELECT * FROM brainrots WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND category = $' + (params.length + 1);
      params.push(category);
    }

    if (rarity) {
      sql += ' AND rarity = $' + (params.length + 1);
      params.push(rarity);
    }

    sql += ' ORDER BY updated_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
  }

  /**
   * Get brainrot by ID
   * @param {number} id - Brainrot ID
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    const result = await query('SELECT * FROM brainrots WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  /**
   * Get brainrot by name and game ID
   * @param {string} name - Brainrot name
   * @param {string} gameId - Game ID
   * @returns {Promise<Object|null>}
   */
  static async findByName(name, gameId = '109983668079237') {
    const result = await query(
      'SELECT * FROM brainrots WHERE name = $1 AND game_id = $2',
      [name, gameId]
    );
    return result.rows[0] || null;
  }

  /**
   * Get brainrot by badge ID
   * @param {number} badgeId - Roblox badge ID
   * @returns {Promise<Object|null>}
   */
  static async findByBadgeId(badgeId) {
    const result = await query(
      'SELECT * FROM brainrots WHERE badge_id = $1',
      [badgeId]
    );
    return result.rows[0] || null;
  }

  /**
   * Create a new brainrot
   * @param {Object} data - Brainrot data
   * @returns {Promise<Object>}
   */
  static async create(data) {
    const {
      name,
      category,
      price,
      imageUrl,
      animationData,
      description,
      gameId = '109983668079237',
      badgeId,
      rarity,
      metadata,
      dataSource = 'badges_api'
    } = data;

    const sql = `
      INSERT INTO brainrots (
        name, category, price, image_url, animation_data, description,
        game_id, badge_id, rarity, metadata, data_source
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const params = [
      name,
      category,
      price,
      imageUrl,
      animationData ? JSON.stringify(animationData) : null,
      description,
      gameId,
      badgeId,
      rarity,
      metadata ? JSON.stringify(metadata) : null,
      dataSource
    ];

    const result = await query(sql, params);
    return result.rows[0];
  }

  /**
   * Update a brainrot
   * @param {number} id - Brainrot ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object|null>}
   */
  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(data).forEach(key => {
      if (key === 'animationData') {
        fields.push(`animation_data = $${paramCount}`);
        values.push(data[key] ? JSON.stringify(data[key]) : null);
      } else if (key === 'imageUrl') {
        fields.push(`image_url = $${paramCount}`);
        values.push(data[key]);
      } else if (key === 'badgeId') {
        fields.push(`badge_id = $${paramCount}`);
        values.push(data[key]);
      } else if (key === 'dataSource') {
        fields.push(`data_source = $${paramCount}`);
        values.push(data[key]);
      } else if (key === 'metadata') {
        fields.push(`metadata = $${paramCount}`);
        values.push(data[key] ? JSON.stringify(data[key]) : null);
      } else {
        fields.push(`${key} = $${paramCount}`);
        values.push(data[key]);
      }
      paramCount++;
    });

    if (fields.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const sql = `
      UPDATE brainrots
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await query(sql, values);
    return result.rows[0] || null;
  }

  /**
   * Upsert brainrot (insert or update)
   * @param {Object} data - Brainrot data
   * @returns {Promise<Object>}
   */
  static async upsert(data) {
    // Try to find by badge_id first, then fall back to name
    let existing = null;

    if (data.badgeId) {
      existing = await this.findByBadgeId(data.badgeId);
    }

    if (!existing) {
      existing = await this.findByName(data.name, data.gameId || '109983668079237');
    }

    if (existing) {
      return await this.update(existing.id, data);
    } else {
      return await this.create(data);
    }
  }

  /**
   * Delete a brainrot
   * @param {number} id - Brainrot ID
   * @returns {Promise<boolean>}
   */
  static async delete(id) {
    const result = await query('DELETE FROM brainrots WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }

  /**
   * Get all categories
   * @returns {Promise<Array>}
   */
  static async getCategories() {
    const result = await query(
      'SELECT DISTINCT category FROM brainrots WHERE category IS NOT NULL ORDER BY category'
    );
    return result.rows.map(row => row.category);
  }

  /**
   * Get all rarities with counts
   * @returns {Promise<Array>}
   */
  static async getRarities() {
    const result = await query(
      'SELECT rarity, COUNT(*) as count FROM brainrots WHERE rarity IS NOT NULL GROUP BY rarity ORDER BY count DESC'
    );
    return result.rows;
  }

  /**
   * Get count of brainrots
   * @param {string} category - Optional category filter
   * @returns {Promise<number>}
   */
  static async count(category = null) {
    let sql = 'SELECT COUNT(*) FROM brainrots WHERE 1=1';
    const params = [];
    
    if (category) {
      sql += ' AND category = $1';
      params.push(category);
    }
    
    const result = await query(sql, params);
    return parseInt(result.rows[0].count, 10);
  }
}

module.exports = Brainrot;

