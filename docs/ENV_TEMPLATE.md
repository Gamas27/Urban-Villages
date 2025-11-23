# Environment Variables Template

Copy this to `.env.local` and fill in the values:

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
# Get from: https://console.cloud.google.com/apis/credentials
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
ENOKI_PRIVATE_API_KEY=<your-enoki-private-key>

# ============================================
# BASE URL (OPTIONAL - for production)
# ============================================
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

