// ============================================
// Database Configuration File
// ============================================
// This file handles the MongoDB connection using Mongoose
// It reads the connection string from environment variables

const mongoose = require('mongoose');

/**
 * connectDB - Establishes connection to MongoDB
 * Uses async/await to handle the asynchronous connection
 * Exits the process if connection fails
 */
const connectDB = async () => {
    try {
        // Connect to MongoDB using the connection string from .env file
        // MONGO_URI is loaded from .env by dotenv package
        await mongoose.connect(process.env.MONGO_URI);

        // Log success message with host information
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
        console.log(`📊 Database Name: ${mongoose.connection.name}`);

    } catch (error) {
        // Log error details if connection fails
        console.error(`❌ MongoDB Connection Error: ${error.message}`);

        // Exit the process with failure code
        // This prevents the server from running without database
        process.exit(1);
    }
};

// Export the connectDB function to use in server.js
module.exports = connectDB;
