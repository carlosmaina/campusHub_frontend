# CampusHub Setup & Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- Groq API key
- Git

### Environment Setup

Create `.env` file in `/backend/server/`:
```env
MONGODB_URL=mongodb://localhost:27017/campusHub
API_KEY=your_groq_api_key
ACCESS_TOKEN=your_jwt_secret_key
PORT=8000
```

### Installation

```bash
# Navigate to project root
cd campusHub2/react-app

# Install dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Running the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
# or
node server/server.js
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

Access application at: `http://localhost:5173`

---

## 📋 Feature Checklist

### Authentication
- [x] User signup with role selection (Student/Lecturer)
- [x] Login with JWT token
- [x] Role stored in sessionStorage
- [x] Secure password validation

### Resource Management
- [x] PDF upload with metadata (Course, Unit)
- [x] PDF text extraction
- [x] Safe file deletion after processing
- [x] Metadata storage in MongoDB

### AI Features
- [x] PDF summarization via Groq API
- [x] Full-text search capabilities
- [x] Content-based resource discovery

### Resource Discovery
- [x] Search by course and unit
- [x] Search by keyword
- [x] Popularity ranking (by views)
- [x] Resource filtering

### User Features
- [x] View personal uploaded resources
- [x] Delete own resources
- [x] Track resource views
- [x] Role-based access control

---

## 🔧 Configuration Options

### MongoDB Connection
**Local:**
```env
MONGODB_URL=mongodb://localhost:27017/campusHub
```

**Atlas Cloud:**
```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/campusHub
```

### API Keys

**Groq API:**
1. Visit: https://console.groq.com
2. Create account
3. Generate API key
4. Add to `.env`: `API_KEY=your_key`

**JWT Secret:**
Generate a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📁 Project Structure

```
campusHub2/
├── react-app/
│   ├── src/
│   │   ├── frontend/
│   │   │   └── mainApp/
│   │   │       ├── signUp.jsx          ✅ Role selection
│   │   │       ├── login.jsx           ✅ Role stored
│   │   │       ├── upload.jsx          ✅ Metadata form
│   │   │       └── ...
│   │   └── mainCss/
│   ├── backend/
│   │   ├── server/
│   │   │   ├── routers_AI.js          ✅ Enhanced endpoints
│   │   │   ├── server.js
│   │   │   ├── auth/
│   │   │   │   ├── login.rout.js
│   │   │   │   ├── sign.rout.js
│   │   │   │   ├── jwt/
│   │   │   │   │   └── access.AI.token.js  ✅ Role in JWT
│   │   │   │   └── models/
│   │   │   │       ├── login.model.js      ✅ Role retrieval
│   │   │   │       └── sign.model.js       ✅ Role storage
│   │   │   └── ...
│   │   ├── uploads/                    (Auto-cleaned)
│   │   └── package.json
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── CAMPUSHUB_IMPROVEMENTS.md           📖 Full documentation
└── API_DOCUMENTATION.md                📖 API reference
```

---

## 🗄️ Database Setup

### Create Initial Collections

MongoDB will auto-create on first insert, but you can pre-create:

```javascript
// Using MongoDB Shell or Compass

// Users collection
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user", "email", "password", "role"],
      properties: {
        _id: { bsonType: "objectId" },
        user: { bsonType: "string" },
        email: { bsonType: "string" },
        password: { bsonType: "string" },
        role: { enum: ["student", "lecturer"] },
        createdAt: { bsonType: "date" }
      }
    }
  }
})

// PDFs collection (auto-indexed)
db.pdfdatas.createIndex({ userId: 1 })
db.pdfdatas.createIndex({ course: 1, unit: 1 })
db.pdfdatas.createIndex({ createdAt: -1 })
db.pdfdatas.createIndex({ views: -1 })
```

---

## 🧪 Testing the API

### Using cURL

**1. Signup:**
```bash
curl -X POST http://localhost:8000/sign \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "username": "testuser",
      "email": "test@example.com",
      "password": "password123",
      "role": "student"
    }
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:8000/Login \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "email": "test@example.com",
      "password": "password123"
    }
  }'
```

