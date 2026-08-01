const express = require('express');
const {
  createComment,
  listCommentsByPost
} = require('../controllers/commentController');
const {
  createPost,
  deletePost,
  getPostById,
  listMyPosts,
  listPosts,
  updatePost
} = require('../controllers/postController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listPosts);
router.get('/me', authenticate, listMyPosts);
router.get('/:postId/comments', listCommentsByPost);
router.get('/:id', getPostById);
router.post('/', authenticate, createPost);
router.post('/:postId/comments', authenticate, createComment);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

module.exports = router;
