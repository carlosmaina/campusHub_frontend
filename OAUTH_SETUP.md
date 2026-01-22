# OAuth Setup Guide - Google & Apple Login

This guide explains how to set up Google and Apple OAuth authentication for CampusHub.

## Prerequisites

- Node.js backend with Express
- React frontend
- `.env` file in backend root directory

## Google OAuth Setup

### 1. Get Google Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → Create OAuth 2.0 Client ID
5. Choose **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (local development)
   - Your production URL
7. Add authorized redirect URIs:
   - `http://localhost:5173/auth/google-callback`
   - Your production callback URL

### 2. Configure Backend

Add to `.env`:
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Install Dependencies

```bash
cd backend
npm install google-auth-library
```

## Apple OAuth Setup

### 1. Get Apple Credentials

1. Go to [Apple Developer Account](https://developer.apple.com/)
2. Create a new App ID with "Sign in with Apple" capability
3. Create a Service ID
4. Register Redirect URLs:
   - `http://localhost:5173/auth/apple-callback` (development)
   - Your production URL
5. Create a private key for API authentication
6. Note your Team ID, Client ID, and Key ID

### 2. Configure Backend

Add to `.env`:
```
REACT_APP_APPLE_CLIENT_ID=your_apple_client_id
REACT_APP_APPLE_TEAM_ID=your_apple_team_id
```

### 3. Install Dependencies

```bash
cd backend
npm install apple-signin-auth
```

## Frontend Configuration

### 1. Add Environment Variables

Create `.env` in `react-app/`:
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_APPLE_CLIENT_ID=your_apple_client_id
REACT_APP_APPLE_TEAM_ID=your_apple_team_id
```

### 2. Files Modified

- **signUp.jsx**: Added Google and Apple signup buttons
- **login.jsx**: Added Google and Apple login buttons

## Backend Routes

### New OAuth Endpoints

```
POST /auth/google-login      - Login with Google token
POST /auth/google-signup     - Sign up with Google
POST /auth/apple-login       - Login with Apple token
POST /auth/apple-signup      - Sign up with Apple
```

### New File Created

- **backend/server/auth/oauth.rout.js** - OAuth route handlers

## Testing Locally

1. **Start Backend**:
```bash
cd backend
npm start
```

2. **Start Frontend**:
```bash
cd react-app
npm run dev
```

3. **Test Google Login**:
   - Navigate to http://localhost:5173/login
   - Click "Sign in with Google"
   - Verify token is sent to backend
   - Check console for any errors

4. **Test Apple Login**:
   - Navigate to http://localhost:5173/login
   - Click "Sign in with Apple"
   - Complete Apple authentication flow
   - Verify token is processed correctly

## Database Records

When users sign up via OAuth:

1. **SignModel** record created with:
   - username (from OAuth provider)
   - email
   - role (from signup selection: student/lecturer)
   - password (OAuth marker)

2. **LoginModel** record created with:
   - email
   - role
   - password (OAuth marker)

3. **JWT Token** generated containing:
   - user (username)
   - userId (MongoDB _id)
   - role (student/lecturer)

## Error Handling

### Common Errors

1. **"Invalid Google token"**
   - Check GOOGLE_CLIENT_ID matches frontend
   - Verify token hasn't expired
   - Ensure redirect URI is authorized

2. **"User doesn't exist"**
   - User must sign up before logging in
   - Check email exists in database

3. **"user already exists"**
   - Account already registered
   - User should login instead

## Security Considerations

1. **JWT Secret**: Use strong, random JWT_SECRET in production
2. **Token Verification**: Backend verifies tokens with OAuth providers
3. **Password**: OAuth users get random password marker (they don't need passwords)
4. **CORS**: Configured to accept requests from frontend origin
5. **HTTPS**: Use HTTPS in production for all OAuth flows

## Troubleshooting

### Google Sign-In not appearing

- Check browser console for errors
- Verify Google Sign-In script loads
- Ensure GOOGLE_CLIENT_ID environment variable is set

### Apple Sign-In errors

- Verify Apple credentials in .env
- Check redirect URI matches configuration
- Ensure domain is registered in Apple Developer

### Token verification fails

- Verify JWT_SECRET matches between signup/login
- Check token hasn't expired
- Ensure backend can reach OAuth provider servers

## Next Steps

1. Test all OAuth flows locally
2. Deploy to staging environment
3. Update OAuth credentials for production URLs
4. Implement email verification (optional)
5. Add profile completion flow after first OAuth signup
