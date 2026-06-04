const { pool } = require('../config/db');

const EntrepreneurProfile = {
  async create({
    userId,
    bio = null,
    location = null,
    skills = null,
    interests = null,
    profileImageUrl = null,
    experienceLevel = 'beginner'
  }) {
    const [result] = await pool.execute(
      `INSERT INTO entrepreneur_profiles
       (user_id, bio, location, skills, interests, profile_image_url, experience_level)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, bio, location, skills, interests, profileImageUrl, experienceLevel]
    );

    return result.insertId;
  },

  async findByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT id, user_id, bio, location, skills, interests, profile_image_url,
              experience_level, created_at, updated_at
       FROM entrepreneur_profiles
       WHERE user_id = ?`,
      [userId]
    );

    return rows[0] || null;
  },

  async updateByUserId(userId, { bio, location, skills, interests, profileImageUrl, experienceLevel }) {
    const [result] = await pool.execute(
      `UPDATE entrepreneur_profiles
       SET bio = COALESCE(?, bio),
           location = COALESCE(?, location),
           skills = COALESCE(?, skills),
           interests = COALESCE(?, interests),
           profile_image_url = COALESCE(?, profile_image_url),
           experience_level = COALESCE(?, experience_level)
       WHERE user_id = ?`,
      [
        bio ?? null,
        location ?? null,
        skills ?? null,
        interests ?? null,
        profileImageUrl ?? null,
        experienceLevel ?? null,
        userId
      ]
    );

    return result.affectedRows;
  }
};

module.exports = EntrepreneurProfile;
