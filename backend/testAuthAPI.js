// ============================================
// Test Script for Authentication APIs
// ============================================
// This script tests the authentication endpoints
// Make sure the server is running before executing this

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
let authToken = '';
let userId = '';

const testAuth = async () => {
    console.log('🧪 Testing Authentication APIs\n');
    console.log('='.repeat(50));

    try {
        // Test 1: Register a new user
        console.log('\n📝 Test 1: Register New User');
        console.log('-'.repeat(50));

        const registerData = {
            name: 'Test Student',
            email: `test${Date.now()}@example.com`, // Unique email
            password: 'test123',
            role: 'student',
            roomNumber: '101'
        };

        const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);

        console.log('✅ Status:', registerResponse.status);
        console.log('✅ Success:', registerResponse.data.success);
        console.log('✅ Message:', registerResponse.data.message);
        console.log('✅ User:', registerResponse.data.data.user.name);
        console.log('✅ Role:', registerResponse.data.data.user.role);
        console.log('✅ Token received:', registerResponse.data.data.token ? 'Yes' : 'No');

        authToken = registerResponse.data.data.token;
        userId = registerResponse.data.data.user._id;

        // Test 2: Login with the registered user
        console.log('\n📝 Test 2: Login');
        console.log('-'.repeat(50));

        const loginData = {
            email: registerData.email,
            password: registerData.password
        };

        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);

        console.log('✅ Status:', loginResponse.status);
        console.log('✅ Success:', loginResponse.data.success);
        console.log('✅ Message:', loginResponse.data.message);
        console.log('✅ User:', loginResponse.data.data.user.name);
        console.log('✅ Token received:', loginResponse.data.data.token ? 'Yes' : 'No');

        // Test 3: Get current user profile
        console.log('\n📝 Test 3: Get Profile (Protected Route)');
        console.log('-'.repeat(50));

        const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });

        console.log('✅ Status:', profileResponse.status);
        console.log('✅ Success:', profileResponse.data.success);
        console.log('✅ User ID:', profileResponse.data.data.user._id);
        console.log('✅ Name:', profileResponse.data.data.user.name);
        console.log('✅ Email:', profileResponse.data.data.user.email);
        console.log('✅ Role:', profileResponse.data.data.user.role);

        // Test 4: Try to access protected route without token
        console.log('\n📝 Test 4: Access Protected Route Without Token');
        console.log('-'.repeat(50));

        try {
            await axios.get(`${BASE_URL}/auth/me`);
            console.log('❌ Should have failed but succeeded');
        } catch (error) {
            console.log('✅ Correctly rejected:', error.response.status);
            console.log('✅ Error message:', error.response.data.message);
        }

        // Test 5: Try to login with wrong password
        console.log('\n📝 Test 5: Login With Wrong Password');
        console.log('-'.repeat(50));

        try {
            await axios.post(`${BASE_URL}/auth/login`, {
                email: registerData.email,
                password: 'wrongpassword'
            });
            console.log('❌ Should have failed but succeeded');
        } catch (error) {
            console.log('✅ Correctly rejected:', error.response.status);
            console.log('✅ Error message:', error.response.data.message);
        }

        // Test 6: Try to register with duplicate email
        console.log('\n📝 Test 6: Register With Duplicate Email');
        console.log('-'.repeat(50));

        try {
            await axios.post(`${BASE_URL}/auth/register`, registerData);
            console.log('❌ Should have failed but succeeded');
        } catch (error) {
            console.log('✅ Correctly rejected:', error.response.status);
            console.log('✅ Error message:', error.response.data.message);
        }

        // Test 7: Register an admin user
        console.log('\n📝 Test 7: Register Admin User');
        console.log('-'.repeat(50));

        const adminData = {
            name: 'Test Admin',
            email: `admin${Date.now()}@example.com`,
            password: 'admin123',
            role: 'admin'
        };

        const adminResponse = await axios.post(`${BASE_URL}/auth/register`, adminData);

        console.log('✅ Status:', adminResponse.status);
        console.log('✅ Admin created:', adminResponse.data.data.user.name);
        console.log('✅ Role:', adminResponse.data.data.user.role);

        console.log('\n' + '='.repeat(50));
        console.log('🎉 All authentication tests passed!\n');

    } catch (error) {
        console.error('\n❌ Test failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

// Run the tests
testAuth();
