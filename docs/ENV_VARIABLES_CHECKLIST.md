# 🔐 Environment Variables Verification Checklist

**Date:** November 22, 2025  
**Status:** Critical for Demo

---

## 📋 Required Environment Variables

### ✅ CRITICAL (Must Have for Demo)

#### 1. SUI Network Configuration
```env
NEXT_PUBLIC_SUI_NETWORK=testnet
```
- **Status:** ✅ Has default fallback
- **Used in:** All contract interactions
- **Required:** Yes (but defaults to testnet)

---

#### 2. Namespace Contract
```env
NEXT_PUBLIC_NAMESPACE_PACKAGE_ID=0x1465dc2888257bd5e03cab860558e96ba806999f7fca4515f8c8378460a27d7b
NEXT_PUBLIC_NAMESPACE_REGISTRY_ID=0xb042e36d39e1268bd5bf4cfc194098a593717e1e0349a8521abf3d689f83aa91
```
- **Status:** ✅ Deployed
- **Used in:** `app/lib/namespace.ts`, onboarding flow
- **Required:** Yes - Namespace registration won't work without these

---

#### 3. Cork Token Contract
```env
NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID=0x3c9b52cb0b208b9902a1a35d4106d8414c0f7f9b277f0e386cef64a4f3d85162
NEXT_PUBLIC_CORK_TREASURY_ID=0x3ad4942fcefb009c4866877d5982fd5461db4145240cf5825b3fc2e67340ca5a
NEXT_PUBLIC_CORK_ADMIN_CAP_ID=0xe6cd1fbaf412f11b7f8917f28aef83aaf7a1d7e10649de6bcc2aa48f15ad359d
```
- **Status:** ✅ Deployed
- **Used in:** `app/lib/cork-token.ts`, `app/api/mint-purchase/route.ts`
- **Required:** Yes - CORK token minting won't work without these

---

#### 4. Bottle NFT Contract
```env
NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID=0x0d8b8be993d4ad87de11b6c059c778a44b356341e53595a1a0e21eec9354b6cd
NEXT_PUBLIC_BOTTLE_REGISTRY_ID=0xca28d84fca1602739f0e327b5a14cbe0c601b97b6ec2bad92684c7144090bd7c
NEXT_PUBLIC_BOTTLE_ADMIN_CAP_ID=0xd4df8247a68009ee730b405f38f62f49d7b07a5644b5458301cf64b288f3d8ab
```
- **Status:** ✅ Deployed
- **Used in:** `app/lib/bottle-nft.ts`, `app/api/mint-purchase/route.ts`
- **Required:** Yes - NFT minting won't work without these

---

#### 5. Admin Private Key (Backend Only)
```env
ADMIN_PRIVATE_KEY=<base64-encoded-ed25519-private-key>
```
- **Status:** ⚠️ NEEDS TO BE SET
- **Used in:** `app/api/mint-purchase/route.ts` (server-side only)
- **Required:** Yes - Purchase → Mint flow won't work without this
- **Security:** ⚠️ NEVER expose this to frontend! Backend only!
- **How to get:** Export from the wallet that deployed contracts

---

#### 6. Enoki Configuration
```env
NEXT_PUBLIC_ENOKI_API_KEY=enoki_public_eb523fdb1cee2b3efce6381a717bf634
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>
```
- **Status:** ⚠️ Google Client ID needs to be set
- **Used in:** `app/lib/enoki.ts`, onboarding flow
- **Required:** 
  - Enoki API Key: ✅ Already set (from docs)
  - Google Client ID: ⚠️ Needs to be configured for Google login
- **Note:** App works without Google login, but Enoki Google login won't appear

---

### ⚠️ OPTIONAL (Nice to Have)

