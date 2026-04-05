const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Employer = require('../models/Employer');

// @desc    Get all reviews
// @route   GET /api/reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get reviews by company ID
// @route   GET /api/reviews/company/:companyId
router.get('/company/:companyId', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.companyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid companyId format'
      });
    }

    const reviews = await Review.find({ companyId: req.params.companyId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Create new review
// @route   POST /api/reviews
router.post('/', async (req, res) => {
  try {
    const { studentId, companyId, rating, reviewText, isAnonymous } = req.body;

    // Validation
    if (!studentId || !companyId || !rating || !reviewText) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if company exists
    const company = await Employer.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Create review
    const review = await Review.create({
      studentId,
      companyId,
      rating,
      reviewText,
      isAnonymous
    });

    // Update company rating
    await updateCompanyRating(companyId);

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Helper function to update company rating
async function updateCompanyRating(companyId) {
  const reviews = await Review.find({ companyId });
  
  if (reviews.length === 0) {
    await Employer.findByIdAndUpdate(companyId, {
      averageRating: 0,
      totalReviews: 0
    });
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await Employer.findByIdAndUpdate(companyId, {
    averageRating: averageRating.toFixed(1),
    totalReviews: reviews.length
  });
}

module.exports = router;