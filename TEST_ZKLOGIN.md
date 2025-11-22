# Quick zkLogin Test Guide

## ✅ Setup Verified

- Google Client ID: Configured in `.env.local`
- OAuth Callback: `/auth/callback` route ready
- Onboarding: Detects authenticated users

## 🧪 Test Steps

### 1. Clear Previous Session (Optional)
Open browser console and run:
```javascript
sessionStorage.clear();
localStorage.clear();
location.reload();
```

### 2. Start Test
1. Go to http://localhost:3000/cork (or click on mobile)
2. You should see the zkLogin screen with "Continue with Google" button

### 3. Authenticate
1. Click "Continue with Google"
2. Should redirect to Google OAuth page
3. Sign in with your Google account
4. Approve permissions
5. Should redirect back to `/auth/callback`

### 4. Verify Success
- Should see "Completing authentication..." briefly
- Should redirect to `/cork`
- Should skip zkLogin step and show village selection
- Check browser console for:
  - `zkLogin callback error:` (should be none)
  - User data logged

### 5. Check Authentication
Open browser console and run:
```javascript
// Check if authenticated
JSON.parse(sessionStorage.getItem('zklogin_user'))

// Should show:
// {
//   sub: "google_...",
//   email: "your@email.com",
//   name: "Your Name",
//   address: "0x...", // Real SUI address!
//   jwt: "...",
//   salt: "...",
//   maxEpoch: ...
// }
```

## 🔍 Debugging

### If OAuth doesn't redirect:
- Check `.env.local` has the Client ID
- Restart dev server
- Check browser console for errors

### If callback fails:
- Check browser console for error messages
- Verify redirect URI in Google Console matches exactly
- Check network tab for failed requests

### If stuck on callback:
- Check if user is already in sessionStorage
- Try clearing sessionStorage and retry

## Expected Flow

```
1. Click "Continue with Google"
   ↓
2. Redirect to Google OAuth
   ↓
3. User signs in
   ↓
4. Redirect to /auth/callback#id_token=...
   ↓
5. Callback processes JWT
   ↓
6. Derives SUI address from JWT + salt
   ↓
7. Stores user in sessionStorage
   ↓
8. Redirects to /cork
   ↓
9. Onboarding detects auth → skips zkLogin step
   ↓
10. Shows village selection
```

## Success Indicators

✅ Redirects to Google OAuth (not mock)  
✅ Returns with JWT token in URL  
✅ SUI address derived (check console)  
✅ User stored in sessionStorage  
✅ Onboarding skips zkLogin step  
✅ Proceeds to village selection

