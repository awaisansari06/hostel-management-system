// ============================================
// Authentication Middleware
// ============================================
// This middleware protects routes and verifies JWT tokens
// It also provides role-based access control

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verify JWT Token Middleware
 * Checks if user is authenticated by verifying the JWT token
 * Attaches user object to request for use in controllers
 */
const verifyToken = async (req, res, next) => {
    try {
        // Get token from Authorization header
        // Expected format: "Bearer <token>"
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            // Extract token from "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database (exclude password)
        req.user = await User.findById(decoded.id).select('-password');

        // Check if user exists
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Continue to next middleware/controller
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);

        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed'
        });
    }
};

/**
 * Admin Role Middleware
 * Checks if the authenticated user has admin role
 * Must be used after verifyToken middleware
 */
const isAdmin = (req, res, next) => {
    // Check if user exists (should be set by verifyToken)
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }

    // User is admin, continue
    next();
};

/**
 * Student Role Middleware
 * Checks if the authenticated user has student role
 * Must be used after verifyToken middleware
 */
const isStudent = (req, res, next) => {
    // Check if user exists (should be set by verifyToken)
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }

    // Check if user is student
    if (req.user.role !== 'student') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Student privileges required.'
        });
    }

    // User is student, continue
    next();
};

// Export all middleware functions
module.exports = {
    verifyToken,
    isAdmin,
    isStudent
};
