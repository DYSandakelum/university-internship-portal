const express = require('express');
const router = express.Router();
const { 
  registerEmployer, 
  loginEmployer,
  getEmployerProfile,
  updateEmployerProfile
} = require('../controllers/employerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerEmployer);
router.post('/login', loginEmployer);
router.get('/profile', protect, getEmployerProfile);
router.put('/profile', protect, updateEmployerProfile);

module.exports = router;