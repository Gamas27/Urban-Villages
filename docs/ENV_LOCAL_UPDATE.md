# Update .env.local with Contract IDs

Add these lines to your `.env.local` file:

```env
# Bottle NFT Contract
NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID=0x0d8b8be993d4ad87de11b6c059c778a44b356341e53595a1a0e21eec9354b6cd
NEXT_PUBLIC_BOTTLE_REGISTRY_ID=0xca28d84fca1602739f0e327b5a14cbe0c601b97b6ec2bad92684c7144090bd7c

# Cork Token Contract
NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID=0x3c9b52cb0b208b9902a1a35d4106d8414c0f7f9b277f0e386cef64a4f3d85162
NEXT_PUBLIC_CORK_TREASURY_ID=0x3ad4942fcefb009c4866877d5982fd5461db4145240cf5825b3fc2e67340ca5a
```

## Complete .env.local Template

Your full `.env.local` should look like this:

```env
# Enoki
NEXT_PUBLIC_ENOKI_API_KEY=enoki_public_eb523fdb1cee2b3efce6381a717bf634
ENOKI_PRIVATE_API_KEY=enoki_private_171c5584dce22874b2b9f27715e9caf3
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1097275538443-5jnmi72g89h8hf4fr5v9ucehshq8toaa.apps.googleusercontent.com

# Network
NEXT_PUBLIC_SUI_NETWORK=testnet

# Namespace Contract
NEXT_PUBLIC_NAMESPACE_PACKAGE_ID=0x1465dc2888257bd5e03cab860558e96ba806999f7fca4515f8c8378460a27d7b
NEXT_PUBLIC_NAMESPACE_REGISTRY_ID=0xb042e36d39e1268bd5bf4cfc194098a593717e1e0349a8521abf3d689f83aa91

# Bottle NFT Contract
NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID=0x0d8b8be993d4ad87de11b6c059c778a44b356341e53595a1a0e21eec9354b6cd
NEXT_PUBLIC_BOTTLE_REGISTRY_ID=0xca28d84fca1602739f0e327b5a14cbe0c601b97b6ec2bad92684c7144090bd7c

# Cork Token Contract
NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID=0x3c9b52cb0b208b9902a1a35d4106d8414c0f7f9b277f0e386cef64a4f3d85162
NEXT_PUBLIC_CORK_TREASURY_ID=0x3ad4942fcefb009c4866877d5982fd5461db4145240cf5825b3fc2e67340ca5a
```

## After Updating

1. **Save the file**
2. **Restart your Next.js dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   pnpm dev
   ```
3. **Test the contracts** in your frontend!

