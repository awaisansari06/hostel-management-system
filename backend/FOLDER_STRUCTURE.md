# Backend Folder Structure Explanation

This document explains the purpose of each folder in the backend directory.

## 📁 Folder Structure Overview

```
backend/
├── config/          # Configuration files
├── models/          # Database schemas (Mongoose models)
├── controllers/     # Business logic for handling requests
├── routes/          # API endpoint definitions
├── middleware/      # Custom middleware functions
├── utils/           # Helper/utility functions
└── server.js        # Main entry point
```

---

## 📂 Detailed Folder Explanations

### 1. **config/** - Configuration Files
**Purpose**: Store all configuration-related code

**Files that will go here**:
- `db.js` - MongoDB connection configuration using Mongoose
- Any other environment-specific configurations

**Why separate?**: 
- Keeps configuration logic separate from business logic
- Easy to modify database settings without touching other code
- Makes it simple to switch between development/production databases

**Example**:
```javascript
// config/db.js will contain:
// - MongoDB connection string from .env
// - Connection options
// - Error handling for database connection
```

---

### 2. **models/** - Database Schemas
**Purpose**: Define the structure of data in MongoDB using Mongoose schemas

**Files that will go here**:
- `User.js` - User schema (for both Admin and Student)
- `Room.js` - Room schema

**Why separate?**:
- Each model represents a collection in MongoDB
- Defines what fields each document can have
- Includes validation rules, default values, and relationships
- Reusable across different controllers

**Example**:
```javascript
// models/User.js will define:
// - name, email, password, role, studentId, phone
// - Password hashing before saving
// - Virtual fields if needed
```

---

### 3. **controllers/** - Business Logic
**Purpose**: Handle the actual logic for each API request

**Files that will go here**:
- `authController.js` - Login, register, get current user
- `adminController.js` - Create rooms, add students, assign rooms
- `studentController.js` - Get profile, get assigned room

**Why separate?**:
- Keeps routes clean and readable
- Each controller function handles one specific task
- Easy to test individual functions
- Follows MVC (Model-View-Controller) pattern

**Example**:
```javascript
// authController.js will contain functions like:
// - register() - Create new user, hash password, return JWT
// - login() - Verify credentials, return JWT
// - getMe() - Get current logged-in user details
```

---

### 4. **routes/** - API Endpoints
**Purpose**: Define URL paths and link them to controller functions

**Files that will go here**:
- `authRoutes.js` - /api/auth/register, /api/auth/login
- `adminRoutes.js` - /api/admin/rooms, /api/admin/students, etc.
- `studentRoutes.js` - /api/student/profile, /api/student/room

**Why separate?**:
- Clear organization of all API endpoints
- Easy to see all available routes at a glance
- Can apply middleware to specific route groups
- RESTful API structure

**Example**:
```javascript
// adminRoutes.js will define:
// POST /api/admin/rooms → adminController.createRoom
// GET /api/admin/rooms → adminController.getAllRooms
// All routes will use auth middleware
```

---

### 5. **middleware/** - Custom Middleware
**Purpose**: Functions that run before reaching controller functions

**Files that will go here**:
- `auth.js` - JWT verification, role checking

**Why separate?**:
- Reusable across multiple routes
- Keeps authentication/authorization logic in one place
- Can chain multiple middleware functions
- Cleaner route definitions

**Example**:
```javascript
// middleware/auth.js will contain:
// - verifyToken() - Check if JWT is valid
// - isAdmin() - Check if user role is 'admin'
// - isStudent() - Check if user role is 'student'
```

**How it works**:
```javascript
// In routes, we'll use it like:
router.get('/rooms', verifyToken, isAdmin, adminController.getAllRooms);
// Request → verifyToken → isAdmin → getAllRooms → Response
```

---

### 6. **utils/** - Helper Functions
**Purpose**: Reusable utility functions used across the application

**Files that will go here** (optional, as needed):
- `generateToken.js` - JWT token generation
- `validators.js` - Input validation helpers
- `errorHandler.js` - Custom error handling

**Why separate?**:
- Avoid code duplication
- Single source of truth for common operations
- Easy to update logic in one place
- Keeps controllers clean

**Example**:
```javascript
// utils/generateToken.js might contain:
// - Function to create JWT with user ID and role
// - Token expiration settings
```

---

### 7. **server.js** - Main Entry Point
**Purpose**: The main file that starts the Express server

**What it will contain**:
- Express app initialization
- Middleware setup (CORS, JSON parsing)
- Database connection
- Route mounting
- Error handling
- Server startup on PORT 5000

**Why at root?**:
- Entry point should be easily identifiable
- Common convention in Node.js projects
- Easy to run: `node server.js` or `nodemon server.js`

---

## 🔄 How Everything Works Together

### Example Request Flow:

**Student wants to view their room:**

1. **Frontend** sends GET request to `/api/student/room` with JWT token in header

2. **server.js** receives request and routes to `studentRoutes.js`

3. **studentRoutes.js** applies middleware:
   - `verifyToken` (from `middleware/auth.js`) checks JWT
   - `isStudent` (from `middleware/auth.js`) checks role

4. **Controller** function `getAssignedRoom` (from `controllers/studentController.js`) executes:
   - Uses `User` model (from `models/User.js`) to find student
   - Uses `Room` model (from `models/Room.js`) to get room details
   - Returns room data

5. **Response** sent back to frontend

---

## 📝 Benefits of This Structure

✅ **Separation of Concerns**: Each folder has one specific responsibility

✅ **Scalability**: Easy to add new features without breaking existing code

✅ **Maintainability**: Easy to find and fix bugs

✅ **Readability**: Clear organization makes code easy to understand

✅ **Testability**: Each component can be tested independently

✅ **Team Collaboration**: Multiple developers can work on different parts

✅ **Industry Standard**: Follows best practices used in professional projects

---

## 🎯 Next Steps

Once you approve, we'll start creating files in this order:

1. **config/db.js** - Database connection
2. **server.js** - Express server setup
3. **models/** - User and Room schemas
4. **middleware/auth.js** - Authentication
5. **controllers/** - Business logic
6. **routes/** - API endpoints

Each file will be well-commented and beginner-friendly! 🚀
