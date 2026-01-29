# JWT Authentication Middleware - Already Implemented ✅

## Overview
The JWT authentication middleware is **already created and fully functional** in `backend/middleware/auth.js`.

## Available Middleware Functions

### 1. `verifyToken`
Verifies JWT token and attaches user to request.

**What it does:**
- Extracts token from `Authorization: Bearer <token>` header
- Verifies token using JWT_SECRET
- Fetches user from database
- Attaches user to `req.user`
- Returns 401 if token is invalid/missing

**Usage:**
```javascript
const { verifyToken } = require('./middleware/auth');

router.get('/protected', verifyToken, controller);
```

### 2. `isAdmin`
Ensures user has admin role (must be used after `verifyToken`).

**What it does:**
- Checks if `req.user.role === 'admin'`
- Returns 403 if user is not admin
- Allows request to continue if user is admin

**Usage:**
```javascript
const { verifyToken, isAdmin } = require('./middleware/auth');

// Admin-only route
router.post('/admin-only', verifyToken, isAdmin, controller);
```

### 3. `isStudent`
Ensures user has student role (must be used after `verifyToken`).

**What it does:**
- Checks if `req.user.role === 'student'`
- Returns 403 if user is not student
- Allows request to continue if user is student

**Usage:**
```javascript
const { verifyToken, isStudent } = require('./middleware/auth');

// Student-only route
router.get('/student-only', verifyToken, isStudent, controller);
```

---

## How to Protect Admin Routes

### Example 1: Single Admin Route
```javascript
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const { createRoom } = require('../controllers/adminController');

// Protected admin route
router.post('/rooms', verifyToken, isAdmin, createRoom);

module.exports = router;
```

### Example 2: Protect All Routes in a File
```javascript
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Apply middleware to ALL routes in this file
router.use(verifyToken);
router.use(isAdmin);

// All routes below are now protected (admin-only)
router.post('/rooms', adminController.createRoom);
router.get('/rooms', adminController.getAllRooms);
router.post('/students', adminController.addStudent);
router.post('/assign-room', adminController.assignStudentToRoom);

module.exports = router;
```

### Example 3: Mixed Protection
```javascript
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin, isStudent } = require('../middleware/auth');

// Public route (no protection)
router.get('/public', publicController);

// Any authenticated user
router.get('/profile', verifyToken, getProfile);

// Admin only
router.post('/admin-action', verifyToken, isAdmin, adminAction);

// Student only
router.get('/student-data', verifyToken, isStudent, studentData);

module.exports = router;
```

---

## Request Flow

### Successful Admin Request
```
1. Client sends request with header:
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

2. verifyToken middleware:
   ✅ Extracts token
   ✅ Verifies with JWT_SECRET
   ✅ Fetches user from database
   ✅ Attaches to req.user

3. isAdmin middleware:
   ✅ Checks req.user.role === 'admin'
   ✅ Allows request to continue

4. Controller executes
   ✅ Has access to req.user
   ✅ Processes request
   ✅ Returns response
```

### Failed Admin Request (Student tries to access)
```
1. Client sends request with student JWT token

2. verifyToken middleware:
   ✅ Token is valid
   ✅ User fetched (role: 'student')
   ✅ Attaches to req.user

3. isAdmin middleware:
   ❌ req.user.role !== 'admin'
   ❌ Returns 403 Forbidden
   
Response:
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### Failed Request (No Token)
```
1. Client sends request without Authorization header

2. verifyToken middleware:
   ❌ No token found
   ❌ Returns 401 Unauthorized
   
Response:
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

---

## Testing Admin Route Protection

### Test 1: Admin Access (Should Work)
```bash
# 1. Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hostel.com","password":"admin123"}'

# 2. Copy the token from response

# 3. Access admin route
curl -X GET http://localhost:5000/api/admin/rooms \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Test 2: Student Access (Should Fail)
```bash
# 1. Login as student
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@hostel.com","password":"student123"}'

# 2. Copy the token

# 3. Try to access admin route (will be rejected)
curl -X GET http://localhost:5000/api/admin/rooms \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"

# Expected: 403 Forbidden
```

### Test 3: No Token (Should Fail)
```bash
# Try to access without token
curl -X GET http://localhost:5000/api/admin/rooms

# Expected: 401 Unauthorized
```

---

## Accessing User Data in Controllers

Once middleware runs, you have access to the authenticated user:

```javascript
const createRoom = async (req, res) => {
  // req.user is available (set by verifyToken)
  console.log('Admin user:', req.user.name);
  console.log('Admin ID:', req.user._id);
  console.log('Role:', req.user.role);
  
  // Your controller logic here
};
```

---

## Error Responses

### 401 Unauthorized (No Token)
```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

### 401 Unauthorized (Invalid Token)
```json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

### 403 Forbidden (Wrong Role)
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

---

## Summary

✅ **JWT middleware already created** in `middleware/auth.js`  
✅ **Fully tested** - All 7 authentication tests passed  
✅ **Three middleware functions available:**
   - `verifyToken` - Validates JWT
   - `isAdmin` - Ensures admin role
   - `isStudent` - Ensures student role  
✅ **Ready to use** in admin and student routes  

**Next Step:** Create admin controller and routes, then apply these middleware functions to protect them! 🚀
