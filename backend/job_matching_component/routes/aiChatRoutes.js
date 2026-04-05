const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/authMiddleware');
const { chatWithCareerAssistant } = require('../controllers/aiChatController');

// @route   POST /api/ai/chat
// @desc    AI career assistant chat (stateless - not persisted)
// @access  Private
router.post('/chat', protect, chatWithCareerAssistant);

module.exports = router;
