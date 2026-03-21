const Employer = require('../models/Employer');

// @desc    Create new employer
// @route   POST /api/employers
const createEmployer = async (req, res) => {
  try {
    console.log('📥 Received data:', req.body); // Debug log
    
    const { companyName, description } = req.body;

    // Validation
    if (!companyName || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide company name and description'
      });
    }

    // Create new employer
    const employer = new Employer({
      companyName,
      description,
      verificationStatus: 'pending',
      averageRating: 0,
      totalReviews: 0
    });

    // Save to database
    const savedEmployer = await employer.save();
    console.log('✅ Saved employer:', savedEmployer); // Debug log

    res.status(201).json({
      success: true,
      message: 'Employer created successfully',
      data: savedEmployer
    });

  } catch (error) {
    console.error('❌ Error creating employer:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all employers
// @route   GET /api/employers
const getEmployers = async (req, res) => {
  try {
    const employers = await Employer.find().sort({ createdAt: -1 });
    console.log('📊 Found employers:', employers.length); // Debug log

    res.json({
      success: true,
      count: employers.length,
      data: employers
    });
  } catch (error) {
    console.error('❌ Error getting employers:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete employer
// @route   DELETE /api/employers/:id
const deleteEmployer = async (req, res) => {
  try {
    const employer = await Employer.findByIdAndDelete(req.params.id);

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: 'Employer not found'
      });
    }

    res.json({
      success: true,
      message: 'Employer deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting employer:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getEmployers,
  createEmployer,
  deleteEmployer
};