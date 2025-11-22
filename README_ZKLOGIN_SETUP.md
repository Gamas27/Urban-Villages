# zkLogin Setup Guide

## Current Status

The app is currently using **mock zkLogin** for development. This allows you to test the full flow without setting up Google OAuth credentials.

## Mock Login (Current - No Setup Required)

When you click "Continue with Google", the app will:
1. Simulate a Google OAuth login
2. Create a mock user with a random SUI address
3. Proceed to village selection

This works perfectly for development and testing!

## Real Google OAuth Setup (Optional - For Production)

If you want to use real Google OAuth authentication:

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable "Google+ API" or "Google Identity API"
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URI: `http://localhost:3000/auth/callback` (for dev)
7. Copy the **Client ID**

### 2. Configure Environment Variable

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
```

### 3. Restart Dev Server

```bash
pnpm dev
```

### 4. Test Real OAuth

Now when you click "Continue with Google", it will:
1. Redirect to Google's OAuth page
2. User authenticates with their Google account
3. Redirects back to `/auth/callback`
4. Derives a real SUI address from the JWT token
5. Proceeds to village selection

## Notes

- **Mock login** is perfect for development - no setup needed!
- **Real OAuth** requires Google Cloud Console setup
- The app works identically with both approaches
- Mock login generates random SUI addresses (not real blockchain addresses)
- Real OAuth generates deterministic SUI addresses from the user's Google account

