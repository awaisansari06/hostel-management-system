import api from './api';

/**
 * Admin Service
 * Handles all admin-related API calls
 */

// ============================================
// ROOM MANAGEMENT
// ============================================

/**
 * Get all rooms with student details
 * @returns {Promise} Response with rooms array and stats
 */
export const getAllRooms = async () => {
    const response = await api.get('/admin/rooms');
    return response.data;
};

/**
 * Create a new room
 * @param {Object} roomData - { roomNumber, capacity }
 * @returns {Promise} Response with created room
 */
export const createRoom = async (roomData) => {
    const response = await api.post('/admin/rooms', roomData);
    return response.data;
};

// ============================================
// STUDENT MANAGEMENT
// ============================================

/**
 * Get all students
 * @returns {Promise} Response with students array and stats
 */
export const getAllStudents = async () => {
    const response = await api.get('/admin/students');
    return response.data;
};

/**
 * Add a new student
 * @param {Object} studentData - { name, email, password }
 * @returns {Promise} Response with created student
 */
export const addStudent = async (studentData) => {
    const response = await api.post('/admin/students', studentData);
    return response.data;
};

// ============================================
// ROOM ASSIGNMENT
// ============================================

/**
 * Assign a student to a room
 * @param {String} studentId - MongoDB ObjectId of student
 * @param {String} roomId - MongoDB ObjectId of room
 * @returns {Promise} Response with updated student and room
 */
export const assignStudentToRoom = async (studentId, roomId) => {
    const response = await api.post('/admin/assign-room', { studentId, roomId });
    return response.data;
};

/**
 * Remove a student from their assigned room
 * @param {String} studentId - MongoDB ObjectId of student
 * @returns {Promise} Response with updated student
 */
export const removeStudentFromRoom = async (studentId) => {
    const response = await api.delete(`/admin/remove-room/${studentId}`);
    return response.data;
};
