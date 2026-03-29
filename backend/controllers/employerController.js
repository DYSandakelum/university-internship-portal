const Employer = require('../models/Employer');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// @desc    Register new employer
// @route   POST /api/employers/register
const registerEmployer = async (req, res) => {
  try {
    const { name, email, password, companyName, companyAddress, companyDescription, documents } = req.body;

    if (!name || !email || !password || !companyName || !companyAddress) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    let employer = await Employer.findOne({ email });
    if (employer) {
      return res.status(400).json({ message: 'Employer already exists' });
    }

    employer = new Employer({
      name,
      email,
      password,
      companyName,
      companyAddress,
      companyDescription,
      documents,
      verificationStatus: 'pending',
      averageRating: 0,
      totalReviews: 0
    });

    await employer.save();

    const token = generateToken(employer._id, 'employer');
    res.status(201).json({ token });

  } catch (error) {
    console.error('❌ Error registering employer:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Login employer
// @route   POST /api/employers/login
const loginEmployer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const employer = await Employer.findOne({ email });
    if (!employer) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(employer._id, 'employer');
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: employer._id,
        name: employer.name,
        email: employer.email,
        companyName: employer.companyName,
        role: 'employer'
      }
    });

  } catch (error) {
    console.error('❌ Error logging in employer:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get all employers
// @route   GET /api/employers
const getEmployers = async (req, res) => {
  try {
    const employers = await Employer.find().sort({ createdAt: -1 });
    console.log('📊 Found employers:', employers.length);

    res.json({
      success: true,
      count: employers.length,
      data: employers
    });

  } catch (error) {
    console.error('❌ Error getting employers:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get employer profile
// @route   GET /api/employers/profile
const getEmployerProfile = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Employer not found' });

    res.json({
      employer: {
        _id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName || '',
        companyAddress: user.companyAddress || '',
        companyDescription: user.companyDescription || '',
        isVerified: user.isVerified || false
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update employer profile
// @route   PUT /api/employers/profile
const updateEmployerProfile = async (req, res) => {
  try {
    const User = require('../models/User');
    const { companyName, companyAddress, companyDescription } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { companyName, companyAddress, companyDescription },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'Employer not found' });

    res.json({
      employer: {
        _id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName || '',
        companyAddress: user.companyAddress || '',
        companyDescription: user.companyDescription || '',
        isVerified: user.isVerified || false
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete employer
// @route   DELETE /api/employers/:id
const deleteEmployer = async (req, res) => {
  try {
    const employer = await Employer.findByIdAndDelete(req.params.id);

    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer not found' });
    }

    res.json({ success: true, message: 'Employer deleted successfully' });

  } catch (error) {
    console.error('❌ Error deleting employer:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerEmployer,
  loginEmployer,
  getEmployers,
  getEmployerProfile,
  updateEmployerProfile,
  deleteEmployer
};
