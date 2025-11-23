# 🔐 Google Login Setup for Vercel

## Problem
Google login works in local dev but not in Vercel deployment.

## Root Cause
`NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in `.env.local` but **NOT set in Vercel**.

---

## ✅ Solution

### Step 1: Get Your Google Client ID

If you already have it in `.env.local`, copy it:
```bash
grep NEXT_PUBLIC_GOOGLE_CLIENT_ID .env.local
```

If you don't have it yet, create one:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your project (or create one)
3. Click **"Create Credentials"** > **"OAuth client ID"**
4. Choose **"Web application"**
5. Add **Authorized redirect URIs**:
   - For local: `http://localhost:3000`
   - For Vercel: `https://your-domain.vercel.app` (your actual Vercel URL)
6. Copy the **Client ID** (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

---

### Step 2: Add to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** > **Environment Variables**
3. Add new variable:
   - **Name:** `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - **Value:** `<your-google-client-id>`
   - **Environment:** Production, Preview, Development (or at least Production)
   - **Type:** Can be Public (since it starts with `NEXT_PUBLIC_`)
4. Click **Save**
5. **Redeploy** your project

---

### Step 3: Verify Google Cloud Console Settings

Make sure your Google OAuth client has the correct redirect URIs:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth 2.0 Client ID
3. Click **Edit**
4. Under **Authorized redirect URIs**, add:
   ```
   https://your-actual-vercel-domain.vercel.app
   ```
   (Replace with your actual Vercel deployment URL)
5. Click **Save**

---

### Step 4: Test

1. After redeploying, visit your Vercel URL
2. Open browser console (F12)
3. Look for Enoki initialization logs:
   ```
   🔧 Enoki initialization: {
     hasGoogleClientId: true,
     googleClientIdPrefix: "123456789-abcdefgh...",
     providersConfigured: true
   }
   ```
4. Click "Connect Wallet" - you should now see **Google** option

---

## 🔍 Debugging

### Check if variable is set in Vercel:

1. Go to Vercel project > Settings > Environment Variables
2. Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is listed
3. Check it's set for the correct environment (Production)

### Check browser console:

Open your Vercel deployment and check console for:
- ✅ `✅ Enoki initialized successfully with Google login` = Working!
- ❌ `❌ Google Client ID is missing!` = Variable not set
- ⚠️ `⚠️ Enoki initialized but Google login is NOT available` = Variable missing

### Common Issues:

1. **Variable not set in Vercel**
   - Fix: Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to Vercel environment variables

2. **Wrong redirect URI in Google Console**
   - Fix: Add your Vercel URL to authorized redirect URIs

3. **Variable set but not redeployed**
   - Fix: Redeploy after adding environment variable

4. **Variable set for wrong environment**
   - Fix: Make sure it's set for "Production" environment

---

## 📝 Quick Checklist

- [ ] Google Client ID created in Google Cloud Console
- [ ] Authorized redirect URI added for Vercel domain
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` added to Vercel environment variables
- [ ] Variable set for Production environment
- [ ] Project redeployed after adding variable
- [ ] Google login option appears in wallet selector

---

## 🚨 Important Notes

1. **Client ID is Public**: Since it starts with `NEXT_PUBLIC_`, it's safe to expose to the frontend
2. **Redirect URIs**: Must match exactly (including `https://` and no trailing slash)
3. **Redeploy Required**: Vercel needs to rebuild to pick up new environment variables
4. **Multiple Environments**: If you have Preview/Development, add the variable there too

---

**Need Help?** Check the browser console logs - they'll tell you exactly what's missing!

