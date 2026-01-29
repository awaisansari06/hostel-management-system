// ============================================
// JWT Token Generation Utility
// ============================================
// This utility function generates JWT tokens for authenticated users

const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for a user
 * @param {String} userId - MongoDB ObjectId of the user
 * @param {String} role - User role (admin or student)
 * @returns {String} - Signed JWT token
 */
const generateToken = (userId, role) => {
    // Create payload with user information
    const payload = {
        id: userId,
        role: role
    };

    // Sign the token with secret key and set expiration
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: '30d' // Token expires in 30 days
        }
    );

    return token;
};

module.exports = generateToken;
