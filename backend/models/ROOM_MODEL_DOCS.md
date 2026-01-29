# Room Model Documentation

## Overview
The Room model manages hostel rooms, their capacity, and student assignments with automatic occupancy tracking.

## Schema Fields

| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `roomNumber` | String | ✅ Yes | ✅ Yes | - | Unique room identifier (uppercase) |
| `capacity` | Number | ✅ Yes | ❌ No | - | Maximum students allowed (1-10) |
| `occupied` | Number | ❌ No | ❌ No | `0` | Current number of students (auto-updated) |
| `students` | Array | ❌ No | ❌ No | `[]` | Array of User ObjectId references |
| `createdAt` | Date | Auto | ❌ No | Auto | Timestamp when room was created |
| `updatedAt` | Date | Auto | ❌ No | Auto | Timestamp when room was last updated |

## Validation Rules

### Room Number
- ✅ Required
- ✅ Must be unique
- ✅ Trimmed (whitespace removed)
- ✅ Converted to uppercase automatically

### Capacity
- ✅ Required
- ✅ Minimum: 1
- ✅ Maximum: 10

### Occupied
- ✅ Cannot be negative
- ✅ Cannot exceed capacity
- ✅ **Automatically updated** when students array changes

### Students Array
- ✅ References User model (ObjectId)
- ✅ Cannot exceed room capacity
- ✅ Automatically updates occupied count

## Virtual Properties

Virtual properties are computed on-the-fly and not stored in the database.

### `isFull`
Returns `true` if the room is at full capacity.

**Usage:**
```javascript
if (room.isFull) {
  console.log('Room is full!');
}
```

### `availableBeds`
Returns the number of empty beds in the room.

**Usage:**
```javascript
console.log(`${room.availableBeds} beds available`);
```

## Middleware

### Auto-Update Occupied Count (Pre-save)
```javascript
roomSchema.pre('save', function(next) {
  this.occupied = this.students.length;
  next();
});
```
**What it does:** Automatically sets `occupied` to match the length of the `students` array.

### Capacity Validation (Pre-save)
```javascript
roomSchema.pre('save', function(next) {
  if (this.students.length > this.capacity) {
    return next(new Error('Cannot exceed capacity'));
  }
  next();
});
```
**What it does:** Prevents saving if students array exceeds room capacity.

## Instance Methods

### `addStudent(studentId)`
Adds a student to the room.

**Parameters:**
- `studentId` (String) - MongoDB ObjectId of the student

**Returns:**
- `Promise<Room>` - Updated room document

**Throws:**
- Error if room is full
- Error if student is already in the room

**Usage:**
```javascript
await room.addStudent(student._id);
```

### `removeStudent(studentId)`
Removes a student from the room.

**Parameters:**
- `studentId` (String) - MongoDB ObjectId of the student

**Returns:**
- `Promise<Room>` - Updated room document

**Throws:**
- Error if student is not in the room

**Usage:**
```javascript
await room.removeStudent(student._id);
```

### `hasSpace()`
Checks if the room has available beds.

**Returns:**
- `Boolean` - `true` if room has empty beds

**Usage:**
```javascript
if (room.hasSpace()) {
  // Assign student
}
```

### `getOccupancyRate()`
Calculates the room occupancy percentage.

**Returns:**
- `Number` - Percentage (0-100)

**Usage:**
```javascript
console.log(`Room is ${room.getOccupancyRate()}% full`);
```

## Static Methods

Static methods are called on the model itself, not on instances.

### `findAvailableRooms()`
Finds all rooms with available beds.

**Returns:**
- `Promise<Array>` - Array of available rooms

**Usage:**
```javascript
const availableRooms = await Room.findAvailableRooms();
```

### `findFullRooms()`
Finds all rooms at full capacity.

**Returns:**
- `Promise<Array>` - Array of full rooms

**Usage:**
```javascript
const fullRooms = await Room.findFullRooms();
```

## Usage Examples

### Creating a Room
```javascript
const Room = require('./models/Room');

const room = new Room({
  roomNumber: '101',
  capacity: 4
});

await room.save();
// occupied will be 0, students will be []
```

### Adding Students to a Room
```javascript
// Method 1: Using addStudent helper
await room.addStudent(student1._id);
await room.addStudent(student2._id);

// Method 2: Direct array manipulation
room.students.push(student1._id, student2._id);
await room.save();
// occupied will automatically be set to 2
```

### Removing a Student
```javascript
await room.removeStudent(student1._id);
// occupied will automatically decrease
```

### Populating Student Details
```javascript
const room = await Room.findOne({ roomNumber: '101' })
  .populate('students', 'name email roomNumber');

console.log(room.students); // Full student objects
```

### Finding Available Rooms
```javascript
const availableRooms = await Room.findAvailableRooms();
console.log(`${availableRooms.length} rooms available`);
```

### Checking Room Status
```javascript
const room = await Room.findOne({ roomNumber: '101' });

console.log(`Room ${room.roomNumber}:`);
console.log(`- Capacity: ${room.capacity}`);
console.log(`- Occupied: ${room.occupied}`);
console.log(`- Available: ${room.availableBeds}`);
console.log(`- Full: ${room.isFull}`);
console.log(`- Occupancy: ${room.getOccupancyRate()}%`);
```

## Relationship with User Model

The Room model has a **one-to-many** relationship with the User model:
- One room can have multiple students
- Each student reference is stored as an ObjectId in the `students` array

**Note:** The User model also has a `roomNumber` field (String), but the Room model uses ObjectId references for better data integrity and easier population.

## Important Notes

> [!IMPORTANT]
> **Automatic Occupied Count**: The `occupied` field is automatically updated when you save the room. You don't need to manually set it.

> [!TIP]
> **Use Helper Methods**: Use `addStudent()` and `removeStudent()` methods instead of directly manipulating the `students` array. They include validation and error handling.

> [!WARNING]
> **Capacity Validation**: The pre-save middleware will prevent saving if the students array exceeds capacity. Always check `hasSpace()` before adding students.

## File Location
📁 `backend/models/Room.js`
