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

const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    throw createError('Email and password are required', 400);
  }

  if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    throw createError('A valid email address is required', 400);
  }

  if (typeof password !== 'string') {
    throw createError('Password is required', 400);
  }
};

const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const { password_hash, ...safeUser } = user;
  return safeUser;
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

const loginUser = async ({ email, password }) => {
  validateLoginInput({ email, password });

  const normalizedEmail = normalizeEmail(email);
  const user = await User.findByEmail(normalizedEmail);

  if (!user) {
    throw createError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw createError('Invalid email or password', 401);
  }

  return sanitizeUser(user);
};

module.exports = {
  loginUser,
  registerUser
};
