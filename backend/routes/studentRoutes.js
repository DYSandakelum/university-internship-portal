const express = require('express');
const router = express.Router();
const { applyForJob, getMyApplications, withdrawApplication, getProfile, updateProfile } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer setup for resume uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `resume_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb(new Error('Only PDF and Word documents are allowed'));
    }
});

// Routes
router.post('/apply/:jobId', protect, authorizeRoles('student'), upload.single('resume'), applyForJob);
router.get('/applications', protect, authorizeRoles('student'), getMyApplications);
router.delete('/applications/:id', protect, authorizeRoles('student'), withdrawApplication);
router.get('/profile', protect, authorizeRoles('student'), getProfile);
router.post('/profile', protect, authorizeRoles('student'), upload.single('cv'), updateProfile);

module.exports = router;