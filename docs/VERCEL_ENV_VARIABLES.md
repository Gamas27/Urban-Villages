# 🚀 Vercel Environment Variables - Complete List

**For:** Vercel Project Settings > Environment Variables  
**Date:** November 22, 2025

---

## 📋 How to Add to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** > **Environment Variables**
3. Add each variable below
4. **Important:** 
   - Variables starting with `NEXT_PUBLIC_` can be **Public** or **Environment Variable**
   - Variables **without** `NEXT_PUBLIC_` must be **Environment Variable** (NOT Public!)
   - Set for: **Production**, **Preview**, and **Development** (or just Production)

---

## ✅ REQUIRED - Public Variables (Can be Public)

These can be exposed to the frontend:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `NEXT_PUBLIC_SUI_NETWORK` | `testnet` | Network for Sui blockchain |
| `NEXT_PUBLIC_NAMESPACE_PACKAGE_ID` | `0x1465dc2888257bd5e03cab860558e96ba806999f7fca4515f8c8378460a27d7b` | Namespace contract package |
| `NEXT_PUBLIC_NAMESPACE_REGISTRY_ID` | `0xb042e36d39e1268bd5bf4cfc194098a593717e1e0349a8521abf3d689f83aa91` | Namespace registry shared object |
| `NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID` | `0x3c9b52cb0b208b9902a1a35d4106d8414c0f7f9b277f0e386cef64a4f3d85162` | Cork Token contract package |
| `NEXT_PUBLIC_CORK_TREASURY_ID` | `0x3ad4942fcefb009c4866877d5982fd5461db4145240cf5825b3fc2e67340ca5a` | Cork Token treasury shared object |
| `NEXT_PUBLIC_CORK_ADMIN_CAP_ID` | `0xe6cd1fbaf412f11b7f8917f28aef83aaf7a1d7e10649de6bcc2aa48f15ad359d` | Cork Token AdminCap |
| `NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID` | `0x0d8b8be993d4ad87de11b6c059c778a44b356341e53595a1a0e21eec9354b6cd` | Bottle NFT contract package |
| `NEXT_PUBLIC_BOTTLE_REGISTRY_ID` | `0xca28d84fca1602739f0e327b5a14cbe0c601b97b6ec2bad92684c7144090bd7c` | Bottle NFT registry shared object |
| `NEXT_PUBLIC_BOTTLE_ADMIN_CAP_ID` | `0xd4df8247a68009ee730b405f38f62f49d7b07a5644b5458301cf64b288f3d8ab` | Bottle NFT AdminCap |
| `NEXT_PUBLIC_ENOKI_API_KEY` | `enoki_public_eb523fdb1cee2b3efce6381a717bf634` | Enoki public API key |

---

## 🔐 REQUIRED - Private Variables (Backend Only - NOT Public!)

These must be **Environment Variable** (NOT Public):

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `ADMIN_PRIVATE_KEY` | `<base64-encoded-private-key>` | ⚠️ **CRITICAL!** Private key of deployer wallet (address: `0x951ffaa17abaf3202acf52125d711df9f71f318c0772a08daeaf6d1d978b6f2f`) |

**How to get ADMIN_PRIVATE_KEY:**
- Export from the wallet that deployed contracts
- Command: `sui keytool export --key-identity <key-alias> --key-encoding base64`
- Or get from Sui Wallet extension for address `0x951ffaa17abaf3202acf52125d711df9f71f318c0772a08daeaf6d1d978b6f2f`

---

## ⚠️ OPTIONAL - Public Variables

