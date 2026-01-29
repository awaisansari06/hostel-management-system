# Authentication API Documentation

## Overview
The authentication system uses JWT (JSON Web Tokens) for secure user authentication and bcrypt for password hashing.

## Endpoints

### 1. Register User
**POST** `/api/auth/register`

Create a new user account (admin or student).

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",        // Optional: "admin" or "student" (default: "student")
  "roomNumber": "101"       // Optional
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "roomNumber": "101"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- **400 Bad Request:** Missing required fields or user already exists
- **500 Server Error:** Internal server error

---

### 2. Login User
**POST** `/api/auth/login`

Authenticate user and receive JWT token.

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "roomNumber": "101"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- **400 Bad Request:** Missing email or password
- **401 Unauthorized:** Invalid credentials
- **500 Server Error:** Internal server error

---

### 3. Get Current User Profile
**GET** `/api/auth/me`

Get the profile of the currently logged-in user.

**Access:** Private (requires JWT token)

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "roomNumber": "101",
      "createdAt": "2024-01-20T10:30:00.000Z",
      "updatedAt": "2024-01-20T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- **401 Unauthorized:** No token or invalid token
- **500 Server Error:** Internal server error

---

## Authentication Flow

### Registration Flow
1. User sends registration data to `/api/auth/register`
2. Server validates required fields
3. Server checks if email already exists
4. Password is automatically hashed by User model (bcrypt)
5. User is created in database
6. JWT token is generated
7. User data and token are returned

### Login Flow
1. User sends credentials to `/api/auth/login`
2. Server validates required fields
3. Server finds user by email
4. Password is compared using bcrypt
5. If valid, JWT token is generated
6. User data and token are returned

### Protected Route Access
1. Client includes JWT token in Authorization header
2. `verifyToken` middleware extracts and verifies token
3. User object is attached to `req.user`
4. Role-based middleware (`isAdmin`, `isStudent`) checks permissions
5. Request proceeds to controller

---

## JWT Token Details

**Token Payload:**
```json
{
  "id": "user-mongodb-id",
  "role": "admin" | "student",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Token Expiration:** 30 days

**Secret Key:** Stored in `.env` as `JWT_SECRET`

---

## Middleware

### `verifyToken`
Verifies JWT token and attaches user to request.

**Usage:**
```javascript
router.get('/protected', verifyToken, controller);
```

### `isAdmin`
Ensures user has admin role. Must be used after `verifyToken`.

**Usage:**
```javascript
router.post('/admin-only', verifyToken, isAdmin, controller);
```

### `isStudent`
Ensures user has student role. Must be used after `verifyToken`.

**Usage:**
```javascript
router.get('/student-only', verifyToken, isStudent, controller);
```

---

## Security Features

✅ **Password Hashing:** Passwords hashed with bcrypt (salt rounds: 10)  
✅ **JWT Authentication:** Secure token-based authentication  
✅ **Token Expiration:** Tokens expire after 30 days  
✅ **Role-Based Access:** Admin and student role separation  
✅ **Password Exclusion:** Passwords never returned in responses  
✅ **Input Validation:** Required fields validated  
✅ **Error Handling:** Comprehensive error messages  

---

## Testing with cURL

### Register Admin
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@hostel.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### Register Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@student.com",
    "password": "student123",
    "role": "student",
    "roomNumber": "101"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@student.com",
    "password": "student123"
  }'
```

### Get Profile (replace TOKEN with actual JWT)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## Files Created

- ✅ `backend/utils/generateToken.js` - JWT token generation
- ✅ `backend/middleware/auth.js` - Authentication middleware
- ✅ `backend/controllers/authController.js` - Auth logic
- ✅ `backend/routes/authRoutes.js` - Auth endpoints
- ✅ `backend/server.js` - Routes mounted

---

## Common Errors

### "Not authorized, no token provided"
- **Cause:** No Authorization header or missing Bearer token
- **Solution:** Include `Authorization: Bearer <token>` header

### "Invalid email or password"
- **Cause:** Wrong credentials
- **Solution:** Check email and password

### "User with this email already exists"
- **Cause:** Email already registered
- **Solution:** Use different email or login instead

### "Access denied. Admin privileges required"
- **Cause:** Student trying to access admin route
- **Solution:** Login with admin account
