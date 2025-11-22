# Enoki Google Login Setup - Quick Fix

## ✅ Issue Fixed

The Enoki initialization order has been fixed. Enoki wallets are now registered **before** WalletProvider renders, so Google login should appear in the ConnectButton.

## 🔧 What Was Changed

1. **Fixed initialization order** in `app/providers.tsx`:
   - Enoki now initializes **synchronously** before WalletProvider renders
   - Changed from `useEffect` to direct initialization

2. **Improved UI messaging** in `app/cork/Onboarding.tsx`:
   - Clearer instructions to select "Enoki (Google)" from wallet selector

## 📋 Required Environment Variables

Make sure your `.env.local` has:

```env
# Enoki API Key (you have this)
NEXT_PUBLIC_ENOKI_API_KEY=enoki_public_eb523fdb1cee2b3efce6381a717bf634

# Google Client ID (REQUIRED for Google login to appear)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# Network
NEXT_PUBLIC_SUI_NETWORK=testnet
```

## 🔍 How to Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID (or use existing)
3. Configure:
   - **Application type:** Web application
   - **Authorized JavaScript origins:** 
     - `http://localhost:3000` (for development)
     - Your production domain (for production)
   - **Authorized redirect URIs:**
     - `http://localhost:3000` (for development)
     - Your production domain (for production)
4. Copy the **Client ID** (not the secret!)
5. Add to `.env.local` as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

## ✅ Testing Steps

1. **Restart dev server:**
   ```bash
   pnpm dev
   ```

2. **Open browser console** and check for:
   - `✅ Enoki initialized successfully`
   - If you see warnings about Google Client ID, add it to `.env.local`

3. **Click "Connect Wallet"** button
   - You should see **"Enoki"** or **"Enoki (Google)"** as an option
   - If you only see Sui Wallet/Phantom, check:
     - Enoki API key is set
     - Google Client ID is set
     - Console for any errors

4. **Select Enoki/Google** option
   - Should open Google OAuth popup
   - After login, wallet is connected automatically

## 🐛 Troubleshooting

### Google login option doesn't appear

**Check:**
1. ✅ Enoki API key is set: `NEXT_PUBLIC_ENOKI_API_KEY`
2. ✅ Google Client ID is set: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
3. ✅ Restart dev server after adding env vars
4. ✅ Check browser console for errors

**Console should show:**
```
✅ Enoki initialized successfully
```

**If you see:**
```
⚠️ Google Client ID not found
```
→ Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to `.env.local`

### Only seeing Sui Wallet/Phantom

**Possible causes:**
1. Enoki not initialized (check console)
2. Google Client ID missing
3. Enoki API key invalid

**Fix:**
- Verify all env vars are set
- Restart dev server
- Clear browser cache
- Check Enoki API key is valid at https://enoki.mystenlabs.com

## 🎯 Expected Behavior

When user clicks "Connect Wallet":
1. Wallet selector modal appears
2. **First option should be "Enoki" or "Enoki (Google)"**
3. User clicks it → Google OAuth popup
4. User signs in → Wallet connected automatically
5. No browser extension needed!

---

**After adding Google Client ID, restart the dev server and test!** 🚀

