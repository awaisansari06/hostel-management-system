// ============================================
// Room Model - Mongoose Schema
// ============================================
// This model defines the structure for hostel rooms
// It includes capacity management and student assignments

const mongoose = require('mongoose');

/**
 * Room Schema Definition
 * Manages room information and student assignments
 */
const roomSchema = new mongoose.Schema(
    {
        // Unique room identifier (e.g., "101", "A-205")
        roomNumber: {
            type: String,
            required: [true, 'Please provide a room number'],
            unique: true,
            trim: true,
            uppercase: true // Convert to uppercase for consistency
        },

        // Maximum number of students allowed in the room
        capacity: {
            type: Number,
            required: [true, 'Please provide room capacity'],
            min: [1, 'Capacity must be at least 1'],
            max: [10, 'Capacity cannot exceed 10']
        },

        // Current number of students occupying the room
        occupied: {
            type: Number,
            default: 0,
            min: [0, 'Occupied count cannot be negative'],
            validate: {
                validator: function (value) {
                    // Occupied count should never exceed capacity
                    return value <= this.capacity;
                },
                message: 'Occupied count cannot exceed room capacity'
            }
        },

        // Array of references to User documents (students in this room)
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User' // Reference to User model
            }
        ]
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true
    }
);

// ============================================
// VIRTUAL PROPERTIES
// ============================================

/**
 * Virtual property to check if room is full
 * Returns true if occupied count equals capacity
 */
roomSchema.virtual('isFull').get(function () {
    return this.occupied >= this.capacity;
});

/**
 * Virtual property to get available beds
 * Returns number of empty beds in the room
 */
roomSchema.virtual('availableBeds').get(function () {
    return this.capacity - this.occupied;
});

// ============================================
// MIDDLEWARE
// ============================================

/**
 * Pre-save hook to automatically update occupied count
 * based on the number of students in the students array
 */
roomSchema.pre('save', function (next) {
    // Update occupied count to match students array length
    this.occupied = this.students.length;
    next();
});

/**
 * Pre-save validation to ensure students array doesn't exceed capacity
 */
roomSchema.pre('save', function (next) {
    if (this.students.length > this.capacity) {
        const error = new Error(`Cannot assign ${this.students.length} students to a room with capacity ${this.capacity}`);
        return next(error);
    }
    next();
});

// ============================================
// INSTANCE METHODS
// ============================================

/**
 * Add a student to the room
 * @param {String} studentId - MongoDB ObjectId of the student
 * @returns {Promise<Room>} - Updated room document
 */
roomSchema.methods.addStudent = async function (studentId) {
    // Check if room is full
    if (this.isFull) {
        throw new Error('Room is already at full capacity');
    }

    // Check if student is already in the room
    if (this.students.includes(studentId)) {
        throw new Error('Student is already assigned to this room');
    }

    // Add student to the room
    this.students.push(studentId);

    // Save will automatically update occupied count via pre-save hook
    return await this.save();
};

/**
 * Remove a student from the room
 * @param {String} studentId - MongoDB ObjectId of the student
 * @returns {Promise<Room>} - Updated room document
 */
roomSchema.methods.removeStudent = async function (studentId) {
    // Find the index of the student
    const studentIndex = this.students.indexOf(studentId);

    if (studentIndex === -1) {
        throw new Error('Student is not assigned to this room');
    }

    // Remove student from the array
    this.students.splice(studentIndex, 1);

    // Save will automatically update occupied count via pre-save hook
    return await this.save();
};

/**
 * Check if room has available space
 * @returns {Boolean} - True if room has empty beds
 */
roomSchema.methods.hasSpace = function () {
    return this.occupied < this.capacity;
};

/**
 * Get room occupancy percentage
 * @returns {Number} - Percentage of room occupancy (0-100)
 */
roomSchema.methods.getOccupancyRate = function () {
    return Math.round((this.occupied / this.capacity) * 100);
};

// ============================================
// STATIC METHODS
// ============================================

/**
 * Find all available rooms (rooms with empty beds)
 * @returns {Promise<Array>} - Array of available rooms
 */
roomSchema.statics.findAvailableRooms = function () {
    return this.find({ $expr: { $lt: ['$occupied', '$capacity'] } });
};

/**
 * Find all full rooms
 * @returns {Promise<Array>} - Array of full rooms
 */
roomSchema.statics.findFullRooms = function () {
    return this.find({ $expr: { $gte: ['$occupied', '$capacity'] } });
};

// ============================================
// INDEXES
// ============================================

// Create index on roomNumber for faster lookups
roomSchema.index({ roomNumber: 1 });

// ============================================
// CREATE AND EXPORT MODEL
// ============================================

// Create the Room model from the schema
const Room = mongoose.model('Room', roomSchema);

// Export the model for use in other files
module.exports = Room;
