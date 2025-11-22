# Deploy Cork Token & Bottle NFT - Quick Reference

## 🚀 Quick Deploy Commands

### Prerequisites
```bash
# Ensure you're in the contracts directory
cd "/Users/joaogameiro/Urban Villages/contracts"

# Check Sui CLI is installed
sui --version

# Check active address
sui client active-address
```

---

## 📦 Deploy Cork Token

### 1. Build
```bash
cd "/Users/joaogameiro/Urban Villages/contracts"
sui move build
```

### 2. Publish
```bash
sui client publish --gas-budget 100000000
```

### 3. Save Package ID
After successful publish, you'll see output like:
```
Published Objects:
  ┌──
  │ PackageID: 0x1234...abcd
  │ ...
```

**Save this Package ID!** You'll need it for:
- Frontend integration
- Treasury Object ID (for minting)
- AdminCap Object ID (for admin functions)

### 4. Find Treasury Object ID
```bash
# Get your active address
ADDRESS=$(sui client active-address)

# Query for Treasury object
sui client objects $ADDRESS | grep -i treasury
```

Or use Sui Explorer:
- Go to: `https://testnet.suivision.xyz/address/YOUR_ADDRESS`
- Look for `Treasury` object type

### 5. Update Frontend
Add to `.env.local`:
```env
NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID=0x1234...abcd
NEXT_PUBLIC_CORK_TREASURY_ID=0x5678...efgh
```

---

## 🍷 Deploy Bottle NFT

### 1. Build
```bash
cd "/Users/joaogameiro/Urban Villages/contracts"
sui move build
```

### 2. Publish
```bash
sui client publish --gas-budget 100000000
```

### 3. Save Package ID
After successful publish, save the Package ID.

### 4. Find QRRegistry Object ID
```bash
# Get your active address
ADDRESS=$(sui client active-address)

# Query for QRRegistry object
sui client objects $ADDRESS | grep -i registry
```

Or use Sui Explorer:
- Go to: `https://testnet.suivision.xyz/address/YOUR_ADDRESS`
- Look for `QRRegistry` object type

### 5. Update Frontend
Add to `.env.local`:
```env
NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID=0x1234...abcd
NEXT_PUBLIC_BOTTLE_REGISTRY_ID=0x5678...efgh
```

---

## 🔧 Complete Environment Variables

After deploying both contracts, your `.env.local` should include:

```env
# Existing
NEXT_PUBLIC_ENOKI_API_KEY=your_enoki_public_key
ENOKI_PRIVATE_API_KEY=your_enoki_private_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_NAMESPACE_PACKAGE_ID=0x1465dc2888257bd5e03cab860558e96ba806999f7fca4515f8c8378460a27d7b
NEXT_PUBLIC_NAMESPACE_REGISTRY_ID=0xb042e36d39e1268bd5bf4cfc194098a593717e1e0349a8521abf3d689f83aa91

# New - Cork Token
NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID=0x...
NEXT_PUBLIC_CORK_TREASURY_ID=0x...

# New - Bottle NFT
NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID=0x...
NEXT_PUBLIC_BOTTLE_REGISTRY_ID=0x...
```

---

## 🧪 Test Deployment

### Test Cork Token Mint
```bash
# Get AdminCap ID first
ADDRESS=$(sui client active-address)
sui client objects $ADDRESS | grep -i AdminCap

# Mint 1000 CORK tokens (replace IDs)
sui client call \
  --package 0x<CORK_PACKAGE_ID> \
  --module cork_token \
  --function mint \
  --args 0x<AdminCap_ID> 0x<Treasury_ID> 0x<RECIPIENT_ADDRESS> 1000000000 "b"test_mint"" \
  --gas-budget 100000000
```

### Test Bottle NFT Mint
```bash
# Get AdminCap ID first
ADDRESS=$(sui client active-address)
sui client objects $ADDRESS | grep -i AdminCap

# Mint a bottle NFT (replace IDs and values)
sui client call \
  --package 0x<BOTTLE_PACKAGE_ID> \
  --module bottle_nft \
  --function mint_bottle \
  --args 0x<AdminCap_ID> 0x<QRRegistry_ID> \
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
    0x<RECIPIENT_ADDRESS> \
    0x6 \
  --gas-budget 100000000
```

---

## 🐛 Troubleshooting

### "Duplicate module found"
**Solution:** Clean build artifacts
```bash
cd "/Users/joaogameiro/Urban Villages/contracts"
rm -rf build
sui move build
```

### "Not enough gas"
**Solution:** Increase gas budget or fund your wallet
```bash
# Check balance
sui client gas

# Fund from faucet if needed
# https://discord.com/channels/916379725201563759/971488439931392130
```

### "Object not found"
**Solution:** Wait a few seconds after publish, then query again
```bash
# Wait 5 seconds
sleep 5

# Query again
sui client objects $(sui client active-address)
```

### "Module not found"
**Solution:** Ensure you're in the correct directory
```bash
pwd
# Should be: /Users/joaogameiro/Urban Villages/contracts
```

---

## 📝 Quick Checklist

Before deploying:
- [ ] Contracts compile (`sui move build`)
- [ ] Active address has SUI for gas
- [ ] You're on testnet (`sui client active-env`)

After deploying:
- [ ] Save Package IDs
- [ ] Find Treasury/Registry Object IDs
- [ ] Update `.env.local`
- [ ] Test mint functions
- [ ] Restart Next.js dev server

---

## 🔗 Useful Links

- **Sui Explorer**: https://testnet.suivision.xyz
- **Testnet Faucet**: https://discord.com/channels/916379725201563759/971488439931392130
- **Sui Docs**: https://docs.sui.io

---

## 💡 Pro Tips

1. **Deploy one at a time** - Easier to debug if something goes wrong
2. **Save all IDs immediately** - Write them down or copy to a file
3. **Test immediately** - Don't wait, test mint functions right after deploy
4. **Use Sui Explorer** - Visual interface makes finding objects easier
5. **Keep gas budget high** - 100M is safe for testnet

---

## 🎯 Next Steps After Deployment

1. Update frontend integration files
2. Replace mock purchase flow with real contract calls
3. Replace mock collection with on-chain queries
4. Test end-to-end purchase → mint flow

