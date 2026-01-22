# CampusHub API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
All endpoints (except `/sign` and `/Login`) require Bearer token authentication:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Sign Up
**POST** `/sign`

Create a new user account with role selection.

**Request:**
```json
{
  "data": {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"  // or "lecturer"
  }
}
```

**Response (Success):**
```json
"signed in"
```

**Response (Error):**
```json
"user already exists"
```

**Status Codes:**
- `200` - User created successfully
- `400` - User already exists or invalid data

---

### 2. Login
**POST** `/Login`

Authenticate user and receive JWT token with role.

**Request:**
```json
{
  "data": {
    "email": "john@example.com",
    "password": "password123"
  }
}
```

**Response (Success):**
```json
{
  "message": "User logged in",
  "email": "john@example.com",
  "user": "john_doe",
  "userId": "507f1f77bcf86cd799439011",
  "role": "student",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Invalid credentials or user not found

---

## Resource Endpoints

### 3. Upload Resource
**POST** `/upload`

Upload a PDF resource with metadata. Includes multipart file upload.

**Request (Form Data):**
```
file: <binary PDF file>
userId: "507f1f77bcf86cd799439011"
username: "john_doe"
uploadedBy: "student"
course: "CS101"
unit: "Data Structures"
token: "eyJhbGciOiJIUzI1NiIs..."
```

**Response (Success):**
```json
{
  "message": "PDF processed and saved to database successfully",
  "text": "Extracted PDF text content...",
  "userId": "507f1f77bcf86cd799439011",
  "fileDeleted": true
}
```

**Status Codes:**
- `200` - Upload successful
- `400` - Missing file or metadata
- `500` - Processing failed

**Notes:**
- PDF is automatically deleted after extraction
- Requires authentication
- Maximum file size: 150MB

---

### 4. Generate Summary
**GET** `/summary?userId={userId}`

Generate AI-powered summary of user's uploaded PDF.

**Request:**
```
GET /summary?userId=507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

**Response (Success):**
```json
{
  "success": true,
  "ai": "This document explains the fundamental concepts of data structures including arrays, linked lists, trees, and graphs. It covers time complexity analysis, implementation details, and practical applications..."
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "No PDF data found for this user. Please upload a PDF first."
}
```

**Status Codes:**
- `200` - Summary generated
- `400` - No PDF found for user
- `401` - Unauthorized (invalid token)
- `500` - AI processing failed

---

### 5. Get Available Courses
**GET** `/courses`

Fetch list of all courses and units available in the system.

**Request:**
```
GET /courses
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "courses": ["CS101", "CS102", "MATH201", "PHYS101"],
  "units": ["Data Structures", "Algorithms", "Calculus", "Physics I"]
}
```

**Status Codes:**
- `200` - Courses retrieved
- `401` - Unauthorized
- `500` - Database error

---

### 6. Search Resources
**GET** `/search?course={course}&unit={unit}&query={query}`

Search for resources by course, unit, or keyword.

**Request:**
```
GET /search?course=CS101&unit=Data%20Structures&query=arrays
Authorization: Bearer <token>
```

**Query Parameters:**
- `course` (optional) - Filter by course code
- `unit` (optional) - Filter by topic/unit
- `query` (optional) - Search keyword or tag

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "_id": "507f191e810c19729de860ea",
      "userId": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "title": "Data_Structures_Lecture_Notes.pdf",
      "course": "CS101",
      "unit": "Data Structures",
      "uploadedBy": "lecturer",
      "isPublic": true,
      "views": 45,
      "createdAt": "2025-01-21T10:30:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Search completed
- `401` - Unauthorized
- `500` - Search failed

**Notes:**
- Search is case-insensitive
- Results limited to 20 items (pagination ready)
- Sorted by popularity (views) then recency

---

### 7. Get My Resources
**GET** `/myresources?userId={userId}`

Fetch all resources uploaded by the authenticated user.

**Request:**
```
GET /myresources?userId=507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "resources": [
    {
      "_id": "507f191e810c19729de860ea",
      "userId": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "title": "Assignment_Solutions.pdf",
      "course": "CS101",
      "unit": "Algorithms",
      "uploadedBy": "student",
      "views": 12,
      "createdAt": "2025-01-21T09:15:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Resources retrieved
- `400` - Missing userId
- `401` - Unauthorized
- `500` - Database error

---

### 8. Track Resource View
**POST** `/view/:id`

Increment view count for a resource (tracking engagement).

**Request:**
```
POST /view/507f191e810c19729de860ea
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200` - View tracked
- `401` - Unauthorized
- `500` - Tracking failed

---

### 9. Delete Resource
**DELETE** `/resource/:id?userId={userId}`

Delete a resource (only owner can delete).

**Request:**
```
DELETE /resource/507f191e810c19729de860ea?userId=507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Resource deleted successfully"
}
```

**Response (Error - Not Owner):**
```json
{
  "success": false,
  "error": "Unauthorized to delete this resource"
}
```

**Status Codes:**
- `200` - Resource deleted
- `400` - Missing parameters
- `401` - Unauthorized
- `403` - Forbidden (not owner)
- `404` - Resource not found
- `500` - Deletion failed

---

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common error codes:
- `400` - Bad Request (missing or invalid parameters)
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Data Models

### User Schema
```javascript
{
  _id: ObjectId,
  user: String,           // Username
  email: String,          // Email address
  password: String,       // Hashed password
  role: "student|lecturer", // User role
  createdAt: Date
}
```

### PDF Resource Schema
```javascript
{
  _id: ObjectId,
  userId: String,         // Owner user ID
  username: String,       // Owner username
  title: String,          // Resource title
  pdfBuffer: Buffer,      // Binary PDF file
  extractedText: String,  // AI-extracted text
  course: String,         // Course code
  unit: String,           // Topic/unit
  uploadedBy: String,     // "student" or "lecturer"
  isPublic: Boolean,      // Visibility
  tags: [String],         // Search tags
  views: Number,          // View count
  createdAt: Date,
  updatedAt: Date
}
```

---

## Usage Examples

### Example 1: Complete Upload Flow
```javascript
// 1. Login
POST /Login
{
  "data": {
    "email": "student@example.com",
    "password": "pass123"
  }
}
// Returns: token, userId, role

// 2. Upload PDF with metadata
POST /upload (multipart/form-data)
- file: lecture_notes.pdf
- userId: <from login>
- username: student_name
- uploadedBy: student
- course: CS101
- unit: Data Structures

// 3. Generate summary
GET /summary?userId=<userId>
// Returns: AI-generated summary
```

### Example 2: Search and Discover
```javascript
// 1. Get available courses
GET /courses

// 2. Search for resources
GET /search?course=CS101&query=arrays

// 3. View resource (tracking engagement)
POST /view/resource_id

// 4. Get summary
GET /summary?userId=owner_id
```

### Example 3: Manage Your Resources
```javascript
// 1. List your resources
GET /myresources?userId=<your_id>

// 2. Delete a resource
DELETE /resource/resource_id?userId=<your_id>
```

---

## Rate Limiting
Currently no rate limiting implemented. Consider adding for production.

## CORS
Enabled for: `http://localhost:5173`

## Session Storage Keys
- `users` - Complete user object
- `userId` - User ID
- `userRole` - User role (student/lecturer)
- `token` - JWT authentication token

---

**API Version:** 1.0  
**Last Updated:** January 21, 2026
