const express = require('express');
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
router.get('/:id', getPostById);
router.post('/', authenticate, createPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

module.exports = router;
