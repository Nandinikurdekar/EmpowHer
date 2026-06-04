const { pool } = require('../config/db');

const Connection = {
  async create({ senderId, receiverId }) {
    const [result] = await pool.execute(
      `INSERT INTO connections (sender_id, receiver_id)
       VALUES (?, ?)`,
      [senderId, receiverId]
    );

    return result.insertId;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT id, sender_id, receiver_id, status, created_at, updated_at
       FROM connections
       WHERE id = ?`,
      [id]
    );

    return rows[0] || null;
  },

  async findBetweenUsers(firstUserId, secondUserId) {
    const [rows] = await pool.execute(
      `SELECT id, sender_id, receiver_id, status, created_at, updated_at
       FROM connections
       WHERE pair_user_low = LEAST(?, ?)
         AND pair_user_high = GREATEST(?, ?)`,
      [firstUserId, secondUserId, firstUserId, secondUserId]
    );

    return rows[0] || null;
  },

  async findForUser(userId, status = 'accepted') {
    const [rows] = await pool.execute(
      `SELECT id, sender_id, receiver_id, status, created_at, updated_at
       FROM connections
       WHERE (sender_id = ? OR receiver_id = ?)
         AND status = ?
       ORDER BY updated_at DESC`,
      [userId, userId, status]
    );

    return rows;
  },

  async updateStatus(id, status) {
    const [result] = await pool.execute(
      `UPDATE connections
       SET status = ?
       WHERE id = ?`,
      [status, id]
    );

    return result.affectedRows;
  }
};

module.exports = Connection;
