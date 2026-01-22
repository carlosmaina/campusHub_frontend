# CampusHub - Quick Reference Card

## 🚀 Getting Started (2 Minutes)

### 1. Setup Environment
```bash
cd react-app/backend
# Create .env file with:
MONGODB_URL=mongodb://localhost:27017/campusHub
API_KEY=your_groq_api_key
ACCESS_TOKEN=your_secret_key
PORT=8000
```

### 2. Start Services
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
npm run dev
```

### 3. Access Application
```
Frontend: http://localhost:5173
Backend: http://localhost:8000
```

---

## 📝 User Flow

### Student Journey
1. **Signup** → Select "Student" role → Create account
2. **Login** → Enter credentials → Get authenticated
3. **Upload PDF** → Add course/unit metadata → File extracted & stored
4. **Generate Summary** → Get AI summary of PDF
5. **Search Resources** → Find relevant materials → View/download
6. **Manage** → View/delete your uploads

### Lecturer Journey
1. **Signup** → Select "Lecturer" role → Create account
2. **Login** → Same authentication flow
3. **Upload** → Share lecture notes, past papers
4. **Track** → See view counts on resources
5. **Manage** → Organize and update materials

---

## 🔑 Key Features

| Feature | Access | Benefit |
|---------|--------|---------|
| **Role Selection** | Signup | Distinguishes students from lecturers |
| **PDF Upload** | Authenticated | Contribute to resource library |
| **Metadata** | Upload form | Organize by course/topic |
| **AI Summary** | Authenticated | Understand content quickly |
| **Search** | Dashboard | Find relevant resources |
| **View Tracking** | Automatic | See popular materials |
| **Resource Delete** | Owner only | Manage your uploads |

---

## 🗄️ Database Collections

### Users
```javascript
{
  user: "john_doe",
  email: "john@uni.edu",
  role: "student",        // ← NEW
  password: "hashed...",
  createdAt: Date
}
```

### Resources (PDFs)
```javascript
{
  userId: "user_id",
  username: "john_doe",
  title: "Lecture Notes",
  course: "CS101",        // ← NEW
  unit: "Data Structures", // ← NEW
  uploadedBy: "student",  // ← NEW
  views: 42,              // ← NEW
  extractedText: "...",
  createdAt: Date
}
```

---

## 🔗 API Quick Reference

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/sign` | Create account | ❌ |
| POST | `/Login` | Authenticate | ❌ |
| POST | `/upload` | Upload PDF | ✅ |
| GET | `/summary` | Get AI summary | ✅ |
| GET | `/search` | Search resources | ✅ |
| GET | `/courses` | List courses | ✅ |
| GET | `/myresources` | Your uploads | ✅ |
| POST | `/view/:id` | Track view | ✅ |
| DELETE | `/resource/:id` | Delete upload | ✅ |

---

## 💾 Session Storage Keys

After login, these are available:
```javascript
sessionStorage.getItem("users")      // Full user object
sessionStorage.getItem("userId")     // User ID
sessionStorage.getItem("userRole")   // "student" or "lecturer"
sessionStorage.getItem("token")      // JWT token
```

---

## 🔐 Authentication Header

