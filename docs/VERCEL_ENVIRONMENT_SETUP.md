# Vercel Environment Variables Setup

## 🔧 Required Environment Variables

### For Google Login (via Enoki)

To enable Google login via Enoki on your Vercel deployment, you need to set these environment variables:

#### 1. Enoki Public API Key
```
NEXT_PUBLIC_ENOKI_API_KEY=enoki_public_eb523fdb1cee2b3efce6381a717bf634
```

#### 2. Google Client ID (REQUIRED for Google login)
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

#### 3. Network (optional, defaults to testnet)
```
NEXT_PUBLIC_SUI_NETWORK=testnet
```

### For Transaction Sponsorship (Gasless Transactions)

To enable sponsored transactions (gasless transactions), you need to set:

#### 4. Enoki Private API Key (REQUIRED for transaction sponsorship)
```
ENOKI_PRIVATE_API_KEY=enoki_private_171c5584dce22874b2b9f27715e9caf3
```

**⚠️ Important:**
- This is a **PRIVATE** key - never expose it in client-side code
- Only use it in server-side API routes (like `/api/sponsor-transaction`)
- Get this from your [Enoki Developer Portal](https://enoki.mystenlabs.com/) project settings
- Make sure your Enoki project has a funded Gas Pool for sponsoring transactions

**Without this key:**
- Namespace registration will fail with "Failed to sponsor transaction" error
- Users will need to pay gas fees themselves
- Transaction sponsorship features will not work

## 📋 How to Set Environment Variables in Vercel

1. **Go to your Vercel project dashboard**
2. **Click on "Settings"** in the top navigation
3. **Click on "Environment Variables"** in the left sidebar
4. **Add each variable:**
   - Click "Add New"
   - Enter the variable name (e.g., `NEXT_PUBLIC_ENOKI_API_KEY`)
   - Enter the value
   - Select environments (Production, Preview, Development - select all)
   - Click "Save"
5. **Redeploy your application** after adding variables

## 🔐 Google OAuth Setup

### Step 1: Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your project (or create a new one)
3. Click "Create Credentials" > "OAuth client ID"
4. If prompted, configure the OAuth consent screen first
5. Choose "Web application" as the application type
6. Configure:
   - **Name:** Urban Villages (or your app name)
   - **Authorized JavaScript origins:**
     - `https://your-vercel-app.vercel.app` (your production domain)
     - `https://*.vercel.app` (for preview deployments)
     - `http://localhost:3000` (for local development)
   - **Authorized redirect URIs:**
     - `https://your-vercel-app.vercel.app` (your production domain)
     - `https://*.vercel.app` (for preview deployments)
     - `http://localhost:3000` (for local development)
7. Click "Create"
8. Copy the **Client ID** (not the secret!)

### Step 2: Add to Vercel

1. In Vercel, add the environment variable:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   ```
2. Make sure to select all environments (Production, Preview, Development)

### Step 3: Redeploy

After adding environment variables, you need to redeploy:

1. Go to your Vercel project
2. Click "Deployments"
3. Click the "..." menu on the latest deployment
4. Click "Redeploy"

Or push a new commit to trigger a new deployment.

## ✅ Verification

After redeploying, check the browser console on your live site:

1. Open your Vercel deployment
2. Open browser DevTools (F12)
3. Check the Console tab
4. You should see:
   ```
   🔧 Enoki initialization: { ... hasGoogleClientId: true, ... }
   ✅ Enoki initialized successfully with Google login
   ```

If you see:
```
❌ Google Client ID is missing! Google login will NOT appear.
```

Then the environment variable is not set correctly. Double-check:
- Variable name is exactly `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- Value is correct (no extra spaces)
- All environments are selected
- You've redeployed after adding the variable

## 🐛 Troubleshooting

### Google login option doesn't appear

**Check:**
1. ✅ Environment variables are set in Vercel
2. ✅ Variables are set for the correct environment (Production/Preview)
3. ✅ You've redeployed after adding variables
4. ✅ Browser console shows "Enoki initialized successfully with Google login"
5. ✅ Google OAuth redirect URIs include your Vercel domain

**Common issues:**
- Variable name typo (must be exactly `NEXT_PUBLIC_GOOGLE_CLIENT_ID`)
- Variable not set for Production environment
- Forgot to redeploy after adding variables
- Google OAuth redirect URI doesn't match Vercel domain

### Only seeing Sui Wallet/Phantom

This means Enoki is not initialized or Google Client ID is missing:
1. Check browser console for Enoki initialization logs
2. Verify `NEXT_PUBLIC_ENOKI_API_KEY` is set
3. Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set
4. Make sure you redeployed after adding variables

## 📝 Quick Checklist

### Google Login Setup
- [ ] `NEXT_PUBLIC_ENOKI_API_KEY` set in Vercel
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` set in Vercel
- [ ] Variables set for all environments (Production, Preview, Development)
- [ ] Google OAuth redirect URIs include Vercel domain
- [ ] Application redeployed after adding variables
- [ ] Browser console shows "Enoki initialized successfully with Google login"
- [ ] "Connect Wallet" shows Enoki/Google option

### Transaction Sponsorship Setup
- [ ] `ENOKI_PRIVATE_API_KEY` set in Vercel (as **Environment Variable**, not Public)
- [ ] Enoki Gas Pool is funded in Enoki Developer Portal
- [ ] Application redeployed after adding the private key
- [ ] Namespace registration works without user paying gas fees
- [ ] No "Failed to sponsor transaction" errors in console

---

**After setting up, redeploy and test!** 🚀

