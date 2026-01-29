// ============================================
// Admin Routes
// ============================================
// Defines API endpoints for admin operations
// All routes are protected with verifyToken and isAdmin middleware

const express = require('express');
const router = express.Router();
const {
    createRoom,
    getAllRooms,
    addStudent,
    getAllStudents,
    assignStudentToRoom,
    removeStudentFromRoom
} = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Apply authentication middleware to all admin routes
router.use(verifyToken);
router.use(isAdmin);

// ============================================
// ROOM MANAGEMENT ROUTES
// ============================================

/**
 * @route   POST /api/admin/rooms
 * @desc    Create a new room
 * @access  Private (Admin only)
 * @body    { roomNumber, capacity }
 */
router.post('/rooms', createRoom);

/**
 * @route   GET /api/admin/rooms
 * @desc    Get all rooms with student details
 * @access  Private (Admin only)
 */
router.get('/rooms', getAllRooms);

// ============================================
// STUDENT MANAGEMENT ROUTES
// ============================================

/**
 * @route   POST /api/admin/students
 * @desc    Add a new student
 * @access  Private (Admin only)
 * @body    { name, email, password, studentId?, phone? }
 */
router.post('/students', addStudent);

/**
 * @route   GET /api/admin/students
 * @desc    Get all students
 * @access  Private (Admin only)
 */
router.get('/students', getAllStudents);

// ============================================
// ROOM ASSIGNMENT ROUTES
// ============================================

/**
 * @route   POST /api/admin/assign-room
 * @desc    Assign a student to a room
 * @access  Private (Admin only)
 * @body    { studentId, roomId }
 */
router.post('/assign-room', assignStudentToRoom);

/**
 * @route   DELETE /api/admin/remove-room/:studentId
 * @desc    Remove student from their assigned room
 * @access  Private (Admin only)
 * @params  studentId - MongoDB ObjectId of the student
 */
router.delete('/remove-room/:studentId', removeStudentFromRoom);

module.exports = router;
