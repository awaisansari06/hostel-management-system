// ============================================
// Main Server File - Entry Point
// ============================================
// This is the main file that starts the Express server
// It sets up middleware, connects to database, and defines routes

// Import required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');

// ============================================
// CONFIGURATION
// ============================================

// Load environment variables from .env file
// This must be done before using process.env
// The .env file is in the parent directory
dotenv.config({ path: '../.env' });

// Initialize Express application
const app = express();

// ============================================
// MIDDLEWARE SETUP
// ============================================

// CORS - Allow frontend to communicate with backend
// This enables requests from different origins (e.g., localhost:5173 to localhost:5000)
app.use(cors());

// Body Parser - Parse incoming JSON requests
// This allows us to access req.body in our routes
app.use(express.json());

// Request Logger - Log all incoming requests (helpful for debugging)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// ============================================
// DATABASE CONNECTION
// ============================================

// Connect to MongoDB
connectDB();

// ============================================
// ROUTES
// ============================================

// Test route to verify server is running
app.get('/', (req, res) => {
    res.json({
        message: '🏨 Hostel Management System API',
        status: 'Server is running',
        version: '1.0.0'
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: 'Connected'
    });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler - Route not found
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// ============================================
// START SERVER
// ============================================

// Get port from environment variables or use 5000 as default
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log('=================================');
});