#### 7. Supabase Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>  # Backend only
```
- **Status:** ⚠️ Optional (app works without, but backend features disabled)
- **Used in:** `app/lib/db/supabase.ts`, posts API, user tracking
- **Required:** No - App will work but posts won't persist
- **Impact:** 
  - Without: Posts won't save, user tracking disabled
  - With: Full backend functionality

---

#### 8. Enoki Private API Key (Backend Only)
```env
ENOKI_PRIVATE_API_KEY=<your-enoki-private-key>
```
- **Status:** ⚠️ Optional
- **Used in:** `app/api/sponsor-transaction/route.ts`
- **Required:** No - Sponsored transactions will use Enoki Gas Pool instead
- **Note:** Only needed if you want to sponsor transactions via API

---

#### 9. Base URL (Optional)
```env
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```
- **Status:** ⚠️ Optional (defaults to localhost:3000)
- **Used in:** Transaction logging, internal API calls
- **Required:** No - Only needed for production deployments

---

## 🔍 Verification Script

Run this to check which variables are set:

```bash
# Check critical variables
echo "=== CRITICAL VARIABLES ==="
echo "SUI Network: ${NEXT_PUBLIC_SUI_NETWORK:-NOT SET (defaults to testnet)}"
echo "Namespace Package: ${NEXT_PUBLIC_NAMESPACE_PACKAGE_ID:-NOT SET}"
echo "Namespace Registry: ${NEXT_PUBLIC_NAMESPACE_REGISTRY_ID:-NOT SET}"
echo "Cork Package: ${NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID:-NOT SET}"
echo "Cork Treasury: ${NEXT_PUBLIC_CORK_TREASURY_ID:-NOT SET}"
echo "Cork AdminCap: ${NEXT_PUBLIC_CORK_ADMIN_CAP_ID:-NOT SET}"
echo "Bottle Package: ${NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID:-NOT SET}"
echo "Bottle Registry: ${NEXT_PUBLIC_BOTTLE_REGISTRY_ID:-NOT SET}"
echo "Bottle AdminCap: ${NEXT_PUBLIC_BOTTLE_ADMIN_CAP_ID:-NOT SET}"
echo "Admin Private Key: ${ADMIN_PRIVATE_KEY:+SET (hidden)} ${ADMIN_PRIVATE_KEY:-NOT SET}"
echo ""
echo "=== ENOKI ==="
echo "Enoki API Key: ${NEXT_PUBLIC_ENOKI_API_KEY:+SET} ${NEXT_PUBLIC_ENOKI_API_KEY:-NOT SET}"
echo "Google Client ID: ${NEXT_PUBLIC_GOOGLE_CLIENT_ID:+SET} ${NEXT_PUBLIC_GOOGLE_CLIENT_ID:-NOT SET}"
echo ""
echo "=== OPTIONAL ==="
echo "Supabase URL: ${NEXT_PUBLIC_SUPABASE_URL:+SET} ${NEXT_PUBLIC_SUPABASE_URL:-NOT SET}"
echo "Supabase Anon Key: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:+SET} ${NEXT_PUBLIC_SUPABASE_ANON_KEY:-NOT SET}"
```

---

## 📝 Complete .env.local Template

```env
# ============================================
# SUI NETWORK
# ============================================
NEXT_PUBLIC_SUI_NETWORK=testnet

# ============================================
# NAMESPACE CONTRACT (DEPLOYED ✅)
# ============================================
NEXT_PUBLIC_NAMESPACE_PACKAGE_ID=0x1465dc2888257bd5e03cab860558e96ba806999f7fca4515f8c8378460a27d7b
NEXT_PUBLIC_NAMESPACE_REGISTRY_ID=0xb042e36d39e1268bd5bf4cfc194098a593717e1e0349a8521abf3d689f83aa91

# ============================================
# CORK TOKEN CONTRACT (DEPLOYED ✅)
# ============================================
NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID=0x3c9b52cb0b208b9902a1a35d4106d8414c0f7f9b277f0e386cef64a4f3d85162
NEXT_PUBLIC_CORK_TREASURY_ID=0x3ad4942fcefb009c4866877d5982fd5461db4145240cf5825b3fc2e67340ca5a
NEXT_PUBLIC_CORK_ADMIN_CAP_ID=0xe6cd1fbaf412f11b7f8917f28aef83aaf7a1d7e10649de6bcc2aa48f15ad359d

