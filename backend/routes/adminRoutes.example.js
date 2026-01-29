// ============================================
// Example: Protected Admin Routes
// ============================================
// This demonstrates how to use the authentication middleware
// to protect admin routes

const express = require('express');
const router = express.Router();

// Import authentication middleware
const { verifyToken, isAdmin } = require('../middleware/auth');

// Example controller (you'll create the actual one later)
const exampleAdminController = {
    // Example: Create a room
    createRoom: async (req, res) => {
        // req.user is available here (set by verifyToken middleware)
        console.log('Admin creating room:', req.user.name);

        res.json({
            success: true,
            message: 'Room created by admin',
            admin: {
                id: req.user._id,
                name: req.user.name,
                role: req.user.role
            }
        });
    },

    // Example: Get all rooms
    getAllRooms: async (req, res) => {
        console.log('Admin viewing rooms:', req.user.name);

        res.json({
            success: true,
            message: 'Rooms retrieved',
            rooms: []
        });
    }
};

// ============================================
// PROTECTED ADMIN ROUTES
// ============================================

// Method 1: Apply middleware to individual routes
router.post('/rooms', verifyToken, isAdmin, exampleAdminController.createRoom);
router.get('/rooms', verifyToken, isAdmin, exampleAdminController.getAllRooms);

// Method 2: Apply middleware to all routes (uncomment to use)
// router.use(verifyToken);
// router.use(isAdmin);
// router.post('/rooms', exampleAdminController.createRoom);
// router.get('/rooms', exampleAdminController.getAllRooms);

module.exports = router;

// ============================================
// HOW TO TEST
// ============================================

/*
1. Start the server:
   npm run dev

2. Register an admin user:
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Admin","email":"admin@test.com","password":"admin123","role":"admin"}'

3. Copy the token from the response

4. Access protected route:
   curl -X POST http://localhost:5000/api/admin/rooms \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -d '{"roomNumber":"101","capacity":4}'

5. Try without token (should fail):
   curl -X POST http://localhost:5000/api/admin/rooms \
     -H "Content-Type: application/json" \
     -d '{"roomNumber":"101","capacity":4}'

6. Try with student token (should fail with 403):
   - Register as student
   - Get student token
   - Try to access admin route
*/
