# zkLogin Testing Checklist

## Pre-Test Setup

✅ **Google OAuth Client ID configured**
- Check `.env.local` has `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- Client ID: `1097275538443-5jnmi72g89h8hf4fr5v9ucehshq8toaa.apps.googleusercontent.com`
- Redirect URI: `http://localhost:3000/auth/callback`

✅ **Dev server running**
```bash
pnpm dev
```

## Testing Steps

### 1. Initial Load
- [ ] Go to http://localhost:3000
- [ ] On mobile: Should show CorkApp
- [ ] On desktop: Should show Urban Villages overview
- [ ] Navigate to `/cork` route

### 2. zkLogin Authentication
- [ ] Click "Continue with Google" button
- [ ] Should redirect to Google OAuth page (not mock login)
- [ ] Sign in with Google account
- [ ] Should redirect back to `/auth/callback`
- [ ] Should see "Completing authentication..." message
- [ ] Should redirect to `/cork` after ~1 second

### 3. Onboarding Flow
- [ ] Should skip zkLogin step (already authenticated)
- [ ] Should show village selection (step 2)
- [ ] Select a village (e.g., Lisbon)
- [ ] Enter username
- [ ] Should proceed to profile picture step (step 3)

### 4. Profile Picture Upload (Optional)
- [ ] Can skip profile picture
- [ ] OR connect wallet and upload to Walrus
- [ ] Complete onboarding

### 5. Main App
- [ ] Should see the main feed
- [ ] User should be authenticated
- [ ] Can create posts, browse feed, etc.

## Expected Behavior

✅ **With Google Client ID:**
- Real Google OAuth flow
- Real SUI address derived from JWT
- User data from Google account

❌ **Without Google Client ID:**
- Falls back to mock login
- Mock SUI address
- Mock user data

## Troubleshooting

### Issue: Still seeing mock login
- Check `.env.local` exists
- Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set
- Restart dev server after creating `.env.local`

### Issue: OAuth redirect fails
- Check redirect URI in Google Console matches: `http://localhost:3000/auth/callback`
- Verify OAuth consent screen is configured
- Check browser console for errors

### Issue: Callback error
- Check browser console
- Verify JWT token is received
- Check network tab for failed requests

### Issue: Stuck on callback page
- Check if user is already authenticated
- Clear sessionStorage: `sessionStorage.clear()`
- Try again

## Current Configuration

- **Network**: Sui Testnet
- **OAuth Provider**: Google
- **Redirect URI**: `http://localhost:3000/auth/callback`
- **Proving Service**: `https://prover-dev.mystenlabs.com/v1` (for future zkLogin signing)

## Test Accounts

You can use any Google account for testing. The app will:
1. Derive a unique SUI address from your Google account
2. Store user info in sessionStorage
3. Use that address for the session

