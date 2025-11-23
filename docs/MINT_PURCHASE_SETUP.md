# Mint Purchase API Setup

## ✅ What Was Created

1. **Backend API Route**: `/app/api/mint-purchase/route.ts`
   - Handles minting both Bottle NFT and CORK tokens on purchase
   - Uses deployer's private key to sign transactions (AdminCap is owned by deployer)

2. **Updated PurchaseModal**: `/app/cork/PurchaseModal.tsx`
   - Replaced mock purchase flow with real API calls
   - Calls `/api/mint-purchase` to mint NFT and tokens
   - Shows real transaction hashes and NFT IDs

---

## 🔧 Required Environment Variables

Add these to your `.env.local` file:

```env
# Admin Private Key (Base64-encoded Ed25519 keypair)
# This is the private key of the wallet that owns the AdminCap objects
# To get this, export the keypair from the wallet that deployed the contracts:
# sui keytool export --key-identity <key-identity> --key-file admin-key.json
# Then extract the private key and base64 encode it
ADMIN_PRIVATE_KEY=<base64-encoded-private-key>

# AdminCap IDs (from deployment)
NEXT_PUBLIC_CORK_ADMIN_CAP_ID=0xe6cd1fbaf412f11b7f8917f28aef83aaf7a1d7e10649de6bcc2aa48f15ad359d
NEXT_PUBLIC_BOTTLE_ADMIN_CAP_ID=0xd4df8247a68009ee730b405f38f62f49d7b07a5644b5458301cf64b288f3d8ab
```

---

## 📋 How to Get Admin Private Key

### Option 1: Export from Sui CLI

If you deployed the contracts using `sui client`, you can export the keypair:

```bash
# List your keys
sui keytool list

# Export the keypair (replace <key-identity> with your key identity)
sui keytool export --key-identity <key-identity> --key-file admin-key.json

# The file will contain the private key in base64 format
# Copy the private key value and add it to .env.local as ADMIN_PRIVATE_KEY
```

### Option 2: Generate New Keypair (For Testing)

If you need a new keypair for testing:

```bash
# Generate new Ed25519 keypair
sui client new-address ed25519

# Export it
sui keytool export --key-identity <new-key-identity> --key-file admin-key.json
```

**Important**: If you use a new keypair, you'll need to transfer the AdminCap objects to this new address, or redeploy the contracts with this keypair.

---

## 🧪 Testing the API

### Test Purchase Flow

1. **Start the dev server:**
   ```bash
   pnpm dev
   ```

2. **Connect your wallet** (Enoki Google login)

3. **Go to Shop** and click "Purchase" on a wine

4. **Confirm purchase** - this will:
   - Call `/api/mint-purchase`
   - Mint CORK tokens to your wallet
   - Mint Bottle NFT to your wallet
   - Show transaction hash and NFT ID

### Test API Directly (Optional)

You can test the API endpoint directly using curl:

```bash
curl -X POST http://localhost:3000/api/mint-purchase \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "0xYOUR_WALLET_ADDRESS",
    "wineName": "Test Wine",
    "vintage": 2023,
    "region": "Lisbon",
    "winery": "Test Winery",
    "wineType": "Red Wine",
    "bottleNumber": 1,
    "totalSupply": 500,
    "imageUrl": "https://example.com/image.jpg",
    "qrCode": "QR-TEST-123",
    "corkAmount": 50
  }'
```

---

## 🔒 Security Notes

1. **Admin Private Key**: 
   - ⚠️ **NEVER** commit this to Git
   - ⚠️ **NEVER** expose it to the frontend
   - ✅ Only use in backend API routes
   - ✅ Store in environment variables (not `NEXT_PUBLIC_`)

2. **AdminCap Objects**:
   - These are owned by the deployer's wallet
   - Only the owner can use them in transactions
   - For production, consider:
     - Using a dedicated admin wallet
     - Implementing access controls
     - Using a multisig wallet for security

3. **Rate Limiting** (Future):
   - Consider adding rate limiting to prevent abuse
   - Add authentication/authorization checks
   - Validate purchase requests before minting

---

## 📊 What Happens on Purchase

1. **User clicks "Confirm Purchase"** in PurchaseModal
2. **Frontend calls** `/api/mint-purchase` with wine data
3. **Backend creates transaction** that:
   - Mints CORK tokens to user's wallet
   - Mints Bottle NFT to user's wallet
4. **Backend signs transaction** using admin private key
5. **Backend executes transaction** on Sui network
6. **Backend returns** transaction digest and NFT ID
7. **Frontend displays** success message with links to explorer

---

## ✅ Next Steps

1. **Add AdminCap IDs to `.env.local`**
2. **Export and add admin private key to `.env.local`**
3. **Restart dev server** to load new environment variables
4. **Test purchase flow** end-to-end
5. **Verify NFTs and tokens** in Sui explorer

---

## 🐛 Troubleshooting

### Error: "Admin private key not configured"
- Make sure `ADMIN_PRIVATE_KEY` is set in `.env.local`
- Restart the dev server after adding it

### Error: "Contract IDs not configured"
- Make sure all `NEXT_PUBLIC_*_ADMIN_CAP_ID` are set
- Check that Package IDs and Registry/Treasury IDs are set

### Error: "Invalid private key"
- Make sure the private key is base64-encoded
- Verify it's the correct keypair (the one that owns AdminCap)

### Transaction fails with "Insufficient gas"
- Make sure the admin wallet has SUI tokens for gas
- Check the network (testnet vs mainnet)

---

**Ready to test!** Once you've added the environment variables, restart the server and try a purchase.

