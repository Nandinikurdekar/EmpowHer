const { pool } = require('../config/db');

const PostComment = {
  async create({ postId, userId, commentText }) {
    const [result] = await pool.execute(
      `INSERT INTO post_comments (post_id, user_id, comment_text)
       VALUES (?, ?, ?)`,
      [postId, userId, commentText]
    );

    return result.insertId;
  },

  async findByPostId(postId, { limit = 20, offset = 0 } = {}) {
    const [rows] = await pool.execute(
      `SELECT id, post_id, user_id, comment_text, is_active, created_at, updated_at
       FROM post_comments
       WHERE post_id = ? AND is_active = TRUE
       ORDER BY created_at ASC
       LIMIT ? OFFSET ?`,
      [postId, limit, offset]
    );

    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT id, post_id, user_id, comment_text, is_active, created_at, updated_at
       FROM post_comments
       WHERE id = ?`,
      [id]
    );

    return rows[0] || null;
  },

  async updateById(id, { commentText, isActive }) {
    const [result] = await pool.execute(
      `UPDATE post_comments
       SET comment_text = COALESCE(?, comment_text),
           is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [commentText ?? null, isActive ?? null, id]
    );

    return result.affectedRows;
  }
};

module.exports = PostComment;