# ============================================
# BOTTLE NFT CONTRACT (DEPLOYED ✅)
# ============================================
NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID=0x0d8b8be993d4ad87de11b6c059c778a44b356341e53595a1a0e21eec9354b6cd
NEXT_PUBLIC_BOTTLE_REGISTRY_ID=0xca28d84fca1602739f0e327b5a14cbe0c601b97b6ec2bad92684c7144090bd7c
NEXT_PUBLIC_BOTTLE_ADMIN_CAP_ID=0xd4df8247a68009ee730b405f38f62f49d7b07a5644b5458301cf64b288f3d8ab

# ============================================
# ADMIN PRIVATE KEY (BACKEND ONLY - CRITICAL!)
# ============================================
# ⚠️ NEVER commit this to git!
# Export from the wallet that deployed contracts:
# sui keytool export --key-identity <key-alias> --key-encoding base64
ADMIN_PRIVATE_KEY=<base64-encoded-private-key>

# ============================================
# ENOKI CONFIGURATION
# ============================================
NEXT_PUBLIC_ENOKI_API_KEY=enoki_public_eb523fdb1cee2b3efce6381a717bf634
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>

# ============================================
# SUPABASE (OPTIONAL - for backend features)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# ============================================
# ENOKI PRIVATE API KEY (OPTIONAL)
# ============================================
# Only needed if sponsoring transactions via API
ENOKI_PRIVATE_API_KEY=<your-enoki-private-key>

# ============================================
# BASE URL (OPTIONAL - for production)
# ============================================
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

---

## ✅ Verification Checklist

### For Local Development (.env.local)
- [ ] `NEXT_PUBLIC_SUI_NETWORK` set (or defaults to testnet)
- [ ] `NEXT_PUBLIC_NAMESPACE_PACKAGE_ID` set
- [ ] `NEXT_PUBLIC_NAMESPACE_REGISTRY_ID` set
- [ ] `NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID` set
- [ ] `NEXT_PUBLIC_CORK_TREASURY_ID` set
- [ ] `NEXT_PUBLIC_CORK_ADMIN_CAP_ID` set
- [ ] `NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID` set
- [ ] `NEXT_PUBLIC_BOTTLE_REGISTRY_ID` set
- [ ] `NEXT_PUBLIC_BOTTLE_ADMIN_CAP_ID` set
- [ ] `ADMIN_PRIVATE_KEY` set (backend only)
- [ ] `NEXT_PUBLIC_ENOKI_API_KEY` set
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` set (optional but recommended)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set (optional)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set (optional)

### For Vercel Deployment
- [ ] All variables above added to Vercel Project Settings
- [ ] `ADMIN_PRIVATE_KEY` added as **Environment Variable** (not Public)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` added as **Environment Variable** (not Public)
- [ ] `ENOKI_PRIVATE_API_KEY` added as **Environment Variable** (not Public)
- [ ] All `NEXT_PUBLIC_*` variables added as **Environment Variables**
- [ ] Variables set for **Production**, **Preview**, and **Development** environments

---

## 🚨 Critical Missing Variables

### If `ADMIN_PRIVATE_KEY` is missing:
- ❌ Purchase → Mint flow will fail
- ❌ Error: "Admin private key not configured"
- **Fix:** Export private key from deployer wallet

### If Contract IDs are missing:
- ❌ Namespace registration will fail
- ❌ CORK token minting will fail
- ❌ NFT minting will fail
- **Fix:** Add all Package IDs and Object IDs from deployment docs

### If `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is missing:
- ⚠️ Google login won't appear in Enoki wallet selector
- ✅ App still works with regular wallets
- **Fix:** Get Client ID from Google Cloud Console

---

