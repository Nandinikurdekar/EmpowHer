const { pool } = require('../config/db');
const BusinessProfile = require('../models/BusinessProfile');

const BUSINESS_FIELDS = [
  'business_name',
  'business_category',
  'business_description',
  'business_location',
  'business_image_url',
  'website_url',
  'instagram_url',
  'is_active'
];

const REQUIRED_CREATE_FIELDS = ['business_name', 'business_category'];

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateStringField = (input, field, { required = false } = {}) => {
  const value = input[field];

  if (required && (!value || typeof value !== 'string' || value.trim().length === 0)) {
    throw createError(`${field} is required`, 400);
  }

  if (value !== undefined && value !== null && typeof value !== 'string') {
    throw createError(`${field} must be a string`, 400);
  }
};

const validateBusinessInput = (input, { isCreate = false } = {}) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw createError('Business profile input must be an object', 400);
  }

  const unknownFields = Object.keys(input).filter((field) => !BUSINESS_FIELDS.includes(field));

  if (unknownFields.length > 0) {
    throw createError(`Invalid business profile fields: ${unknownFields.join(', ')}`, 400);
  }

  if (!isCreate && Object.keys(input).length === 0) {
    throw createError('At least one business profile field is required', 400);
  }

  REQUIRED_CREATE_FIELDS.forEach((field) => {
    validateStringField(input, field, { required: isCreate });
  });

  BUSINESS_FIELDS
    .filter((field) => field !== 'is_active' && !REQUIRED_CREATE_FIELDS.includes(field))
    .forEach((field) => validateStringField(input, field));

  if (input.is_active !== undefined && typeof input.is_active !== 'boolean') {
    throw createError('is_active must be a boolean', 400);
  }
};

const mapBusinessInput = (input) => ({
  businessName: input.business_name,
  businessCategory: input.business_category,
  businessDescription: input.business_description,
  businessLocation: input.business_location,
  businessImageUrl: input.business_image_url,
  websiteUrl: input.website_url,
  instagramUrl: input.instagram_url,
  isActive: input.is_active
});

const createBusinessProfile = async (userId, input) => {
  validateBusinessInput(input, { isCreate: true });

  const existingBusinessProfile = await BusinessProfile.findByUserId(userId);

  if (existingBusinessProfile) {
    throw createError('Business profile already exists', 409);
  }

  try {
    await BusinessProfile.create({
      userId,
      ...mapBusinessInput(input)
    });

    if (input.is_active !== undefined) {
      await BusinessProfile.updateByUserId(userId, { isActive: input.is_active });
    }

    return BusinessProfile.findByUserId(userId);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError('Business profile already exists', 409);
    }

    throw error;
  }
};

const getMyBusinessProfile = async (userId) => {
  const businessProfile = await BusinessProfile.findByUserId(userId);

  if (!businessProfile) {
    throw createError('Business profile not found', 404);
  }

  return businessProfile;
};

const updateBusinessProfile = async (userId, input) => {
  validateBusinessInput(input);

  const existingBusinessProfile = await BusinessProfile.findByUserId(userId);

  if (!existingBusinessProfile) {
    throw createError('Business profile not found', 404);
  }

  await BusinessProfile.updateByUserId(userId, mapBusinessInput(input));

  return BusinessProfile.findByUserId(userId);
};

const listActiveBusinessProfiles = async () => {
  const [rows] = await pool.execute(
    `SELECT id, user_id, business_name, business_category, business_description,
            business_location, business_image_url, website_url, instagram_url,
            is_active, created_at, updated_at
     FROM business_profiles
     WHERE is_active = TRUE
     ORDER BY business_name ASC`
  );

  return rows;
};

module.exports = {
  createBusinessProfile,
  getMyBusinessProfile,
  listActiveBusinessProfiles,
  updateBusinessProfile
};
