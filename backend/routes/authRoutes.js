const express = require('express');
const router = express.Router();
const {
    registerUser,
    verifyEmail,
    loginUser,
    getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', loginUser);

// Private routes (need to be logged in)
router.get('/me', protect, getMe);

module.exports = router;