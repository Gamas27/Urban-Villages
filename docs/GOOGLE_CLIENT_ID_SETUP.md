# Google Client ID Setup - Quick Guide

## ✅ Your Client ID

From your Google OAuth configuration, use this:

```
1097275538443-5jnmi72g89h8hf4fr5v9ucehshq8toaa.apps.googleusercontent.com
```

## 📝 Add to .env.local

Add this line to your `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1097275538443-5jnmi72g89h8hf4fr5v9ucehshq8toaa.apps.googleusercontent.com
```

## ⚠️ Important Notes

### 1. Client Secret
- ❌ **DO NOT** use `client_secret` in frontend code
- ✅ Only use `client_id` (which is safe to expose)
- The `client_secret` is for backend/server-side flows only

### 2. Redirect URI
Your current redirect URI is:
```
http://localhost:3000/auth/callback
```

**With Enoki**, the OAuth flow is handled by Enoki's infrastructure. You may need to:

1. **Check Enoki Portal** for the correct redirect URI
2. **Update Google Console** if needed:
   - Go to: https://console.cloud.google.com/apis/credentials
   - Edit your OAuth 2.0 Client ID
   - Add Enoki's redirect URI (check Enoki docs/portal)

**OR** try with the current redirect URI first - Enoki might handle it automatically.

### 3. Authorized JavaScript Origins
Make sure these are set in Google Console:
```
http://localhost:3000
```

## ✅ Quick Setup Steps

1. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=1097275538443-5jnmi72g89h8hf4fr5v9ucehshq8toaa.apps.googleusercontent.com
   ```

2. **Restart dev server:**
   ```bash
   pnpm dev
   ```

3. **Test:**
   - Click "Connect Wallet"
   - Look for "Enoki" or "Enoki (Google)" option
   - Select it → Should open Google OAuth

## 🔍 If Google Login Doesn't Appear

1. Check browser console for:
   - `✅ Enoki initialized successfully`
   - Any warnings about Google Client ID

2. Verify `.env.local` has the correct variable name:
   - Must be: `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (with `NEXT_PUBLIC_` prefix)

3. Check Enoki Portal:
   - Make sure Google provider is enabled
   - Verify the Client ID matches

---

**Ready to test!** Add the Client ID to `.env.local` and restart your dev server. 🚀

