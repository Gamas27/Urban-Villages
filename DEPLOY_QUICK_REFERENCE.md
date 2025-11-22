# Namespace Contract Deployment - Quick Reference

## 🚀 Quick Start (TL;DR)

```bash
# 1. Navigate to contracts
cd "/Users/joaogameiro/Urban Villages/contracts"

# 2. Build
sui move build

# 3. Deploy
sui client publish --gas-budget 100000000

# 4. Save Package ID and Registry ID from output

# 5. Update .env.local
NEXT_PUBLIC_NAMESPACE_PACKAGE_ID=0x<YOUR_PACKAGE_ID>
NEXT_PUBLIC_NAMESPACE_REGISTRY_ID=0x<YOUR_REGISTRY_ID>
```

---

## 📋 Essential Commands

### Setup
```bash
# Install Sui CLI
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/MystenLabs/sui/releases/latest/download/sui-installer.sh | sh

# Switch to testnet
sui client switch --env testnet

# Get testnet SUI
sui client faucet

# Check balance
sui client gas
```

### Build & Deploy
```bash
# Build contract
sui move build

# Deploy to testnet
sui client publish --gas-budget 100000000

# View transaction
sui client tx <TRANSACTION_DIGEST>
```

### Verify
```bash
# Check package
sui client object <PACKAGE_ID>

# Check registry
sui client object <REGISTRY_ID>

# View on explorer
# https://suiexplorer.com/?network=testnet&object=<REGISTRY_ID>
```

---

## 🔑 What to Save After Deployment

From the deployment output, save these IDs:

1. **Package ID** → `NEXT_PUBLIC_NAMESPACE_PACKAGE_ID`
2. **Registry ID** → `NEXT_PUBLIC_NAMESPACE_REGISTRY_ID`
3. **AdminCap ID** → (optional, for future admin functions)

---

## 📝 Environment Variables Template

```env
# Network
NEXT_PUBLIC_SUI_NETWORK=testnet

# Namespace Contract
NEXT_PUBLIC_NAMESPACE_PACKAGE_ID=0x<YOUR_PACKAGE_ID>
NEXT_PUBLIC_NAMESPACE_REGISTRY_ID=0x<YOUR_REGISTRY_ID>

# Enoki (already configured)
NEXT_PUBLIC_ENOKI_API_KEY=enoki_public_eb523fdb1cee2b3efce6381a717bf634
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
```

---

## 🧪 Test Commands

### Test Read Function (is_available)
```bash
sui client call \
  --package <PACKAGE_ID> \
  --module namespace \
  --function is_available \
  --args <REGISTRY_ID> "test.lisbon" \
  --gas-budget 10000000
```

### Test Write Function (register)
```bash
sui client call \
  --package <PACKAGE_ID> \
  --module namespace \
  --function register \
  --args <REGISTRY_ID> "test.lisbon" "test" "lisbon" "" \
  --gas-budget 100000000
```

**Note:** For `register`, you also need to pass the Clock object (`0x6`):
```bash
sui client call \
  --package <PACKAGE_ID> \
  --module namespace \
  --function register \
  --args <REGISTRY_ID> "test.lisbon" "test" "lisbon" "" "0x6" \
  --gas-budget 100000000
```

---

## 🔍 Find Your IDs

After deployment, look for:

```
Created Objects:
 ┌── ID: 0x<REGISTRY_ID>          ← Save this!
 │   Type: cork_collective::namespace::Registry
 ├── ID: 0x<ADMIN_CAP_ID>         ← Optional
 │   Type: cork_collective::namespace::AdminCap
Published Objects:
 ┌── Package ID: 0x<PACKAGE_ID>  ← Save this!
```

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Insufficient gas | `sui client faucet` or increase `--gas-budget` |
| Build errors | Check `Move.toml` and module syntax |
| Object not found | Wait a few seconds, check transaction on explorer |
| Frontend can't connect | Verify `.env.local` IDs, restart dev server |

---

## 📚 Full Guide

For detailed step-by-step instructions, see:
**`DEPLOY_NAMESPACE_CONTRACT.md`**

---

## ✅ Deployment Checklist

- [ ] Sui CLI installed
- [ ] Testnet configured
- [ ] Testnet SUI obtained
- [ ] Contract builds successfully
- [ ] Contract deployed
- [ ] Package ID saved
- [ ] Registry ID saved
- [ ] `.env.local` updated
- [ ] Frontend restarted
- [ ] Tested registration

---

**Ready? Start with:** `cd contracts && sui move build`

