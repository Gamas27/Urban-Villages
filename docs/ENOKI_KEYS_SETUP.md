# 🔑 Enoki API Keys Setup Instructions

## ✅ Your API Keys

**Public Key (Frontend):**
```
enoki_public_eb523fdb1cee2b3efce6381a717bf634
```

**Private Key (Backend Only - Keep Secret!):**
```
enoki_private_171c5584dce22874b2b9f27715e9caf3
```

---

## 📝 Step 1: Create .env.local File

Create a file named `.env.local` in the project root (`/Users/joaogameiro/Urban Villages/.env.local`) with the following content:

```bash
# Enoki Configuration
# Public API Key - Safe for frontend use
NEXT_PUBLIC_ENOKI_API_KEY=enoki_public_eb523fdb1cee2b3efce6381a717bf634

# SUI Network (testnet, mainnet, or devnet)
NEXT_PUBLIC_SUI_NETWORK=testnet

# Google OAuth (for zkLogin via Enoki)
# Get this from Google Cloud Console: https://console.cloud.google.com/
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**Important:** 
- ✅ The **public key** goes in `.env.local` (safe for frontend)
- ❌ The **private key** should NOT go in `.env.local` (only for backend services)

---

## 🔒 Step 2: Secure Your Private Key

**DO NOT** put the private key in `.env.local` or any frontend code!

**For future backend gas sponsorship**, store the private key in:
- Backend environment variables (e.g., Vercel, Railway, etc.)
- Server-side only (API routes)
- Never in client-side code

---

## 🚀 Step 3: Test the Setup

1. **Restart your development server:**
   ```bash
   pnpm dev
   ```

2. **Check browser console:**
   - Open browser DevTools (F12)
   - Look for: `✅ Enoki initialized successfully`

3. **Test wallet connection:**
   - Click "Connect Wallet" in your app
   - You should see "Enoki (Google)" as an option
   - Try connecting with Google login

---

## ✅ Verification Checklist

- [ ] `.env.local` file created in project root
- [ ] Public API key added to `NEXT_PUBLIC_ENOKI_API_KEY`
- [ ] Dev server restarted
- [ ] Browser console shows "✅ Enoki initialized successfully"
- [ ] Enoki wallet appears in wallet selector
- [ ] Private key stored securely (not in frontend code)

---

## 🎯 What's Next?

Once Enoki is working:

1. **Set up Google OAuth** (optional):
   - Get Google Client ID from [Google Cloud Console](https://console.cloud.google.com/)
   - Add to `.env.local` as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - Configure in Enoki Portal → Auth Providers

2. **Test Enoki wallets:**
   - Connect with Google login
   - Try uploading images (should work without wallet extension!)
   - Test namespace registration

3. **Future: Gas Sponsorship** (when you have a backend):
   - Use private key in backend API route
   - Set up gas pool in Enoki Portal
   - Enable gasless transactions

---

## ⚠️ Security Reminders

1. ✅ `.env.local` is already in `.gitignore` (safe to create)
2. ❌ Never commit API keys to Git
3. ❌ Never share private keys publicly
4. ✅ Public key is safe to use in frontend
5. 🔒 Private key is for backend only

---

**Your Enoki integration is ready! Just create the `.env.local` file and restart your dev server.**

