# OAuth Quick Start - Google & Apple Login

## ⚡ Quick Setup (5 minutes)

### Step 1: Backend Setup

```bash
cd backend
npm install google-auth-library
```

### Step 2: Environment Variables

Create/update `.env` in `backend/` folder:

```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_APPLE_CLIENT_ID=your_apple_client_id_here
REACT_APP_APPLE_TEAM_ID=your_apple_team_id_here
JWT_SECRET=your_secret_key_here
MONGODB_URL=your_mongodb_url
PORT=8000
```

### Step 3: Get Credentials

**Google:**
1. Go to https://console.cloud.google.com/
2. Create OAuth 2.0 Client ID for Web
3. Copy the Client ID

**Apple:**
1. Go to https://developer.apple.com/
2. Create App ID with "Sign in with Apple"
3. Copy Client ID and Team ID

### Step 4: Test

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd react-app
npm run dev
```

Visit http://localhost:5173/signup

## 📁 Files Changed

| File | Change |
|------|--------|
| `src/frontend/mainApp/signUp.jsx` | + Google & Apple signup buttons |
| `src/frontend/mainApp/login.jsx` | + Google & Apple login buttons |
| `backend/server/auth/oauth.rout.js` | NEW - OAuth endpoints |
| `backend/server/auth/jwt/auto.id.js` | + Google OAuth2Client |
| `backend/server/server.js` | + OAuth route registration |

## 🔐 What It Does

1. **Google Sign-Up**
   - User clicks "Sign up with Google"
   - Google login opens
   - User authenticated
   - Account created automatically
   - Stores role selection (Student/Lecturer)

2. **Google Sign-In**
   - User clicks "Sign in with Google"
   - Google login opens
   - User authenticated
   - SessionStorage populated with userId, userRole, token
   - Ready for API calls

3. **Apple Flow** - Same as Google

## 🧪 Testing Checklist

- [ ] Backend runs without errors
- [ ] Frontend runs without errors
- [ ] Can navigate to /signup page
- [ ] Google/Apple buttons visible
- [ ] Can click Google button (dialog appears)
- [ ] Can click Apple button (dialog appears)
- [ ] SessionStorage has userId after login
- [ ] Can upload PDF after OAuth login
- [ ] Can search after OAuth login

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Script load error" | Check GOOGLE_CLIENT_ID in .env |
| "Redirect mismatch" | Ensure http://localhost:5173 in OAuth settings |
| "User doesn't exist" | Try Sign-Up first, then Login |
| "SVG not showing" | Hard refresh browser (Ctrl+Shift+R) |

## 📚 Complete Docs

- **OAUTH_SETUP.md** - Full setup guide with credentials
- **OAUTH_IMPLEMENTATION_SUMMARY.md** - Technical details

## 🚀 Next Steps

1. Get Google & Apple credentials
2. Add to .env
3. Run backend: `npm start`
4. Run frontend: `npm run dev`
5. Test all OAuth flows
6. Deploy to staging

## ✅ Features

✓ Google Sign-Up/Login
✓ Apple Sign-Up/Login  
✓ Role selection (Student/Lecturer)
✓ Automatic user creation
✓ JWT token with role
✓ SessionStorage integration
✓ Error handling
✓ Backward compatible (email/password still works)

---

**Ready?** Start with Step 1 above!