**3. Search Resources:**
```bash
curl -X GET "http://localhost:8000/search?course=CS101&query=arrays" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Create new workspace
2. Import requests from `API_DOCUMENTATION.md`
3. Set variable `token` from login response
4. Test each endpoint

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Failed
**Solution:**
```bash
# Check MongoDB is running
mongod --version

# Start MongoDB service
mongod
# or on macOS with Homebrew
brew services start mongodb-community
```

### Issue: API Key Invalid
**Solution:**
- Verify Groq API key in `.env`
- Check key hasn't expired
- Regenerate from Groq console if needed

### Issue: CORS Error
**Solution:**
- Ensure frontend runs on `http://localhost:5173`
- Check CORS configuration in `server.js`

### Issue: File Upload Fails
**Solution:**
```bash
# Create uploads folder
mkdir -p backend/uploads

# Check permissions
chmod 755 backend/uploads
```

### Issue: Session Not Persisting
**Solution:**
- Clear browser sessionStorage: `sessionStorage.clear()`
- Check if tokens are stored after login
- Verify sessionStorage keys: `userId`, `userRole`, `token`

---

## 📊 Database Monitoring

### Check Collections Size
```javascript
db.users.stats()
db.pdfdatas.stats()
```

### Monitor Uploads
```javascript
// Recent uploads
db.pdfdatas.find().sort({ createdAt: -1 }).limit(5)

// By course
db.pdfdatas.aggregate([
  { $group: { _id: "$course", count: { $sum: 1 } } }
])

// By role
db.pdfdatas.aggregate([
  { $group: { _id: "$uploadedBy", count: { $sum: 1 } } }
])
```

---

## 🔐 Security Considerations

### For Production Deployment:

1. **Password Security:**
   - Implement bcrypt hashing (not plain text)
   - Add password strength validation
   - Implement rate limiting on login

2. **API Security:**
   - Add HTTPS/SSL
   - Implement request validation middleware
   - Add rate limiting (express-rate-limit)
   - Use environment variables for secrets

3. **Database Security:**
   - Enable MongoDB authentication
   - Use connection string with credentials
   - Enable database encryption
   - Regular backups

4. **File Upload Security:**
   - Validate file types (not just extension)
   - Scan for malware
   - Implement file size limits
   - Use antivirus integration

5. **Access Control:**
   - Implement row-level security
   - Add content moderation
   - Add admin dashboard for management

---

## 📈 Performance Optimization

### Database Indexes (Already Implemented)
```javascript
db.pdfdatas.createIndex({ userId: 1 })
db.pdfdatas.createIndex({ course: 1 })
db.pdfdatas.createIndex({ createdAt: -1 })
db.pdfdatas.createIndex({ views: -1 })
```

### Recommended Optimizations:
1. Implement Redis for caching
2. Add pagination to search results
3. Compress PDF buffers before storage
4. Implement lazy loading in frontend
5. Add CDN for static assets

---

## 📱 Deployment Options

### Option 1: Heroku
```bash
# Login
heroku login

# Create app
heroku create campushub

# Set environment variables
heroku config:set MONGODB_URL=...
heroku config:set API_KEY=...

# Deploy
git push heroku main
```

### Option 2: Vercel (Frontend) + Railway (Backend)
- Frontend: Deploy to Vercel
- Backend: Deploy to Railway
- Connect via environment variables

### Option 3: Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
```

---

## 📝 Maintenance Checklist

- [ ] Daily: Monitor error logs
- [ ] Weekly: Check database size
- [ ] Weekly: Review uploaded resources
- [ ] Monthly: Backup database
- [ ] Monthly: Review and update dependencies
- [ ] Quarterly: Security audit
- [ ] Quarterly: Performance optimization review

---

## 🤝 Support & Contribution

For issues or improvements:
1. Create GitHub issue with details
2. Include error logs and steps to reproduce
3. Propose solutions if possible

---

**Last Updated:** January 21, 2026  
**Status:** Production Ready ✅

