const express = require('express');
const {
  deleteComment,
  updateComment
} = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.put('/:commentId', authenticate, updateComment);
router.delete('/:commentId', authenticate, deleteComment);

module.exports = router;
