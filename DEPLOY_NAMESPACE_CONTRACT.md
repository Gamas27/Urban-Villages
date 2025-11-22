# Deploy Namespace Contract - Step-by-Step Guide

This guide will walk you through deploying the `namespace.move` contract to Sui testnet.

---

## 📋 Prerequisites

### 1. Install Sui CLI

**macOS/Linux:**
```bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/MystenLabs/sui/releases/latest/download/sui-installer.sh | sh
```

**Windows:**
Download from: https://github.com/MystenLabs/sui/releases

**Verify Installation:**
```bash
sui --version
# Should show: sui 1.x.x
```

### 2. Set Up Testnet Environment

```bash
# Switch to testnet
sui client switch --env testnet

# If you don't have a wallet yet, create one
sui client new-address ed25519

# Set as active address (replace with your address)
sui client active-address
```

### 3. Get Testnet SUI Tokens

You need SUI tokens to pay for gas fees (deployment costs).

**Option 1: Using CLI Faucet**
```bash
sui client faucet
```

**Option 2: Using Web Faucet**
1. Visit: https://faucet.sui.io
2. Enter your wallet address
3. Click "Request SUI"

**Check Your Balance:**
```bash
sui client gas
# Should show at least 0.1 SUI (100,000,000 MIST)
```

---

## 🔧 Pre-Deployment Setup

### 1. Navigate to Contracts Directory

```bash
cd "/Users/joaogameiro/Urban Villages/contracts"
```

### 2. Verify Move.toml Configuration

Check that `contracts/Move.toml` has the correct module address:

```toml
[package]
name = "cork_collective"
version = "1.0.0"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet", override = true }

[addresses]
cork_collective = "0x0"
```

**Important:** The address `cork_collective = "0x0"` is correct - it will be replaced with your package ID during deployment.

### 3. Build the Contract

```bash
# Build to check for errors
sui move build
```

**Expected Output:**
```
UPDATING GIT DEPENDENCY https://github.com/MystenLabs/sui.git
INCLUDING DEPENDENCY Sui
BUILDING cork_collective
```

If you see errors, fix them before proceeding.

---

## 🚀 Deployment Steps

### Step 1: Deploy the Contract

```bash
# Make sure you're in the contracts directory
cd "/Users/joaogameiro/Urban Villages/contracts"

# Deploy with sufficient gas budget
sui client publish --gas-budget 100000000
```

**What This Does:**
- `publish`: Deploys your contract to testnet
- `--gas-budget 100000000`: Sets max gas (100M MIST = 0.1 SUI)

**Expected Output:**
```
Transaction Digest: <LONG_HEX_STRING>
╭───────────────────────────────────────────────────────────────────╮
│ Transaction Effects                                                │
├───────────────────────────────────────────────────────────────────┤
│ Status: Success                                                    │
│ Created Objects:                                                   │
│  ┌── ID: 0x<REGISTRY_ID>                                          │
│  │   Type: cork_collective::namespace::Registry                   │
│  ├── ID: 0x<ADMIN_CAP_ID>                                         │
│  │   Type: cork_collective::namespace::AdminCap                  │
│ Published Objects:                                                 │
│  ┌── Package ID: 0x<PACKAGE_ID>                                   │
│  │   Version: 1                                                    │
│  │   Digest: <DIGEST>                                             │
│  │   Modules: namespace                                            │
```

### Step 2: Extract Important IDs

From the deployment output, you need to save:

1. **Package ID** - The main contract identifier
   - Look for: `Package ID: 0x...`
   - Example: `0xcea82fb908b9d9566b1c7977491e76901ed167978a1ecd6053a994881c0ea9b5`

2. **Registry ID** - The shared Registry object
   - Look for: `Type: cork_collective::namespace::Registry`
   - Example: `0xabc123def456...`

3. **AdminCap ID** - The admin capability (optional, for future admin functions)
   - Look for: `Type: cork_collective::namespace::AdminCap`
   - Example: `0xdef456abc123...`

**Save these in a text file for now!**

### Step 3: Verify Deployment

```bash
# Check your package
sui client object <PACKAGE_ID>

# Check the Registry object
sui client object <REGISTRY_ID>
```

You should see the objects with their types and owners.

---

## 🔗 Update Frontend Configuration

### Step 1: Update Environment Variables

