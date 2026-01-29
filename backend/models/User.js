// ============================================
// User Model - Mongoose Schema
// ============================================
// This model defines the structure for both Admin and Student users
// It includes authentication fields and role-based access control

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema Definition
 * Handles both Admin and Student users with role-based differentiation
 */
const userSchema = new mongoose.Schema(
    {
        // Full name of the user
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters']
        },

        // Email address - used for login
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email'
            ]
        },

        // Password - will be hashed before saving
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false // Don't include password in queries by default
        },

        // Role determines access level
        role: {
            type: String,
            enum: {
                values: ['admin', 'student'],
                message: 'Role must be either admin or student'
            },
            default: 'student'
        },

        // Room number assigned to the user (mainly for students)
        roomNumber: {
            type: String,
            default: null,
            trim: true
        }
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true
    }
);

// ============================================
// MIDDLEWARE - Hash Password Before Saving
// ============================================
/**
 * Pre-save hook to hash password before storing in database
 * Only runs if password is modified or new
 */
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate salt (random data for hashing)
        const salt = await bcrypt.genSalt(10);

        // Hash the password with the salt
        this.password = await bcrypt.hash(this.password, salt);

        next();
    } catch (error) {
        next(error);
    }
});

// ============================================
// INSTANCE METHODS
// ============================================

/**
 * Compare entered password with hashed password in database
 * @param {string} enteredPassword - Password to check
 * @returns {Promise<boolean>} - True if passwords match
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Check if user is an admin
 * @returns {boolean} - True if user role is admin
 */
userSchema.methods.isAdmin = function () {
    return this.role === 'admin';
};

/**
 * Check if user is a student
 * @returns {boolean} - True if user role is student
 */
userSchema.methods.isStudent = function () {
    return this.role === 'student';
};

// ============================================
// CREATE AND EXPORT MODEL
// ============================================

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

// Export the model for use in other files
module.exports = User;
