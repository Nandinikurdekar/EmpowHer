const EntrepreneurProfile = require('../models/EntrepreneurProfile');

const ALLOWED_EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'experienced'];
const PROFILE_FIELDS = [
  'bio',
  'location',
  'skills',
  'interests',
  'profile_image_url',
  'experience_level'
];

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateProfileInput = (input, { requireAtLeastOneField = false } = {}) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw createError('Profile input must be an object', 400);
  }

  const unknownFields = Object.keys(input).filter((field) => !PROFILE_FIELDS.includes(field));

  if (unknownFields.length > 0) {
    throw createError(`Invalid profile fields: ${unknownFields.join(', ')}`, 400);
  }

  if (requireAtLeastOneField && Object.keys(input).length === 0) {
    throw createError('At least one profile field is required', 400);
  }

  PROFILE_FIELDS.forEach((field) => {
    if (input[field] !== undefined && input[field] !== null && typeof input[field] !== 'string') {
      throw createError(`${field} must be a string`, 400);
    }
  });

  if (
    input.experience_level !== undefined &&
    input.experience_level !== null &&
    !ALLOWED_EXPERIENCE_LEVELS.includes(input.experience_level)
  ) {
    throw createError('experience_level must be beginner, intermediate, or experienced', 400);
  }
};

const mapProfileInput = (input) => ({
  bio: input.bio,
  location: input.location,
  skills: input.skills,
  interests: input.interests,
  profileImageUrl: input.profile_image_url,
  experienceLevel: input.experience_level
});

const createProfile = async (userId, input) => {
  validateProfileInput(input, { requireAtLeastOneField: true });

  const existingProfile = await EntrepreneurProfile.findByUserId(userId);

  if (existingProfile) {
    throw createError('Entrepreneur profile already exists', 409);
  }

  await EntrepreneurProfile.create({
    userId,
    ...mapProfileInput(input)
  });

  return EntrepreneurProfile.findByUserId(userId);
};

const getProfile = async (userId) => {
  const profile = await EntrepreneurProfile.findByUserId(userId);

  if (!profile) {
    throw createError('Entrepreneur profile not found', 404);
  }

  return profile;
};

const updateProfile = async (userId, input) => {
  validateProfileInput(input, { requireAtLeastOneField: true });

  const existingProfile = await EntrepreneurProfile.findByUserId(userId);

  if (!existingProfile) {
    throw createError('Entrepreneur profile not found', 404);
  }

  await EntrepreneurProfile.updateByUserId(userId, mapProfileInput(input));

  return EntrepreneurProfile.findByUserId(userId);
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile
};
