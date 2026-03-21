const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            verificationToken,
            verificationTokenExpire
        });

        if (user) {
            // Send verification email
            const verificationURL = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

            const html = `
                <h1>Email Verification</h1>
                <p>Hi ${user.name},</p>
                <p>Thank you for registering at University Internship Portal.</p>
                <p>Please click the link below to verify your email address:</p>
                <a href="${verificationURL}" style="
                    background-color: #4CAF50;
                    color: white;
                    padding: 14px 20px;
                    text-decoration: none;
                    border-radius: 4px;
                ">Verify Email</a>
                <p>This link will expire in 24 hours.</p>
                <p>If you did not create an account, please ignore this email.</p>
            `;

            await sendEmail({
                email: user.email,
                subject: 'Email Verification - University Internship Portal',
                html
            });

            res.status(201).json({
                message: 'Registration successful! Please check your email to verify your account.',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified
                }
            });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // Find user with this token and check it hasn't expired
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        // Update user directly in database without triggering pre save hook
        await User.findByIdAndUpdate(user._id, {
            $set: { isVerified: true },
            $unset: { verificationToken: 1, verificationTokenExpire: 1 }
        });

        res.status(200).json({ message: 'Email verified successfully! You can now log in.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email before logging in' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Send back user data and token
        res.status(200).json({
            message: 'Login successful',
            token: generateToken(user._id, user.role),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, verifyEmail, loginUser, getMe };