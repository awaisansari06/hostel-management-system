# Admin API Documentation

## Overview
Admin APIs provide complete control over hostel management including room creation, student management, and room assignments.

**Base URL:** `/api/admin`  
**Authentication:** Required (Admin role only)  
**Authorization Header:** `Bearer <admin-jwt-token>`

---

## Endpoints

### 1. Create Room
**POST** `/api/admin/rooms`

Create a new hostel room.

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "roomNumber": "101",
  "capacity": 4
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "room": {
      "_id": "65abc123...",
      "roomNumber": "101",
      "capacity": 4,
      "occupied": 0,
      "availableBeds": 4,
      "isFull": false
    }
  }
}
```

**Error Responses:**
- **400:** Missing fields or room already exists
- **401:** Not authenticated
- **403:** Not admin

---

### 2. Get All Rooms
**GET** `/api/admin/rooms`

Get all rooms with student details and statistics.

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "stats": {
    "totalRooms": 10,
    "totalCapacity": 40,
    "totalOccupied": 25,
    "availableRooms": 7,
    "fullRooms": 3
  },
  "data": {
    "rooms": [
      {
        "_id": "65abc123...",
        "roomNumber": "101",
        "capacity": 4,
        "occupied": 3,
        "availableBeds": 1,
        "isFull": false,
        "occupancyRate": 75,
        "students": [
          {
            "_id": "65def456...",
            "name": "John Doe",
            "email": "john@student.com",
            "studentId": "ST001"
          }
        ],
        "createdAt": "2024-01-20T10:30:00.000Z",
        "updatedAt": "2024-01-20T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 3. Add Student
**POST** `/api/admin/students`

Add a new student to the system.

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@student.com",
  "password": "student123",
  "studentId": "ST001",
  "phone": "1234567890"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Student added successfully",
  "data": {
    "student": {
      "_id": "65def456...",
      "name": "John Doe",
      "email": "john@student.com",
      "role": "student",
      "studentId": "ST001",
      "phone": "1234567890",
      "roomNumber": null
    }
  }
}
```

**Error Responses:**
- **400:** Missing fields or email already exists
- **401:** Not authenticated
- **403:** Not admin

---

### 4. Get All Students
**GET** `/api/admin/students`

Get all students with assignment statistics.

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 25,
  "stats": {
    "totalStudents": 25,
    "assignedStudents": 20,
    "unassignedStudents": 5
  },
  "data": {
    "students": [
      {
        "_id": "65def456...",
        "name": "John Doe",
        "email": "john@student.com",
        "role": "student",
        "studentId": "ST001",
        "roomNumber": "101",
        "createdAt": "2024-01-20T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 5. Assign Student to Room
**POST** `/api/admin/assign-room`

Assign a student to a room. If student is already in another room, they will be moved.

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "studentId": "65def456...",
  "roomId": "65abc123..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Student John Doe assigned to room 101",
  "data": {
    "student": {
      "_id": "65def456...",
      "name": "John Doe",
      "email": "john@student.com",
      "roomNumber": "101"
    },
    "room": {
      "_id": "65abc123...",
      "roomNumber": "101",
      "capacity": 4,
      "occupied": 3,
      "availableBeds": 1,
      "isFull": false,
      "students": [...]
    }
  }
}
```

**Error Responses:**
- **400:** Missing fields, room full, or student already assigned
- **404:** Student or room not found
- **401:** Not authenticated
- **403:** Not admin

---

### 6. Remove Student from Room
**DELETE** `/api/admin/remove-room/:studentId`

Remove a student from their assigned room.

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <admin-token>
```

**URL Parameters:**
- `studentId` - MongoDB ObjectId of the student

**Success Response (200):**
```json
{
  "success": true,
  "message": "Student John Doe removed from room",
  "data": {
    "student": {
      "_id": "65def456...",
      "name": "John Doe",
      "email": "john@student.com",
      "roomNumber": null
    }
  }
}
```

**Error Responses:**
- **400:** Student not assigned to any room
- **404:** Student not found
- **401:** Not authenticated
- **403:** Not admin

---

## Testing with cURL

### 1. Login as Admin (Get Token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hostel.com","password":"admin123"}'
```

### 2. Create Room
```bash
curl -X POST http://localhost:5000/api/admin/rooms \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roomNumber":"101","capacity":4}'
```

### 3. Get All Rooms
```bash
curl -X GET http://localhost:5000/api/admin/rooms \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 4. Add Student
```bash
curl -X POST http://localhost:5000/api/admin/students \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@student.com",
    "password":"student123",
    "studentId":"ST001"
  }'
```

### 5. Get All Students
```bash
curl -X GET http://localhost:5000/api/admin/students \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 6. Assign Student to Room
```bash
curl -X POST http://localhost:5000/api/admin/assign-room \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId":"STUDENT_OBJECT_ID",
    "roomId":"ROOM_OBJECT_ID"
  }'
```

### 7. Remove Student from Room
```bash
curl -X DELETE http://localhost:5000/api/admin/remove-room/STUDENT_OBJECT_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Common Workflows

### Workflow 1: Setup New Hostel Floor
```
1. POST /api/admin/rooms (Create room 101)
2. POST /api/admin/rooms (Create room 102)
3. POST /api/admin/rooms (Create room 103)
4. GET /api/admin/rooms (Verify all rooms created)
```

### Workflow 2: Onboard New Students
```
1. POST /api/admin/students (Add student 1)
2. POST /api/admin/students (Add student 2)
3. POST /api/admin/students (Add student 3)
4. GET /api/admin/students (Verify all students added)
```

### Workflow 3: Assign Students to Rooms
```
1. GET /api/admin/rooms (Find available rooms)
2. GET /api/admin/students (Find unassigned students)
3. POST /api/admin/assign-room (Assign student to room)
4. GET /api/admin/rooms (Verify assignment)
```

---

## Security Features

✅ **JWT Authentication:** All endpoints require valid admin token  
✅ **Role-Based Access:** Only admin users can access these endpoints  
✅ **Input Validation:** All inputs validated before processing  
✅ **Capacity Checks:** Automatic room capacity enforcement  
✅ **Duplicate Prevention:** Email and room number uniqueness  
✅ **Error Handling:** Comprehensive error messages  

---

## Files Created

- ✅ `backend/controllers/adminController.js` - Admin business logic
- ✅ `backend/routes/adminRoutes.js` - Admin API routes
- ✅ `backend/server.js` - Routes mounted at `/api/admin`
