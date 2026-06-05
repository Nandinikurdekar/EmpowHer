const express = require('express');
const { getMe, login, register } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authenticate, getMe);
router.post('/login', login);
router.post('/register', register);

module.exports = router;
