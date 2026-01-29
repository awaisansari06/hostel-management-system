// ============================================
// Authentication Controller
// ============================================
// Handles user registration, login, and profile retrieval

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
    try {
        // Extract data from request body
        const { name, email, password, role, roomNumber } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password'
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        // Password will be automatically hashed by the User model's pre-save hook
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student', // Default to student if not specified
            roomNumber: roomNumber || null
        });

        // Generate JWT token
        const token = generateToken(user._id, user.role);

        // Send response with user data and token
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    roomNumber: user.roomNumber
                },
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    try {
        // Extract credentials from request body
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user by email and include password field
        // Password is excluded by default, so we need to explicitly select it
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password using the comparePassword method from User model
        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = generateToken(user._id, user.role);

        // Send response with user data and token
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    roomNumber: user.roomNumber
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);

        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private (requires authentication)
 */
const getMe = async (req, res) => {
    try {
        // req.user is set by verifyToken middleware
        const user = req.user;

        res.status(200).json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    roomNumber: user.roomNumber,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);

        res.status(500).json({
            success: false,
            message: 'Server error while fetching profile'
        });
    }
};

// Export controller functions
module.exports = {
    register,
    login,
    getMe
};
