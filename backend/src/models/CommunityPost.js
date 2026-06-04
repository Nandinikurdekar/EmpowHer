const { pool } = require('../config/db');

const CommunityPost = {
  async create({
    userId,
    content,
    imageUrl = null,
    postType = 'general',
    visibility = 'public'
  }) {
    const [result] = await pool.execute(
      `INSERT INTO community_posts (user_id, content, image_url, post_type, visibility)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, content, imageUrl, postType, visibility]
    );

    return result.insertId;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT id, user_id, content, image_url, post_type, visibility,
              is_active, created_at, updated_at
       FROM community_posts
       WHERE id = ?`,
      [id]
    );

    return rows[0] || null;
  },

  async findActive({ limit = 20, offset = 0 } = {}) {
    const [rows] = await pool.execute(
      `SELECT id, user_id, content, image_url, post_type, visibility,
              created_at, updated_at
       FROM community_posts
       WHERE is_active = TRUE
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return rows;
  },

  async updateById(id, { content, imageUrl, postType, visibility, isActive }) {
    const [result] = await pool.execute(
      `UPDATE community_posts
       SET content = COALESCE(?, content),
           image_url = COALESCE(?, image_url),
           post_type = COALESCE(?, post_type),
           visibility = COALESCE(?, visibility),
           is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [
        content ?? null,
        imageUrl ?? null,
        postType ?? null,
        visibility ?? null,
        isActive ?? null,
        id
      ]
    );

    return result.affectedRows;
  }
};

module.exports = CommunityPost;
