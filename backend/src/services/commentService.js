const CommunityPost = require('../models/CommunityPost');
const PostComment = require('../models/PostComment');

const COMMENT_FIELDS = ['comment_text'];

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validatePositiveInteger = (value, label) => {
  const numericValue = Number(value);

  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    throw createError(`${label} must be a positive integer`, 400);
  }

  return numericValue;
};

const validateCommentInput = (input) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw createError('Comment input must be an object', 400);
  }

  const unknownFields = Object.keys(input).filter((field) => !COMMENT_FIELDS.includes(field));

  if (unknownFields.length > 0) {
    throw createError(`Invalid comment fields: ${unknownFields.join(', ')}`, 400);
  }

  if (!input.comment_text || typeof input.comment_text !== 'string' || input.comment_text.trim().length === 0) {
    throw createError('comment_text is required', 400);
  }
};

const getExistingActivePost = async (postId) => {
  const numericPostId = validatePositiveInteger(postId, 'Post id');
  const post = await CommunityPost.findById(numericPostId);

  if (!post || !post.is_active) {
    throw createError('Post not found', 404);
  }

  return post;
};

const getExistingActiveComment = async (commentId) => {
  const numericCommentId = validatePositiveInteger(commentId, 'Comment id');
  const comment = await PostComment.findById(numericCommentId);

  if (!comment || !comment.is_active) {
    throw createError('Comment not found', 404);
  }

  return comment;
};

const createComment = async (userId, postId, input) => {
  validateCommentInput(input);
  const post = await getExistingActivePost(postId);

  const commentId = await PostComment.create({
    postId: post.id,
    userId,
    commentText: input.comment_text.trim()
  });

  return PostComment.findById(commentId);
};

const listCommentsByPost = async (postId) => {
  const post = await getExistingActivePost(postId);

  return PostComment.findByPostId(post.id);
};

const updateComment = async (userId, commentId, input) => {
  validateCommentInput(input);
  const comment = await getExistingActiveComment(commentId);

  if (comment.user_id !== userId) {
    throw createError('You are not allowed to modify this comment', 403);
  }

  await getExistingActivePost(comment.post_id);
  await PostComment.updateById(comment.id, { commentText: input.comment_text.trim() });

  return PostComment.findById(comment.id);
};

const deleteComment = async (userId, commentId) => {
  const comment = await getExistingActiveComment(commentId);

  if (comment.user_id !== userId) {
    throw createError('You are not allowed to delete this comment', 403);
  }

  await getExistingActivePost(comment.post_id);
  await PostComment.updateById(comment.id, { isActive: false });

  return {
    id: comment.id,
    is_active: false
  };
};

module.exports = {
  createComment,
  deleteComment,
  listCommentsByPost,
  updateComment
};
