require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

// MongoDB Connection Test
const testConnection = async () => {
    try {
        console.log('🔄 Attempting to connect to MongoDB...');

        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI not found in .env file!');
            process.exit(1);
        }

        console.log('📍 MongoDB URI: Found in .env');

        // Note: If your password contains special characters like @, #, etc.
        // they need to be URL-encoded in the connection string
        console.log('ℹ️  Note: Special characters in password should be URL-encoded');
        console.log('   Example: @ should be %40, # should be %23\n');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        console.log('✅ MongoDB Connected Successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 Connection Details:');
        console.log('   - Database Name:', mongoose.connection.name || 'default');
        console.log('   - Host:', mongoose.connection.host);
        console.log('   - Port:', mongoose.connection.port || 'default');
        console.log('   - Ready State:', mongoose.connection.readyState === 1 ? '✓ Connected' : '✗ Not Connected');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Close the connection
        await mongoose.connection.close();
        console.log('🔌 Connection closed successfully');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ MongoDB Connection Failed!');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('Error Message:', error.message);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Provide specific troubleshooting tips
        if (error.message.includes('authentication') || error.message.includes('auth')) {
            console.error('💡 Authentication Issue:');
            console.error('   - Check your MongoDB username and password');
            console.error('   - Special characters in password must be URL-encoded');
            console.error('   - Example: "Ankit@143" should be "Ankit%40143"');
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
            console.error('💡 Network Issue:');
            console.error('   - Check your internet connection');
            console.error('   - Verify the MongoDB cluster hostname');
            console.error('   - Ensure your IP is whitelisted in MongoDB Atlas');
        } else if (error.message.includes('timeout')) {
            console.error('💡 Timeout Issue:');
            console.error('   - MongoDB server might be down');
            console.error('   - Check firewall settings');
            console.error('   - Verify network connectivity');
        } else {
            console.error('💡 General Tips:');
            console.error('   - Verify MONGO_URI in .env file');
            console.error('   - Check MongoDB Atlas cluster status');
            console.error('   - Ensure database user has proper permissions');
        }

        console.error('\n📝 Current MONGO_URI format (masked):');
        const maskedUri = process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
        console.error('   ', maskedUri);

        process.exit(1);
    }
};

// Run the test
testConnection();
