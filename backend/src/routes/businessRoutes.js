const express = require('express');
const {
  createMyBusinessProfile,
  getMyBusinessProfile,
  listBusinessProfiles,
  updateMyBusinessProfile
} = require('../controllers/businessController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listBusinessProfiles);
router.post('/me', authenticate, createMyBusinessProfile);
router.get('/me', authenticate, getMyBusinessProfile);
router.put('/me', authenticate, updateMyBusinessProfile);

module.exports = router;