## 🔧 How to Get Missing Values

### 1. Admin Private Key
```bash
# If you have the key in sui keystore:
sui keytool export --key-identity <key-alias> --key-encoding base64

# Or if you have the raw private key:
# Convert to base64: echo -n "<private-key-hex>" | xxd -r -p | base64
```

### 2. Google Client ID
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - `http://localhost:3000` (for local)
   - `https://your-domain.vercel.app` (for production)
4. Copy the Client ID

### 3. Supabase Credentials
1. Go to your Supabase project
2. Settings > API
3. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (backend only)

---

## 🧪 Test Environment Variables

Create a test script to verify all variables:

```typescript
// app/api/test-env/route.ts
export async function GET() {
  const required = {
    'NEXT_PUBLIC_SUI_NETWORK': process.env.NEXT_PUBLIC_SUI_NETWORK,
    'NEXT_PUBLIC_NAMESPACE_PACKAGE_ID': process.env.NEXT_PUBLIC_NAMESPACE_PACKAGE_ID,
    'NEXT_PUBLIC_NAMESPACE_REGISTRY_ID': process.env.NEXT_PUBLIC_NAMESPACE_REGISTRY_ID,
    'NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID': process.env.NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID,
    'NEXT_PUBLIC_CORK_TREASURY_ID': process.env.NEXT_PUBLIC_CORK_TREASURY_ID,
    'NEXT_PUBLIC_CORK_ADMIN_CAP_ID': process.env.NEXT_PUBLIC_CORK_ADMIN_CAP_ID,
    'NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID': process.env.NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID,
    'NEXT_PUBLIC_BOTTLE_REGISTRY_ID': process.env.NEXT_PUBLIC_BOTTLE_REGISTRY_ID,
    'NEXT_PUBLIC_BOTTLE_ADMIN_CAP_ID': process.env.NEXT_PUBLIC_BOTTLE_ADMIN_CAP_ID,
    'ADMIN_PRIVATE_KEY': process.env.ADMIN_PRIVATE_KEY ? 'SET (hidden)' : 'NOT SET',
    'NEXT_PUBLIC_ENOKI_API_KEY': process.env.NEXT_PUBLIC_ENOKI_API_KEY,
    'NEXT_PUBLIC_GOOGLE_CLIENT_ID': process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  };

  const optional = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'ENOKI_PRIVATE_API_KEY': process.env.ENOKI_PRIVATE_API_KEY ? 'SET (hidden)' : 'NOT SET',
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  return Response.json({
    required,
    optional,
    missing,
    allSet: missing.length === 0,
  });
}
```

---

## 📊 Status Summary

| Variable | Status | Priority | Impact if Missing |
|----------|--------|----------|-------------------|
| `NEXT_PUBLIC_SUI_NETWORK` | ✅ Has default | Low | None (defaults to testnet) |
| `NEXT_PUBLIC_NAMESPACE_*` | ✅ From docs | **Critical** | Namespace registration fails |
| `NEXT_PUBLIC_CORK_*` | ✅ From docs | **Critical** | CORK minting fails |
| `NEXT_PUBLIC_BOTTLE_*` | ✅ From docs | **Critical** | NFT minting fails |
| `ADMIN_PRIVATE_KEY` | ⚠️ **MUST SET** | **Critical** | Purchase → Mint fails |
| `NEXT_PUBLIC_ENOKI_API_KEY` | ✅ From docs | High | Enoki wallets unavailable |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | ⚠️ Needs set | Medium | Google login unavailable |
| `NEXT_PUBLIC_SUPABASE_*` | ⚠️ Optional | Low | Backend features disabled |

---

## 🎯 Next Steps

1. **Create `.env.local`** with all critical variables
2. **Add to Vercel** Project Settings > Environment Variables
3. **Test locally** - Run `pnpm dev` and check console for warnings
4. **Verify in production** - Check Vercel build logs for errors

---

**Last Updated:** November 22, 2025

