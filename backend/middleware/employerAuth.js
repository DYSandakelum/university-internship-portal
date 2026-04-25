const jwt = require('jsonwebtoken');
const User = require('../models/User');

const employerAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('employerAuth decoded token:', decoded);

        const employer = await User.findById(decoded.id).select('-password');

        if (!employer) {
            return res.status(401).json({ message: 'Employer not found' });
        }

        req.employer = {
            ...employer.toObject(),
            _id: employer._id,
            id: employer._id
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = employerAuth;
