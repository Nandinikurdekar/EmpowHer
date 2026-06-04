const bcrypt = require('bcrypt');
const User = require('../models/User');

const SALT_ROUNDS = 12;

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeEmail = (email) => email.trim().toLowerCase();

const validateRegistrationInput = ({ fullName, email, password }) => {
  if (!fullName || !email || !password) {
    throw createError('Full name, email, and password are required', 400);
  }

  if (typeof fullName !== 'string' || fullName.trim().length < 2) {
    throw createError('Full name must be at least 2 characters long', 400);
  }

  if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    throw createError('A valid email address is required', 400);
  }

  if (typeof password !== 'string' || password.length < 8) {
    throw createError('Password must be at least 8 characters long', 400);
  }
};

const registerUser = async ({ fullName, email, password, phone = null }) => {
  validateRegistrationInput({ fullName, email, password });

  const normalizedEmail = normalizeEmail(email);
  const existingUser = await User.findByEmail(normalizedEmail);

  if (existingUser) {
    throw createError('Email is already registered', 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const userId = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
      phone
    });

    return User.findById(userId);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError('Email is already registered', 409);
    }

    throw error;
  }
};

module.exports = {
  registerUser
};
