import api from './api';

// Register user
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

// Login user
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

// Get current user profile
export const getProfile = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};
