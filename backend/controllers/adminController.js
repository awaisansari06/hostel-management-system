// ============================================
// Admin Controller
// ============================================
// Handles admin operations: room management, student management, and assignments

const Room = require('../models/Room');
const User = require('../models/User');

/**
 * @desc    Create a new room
 * @route   POST /api/admin/rooms
 * @access  Private (Admin only)
 */
const createRoom = async (req, res) => {
    try {
        const { roomNumber, capacity } = req.body;

        // Validate required fields
        if (!roomNumber || !capacity) {
            return res.status(400).json({
                success: false,
                message: 'Please provide room number and capacity'
            });
        }

        // Check if room already exists
        const roomExists = await Room.findOne({ roomNumber: roomNumber.toUpperCase() });

        if (roomExists) {
            return res.status(400).json({
                success: false,
                message: `Room ${roomNumber} already exists`
            });
        }

        // Create new room
        const room = await Room.create({
            roomNumber,
            capacity
        });

        res.status(201).json({
            success: true,
            message: 'Room created successfully',
            data: {
                room: {
                    _id: room._id,
                    roomNumber: room.roomNumber,
                    capacity: room.capacity,
                    occupied: room.occupied,
                    availableBeds: room.availableBeds,
                    isFull: room.isFull
                }
            }
        });
    } catch (error) {
        console.error('Create room error:', error);

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
            message: 'Server error while creating room'
        });
    }
};

/**
 * @desc    Get all rooms
 * @route   GET /api/admin/rooms
 * @access  Private (Admin only)
 */
const getAllRooms = async (req, res) => {
    try {
        // Fetch all rooms and populate student details
        const rooms = await Room.find()
            .populate('students', 'name email studentId')
            .sort({ roomNumber: 1 });

        // Calculate statistics
        const stats = {
            totalRooms: rooms.length,
            totalCapacity: rooms.reduce((sum, room) => sum + room.capacity, 0),
            totalOccupied: rooms.reduce((sum, room) => sum + room.occupied, 0),
            availableRooms: rooms.filter(room => !room.isFull).length,
            fullRooms: rooms.filter(room => room.isFull).length
        };

        res.status(200).json({
            success: true,
            count: rooms.length,
            stats,
            data: {
                rooms: rooms.map(room => ({
                    _id: room._id,
                    roomNumber: room.roomNumber,
                    capacity: room.capacity,
                    occupied: room.occupied,
                    availableBeds: room.availableBeds,
                    isFull: room.isFull,
                    occupancyRate: room.getOccupancyRate(),
                    students: room.students,
                    createdAt: room.createdAt,
                    updatedAt: room.updatedAt
                }))
            }
        });
    } catch (error) {
        console.error('Get rooms error:', error);

        res.status(500).json({
            success: false,
            message: 'Server error while fetching rooms'
        });
    }
};

/**
 * @desc    Add a new student
 * @route   POST /api/admin/students
 * @access  Private (Admin only)
 */
const addStudent = async (req, res) => {
    try {
        const { name, email, password, studentId, phone } = req.body;

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
                message: 'Student with this email already exists'
            });
        }

        // Create new student user
        const student = await User.create({
            name,
            email,
            password,
            role: 'student',
            studentId,
            phone
        });

        res.status(201).json({
            success: true,
            message: 'Student added successfully',
            data: {
                student: {
                    _id: student._id,
                    name: student.name,
                    email: student.email,
                    role: student.role,
                    studentId: student.studentId,
                    phone: student.phone,
                    roomNumber: student.roomNumber
                }
            }
        });
    } catch (error) {
        console.error('Add student error:', error);

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
            message: 'Server error while adding student'
        });
    }
};

/**
 * @desc    Get all students
 * @route   GET /api/admin/students
 * @access  Private (Admin only)
 */
const getAllStudents = async (req, res) => {
    try {
        // Fetch all students
        const students = await User.find({ role: 'student' })
            .select('-password')
            .sort({ name: 1 });

        // Calculate statistics
        const stats = {
            totalStudents: students.length,
            assignedStudents: students.filter(s => s.roomNumber).length,
            unassignedStudents: students.filter(s => !s.roomNumber).length
        };

        res.status(200).json({
            success: true,
            count: students.length,
            stats,
            data: {
                students
            }
        });
    } catch (error) {
        console.error('Get students error:', error);

        res.status(500).json({
            success: false,
            message: 'Server error while fetching students'
        });
    }
};

/**
 * @desc    Assign student to room
 * @route   POST /api/admin/assign-room
 * @access  Private (Admin only)
 */
const assignStudentToRoom = async (req, res) => {
    try {
        const { studentId, roomId } = req.body;

        // Validate required fields
        if (!studentId || !roomId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide student ID and room ID'
            });
        }

        // Find student
        const student = await User.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Check if student is actually a student
        if (student.role !== 'student') {
            return res.status(400).json({
                success: false,
                message: 'User is not a student'
            });
        }

        // Find room
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        // Check if student is already assigned to a room
        if (student.roomNumber) {
            // Remove from old room first
            const oldRoom = await Room.findOne({ roomNumber: student.roomNumber });
            if (oldRoom) {
                await oldRoom.removeStudent(student._id);
            }
        }

        // Add student to new room (will check capacity automatically)
        await room.addStudent(student._id);

        // Update student's roomNumber field
        student.roomNumber = room.roomNumber;
        await student.save();

        // Fetch updated room with student details
        const updatedRoom = await Room.findById(roomId)
            .populate('students', 'name email studentId');

        res.status(200).json({
            success: true,
            message: `Student ${student.name} assigned to room ${room.roomNumber}`,
            data: {
                student: {
                    _id: student._id,
                    name: student.name,
                    email: student.email,
                    roomNumber: student.roomNumber
                },
                room: {
                    _id: updatedRoom._id,
                    roomNumber: updatedRoom.roomNumber,
                    capacity: updatedRoom.capacity,
                    occupied: updatedRoom.occupied,
                    availableBeds: updatedRoom.availableBeds,
                    isFull: updatedRoom.isFull,
                    students: updatedRoom.students
                }
            }
        });
    } catch (error) {
        console.error('Assign student error:', error);

        // Handle specific errors from Room model
        if (error.message.includes('full capacity') || error.message.includes('already assigned')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while assigning student to room'
        });
    }
};

/**
 * @desc    Remove student from room
 * @route   DELETE /api/admin/remove-room/:studentId
 * @access  Private (Admin only)
 */
const removeStudentFromRoom = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Find student
        const student = await User.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Check if student has a room assigned
        if (!student.roomNumber) {
            return res.status(400).json({
                success: false,
                message: 'Student is not assigned to any room'
            });
        }

        // Find and update room
        const room = await Room.findOne({ roomNumber: student.roomNumber });

        if (room) {
            await room.removeStudent(student._id);
        }

        // Clear student's roomNumber
        student.roomNumber = null;
        await student.save();

        res.status(200).json({
            success: true,
            message: `Student ${student.name} removed from room`,
            data: {
                student: {
                    _id: student._id,
                    name: student.name,
                    email: student.email,
                    roomNumber: student.roomNumber
                }
            }
        });
    } catch (error) {
        console.error('Remove student error:', error);

        res.status(500).json({
            success: false,
            message: 'Server error while removing student from room'
        });
    }
};

// Export controller functions
module.exports = {
    createRoom,
    getAllRooms,
    addStudent,
    getAllStudents,
    assignStudentToRoom,
    removeStudentFromRoom
};
