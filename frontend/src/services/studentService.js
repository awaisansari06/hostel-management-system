import api from './api';

/**
 * Student Service
 * Handles all student-related API calls
 */

/**
 * Get current student's profile
 * @returns {Promise} Response with student profile data
 */
export const getMyProfile = async () => {
    const response = await api.get('/student/profile');
    return response.data;
};

/**
 * Update current student's profile
 * @param {Object} data - { name, phone }
 * @returns {Promise} Response with updated student profile data
 */
export const updateProfile = async (data) => {
    const response = await api.put('/student/profile', data);
    return response.data;
};

/**
 * Get current student's room details
 * @returns {Promise} Response with room data and roommates
 */
export const getMyRoom = async () => {
    const response = await api.get('/student/room');
    return response.data;
};
