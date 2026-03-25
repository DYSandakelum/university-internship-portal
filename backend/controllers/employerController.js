const Employer = require('../models/Employer');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

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
    });
    await employer.save();
    const token = generateToken(employer._id, 'employer');
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

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
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerEmployer, loginEmployer };
