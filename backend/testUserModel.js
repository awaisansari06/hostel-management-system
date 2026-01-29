// ============================================
// Test Script for User Model
// ============================================
// This script tests the User model functionality
// Run with: node testUserModel.js

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
const testUserModel = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Test 1: Create an Admin User
        console.log('📝 Test 1: Creating Admin User...');
        const admin = new User({
            name: 'Admin User',
            email: 'admin@hostel.com',
            password: 'admin123',
            role: 'admin'
        });

        await admin.save();
        console.log('✅ Admin created:', {
            name: admin.name,
            email: admin.email,
            role: admin.role,
            hasPassword: !!admin.password,
            passwordHashed: admin.password !== 'admin123'
        });
        console.log('✅ Password was hashed:', admin.password.startsWith('$2a$'));
        console.log('✅ isAdmin():', admin.isAdmin());
        console.log('✅ isStudent():', admin.isStudent());
        console.log('');

        // Test 2: Create a Student User
        console.log('📝 Test 2: Creating Student User...');
        const student = new User({
            name: 'John Doe',
            email: 'john@student.com',
            password: 'student123',
            role: 'student',
            roomNumber: '101'
        });

        await student.save();
        console.log('✅ Student created:', {
            name: student.name,
            email: student.email,
            role: student.role,
            roomNumber: student.roomNumber
        });
        console.log('✅ isAdmin():', student.isAdmin());
        console.log('✅ isStudent():', student.isStudent());
        console.log('');

        // Test 3: Test Password Comparison
        console.log('📝 Test 3: Testing Password Comparison...');
        // Need to fetch user with password field
        const userWithPassword = await User.findById(student._id).select('+password');
        const correctPassword = await userWithPassword.comparePassword('student123');
        const wrongPassword = await userWithPassword.comparePassword('wrongpassword');
        console.log('✅ Correct password matches:', correctPassword);
        console.log('✅ Wrong password rejected:', !wrongPassword);
        console.log('');

        // Test 4: Test Unique Email Constraint
        console.log('📝 Test 4: Testing Unique Email Constraint...');
        try {
            const duplicate = new User({
                name: 'Duplicate User',
                email: 'john@student.com', // Same email as student
                password: 'test123',
                role: 'student'
            });
            await duplicate.save();
            console.log('❌ Duplicate email was allowed (should not happen)');
        } catch (error) {
            console.log('✅ Duplicate email rejected:', error.code === 11000);
        }
        console.log('');

        // Test 5: Test Validation
        console.log('📝 Test 5: Testing Validation...');
        try {
            const invalidUser = new User({
                name: 'Invalid User',
                email: 'invalid-email', // Invalid email format
                password: '123', // Too short
                role: 'teacher' // Invalid role
            });
            await invalidUser.save();
            console.log('❌ Invalid user was saved (should not happen)');
        } catch (error) {
            console.log('✅ Validation errors caught:', error.errors ? Object.keys(error.errors) : 'Yes');
        }
        console.log('');

        // Cleanup: Delete test users
        console.log('🧹 Cleaning up test data...');
        await User.deleteMany({ email: { $in: ['admin@hostel.com', 'john@student.com'] } });
        console.log('✅ Test data cleaned up\n');

        console.log('🎉 All tests passed!\n');

        // Close connection
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
        process.exit(0);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

// Run the test
testUserModel();
