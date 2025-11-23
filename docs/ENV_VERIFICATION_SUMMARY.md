# 🔐 Environment Variables Verification Summary

**Date:** November 22, 2025  
**Status:** Verification Tools Created

---

## ✅ What I've Created

### 1. Environment Variables Checklist
- **File:** `docs/ENV_VARIABLES_CHECKLIST.md`
- **Contains:** Complete list of all required variables with values from deployment docs

### 2. Environment Template
- **File:** `docs/ENV_TEMPLATE.md`
- **Contains:** Ready-to-use `.env.local` template with all contract IDs

### 3. Verification Script
- **File:** `check-env.sh`
- **Usage:** `source .env.local && ./check-env.sh`
- **Output:** Shows which variables are set/missing

### 4. API Test Endpoint
- **File:** `app/api/test-env/route.ts`
- **URL:** `http://localhost:3000/api/test-env` (when running)
- **Returns:** JSON with all environment variable status

---

## 📋 Required Variables (From Deployment Docs)

### ✅ Already Have Values (From Deployment)

#### Namespace Contract
```env
NEXT_PUBLIC_NAMESPACE_PACKAGE_ID=0x1465dc2888257bd5e03cab860558e96ba806999f7fca4515f8c8378460a27d7b
NEXT_PUBLIC_NAMESPACE_REGISTRY_ID=0xb042e36d39e1268bd5bf4cfc194098a593717e1e0349a8521abf3d689f83aa91
```

#### Cork Token Contract
```env
NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID=0x3c9b52cb0b208b9902a1a35d4106d8414c0f7f9b277f0e386cef64a4f3d85162
NEXT_PUBLIC_CORK_TREASURY_ID=0x3ad4942fcefb009c4866877d5982fd5461db4145240cf5825b3fc2e67340ca5a
NEXT_PUBLIC_CORK_ADMIN_CAP_ID=0xe6cd1fbaf412f11b7f8917f28aef83aaf7a1d7e10649de6bcc2aa48f15ad359d
```

#### Bottle NFT Contract
```env
NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID=0x0d8b8be993d4ad87de11b6c059c778a44b356341e53595a1a0e21eec9354b6cd
NEXT_PUBLIC_BOTTLE_REGISTRY_ID=0xca28d84fca1602739f0e327b5a14cbe0c601b97b6ec2bad92684c7144090bd7c
NEXT_PUBLIC_BOTTLE_ADMIN_CAP_ID=0xd4df8247a68009ee730b405f38f62f49d7b07a5644b5458301cf64b288f3d8ab
```

#### Enoki
```env
NEXT_PUBLIC_ENOKI_API_KEY=enoki_public_eb523fdb1cee2b3efce6381a717bf634
```

---

### ⚠️ Need to Set

#### 1. ADMIN_PRIVATE_KEY (CRITICAL!)
- **What:** Base64-encoded Ed25519 private key of the deployer wallet
- **Why:** Required for `/api/mint-purchase` to mint NFTs and tokens
- **How to get:**
  ```bash
  # If key is in sui keystore:
  sui keytool export --key-identity <key-alias> --key-encoding base64
  
  # Or if you have the raw private key (hex):
  # Convert to base64 manually
  ```
- **Security:** ⚠️ NEVER commit to git! Backend only!

#### 2. NEXT_PUBLIC_GOOGLE_CLIENT_ID
- **What:** Google OAuth Client ID for Enoki Google login
- **Why:** Enables Google login option in wallet selector
- **How to get:**
  1. Go to https://console.cloud.google.com/apis/credentials
  2. Create OAuth 2.0 Client ID
  3. Add authorized redirect URIs
  4. Copy Client ID
- **Impact:** App works without it, but Google login won't appear

#### 3. Supabase (Optional)
- **What:** Database for posts and user tracking
- **Why:** Enables backend features (posts persistence, user tracking)
- **Impact:** App works without it, but posts won't save

---

## 🧪 How to Verify

### Method 1: Use the API Endpoint
1. Start dev server: `pnpm dev`
2. Visit: `http://localhost:3000/api/test-env`
3. Check JSON response for missing variables

### Method 2: Use the Script
```bash
source .env.local
./check-env.sh
```

### Method 3: Check Vercel
1. Go to Vercel Project Settings > Environment Variables
2. Verify all `NEXT_PUBLIC_*` variables are set
3. Verify `ADMIN_PRIVATE_KEY` is set (as Environment Variable, not Public)

---

## 🚨 Critical Missing Variables

### If ADMIN_PRIVATE_KEY is missing:
- ❌ **Purchase → Mint will fail**
- Error: "Admin private key not configured"
- **Fix:** Export from deployer wallet

### If Contract IDs are missing:
- ❌ **Namespace registration fails**
- ❌ **CORK minting fails**
- ❌ **NFT minting fails**
- **Fix:** Add all Package IDs from deployment docs

---

## 📝 Quick Setup Steps

1. **Copy template:**
   ```bash
   # Use docs/ENV_TEMPLATE.md as reference
   # Create .env.local with all values
   ```

2. **Add contract IDs** (from deployment docs - already have values)

3. **Export ADMIN_PRIVATE_KEY:**
   ```bash
   sui keytool export --key-identity <your-key> --key-encoding base64
   # Copy output to ADMIN_PRIVATE_KEY in .env.local
   ```

4. **Add Google Client ID** (optional but recommended)

5. **Add Supabase** (optional - for backend features)

6. **Verify:**
   ```bash
   source .env.local
   ./check-env.sh
   # Or visit /api/test-env when server is running
   ```

7. **For Vercel:**
   - Add all variables in Project Settings > Environment Variables
   - Make sure `ADMIN_PRIVATE_KEY` is NOT marked as "Public"

---

## ✅ Verification Checklist

- [ ] All contract Package IDs set
- [ ] All contract Registry/Treasury IDs set
- [ ] All AdminCap IDs set
- [ ] `ADMIN_PRIVATE_KEY` set (backend only)
- [ ] `NEXT_PUBLIC_ENOKI_API_KEY` set
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` set (optional)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set (optional)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set (optional)
- [ ] All variables added to Vercel (for deployment)

---

**Next:** Test the purchase flow to verify everything works!

