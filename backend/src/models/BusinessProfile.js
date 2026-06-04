const { pool } = require('../config/db');

const BusinessProfile = {
  async create({
    userId,
    businessName,
    businessCategory,
    businessDescription = null,
    businessLocation = null,
    businessImageUrl = null,
    websiteUrl = null,
    instagramUrl = null
  }) {
    const [result] = await pool.execute(
      `INSERT INTO business_profiles
       (user_id, business_name, business_category, business_description,
        business_location, business_image_url, website_url, instagram_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        businessName,
        businessCategory,
        businessDescription,
        businessLocation,
        businessImageUrl,
        websiteUrl,
        instagramUrl
      ]
    );

    return result.insertId;
  },

  async findByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT id, user_id, business_name, business_category, business_description,
              business_location, business_image_url, website_url, instagram_url,
              is_active, created_at, updated_at
       FROM business_profiles
       WHERE user_id = ?`,
      [userId]
    );

    return rows[0] || null;
  },

  async findActiveByCategory(category) {
    const [rows] = await pool.execute(
      `SELECT id, user_id, business_name, business_category, business_description,
              business_location, business_image_url, website_url, instagram_url,
              created_at, updated_at
       FROM business_profiles
       WHERE business_category = ? AND is_active = TRUE
       ORDER BY business_name ASC`,
      [category]
    );

    return rows;
  },

  async updateByUserId(userId, {
    businessName,
    businessCategory,
    businessDescription,
    businessLocation,
    businessImageUrl,
    websiteUrl,
    instagramUrl,
    isActive
  }) {
    const [result] = await pool.execute(
      `UPDATE business_profiles
       SET business_name = COALESCE(?, business_name),
           business_category = COALESCE(?, business_category),
           business_description = COALESCE(?, business_description),
           business_location = COALESCE(?, business_location),
           business_image_url = COALESCE(?, business_image_url),
           website_url = COALESCE(?, website_url),
           instagram_url = COALESCE(?, instagram_url),
           is_active = COALESCE(?, is_active)
       WHERE user_id = ?`,
      [
        businessName ?? null,
        businessCategory ?? null,
        businessDescription ?? null,
        businessLocation ?? null,
        businessImageUrl ?? null,
        websiteUrl ?? null,
        instagramUrl ?? null,
        isActive ?? null,
        userId
      ]
    );

    return result.affectedRows;
  }
};

module.exports = BusinessProfile;
