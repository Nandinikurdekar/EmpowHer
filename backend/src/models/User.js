const { pool } = require('../config/db');

const User = {
  async create({ fullName, email, passwordHash, phone = null }) {
    const [result] = await pool.execute(
      `INSERT INTO users (full_name, email, password_hash, phone)
       VALUES (?, ?, ?, ?)`,
      [fullName, email, passwordHash, phone]
    );

    return result.insertId;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT id, full_name, email, phone, role, is_active, created_at, updated_at
       FROM users
       WHERE id = ?`,
      [id]
    );

    return rows[0] || null;
  },

  async findByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT id, full_name, email, password_hash, phone, role, is_active, created_at, updated_at
       FROM users
       WHERE email = ?`,
      [email]
    );

    return rows[0] || null;
  },

  async updateById(id, { fullName, phone, isActive }) {
    const [result] = await pool.execute(
      `UPDATE users
       SET full_name = COALESCE(?, full_name),
           phone = COALESCE(?, phone),
           is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [fullName ?? null, phone ?? null, isActive ?? null, id]
    );

    return result.affectedRows;
  }
};

module.exports = User;
