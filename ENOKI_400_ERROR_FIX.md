# Enoki 400 Error Fix

## 🔍 Issues Identified

1. **COOP (Cross-Origin-Opener-Policy) Warnings**
   - These are warnings about OAuth popup windows
   - Fixed by adding COOP headers to `next.config.js`

2. **Enoki API 400 Bad Request**
   - `GET https://api.enoki.mystenlabs.com/v1/zklogin 400 (Bad Request)`
   - This suggests a configuration issue

## ✅ Fixes Applied

### 1. Added COOP Headers
Added to `next.config.js` to allow OAuth popups:
```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin-allow-popups',
        },
      ],
    },
  ];
}
```

### 2. Enhanced Enoki Logging
Added better logging to see what's being configured.

## 🔧 Troubleshooting the 400 Error

The 400 error from Enoki API suggests one of these issues:

### Issue 1: Google Client ID Not Configured in Enoki Portal

**You need to configure the Google Client ID in TWO places:**

1. ✅ **In your code** (`.env.local`):
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=1097275538443-5jnmi72g89h8hf4fr5v9ucehshq8toaa.apps.googleusercontent.com
   ```

2. ⚠️ **In Enoki Developer Portal** (MISSING?):
   - Go to: https://enoki.mystenlabs.com/
   - Navigate to your project
   - Go to "Auth Providers" or "OAuth Providers"
   - Add Google provider with your Client ID
   - Configure redirect URIs if needed

### Issue 2: Redirect URI Mismatch

Enoki might need specific redirect URIs configured:

1. **Check Enoki Portal** for required redirect URIs
2. **Update Google Console** to include Enoki's redirect URIs:
   - Go to: https://console.cloud.google.com/apis/credentials
   - Edit your OAuth 2.0 Client ID
   - Add Enoki's redirect URI (check Enoki docs/portal)

Common Enoki redirect URIs:
- `https://enoki.mystenlabs.com/auth/callback` (or similar)
- Your app's redirect URI might also be needed

### Issue 3: API Key Issues

Verify your Enoki API key:
- Make sure you're using the **Public API Key** (not private)
- Check it's valid in Enoki Portal
- Ensure it's correctly set in `.env.local`

## 📋 Step-by-Step Fix

### Step 1: Verify Environment Variables

Check your `.env.local` has:
```env
NEXT_PUBLIC_ENOKI_API_KEY=enoki_public_eb523fdb1cee2b3efce6381a717bf634
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1097275538443-5jnmi72g89h8hf4fr5v9ucehshq8toaa.apps.googleusercontent.com
NEXT_PUBLIC_SUI_NETWORK=testnet
```

### Step 2: Configure Google Client ID in Enoki Portal

1. Go to https://enoki.mystenlabs.com/
2. Log in to your account
3. Select your project
4. Navigate to **"Auth Providers"** or **"OAuth Providers"**
5. Click **"Add Provider"** or **"Configure Google"**
6. Enter your Google Client ID:
   ```
   1097275538443-5jnmi72g89h8hf4fr5v9ucehshq8toaa.apps.googleusercontent.com
   ```
7. Save the configuration

### Step 3: Update Google Console Redirect URIs

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Under **"Authorized redirect URIs"**, add:
   - `http://localhost:3000` (for development)
   - Any redirect URIs that Enoki requires (check Enoki docs)
4. Save changes

### Step 4: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
pnpm dev
```

### Step 5: Check Browser Console

After restarting, check the console for:
- `✅ Enoki initialized successfully`
- Enoki config log showing Google Client ID is set
- No more 400 errors

## 🧪 Testing

1. **Click "Connect Wallet"**
2. **Look for "Enoki" or "Enoki (Google)" option**
3. **Select it** → Should open Google OAuth popup
4. **Sign in** → Should connect wallet successfully

## 📝 Notes

- The COOP warnings are now fixed (they were just warnings, not blocking)
- The 400 error is the main issue - it's likely because Google Client ID isn't configured in Enoki Portal
- Enoki needs the Google Client ID configured in their portal, not just in your code

---

**Most likely fix:** Configure Google Client ID in Enoki Developer Portal! 🚀

