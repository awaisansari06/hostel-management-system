// ============================================
// Authentication Routes
// ============================================
// Defines API endpoints for authentication

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (admin or student)
 * @access  Public
 * @body    { name, email, password, role?, roomNumber? }
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get JWT token
 * @access  Public
 * @body    { email, password }
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user profile
 * @access  Private (requires JWT token)
 * @header  Authorization: Bearer <token>
 */
router.get('/me', verifyToken, getMe);

module.exports = router;
