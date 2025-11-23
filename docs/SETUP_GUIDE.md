# 🚀 Quick Setup Guide - Environment Variables

## Current Status
- ✅ Sui CLI is installed
- ✅ `.env.local` exists
- ❌ `ADMIN_PRIVATE_KEY` is NOT set (CRITICAL!)

---

## Step 1: Export ADMIN_PRIVATE_KEY

The `ADMIN_PRIVATE_KEY` must be from the wallet that deployed the contracts (owns the AdminCap).

### Option A: If you know which key deployed the contracts

```bash
# List all keys to find the right one
sui keytool list

# Export the private key (replace <key-alias> with your key name)
sui keytool export --key-identity <key-alias> --key-encoding base64

# Copy the output (it will be a long base64 string)
```

### Option B: If you have the address that deployed contracts

```bash
# Find which key matches the deployer address
sui keytool list

# Export that key
sui keytool export --key-identity <key-alias> --key-encoding base64
```

### Option C: If you have the private key in another format

If you have the private key as hex or another format, we can convert it.

---

## Step 2: Add to .env.local

1. Open `.env.local` in your editor
2. Find or add this line:
   ```env
   ADMIN_PRIVATE_KEY=<paste-the-base64-key-here>
   ```
3. Save the file

**⚠️ IMPORTANT:** Never commit `.env.local` to git!

---

## Step 3: Add Contract IDs (if not already there)

Copy these from `docs/ENV_TEMPLATE.md`:

```env
# SUI NETWORK
NEXT_PUBLIC_SUI_NETWORK=testnet

# NAMESPACE CONTRACT
NEXT_PUBLIC_NAMESPACE_PACKAGE_ID=0x1465dc2888257bd5e03cab860558e96ba806999f7fca4515f8c8378460a27d7b
NEXT_PUBLIC_NAMESPACE_REGISTRY_ID=0xb042e36d39e1268bd5bf4cfc194098a593717e1e0349a8521abf3d689f83aa91

# CORK TOKEN CONTRACT
NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID=0x3c9b52cb0b208b9902a1a35d4106d8414c0f7f9b277f0e386cef64a4f3d85162
NEXT_PUBLIC_CORK_TREASURY_ID=0x3ad4942fcefb009c4866877d5982fd5461db4145240cf5825b3fc2e67340ca5a
NEXT_PUBLIC_CORK_ADMIN_CAP_ID=0xe6cd1fbaf412f11b7f8917f28aef83aaf7a1d7e10649de6bcc2aa48f15ad359d

# BOTTLE NFT CONTRACT
NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID=0x0d8b8be993d4ad87de11b6c059c778a44b356341e53595a1a0e21eec9354b6cd
NEXT_PUBLIC_BOTTLE_REGISTRY_ID=0xca28d84fca1602739f0e327b5a14cbe0c601b97b6ec2bad92684c7144090bd7c
NEXT_PUBLIC_BOTTLE_ADMIN_CAP_ID=0xd4df8247a68009ee730b405f38f62f49d7b07a5644b5458301cf64b288f3d8ab

# ENOKI
NEXT_PUBLIC_ENOKI_API_KEY=enoki_public_eb523fdb1cee2b3efce6381a717bf634
```

---

## Step 4: Verify Setup

### Method 1: Use the verification script
```bash
source .env.local
./check-env.sh
```

### Method 2: Use the API endpoint
```bash
# Start dev server
pnpm dev

# In another terminal or browser, visit:
# http://localhost:3000/api/test-env
```

### Method 3: Check manually
```bash
# Check if ADMIN_PRIVATE_KEY is set (should show "SET")
grep ADMIN_PRIVATE_KEY .env.local | grep -v "^#" | grep -v "^$"
```

---

## Step 5: For Vercel Deployment

1. Go to Vercel Project Settings > Environment Variables
2. Add all `NEXT_PUBLIC_*` variables
3. Add `ADMIN_PRIVATE_KEY` as **Environment Variable** (NOT Public!)
4. Redeploy

---

## Common Issues

### "Admin private key not configured"
- **Cause:** `ADMIN_PRIVATE_KEY` is missing or incorrect
- **Fix:** Export the key from the deployer wallet and add to `.env.local`

### "Contract not deployed" errors
- **Cause:** Contract IDs are missing or incorrect
- **Fix:** Copy all Package IDs and Object IDs from deployment docs

### Google login doesn't appear
- **Cause:** `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is not set
- **Fix:** Get Client ID from Google Cloud Console (optional)

---

## Need Help?

If you're stuck:
1. Check `docs/ENV_VARIABLES_CHECKLIST.md` for complete details
2. Run `./check-env.sh` to see what's missing
3. Visit `/api/test-env` when server is running

---

**Next Steps After Setup:**
1. ✅ Verify all variables are set
2. ✅ Test the purchase flow
3. ✅ Deploy to Vercel