These are optional but recommended:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `<your-google-client-id>` | For Enoki Google login. Get from [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `NEXT_PUBLIC_BASE_URL` | `https://your-domain.vercel.app` | Your Vercel deployment URL (auto-set by Vercel, but you can override) |

---

## ⚠️ OPTIONAL - Private Variables (Backend Only)

These are optional for backend features:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `<your-supabase-url>` | Supabase project URL (for posts/user tracking) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `<your-supabase-anon-key>` | Supabase anonymous key (can be public) |
| `SUPABASE_SERVICE_ROLE_KEY` | `<your-service-role-key>` | Supabase service role key (backend only - NOT public!) |
| `ENOKI_PRIVATE_API_KEY` | `<your-enoki-private-key>` | Enoki private API key (only if sponsoring transactions via API) |

---

## 📝 Copy-Paste Format for Vercel

### Required Public Variables (Add as Environment Variable or Public):

```
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_NAMESPACE_PACKAGE_ID=0x1465dc2888257bd5e03cab860558e96ba806999f7fca4515f8c8378460a27d7b
NEXT_PUBLIC_NAMESPACE_REGISTRY_ID=0xb042e36d39e1268bd5bf4cfc194098a593717e1e0349a8521abf3d689f83aa91
NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID=0x3c9b52cb0b208b9902a1a35d4106d8414c0f7f9b277f0e386cef64a4f3d85162
NEXT_PUBLIC_CORK_TREASURY_ID=0x3ad4942fcefb009c4866877d5982fd5461db4145240cf5825b3fc2e67340ca5a
NEXT_PUBLIC_CORK_ADMIN_CAP_ID=0xe6cd1fbaf412f11b7f8917f28aef83aaf7a1d7e10649de6bcc2aa48f15ad359d
NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID=0x0d8b8be993d4ad87de11b6c059c778a44b356341e53595a1a0e21eec9354b6cd
NEXT_PUBLIC_BOTTLE_REGISTRY_ID=0xca28d84fca1602739f0e327b5a14cbe0c601b97b6ec2bad92684c7144090bd7c
NEXT_PUBLIC_BOTTLE_ADMIN_CAP_ID=0xd4df8247a68009ee730b405f38f62f49d7b07a5644b5458301cf64b288f3d8ab
NEXT_PUBLIC_ENOKI_API_KEY=enoki_public_eb523fdb1cee2b3efce6381a717bf634
```

### Required Private Variable (Add as Environment Variable - NOT Public!):

```
ADMIN_PRIVATE_KEY=<paste-your-base64-private-key-here>
```

### Optional Public Variables:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

### Optional Private Variables (Add as Environment Variable - NOT Public!):

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
ENOKI_PRIVATE_API_KEY=<your-enoki-private-key>
```

---

## ✅ Vercel Setup Checklist

- [ ] Add all 10 required `NEXT_PUBLIC_*` variables
- [ ] Add `ADMIN_PRIVATE_KEY` as **Environment Variable** (NOT Public!)
- [ ] Set variables for **Production** environment (at minimum)
- [ ] Optionally set for **Preview** and **Development**
- [ ] Verify `ADMIN_PRIVATE_KEY` is NOT marked as "Public"
- [ ] Redeploy after adding variables

---

## 🚨 Critical Notes

1. **ADMIN_PRIVATE_KEY is CRITICAL** - Without it, purchase → mint flow will fail
2. **ADMIN_PRIVATE_KEY must be PRIVATE** - Never mark it as "Public" in Vercel
3. **Deployer Address:** `0x951ffaa17abaf3202acf52125d711df9f71f318c0772a08daeaf6d1d978b6f2f`
4. **All contract IDs are from testnet deployments** - Don't change them unless redeploying

---

## 🧪 After Adding Variables

1. **Redeploy** your Vercel project
2. **Check build logs** for any missing variable errors
3. **Test the app** - Try the purchase flow to verify `ADMIN_PRIVATE_KEY` works
4. **Check `/api/test-env`** endpoint (if deployed) to verify all variables

---

## 📞 Need Help?

- Missing `ADMIN_PRIVATE_KEY`? See `docs/FIND_DEPLOYER_KEY.md`
- Contract IDs not working? Verify they match deployment docs
- Build failing? Check Vercel build logs for missing variables

---

**Last Updated:** November 22, 2025

