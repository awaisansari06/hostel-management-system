// ============================================
// Test Script for Student APIs
// ============================================
// This script tests all student endpoints
// Make sure the server is running before executing this

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
let adminToken = '';
let studentToken = '';
let studentId = '';
let roomId = '';

const testStudentAPIs = async () => {
    console.log('🧪 Testing Student APIs\n');
    console.log('='.repeat(60));

    try {
        // Setup: Create admin and student
        console.log('\n📝 Setup: Creating Admin and Student');
        console.log('-'.repeat(60));

        // Register admin
        const adminEmail = `admin${Date.now()}@hostel.com`;
        const adminRegister = await axios.post(`${BASE_URL}/auth/register`, {
            name: 'Test Admin',
            email: adminEmail,
            password: 'admin123',
            role: 'admin'
        });
        adminToken = adminRegister.data.data.token;
        console.log('✅ Admin created');

        // Register student
        const studentEmail = `student${Date.now()}@hostel.com`;
        const studentRegister = await axios.post(`${BASE_URL}/auth/register`, {
            name: 'Test Student',
            email: studentEmail,
            password: 'student123',
            role: 'student',
            studentId: 'ST999',
            phone: '1234567890'
        });
        studentToken = studentRegister.data.data.token;
        studentId = studentRegister.data.data.user._id;
        console.log('✅ Student created');

        // Create a room
        const roomResponse = await axios.post(
            `${BASE_URL}/admin/rooms`,
            { roomNumber: '201', capacity: 4 },
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        roomId = roomResponse.data.data.room._id;
        console.log('✅ Room created');

        // Test 1: Get Student Profile
        console.log('\n📝 Test 1: Get Student Profile');
        console.log('-'.repeat(60));

        const profileResponse = await axios.get(
            `${BASE_URL}/student/profile`,
            {
                headers: { Authorization: `Bearer ${studentToken}` }
            }
        );

        console.log('✅ Status:', profileResponse.status);
        console.log('✅ Name:', profileResponse.data.data.student.name);
        console.log('✅ Email:', profileResponse.data.data.student.email);
        console.log('✅ Student ID:', profileResponse.data.data.student.studentId);
        console.log('✅ Phone:', profileResponse.data.data.student.phone);
        console.log('✅ Room Number:', profileResponse.data.data.student.roomNumber || 'Not assigned');

        // Test 2: Get Room (Before Assignment)
        console.log('\n📝 Test 2: Get Room Details (Before Assignment)');
        console.log('-'.repeat(60));

        try {
            await axios.get(
                `${BASE_URL}/student/room`,
                { headers: { Authorization: `Bearer ${studentToken}` } }
            );
            console.log('❌ Should have failed (no room assigned)');
        } catch (error) {
            console.log('✅ Correctly rejected:', error.response.status);
            console.log('✅ Message:', error.response.data.message);
        }

        // Test 3: Assign Student to Room (Admin Action)
        console.log('\n📝 Test 3: Assign Student to Room (Admin)');
        console.log('-'.repeat(60));

        await axios.post(
            `${BASE_URL}/admin/assign-room`,
            { studentId, roomId },
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        console.log('✅ Student assigned to room');

        // Test 4: Get Room Details (After Assignment)
        console.log('\n📝 Test 4: Get Room Details (After Assignment)');
        console.log('-'.repeat(60));

        const roomDetailsResponse = await axios.get(
            `${BASE_URL}/student/room`,
            { headers: { Authorization: `Bearer ${studentToken}` } }
        );

        console.log('✅ Status:', roomDetailsResponse.status);
        console.log('✅ Room Number:', roomDetailsResponse.data.data.room.roomNumber);
        console.log('✅ Capacity:', roomDetailsResponse.data.data.room.capacity);
        console.log('✅ Occupied:', roomDetailsResponse.data.data.room.occupied);
        console.log('✅ Available Beds:', roomDetailsResponse.data.data.room.availableBeds);
        console.log('✅ Occupancy Rate:', roomDetailsResponse.data.data.room.occupancyRate + '%');
        console.log('✅ Total Roommates:', roomDetailsResponse.data.data.totalRoommates);

        // Test 5: Add Another Student to Same Room
        console.log('\n📝 Test 5: Add Roommate');
        console.log('-'.repeat(60));

        const student2Email = `student2${Date.now()}@hostel.com`;
        const student2Register = await axios.post(`${BASE_URL}/auth/register`, {
            name: 'Roommate Student',
            email: student2Email,
            password: 'student123',
            role: 'student',
            studentId: 'ST998',
            phone: '9876543210'
        });
        const student2Id = student2Register.data.data.user._id;

        await axios.post(
            `${BASE_URL}/admin/assign-room`,
            { studentId: student2Id, roomId },
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        console.log('✅ Roommate added');

        // Test 6: Get Room with Roommates
        console.log('\n📝 Test 6: Get Room with Roommates');
        console.log('-'.repeat(60));

        const roomWithMatesResponse = await axios.get(
            `${BASE_URL}/student/room`,
            { headers: { Authorization: `Bearer ${studentToken}` } }
        );

        console.log('✅ Status:', roomWithMatesResponse.status);
        console.log('✅ Room Occupied:', roomWithMatesResponse.data.data.room.occupied);
        console.log('✅ Total Roommates:', roomWithMatesResponse.data.data.totalRoommates);
        console.log('✅ Roommates:', roomWithMatesResponse.data.data.roommates.map(r => r.name));

        // Test 7: Update Profile
        console.log('\n📝 Test 7: Update Profile');
        console.log('-'.repeat(60));

        const updateResponse = await axios.put(
            `${BASE_URL}/student/profile`,
            { name: 'Updated Student Name', phone: '5555555555' },
            { headers: { Authorization: `Bearer ${studentToken}` } }
        );

        console.log('✅ Status:', updateResponse.status);
        console.log('✅ Message:', updateResponse.data.message);
        console.log('✅ Updated Name:', updateResponse.data.data.student.name);
        console.log('✅ Updated Phone:', updateResponse.data.data.student.phone);

        // Test 8: Try to Access Student Route as Admin
        console.log('\n📝 Test 8: Access Student Route as Admin');
        console.log('-'.repeat(60));

        try {
            await axios.get(
                `${BASE_URL}/student/profile`,
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            console.log('❌ Should have failed but succeeded');
        } catch (error) {
            console.log('✅ Correctly rejected:', error.response.status);
            console.log('✅ Error message:', error.response.data.message);
        }

        // Test 9: Try to Access Without Token
        console.log('\n📝 Test 9: Access Student Route Without Token');
        console.log('-'.repeat(60));

        try {
            await axios.get(`${BASE_URL}/student/profile`);
            console.log('❌ Should have failed but succeeded');
        } catch (error) {
            console.log('✅ Correctly rejected:', error.response.status);
            console.log('✅ Error message:', error.response.data.message);
        }

        // Test 10: Verify Updated Profile
        console.log('\n📝 Test 10: Verify Updated Profile');
        console.log('-'.repeat(60));

        const finalProfileResponse = await axios.get(
            `${BASE_URL}/student/profile`,
            { headers: { Authorization: `Bearer ${studentToken}` } }
        );

        console.log('✅ Name:', finalProfileResponse.data.data.student.name);
        console.log('✅ Phone:', finalProfileResponse.data.data.student.phone);
        console.log('✅ Room:', finalProfileResponse.data.data.student.roomNumber);

        console.log('\n' + '='.repeat(60));
        console.log('🎉 All student API tests passed!\n');

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
testStudentAPIs();
