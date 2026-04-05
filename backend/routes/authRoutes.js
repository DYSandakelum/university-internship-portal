const express = require('express');
const router = express.Router();
const {
    registerUser,
    verifyEmail,
    loginUser,
    getMe,
    demoLogin
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', loginUser);
router.post('/demo-login', demoLogin);

// Private routes (need to be logged in)
router.get('/me', protect, getMe);

module.exports = router;