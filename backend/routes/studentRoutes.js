// ============================================
// Student Routes
// ============================================
// Defines API endpoints for student operations
// All routes are protected with verifyToken and isStudent middleware

const express = require('express');
const router = express.Router();
const {
    getProfile,
    getAssignedRoom,
    updateProfile
} = require('../controllers/studentController');
const { verifyToken, isStudent } = require('../middleware/auth');

// Apply authentication middleware to all student routes
router.use(verifyToken);
router.use(isStudent);

// ============================================
// STUDENT PROFILE ROUTES
// ============================================

/**
 * @route   GET /api/student/profile
 * @desc    Get student's own profile
 * @access  Private (Student only)
 */
router.get('/profile', getProfile);

/**
 * @route   PUT /api/student/profile
 * @desc    Update student's own profile (name, phone)
 * @access  Private (Student only)
 * @body    { name?, phone? }
 */
router.put('/profile', updateProfile);

// ============================================
// STUDENT ROOM ROUTES
// ============================================

/**
 * @route   GET /api/student/room
 * @desc    Get student's assigned room details with roommates
 * @access  Private (Student only)
 */
router.get('/room', getAssignedRoom);

module.exports = router;
