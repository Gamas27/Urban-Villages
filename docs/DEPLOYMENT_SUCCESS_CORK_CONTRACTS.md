# ✅ Cork Token & Bottle NFT - Deployment Success!

Both contracts have been successfully deployed to Sui testnet!

---

## 📦 Bottle NFT Contract

**Transaction Digest:** `DpDsTP8AoggbQBN1NxKezNcJqHejcGeMZyLoBVeVwRsX`

### Important IDs:
- **Package ID:** `0x0d8b8be993d4ad87de11b6c059c778a44b356341e53595a1a0e21eec9354b6cd`
- **QRRegistry ID:** `0xca28d84fca1602739f0e327b5a14cbe0c601b97b6ec2bad92684c7144090bd7c` (Shared Object)
- **AdminCap ID:** `0xd4df8247a68009ee730b405f38f62f49d7b07a5644b5458301cf64b288f3d8ab`

### Explorer Links:
- **Package:** https://testnet.suivision.xyz/object/0x0d8b8be993d4ad87de11b6c059c778a44b356341e53595a1a0e21eec9354b6cd
- **QRRegistry:** https://testnet.suivision.xyz/object/0xca28d84fca1602739f0e327b5a14cbe0c601b97b6ec2bad92684c7144090bd7c
- **Transaction:** https://testnet.suivision.xyz/txblock/DpDsTP8AoggbQBN1NxKezNcJqHejcGeMZyLoBVeVwRsX

---

## 🪙 Cork Token Contract

**Transaction Digest:** `C276oJuESqTA2VsYU8DrMJJttA9buTp9KYgfwYVkvAgz`

### Important IDs:
- **Package ID:** `0x3c9b52cb0b208b9902a1a35d4106d8414c0f7f9b277f0e386cef64a4f3d85162`
- **Treasury ID:** `0x3ad4942fcefb009c4866877d5982fd5461db4145240cf5825b3fc2e67340ca5a` (Shared Object)
- **AdminCap ID:** `0xe6cd1fbaf412f11b7f8917f28aef83aaf7a1d7e10649de6bcc2aa48f15ad359d`

### Explorer Links:
- **Package:** https://testnet.suivision.xyz/object/0x3c9b52cb0b208b9902a1a35d4106d8414c0f7f9b277f0e386cef64a4f3d85162
- **Treasury:** https://testnet.suivision.xyz/object/0x3ad4942fcefb009c4866877d5982fd5461db4145240cf5825b3fc2e67340ca5a
- **Transaction:** https://testnet.suivision.xyz/txblock/C276oJuESqTA2VsYU8DrMJJttA9buTp9KYgfwYVkvAgz

---

## 🔧 Update Environment Variables

Add these to your `.env.local` file:

```env
# Bottle NFT Contract
NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID=0x0d8b8be993d4ad87de11b6c059c778a44b356341e53595a1a0e21eec9354b6cd
NEXT_PUBLIC_BOTTLE_REGISTRY_ID=0xca28d84fca1602739f0e327b5a14cbe0c601b97b6ec2bad92684c7144090bd7c

# Cork Token Contract
NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID=0x3c9b52cb0b208b9902a1a35d4106d8414c0f7f9b277f0e386cef64a4f3d85162
NEXT_PUBLIC_CORK_TREASURY_ID=0x3ad4942fcefb009c4866877d5982fd5461db4145240cf5825b3fc2e67340ca5a
```

---

## 📋 Next Steps

1. **Extract Cork Token IDs** from the first transaction output
2. **Update `.env.local`** with all Package IDs and Object IDs
3. **Restart Next.js dev server** to load new environment variables
4. **Test contract interactions** in the frontend

---

## 🧪 Test Commands

### Test Cork Token Mint
```bash
# Replace YOUR_ADDRESS with your address
sui client call \
  --package 0x3c9b52cb0b208b9902a1a35d4106d8414c0f7f9b277f0e386cef64a4f3d85162 \
  --module cork_token \
  --function mint \
  --args 0xe6cd1fbaf412f11b7f8917f28aef83aaf7a1d7e10649de6bcc2aa48f15ad359d \
    0x3ad4942fcefb009c4866877d5982fd5461db4145240cf5825b3fc2e67340ca5a \
    0x951ffaa17abaf3202acf52125d711df9f71f318c0772a08daeaf6d1d978b6f2f \
    1000000000 \
    "b"test_mint"" \
  --gas-budget 100000000
```

### Test Bottle NFT Mint
```bash
sui client call \
  --package 0x0d8b8be993d4ad87de11b6c059c778a44b356341e53595a1a0e21eec9354b6cd \
  --module bottle_nft \
  --function mint_bottle \
  --args 0xd4df8247a68009ee730b405f38f62f49d7b07a5644b5458301cf64b288f3d8ab \
    0xca28d84fca1602739f0e327b5a14cbe0c601b97b6ec2bad92684c7144090bd7c \
    "Sunset Orange 2023" \
    2023 \
    "Douro Valley, Portugal" \
    "Quinta do Terroir" \
    "Orange Wine" \
    1 \
    500 \
    "" \
    "https://example.com/image.jpg" \
    "QR123456" \
    0x951ffaa17abaf3202acf52125d711df9f71f318c0772a08daeaf6d1d978b6f2f \
    0x6 \
  --gas-budget 100000000
```

---

## ✅ Deployment Checklist

- [x] Bottle NFT contract deployed
- [x] Bottle NFT Package ID saved
- [x] Bottle NFT QRRegistry ID saved
- [x] Bottle NFT AdminCap ID saved
- [x] Cork Token contract deployed
- [x] Cork Token Package ID extracted
- [x] Cork Token Treasury ID extracted
- [x] Cork Token AdminCap ID extracted
- [ ] `.env.local` updated
- [ ] Frontend restarted
- [ ] Contracts tested

---

**🎉 Congratulations! Your contracts are live on Sui testnet!**

