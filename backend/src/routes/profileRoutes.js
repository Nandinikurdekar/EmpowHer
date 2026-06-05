const express = require('express');
const {
  createMyProfile,
  getMyProfile,
  updateMyProfile
} = require('../controllers/profileController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/me', createMyProfile);
router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);

module.exports = router;