Edit `.env.local` (create it if it doesn't exist):

```bash
cd "/Users/joaogameiro/Urban Villages"
```

Add or update these variables:

```env
# Sui Network
NEXT_PUBLIC_SUI_NETWORK=testnet

# Namespace Contract (from deployment output)
NEXT_PUBLIC_NAMESPACE_PACKAGE_ID=0x<YOUR_PACKAGE_ID>
NEXT_PUBLIC_NAMESPACE_REGISTRY_ID=0x<YOUR_REGISTRY_ID>

# Enoki (already configured)
NEXT_PUBLIC_ENOKI_API_KEY=enoki_public_eb523fdb1cee2b3efce6381a717bf634
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
```

**Example:**
```env
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_NAMESPACE_PACKAGE_ID=0xcea82fb908b9d9566b1c7977491e76901ed167978a1ecd6053a994881c0ea9b5
NEXT_PUBLIC_NAMESPACE_REGISTRY_ID=0xabc123def4567890abcdef1234567890abcdef1234567890abcdef1234567890
```

### Step 2: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
pnpm dev
```

The frontend will now use the deployed contract!

---

## ✅ Test the Deployment

### Option 1: Test via Frontend

1. Start the app: `pnpm dev`
2. Navigate to the onboarding flow
3. Try registering a namespace (e.g., `test.lisbon`)
4. Check the browser console for transaction details

### Option 2: Test via CLI

```bash
# Call the is_available function (read-only)
sui client call \
  --package <PACKAGE_ID> \
  --module namespace \
  --function is_available \
  --args <REGISTRY_ID> "test.lisbon" \
  --gas-budget 10000000

# Register a namespace (requires wallet approval)
sui client call \
  --package <PACKAGE_ID> \
  --module namespace \
  --function register \
  --args <REGISTRY_ID> "test.lisbon" "test" "lisbon" "" \
  --gas-budget 100000000
```

---

## 🔍 Verify on Sui Explorer

1. Visit: https://suiexplorer.com/?network=testnet
2. Search for your Package ID or Registry ID
3. You should see:
   - Package details
   - Registry object
   - Transaction history

---

## 📝 Troubleshooting

### Error: "Insufficient gas"

**Solution:**
```bash
# Get more testnet SUI
sui client faucet

# Or increase gas budget
sui client publish --gas-budget 200000000
```

### Error: "Module not found" or "Address not found"

**Solution:**
- Make sure `Move.toml` has `cork_collective = "0x0"` in `[addresses]`
- Rebuild: `sui move build`
- Try deploying again

### Error: "Object not found" after deployment

**Solution:**
- Wait a few seconds for the transaction to finalize
- Check the transaction digest on Sui Explorer
- Verify you copied the correct IDs

### Frontend can't find contract

**Solution:**
- Verify `.env.local` has correct IDs (no extra spaces)
- Restart the dev server: `pnpm dev`
- Check browser console for errors
- Verify network is set to `testnet`

---

## 🎯 Next Steps

After successful deployment:

1. ✅ **Test namespace registration** via frontend
2. ✅ **Verify namespace appears** in Registry
3. ✅ **Test namespace transfer** functionality
4. ✅ **Test profile picture updates**

---

## 📚 Additional Resources

- **Sui Documentation**: https://docs.sui.io/build/move
- **Sui Explorer**: https://suiexplorer.com
- **Testnet Faucet**: https://faucet.sui.io
- **Sui CLI Reference**: https://docs.sui.io/references/cli

---

## 🚨 Important Notes

1. **Testnet Only**: This guide deploys to testnet. For mainnet, change `--env testnet` to `--env mainnet` and use real SUI.

2. **Package ID is Permanent**: Once deployed, the Package ID never changes. You can upgrade by publishing a new version.

3. **Registry ID**: The Registry object is created once during `init()`. Save this ID - you'll need it for all frontend calls.

4. **Gas Costs**: Deployment typically costs 0.05-0.1 SUI on testnet. Keep some SUI for future transactions.

5. **Backup Your IDs**: Save Package ID and Registry ID in a safe place. You'll need them for production deployment too.

---

## ✅ Deployment Checklist

- [ ] Sui CLI installed and verified
- [ ] Testnet environment configured
- [ ] Testnet SUI tokens obtained (at least 0.1 SUI)
- [ ] Contract builds without errors (`sui move build`)
- [ ] Contract deployed successfully (`sui client publish`)
- [ ] Package ID saved
- [ ] Registry ID saved
- [ ] AdminCap ID saved (optional)
- [ ] `.env.local` updated with IDs
- [ ] Frontend restarted
- [ ] Tested namespace registration
- [ ] Verified on Sui Explorer

---

**Ready to deploy? Start with Step 1!** 🚀

