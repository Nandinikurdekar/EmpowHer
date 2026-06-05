const { pool } = require('../config/db');
const CommunityPost = require('../models/CommunityPost');

const POST_TYPES = ['general', 'question', 'tip', 'success_story', 'business_update'];
const VISIBILITY_OPTIONS = ['public', 'connections'];
const POST_FIELDS = ['content', 'post_type', 'visibility'];

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validatePostInput = (input, { isCreate = false } = {}) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw createError('Post input must be an object', 400);
  }

  const unknownFields = Object.keys(input).filter((field) => !POST_FIELDS.includes(field));

  if (unknownFields.length > 0) {
    throw createError(`Invalid post fields: ${unknownFields.join(', ')}`, 400);
  }

  if (!isCreate && Object.keys(input).length === 0) {
    throw createError('At least one post field is required', 400);
  }

  if (isCreate && (!input.content || typeof input.content !== 'string' || input.content.trim().length === 0)) {
    throw createError('content is required', 400);
  }

  if (input.content !== undefined && (typeof input.content !== 'string' || input.content.trim().length === 0)) {
    throw createError('content must be a non-empty string', 400);
  }

  if (input.post_type !== undefined && !POST_TYPES.includes(input.post_type)) {
    throw createError('post_type must be general, question, tip, success_story, or business_update', 400);
  }

  if (input.visibility !== undefined && !VISIBILITY_OPTIONS.includes(input.visibility)) {
    throw createError('visibility must be public or connections', 400);
  }
};

const mapPostInput = (input) => ({
  content: input.content?.trim(),
  postType: input.post_type,
  visibility: input.visibility
});

const validatePostId = (postId) => {
  const numericPostId = Number(postId);

  if (!Number.isInteger(numericPostId) || numericPostId <= 0) {
    throw createError('Post id must be a positive integer', 400);
  }

  return numericPostId;
};

const getExistingActivePost = async (postId) => {
  const numericPostId = validatePostId(postId);
  const post = await CommunityPost.findById(numericPostId);

  if (!post || !post.is_active) {
    throw createError('Post not found', 404);
  }

  return post;
};

const createPost = async (userId, input) => {
  validatePostInput(input, { isCreate: true });

  const postId = await CommunityPost.create({
    userId,
    ...mapPostInput(input)
  });

  return CommunityPost.findById(postId);
};

const listActivePosts = async () => {
  const [rows] = await pool.execute(
    `SELECT id, user_id, content, image_url, post_type, visibility,
            is_active, created_at, updated_at
     FROM community_posts
     WHERE is_active = TRUE
     ORDER BY created_at DESC`
  );

  return rows;
};

const getActivePostById = async (postId) => {
  return getExistingActivePost(postId);
};

const listMyPosts = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT id, user_id, content, image_url, post_type, visibility,
            is_active, created_at, updated_at
     FROM community_posts
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );

  return rows;
};

const updatePost = async (userId, postId, input) => {
  validatePostInput(input);
  const numericPostId = validatePostId(postId);

  const post = await getExistingActivePost(numericPostId);

  if (post.user_id !== userId) {
    throw createError('You are not allowed to modify this post', 403);
  }

  await CommunityPost.updateById(numericPostId, mapPostInput(input));

  return CommunityPost.findById(numericPostId);
};

const deletePost = async (userId, postId) => {
  const numericPostId = validatePostId(postId);
  const post = await getExistingActivePost(numericPostId);

  if (post.user_id !== userId) {
    throw createError('You are not allowed to delete this post', 403);
  }

  await CommunityPost.updateById(numericPostId, { isActive: false });

  return {
    id: numericPostId,
    is_active: false
  };
};

module.exports = {
  createPost,
  deletePost,
  getActivePostById,
  listActivePosts,
  listMyPosts,
  updatePost
};
