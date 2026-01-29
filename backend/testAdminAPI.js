// ============================================
// Test Script for Admin APIs
// ============================================
// This script tests all admin endpoints
// Make sure the server is running before executing this

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
let adminToken = '';
let studentId = '';
let roomId = '';

const testAdminAPIs = async () => {
    console.log('🧪 Testing Admin APIs\n');
    console.log('='.repeat(60));

    try {
        // Step 0: Register and login as admin
        console.log('\n📝 Step 0: Setup - Register and Login as Admin');
        console.log('-'.repeat(60));

        const adminEmail = `admin${Date.now()}@hostel.com`;

        const adminRegister = await axios.post(`${BASE_URL}/auth/register`, {
            name: 'Test Admin',
            email: adminEmail,
            password: 'admin123',
            role: 'admin'
        });

        adminToken = adminRegister.data.data.token;
        console.log('✅ Admin registered and logged in');
        console.log('✅ Token received:', adminToken ? 'Yes' : 'No');

        // Test 1: Create Room
        console.log('\n📝 Test 1: Create Room');
        console.log('-'.repeat(60));

        const roomData = {
            roomNumber: '101',
            capacity: 4
        };

        const createRoomResponse = await axios.post(
            `${BASE_URL}/admin/rooms`,
            roomData,
            {
                headers: { Authorization: `Bearer ${adminToken}` }
            }
        );

        roomId = createRoomResponse.data.data.room._id;
        console.log('✅ Status:', createRoomResponse.status);
        console.log('✅ Room created:', createRoomResponse.data.data.room.roomNumber);
        console.log('✅ Capacity:', createRoomResponse.data.data.room.capacity);
        console.log('✅ Available beds:', createRoomResponse.data.data.room.availableBeds);

        // Test 2: Get All Rooms
        console.log('\n📝 Test 2: Get All Rooms');
        console.log('-'.repeat(60));

        const getRoomsResponse = await axios.get(
            `${BASE_URL}/admin/rooms`,
            {
                headers: { Authorization: `Bearer ${adminToken}` }
            }
        );

        console.log('✅ Status:', getRoomsResponse.status);
        console.log('✅ Total rooms:', getRoomsResponse.data.count);
        console.log('✅ Statistics:', getRoomsResponse.data.stats);

        // Test 3: Add Student
        console.log('\n📝 Test 3: Add Student');
        console.log('-'.repeat(60));

        const studentData = {
            name: 'Test Student',
            email: `student${Date.now()}@hostel.com`,
            password: 'student123',
            studentId: 'ST001',
            phone: '1234567890'
        };

        const addStudentResponse = await axios.post(
            `${BASE_URL}/admin/students`,
            studentData,
            {
                headers: { Authorization: `Bearer ${adminToken}` }
            }
        );

        studentId = addStudentResponse.data.data.student._id;
        console.log('✅ Status:', addStudentResponse.status);
        console.log('✅ Student added:', addStudentResponse.data.data.student.name);
        console.log('✅ Student ID:', addStudentResponse.data.data.student.studentId);
        console.log('✅ Room assigned:', addStudentResponse.data.data.student.roomNumber || 'None');

        // Test 4: Get All Students
        console.log('\n📝 Test 4: Get All Students');
        console.log('-'.repeat(60));

        const getStudentsResponse = await axios.get(
            `${BASE_URL}/admin/students`,
            {
                headers: { Authorization: `Bearer ${adminToken}` }
            }
        );

        console.log('✅ Status:', getStudentsResponse.status);
        console.log('✅ Total students:', getStudentsResponse.data.count);
        console.log('✅ Statistics:', getStudentsResponse.data.stats);

        // Test 5: Assign Student to Room
        console.log('\n📝 Test 5: Assign Student to Room');
        console.log('-'.repeat(60));

        const assignData = {
            studentId: studentId,
            roomId: roomId
        };

        const assignResponse = await axios.post(
            `${BASE_URL}/admin/assign-room`,
            assignData,
            {
                headers: { Authorization: `Bearer ${adminToken}` }
            }
        );

        console.log('✅ Status:', assignResponse.status);
        console.log('✅ Message:', assignResponse.data.message);
        console.log('✅ Student room:', assignResponse.data.data.student.roomNumber);
        console.log('✅ Room occupied:', assignResponse.data.data.room.occupied);
        console.log('✅ Room available beds:', assignResponse.data.data.room.availableBeds);

        // Test 6: Try to access admin route without token
        console.log('\n📝 Test 6: Access Admin Route Without Token');
        console.log('-'.repeat(60));

        try {
            await axios.get(`${BASE_URL}/admin/rooms`);
            console.log('❌ Should have failed but succeeded');
        } catch (error) {
            console.log('✅ Correctly rejected:', error.response.status);
            console.log('✅ Error message:', error.response.data.message);
        }

        // Test 7: Try to access admin route as student
        console.log('\n📝 Test 7: Access Admin Route as Student');
        console.log('-'.repeat(60));

        // Login as student
        const studentLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: studentData.email,
            password: studentData.password
        });

        const studentToken = studentLogin.data.data.token;

        try {
            await axios.get(`${BASE_URL}/admin/rooms`, {
                headers: { Authorization: `Bearer ${studentToken}` }
            });
            console.log('❌ Should have failed but succeeded');
        } catch (error) {
            console.log('✅ Correctly rejected:', error.response.status);
            console.log('✅ Error message:', error.response.data.message);
        }

        // Test 8: Remove Student from Room
        console.log('\n📝 Test 8: Remove Student from Room');
        console.log('-'.repeat(60));

        const removeResponse = await axios.delete(
            `${BASE_URL}/admin/remove-room/${studentId}`,
            {
                headers: { Authorization: `Bearer ${adminToken}` }
            }
        );

        console.log('✅ Status:', removeResponse.status);
        console.log('✅ Message:', removeResponse.data.message);
        console.log('✅ Student room:', removeResponse.data.data.student.roomNumber || 'None');

        // Test 9: Create Multiple Rooms
        console.log('\n📝 Test 9: Create Multiple Rooms');
        console.log('-'.repeat(60));

        const rooms = ['102', '103', '104'];
        for (const roomNum of rooms) {
            await axios.post(
                `${BASE_URL}/admin/rooms`,
                { roomNumber: roomNum, capacity: 3 },
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            console.log(`✅ Room ${roomNum} created`);
        }

        // Test 10: Final Statistics
        console.log('\n📝 Test 10: Final Statistics');
        console.log('-'.repeat(60));

        const finalRooms = await axios.get(
            `${BASE_URL}/admin/rooms`,
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );

        const finalStudents = await axios.get(
            `${BASE_URL}/admin/students`,
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );

        console.log('✅ Total rooms:', finalRooms.data.count);
        console.log('✅ Total capacity:', finalRooms.data.stats.totalCapacity);
        console.log('✅ Total students:', finalStudents.data.count);
        console.log('✅ Assigned students:', finalStudents.data.stats.assignedStudents);
        console.log('✅ Unassigned students:', finalStudents.data.stats.unassignedStudents);

        console.log('\n' + '='.repeat(60));
        console.log('🎉 All admin API tests passed!\n');

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
testAdminAPIs();
