# User Model Documentation

## Overview
The User model handles both Admin and Student users with role-based differentiation.

## Schema Fields

| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `name` | String | ✅ Yes | ❌ No | - | Full name of the user (max 50 chars) |
| `email` | String | ✅ Yes | ✅ Yes | - | Email address for login (validated format) |
| `password` | String | ✅ Yes | ❌ No | - | Hashed password (min 6 chars, not returned in queries) |
| `role` | String | ❌ No | ❌ No | `'student'` | User role: `'admin'` or `'student'` |
| `roomNumber` | String | ❌ No | ❌ No | `null` | Assigned room number (mainly for students) |
| `createdAt` | Date | Auto | ❌ No | Auto | Timestamp when user was created |
| `updatedAt` | Date | Auto | ❌ No | Auto | Timestamp when user was last updated |

## Validation Rules

### Name
- ✅ Required
- ✅ Maximum 50 characters
- ✅ Trimmed (whitespace removed)

### Email
- ✅ Required
- ✅ Must be unique
- ✅ Converted to lowercase
- ✅ Must match email format regex
- ✅ Trimmed

### Password
- ✅ Required
- ✅ Minimum 6 characters
- ✅ Automatically hashed before saving (using bcrypt)
- ✅ Not included in queries by default (`select: false`)

### Role
- ✅ Must be either `'admin'` or `'student'`
- ✅ Defaults to `'student'`

### Room Number
- ❌ Optional
- ✅ Trimmed
- ✅ Defaults to `null`

## Middleware

### Password Hashing (Pre-save Hook)
```javascript
// Automatically runs before saving a user
// Only hashes if password is new or modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

**What it does:**
- Checks if password was modified
- Generates a salt (random data)
- Hashes the password with bcrypt
- Stores the hashed password

## Instance Methods

### `comparePassword(enteredPassword)`
Compares a plain text password with the hashed password in the database.

**Parameters:**
- `enteredPassword` (String) - The password to check

**Returns:**
- `Promise<Boolean>` - `true` if passwords match, `false` otherwise

**Usage:**
```javascript
const user = await User.findOne({ email: 'user@example.com' }).select('+password');
const isMatch = await user.comparePassword('password123');
```

### `isAdmin()`
Checks if the user has admin role.

**Returns:**
- `Boolean` - `true` if role is 'admin', `false` otherwise

**Usage:**
```javascript
if (user.isAdmin()) {
  // Grant admin access
}
```

### `isStudent()`
Checks if the user has student role.

**Returns:**
- `Boolean` - `true` if role is 'student', `false` otherwise

**Usage:**
```javascript
if (user.isStudent()) {
  // Grant student access
}
```

## Usage Examples

### Creating an Admin User
```javascript
const User = require('./models/User');

const admin = new User({
  name: 'Admin User',
  email: 'admin@hostel.com',
  password: 'admin123',
  role: 'admin'
});

await admin.save();
// Password is automatically hashed
```

### Creating a Student User
```javascript
const student = new User({
  name: 'John Doe',
  email: 'john@student.com',
  password: 'student123',
  role: 'student',
  roomNumber: '101'
});

await student.save();
```

### Finding a User and Verifying Password
```javascript
// Find user and include password field
const user = await User.findOne({ email: 'john@student.com' }).select('+password');

// Verify password
const isCorrect = await user.comparePassword('student123');

if (isCorrect) {
  console.log('Login successful!');
}
```

### Querying Users by Role
```javascript
// Get all admins
const admins = await User.find({ role: 'admin' });

// Get all students
const students = await User.find({ role: 'student' });

// Get students in a specific room
const roommates = await User.find({ roomNumber: '101' });
```

## Security Features

✅ **Password Hashing**: Passwords are hashed using bcrypt with salt  
✅ **Password Exclusion**: Passwords not returned in queries by default  
✅ **Email Uniqueness**: Prevents duplicate email registrations  
✅ **Email Validation**: Ensures valid email format  
✅ **Role Validation**: Only allows 'admin' or 'student' roles  
✅ **Secure Comparison**: Uses bcrypt.compare for password verification  

## Important Notes

> [!IMPORTANT]
> **Password Field**: When querying users for authentication, you must explicitly select the password field using `.select('+password')` since it's excluded by default.

> [!WARNING]
> **Never Store Plain Passwords**: The pre-save middleware automatically hashes passwords. Never manually save a plain text password.

> [!TIP]
> **Testing**: Use the `testUserModel.js` script to verify all model functionality works correctly.

## File Location
📁 `backend/models/User.js`
