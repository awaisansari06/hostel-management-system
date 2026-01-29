# Student API Documentation

## Overview
Student APIs allow students to view their profile and assigned room details.

**Base URL:** `/api/student`  
**Authentication:** Required (Student role only)  
**Authorization Header:** `Bearer <student-jwt-token>`

---

## Endpoints

### 1. Get Student Profile
**GET** `/api/student/profile`

Get the logged-in student's profile information.

**Access:** Student only

**Headers:**
```
Authorization: Bearer <student-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "student": {
      "_id": "65def456...",
      "name": "John Doe",
      "email": "john@student.com",
      "role": "student",
      "studentId": "ST001",
      "phone": "1234567890",
      "roomNumber": "101",
      "createdAt": "2024-01-20T10:30:00.000Z",
      "updatedAt": "2024-01-20T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- **401:** Not authenticated
- **403:** Not a student
- **500:** Server error

---

### 2. Get Assigned Room Details
**GET** `/api/student/room`

Get details of the student's assigned room including roommates.

**Access:** Student only

**Headers:**
```
Authorization: Bearer <student-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "room": {
      "_id": "65abc123...",
      "roomNumber": "101",
      "capacity": 4,
      "occupied": 3,
      "availableBeds": 1,
      "isFull": false,
      "occupancyRate": 75
    },
    "roommates": [
      {
        "_id": "65xyz789...",
        "name": "Jane Smith",
        "email": "jane@student.com",
        "studentId": "ST002",
        "phone": "9876543210"
      },
      {
        "_id": "65pqr456...",
        "name": "Bob Johnson",
        "email": "bob@student.com",
        "studentId": "ST003",
        "phone": "5555555555"
      }
    ],
    "totalRoommates": 2
  }
}
```

**Error Responses:**
- **401:** Not authenticated
- **403:** Not a student
- **404:** No room assigned or room not found
- **500:** Server error

---

### 3. Update Profile
**PUT** `/api/student/profile`

Update student's own profile (name and phone only).

**Access:** Student only

**Headers:**
```
Authorization: Bearer <student-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Updated Doe",
  "phone": "9999999999"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "student": {
      "_id": "65def456...",
      "name": "John Updated Doe",
      "email": "john@student.com",
      "studentId": "ST001",
      "phone": "9999999999",
      "roomNumber": "101"
    }
  }
}
```

**Error Responses:**
- **401:** Not authenticated
- **403:** Not a student
- **500:** Server error

---

## Testing with cURL

### 1. Login as Student (Get Token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@student.com","password":"student123"}'
```

### 2. Get Profile
```bash
curl -X GET http://localhost:5000/api/student/profile \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

### 3. Get Assigned Room
```bash
curl -X GET http://localhost:5000/api/student/room \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

### 4. Update Profile
```bash
curl -X PUT http://localhost:5000/api/student/profile \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","phone":"1111111111"}'
```

---

## Common Workflows

### Workflow 1: Student Checks Their Info
```
1. POST /api/auth/login (Login)
2. GET /api/student/profile (View profile)
3. GET /api/student/room (View room and roommates)
```

### Workflow 2: Student Updates Contact Info
```
1. POST /api/auth/login (Login)
2. GET /api/student/profile (Check current info)
3. PUT /api/student/profile (Update phone number)
4. GET /api/student/profile (Verify update)
```

---

## Response Details

### Room Not Assigned
If student has no room assigned:
```json
{
  "success": false,
  "message": "No room assigned yet"
}
```

### Roommates Information
- Current student is excluded from roommates list
- Only shows other students in the same room
- Includes contact information for coordination

---

## Security Features

✅ **JWT Authentication:** All endpoints require valid student token  
✅ **Role-Based Access:** Only student users can access these endpoints  
✅ **Data Privacy:** Students can only view their own data  
✅ **Limited Updates:** Students can only update name and phone  
✅ **No Password in Response:** Password never returned  

---

## Files Created

- ✅ `backend/controllers/studentController.js` - Student business logic
- ✅ `backend/routes/studentRoutes.js` - Student API routes
- ✅ `backend/server.js` - Routes mounted at `/api/student`
