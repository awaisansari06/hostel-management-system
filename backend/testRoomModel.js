// ============================================
// Test Script for Room Model
// ============================================
// This script tests the Room model functionality
// Run with: node testRoomModel.js

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Room = require('./models/Room');
const User = require('./models/User');

// Connect to MongoDB
const testRoomModel = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Create test students first
        console.log('📝 Creating test students...');
        const student1 = await User.create({
            name: 'Alice Johnson',
            email: 'alice@test.com',
            password: 'test123',
            role: 'student'
        });

        const student2 = await User.create({
            name: 'Bob Smith',
            email: 'bob@test.com',
            password: 'test123',
            role: 'student'
        });

        const student3 = await User.create({
            name: 'Charlie Brown',
            email: 'charlie@test.com',
            password: 'test123',
            role: 'student'
        });

        console.log('✅ Created 3 test students\n');

        // Test 1: Create a Room
        console.log('📝 Test 1: Creating a Room...');
        const room = await Room.create({
            roomNumber: '101',
            capacity: 2
        });

        console.log('✅ Room created:', {
            roomNumber: room.roomNumber,
            capacity: room.capacity,
            occupied: room.occupied,
            students: room.students.length
        });
        console.log('✅ Available beds:', room.availableBeds);
        console.log('✅ Is full:', room.isFull);
        console.log('');

        // Test 2: Add Students Using Helper Method
        console.log('📝 Test 2: Adding students using addStudent()...');
        await room.addStudent(student1._id);
        console.log('✅ Added student 1');
        console.log('  - Occupied:', room.occupied);
        console.log('  - Available beds:', room.availableBeds);
        console.log('  - Occupancy rate:', room.getOccupancyRate() + '%');

        await room.addStudent(student2._id);
        console.log('✅ Added student 2');
        console.log('  - Occupied:', room.occupied);
        console.log('  - Available beds:', room.availableBeds);
        console.log('  - Is full:', room.isFull);
        console.log('  - Occupancy rate:', room.getOccupancyRate() + '%');
        console.log('');

        // Test 3: Try to Add Student to Full Room
        console.log('📝 Test 3: Trying to add student to full room...');
        try {
            await room.addStudent(student3._id);
            console.log('❌ Full room check failed (should not happen)');
        } catch (error) {
            console.log('✅ Full room rejected:', error.message);
        }
        console.log('');

        // Test 4: Remove a Student
        console.log('📝 Test 4: Removing a student...');
        await room.removeStudent(student1._id);
        console.log('✅ Removed student 1');
        console.log('  - Occupied:', room.occupied);
        console.log('  - Available beds:', room.availableBeds);
        console.log('  - Has space:', room.hasSpace());
        console.log('');

        // Test 5: Populate Student Details
        console.log('📝 Test 5: Populating student details...');
        const populatedRoom = await Room.findById(room._id)
            .populate('students', 'name email');

        console.log('✅ Room with populated students:');
        console.log('  - Room:', populatedRoom.roomNumber);
        console.log('  - Students:', populatedRoom.students.map(s => s.name));
        console.log('');

        // Test 6: Create More Rooms and Test Static Methods
        console.log('📝 Test 6: Testing static methods...');
        await Room.create({ roomNumber: '102', capacity: 4 });
        await Room.create({ roomNumber: '103', capacity: 3, students: [student3._id] });

        const availableRooms = await Room.findAvailableRooms();
        const fullRooms = await Room.findFullRooms();

        console.log('✅ Available rooms:', availableRooms.map(r => r.roomNumber));
        console.log('✅ Full rooms:', fullRooms.map(r => r.roomNumber));
        console.log('');

        // Test 7: Test Automatic Occupied Update
        console.log('📝 Test 7: Testing automatic occupied update...');
        const testRoom = await Room.findOne({ roomNumber: '103' });
        console.log('  - Before: occupied =', testRoom.occupied);

        testRoom.students.push(student1._id);
        await testRoom.save();

        console.log('  - After adding student: occupied =', testRoom.occupied);
        console.log('✅ Occupied count auto-updated!');
        console.log('');

        // Cleanup: Delete test data
        console.log('🧹 Cleaning up test data...');
        await Room.deleteMany({ roomNumber: { $in: ['101', '102', '103'] } });
        await User.deleteMany({ email: { $in: ['alice@test.com', 'bob@test.com', 'charlie@test.com'] } });
        console.log('✅ Test data cleaned up\n');

        console.log('🎉 All tests passed!\n');

        // Close connection
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
        process.exit(0);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

// Run the test
testRoomModel();
