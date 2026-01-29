// ============================================
// Student Controller
// ============================================
// Handles student operations: profile viewing and room details

const Room = require('../models/Room');
const User = require('../models/User');

/**
 * @desc    Get student's own profile
 * @route   GET /api/student/profile
 * @access  Private (Student only)
 */
const getProfile = async (req, res) => {
    try {
        // req.user is set by verifyToken middleware
        const student = req.user;

        res.status(200).json({
            success: true,
            data: {
                student: {
                    _id: student._id,
                    name: student.name,
                    email: student.email,
                    role: student.role,
                    studentId: student.studentId,
                    phone: student.phone,
                    roomNumber: student.roomNumber,
                    createdAt: student.createdAt,
                    updatedAt: student.updatedAt
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

/**
 * @desc    Get student's assigned room details
 * @route   GET /api/student/room
 * @access  Private (Student only)
 */
const getAssignedRoom = async (req, res) => {
    try {
        // req.user is set by verifyToken middleware
        const student = req.user;

        // Check if student has a room assigned
        if (!student.roomNumber) {
            return res.status(404).json({
                success: false,
                message: 'No room assigned yet'
            });
        }

        // Find the room and populate roommates
        const room = await Room.findOne({ roomNumber: student.roomNumber })
            .populate('students', 'name email studentId phone');

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        // Filter out current student from roommates list
        const roommates = room.students.filter(
            s => s._id.toString() !== student._id.toString()
        );

        res.status(200).json({
            success: true,
            data: {
                room: {
                    _id: room._id,
                    roomNumber: room.roomNumber,
                    capacity: room.capacity,
                    occupied: room.occupied,
                    availableBeds: room.availableBeds,
                    isFull: room.isFull,
                    occupancyRate: room.getOccupancyRate()
                },
                roommates: roommates.map(mate => ({
                    _id: mate._id,
                    name: mate.name,
                    email: mate.email,
                    studentId: mate.studentId,
                    phone: mate.phone
                })),
                totalRoommates: roommates.length
            }
        });
    } catch (error) {
        console.error('Get room error:', error);

        res.status(500).json({
            success: false,
            message: 'Server error while fetching room details'
        });
    }
};

/**
 * @desc    Update student's own profile
 * @route   PUT /api/student/profile
 * @access  Private (Student only)
 */
const updateProfile = async (req, res) => {
    try {
        const student = req.user;
        const { name, phone, studentId } = req.body;

        // Only allow updating name, phone, and studentId
        if (name) student.name = name;
        if (phone) student.phone = phone;
        if (studentId) student.studentId = studentId;

        await student.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                student: {
                    _id: student._id,
                    name: student.name,
                    email: student.email,
                    studentId: student.studentId,
                    phone: student.phone,
                    roomNumber: student.roomNumber
                }
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Student ID already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while updating profile'
        });
    }
};

// Export controller functions
module.exports = {
    getProfile,
    getAssignedRoom,
    updateProfile
};