Use for authenticated requests:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│  USER SIGNUP    │
│ Select Role     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  MongoDB Users Collection           │
│  ├─ username                        │
│  ├─ email                           │
│  ├─ role: "student" | "lecturer"   │ ← NEW
│  └─ password (hashed)               │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  USER LOGIN     │
│  Get JWT token  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  JWT Token Contains:                │
│  ├─ user (username)                 │
│  ├─ userId                          │ ← NEW
│  └─ role                            │ ← NEW
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  AUTHENTICATED REQUESTS             │
│  ├─ Upload PDF (with metadata)      │
│  ├─ Search Resources                │
│  ├─ Generate Summary                │
│  └─ Manage Uploads                  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  MongoDB Resources Collection       │
│  ├─ userId (owner)                  │
│  ├─ course (organization)           │ ← NEW
│  ├─ unit (topic)                    │ ← NEW
│  ├─ uploadedBy (role)               │ ← NEW
│  ├─ views (engagement)              │ ← NEW
│  ├─ extractedText (AI content)      │
│  └─ createdAt (timestamp)           │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ RESOURCE SEARCH │
│ VIEW & SUMMARIZE│
└─────────────────┘
```

---

## 🛠️ Common Tasks

### Task 1: Upload a PDF
```
1. Login
2. Go to Upload page
3. Select PDF file
4. Enter Course (e.g., CS101)
5. Enter Unit (e.g., Data Structures)
6. Click Upload
7. Wait for extraction
8. Generate summary (optional)
```

### Task 2: Search Resources
```
1. Click Search
2. Select Course (optional)
3. Enter keyword (optional)
4. View results sorted by popularity
5. Click resource to view summary
```

### Task 3: Manage Your Resources
```
1. Click "My Resources"
2. View all your uploads
3. See view count for each
4. Click delete to remove (owner only)
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB connection failed | Check MONGODB_URL, ensure mongod running |
| API key invalid | Verify Groq API key in .env |
| Role not saving | Clear sessionStorage, re-login |
| Upload fails | Check userId/username sent, check file size |
| Search returns nothing | Ensure resources uploaded with course/unit |

---

## 📈 Monitoring

### Check Backend Status
```bash
# Should return version/status
curl http://localhost:8000
```

### Monitor MongoDB
```javascript
// In MongoDB shell
db.users.find().count()           // Total users
db.pdfdatas.find().count()        // Total resources
db.pdfdatas.find({course: "CS101"}).count() // By course
```

---

## 🔄 Development Workflow

### Making Changes
```bash
# 1. Make code changes
# 2. Backend auto-restarts (or manually restart)
# 3. Frontend hot-reloads automatically
# 4. Test in browser
```

### Adding New Endpoint
```javascript
// In routers_AI.js
router_AI_App.get("/newfeature", authenticate, async (req, res) => {
  // Your logic
});

// Test with
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/newfeature
```

---

## 📱 Responsive Features

- [x] Role selection on signup ✅
- [x] Metadata form on upload ✅
- [x] Search filtering ✅
- [x] View tracking ✅
- [x] User resource management ✅

---

## ⚡ Performance Tips

1. **First load**: Clear browser cache (Ctrl+Shift+Delete)
2. **Search speed**: Add course filter for faster results
3. **Summary speed**: Shorter PDFs summarize faster
4. **Upload speed**: Keep PDFs under 50MB

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `CAMPUSHUB_IMPROVEMENTS.md` | Full feature documentation |
| `API_DOCUMENTATION.md` | API endpoint reference |
| `SETUP_GUIDE.md` | Setup and deployment |
| `IMPLEMENTATION_SUMMARY.md` | Changes overview |

---

## 🎯 Success Metrics

Monitor these for platform health:
- ✅ User signup/login success rate
- ✅ PDF upload success rate
- ✅ Search result relevance
- ✅ Summary generation time
- ✅ Resource discovery usage

---

## 🚀 Ready to Deploy?

**Checklist:**
- [ ] All services running without errors
- [ ] Can signup with role selection
- [ ] Can upload PDF with metadata
- [ ] Can search and find resources
- [ ] Can generate summaries
- [ ] Database storing data correctly
- [ ] No leftover files in uploads folder

**If all ✅, you're ready to deploy!**

---

## 📞 Quick Links

- **MongoDB Compass**: GUI for database management
- **Postman**: Test API endpoints
- **Groq Console**: https://console.groq.com (get API key)
- **Documentation**: Read the .md files in root directory

---

**Last Updated**: January 21, 2026  
**Version**: 1.0 Production  
**Status**: ✅ Ready to Deploy

