# Cork Collective Smart Contracts

SUI Move smart contracts for the Cork Collective loyalty rewards program.

## 📦 Contracts Overview

### 1. **cork_token.move**
Fungible token for loyalty rewards.

**Key Functions:**
- `mint()` - Mint Cork tokens (admin only)
- `burn()` - Burn tokens for redemption
- `transfer_corks()` - Transfer between users
- `batch_mint()` - Bulk mint for campaigns

**Events:**
- `CorksMinted` - Tokens created
- `CorksBurned` - Tokens destroyed
- `CorksTransferred` - Tokens moved

### 2. **bottle_nft.move**
Non-fungible token for wine bottle provenance.

**Key Functions:**
- `mint_bottle()` - Create bottle NFT on purchase
- `transfer_bottle()` - Change ownership
- `verify_bottle()` - QR code verification
- `add_provenance_event()` - Track bottle history

**Events:**
- `BottleMinted` - New NFT created
- `BottleTransferred` - Ownership changed
- `BottleVerified` - QR scan verified
- `ProvenanceAdded` - Event logged

### 3. **tier_system.move**
Gamified loyalty tier management.

**Key Functions:**
- `create_profile()` - Initialize user
- `update_cork_balance()` - Sync balance
- `register_referral()` - Track referrals
- `record_bottle_purchase()` - Update stats

**Tiers:**
- 🍷 **Casual Sipper** (0-299 Corks) - 10% discount
- 🍇 **Natural Wine Advocate** (300-999 Corks) - 15% discount
- 👑 **Terroir Guardian** (1000+ Corks) - 20% discount

**Events:**
- `ProfileCreated` - User joined
- `TierUpgraded` - Tier level increased
- `ReferralRegistered` - Referral tracked
- `CorksUpdated` - Balance changed

### 4. **rewards.move**
Reward redemption and fulfillment.

**Key Functions:**
- `create_reward()` - Add new reward (admin)
- `redeem_reward()` - Burn Corks for reward
- `update_redemption_status()` - Track fulfillment
- `add_tracking_number()` - Add shipping info

**Reward Types:**
- 🎁 Products (merch, wine accessories)
- 🚜 Experiences (tours, tastings)
- 🎟️ Discounts (special pricing)

**Events:**
- `RewardCreated` - New reward added
- `RewardRedeemed` - User claimed reward
- `RedemptionStatusUpdated` - Fulfillment status

---

## 🚀 Deployment Instructions

### Prerequisites
```bash
# Install SUI CLI
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/MystenLabs/sui/releases/latest/download/sui-installer.sh | sh

# Verify installation
sui --version

# Create new wallet (or use existing)
sui client new-address ed25519
```

### Setup Environment
```bash
# Switch to testnet
sui client switch --env testnet

# Get testnet SUI tokens
sui client faucet

# Check balance
sui client gas
```

### Build Contracts
```bash
cd contracts

# Build all contracts
sui move build

# Run tests (if added)
sui move test
```

### Deploy to Testnet
```bash
# Deploy the package
sui client publish --gas-budget 100000000

# Save the output - you'll need:
# - Package ID
# - Cork Token Treasury object ID
# - Admin Cap object ID
# - Registry object IDs
```

### Deployment Output Example
```
Transaction Digest: <TXID>
╭───────────────────────────────────────────────────────────────────╮
│ Transaction Effects                                                │
├───────────────────────────────────────────────────────────────────┤
│ Status: Success                                                    │
│ Created Objects:                                                   │
│  ┌── ID: 0xabc123...                                              │
│  │   Type: cork_collective::cork_token::Treasury                   │
│  ├── ID: 0xdef456...                                              │
│  │   Type: cork_collective::cork_token::AdminCap                  │
│  ├── ID: 0xghi789...                                              │
│  │   Type: cork_collective::bottle_nft::QRRegistry                │
│  └── ...                                                           │
╰───────────────────────────────────────────────────────────────────╯

Package ID: 0x<PACKAGE_ID>
```

---

## 🔗 Frontend Integration

### Install SUI SDK
```bash
npm install @mysten/sui.js
```

### Setup Client
```typescript
// lib/sui-client.ts
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';

export const suiClient = new SuiClient({ 
  url: getFullnodeUrl('testnet') 
});

// Update these after deployment
export const PACKAGE_ID = '0xYOUR_PACKAGE_ID';
export const CORK_TREASURY_ID = '0xYOUR_TREASURY_ID';
export const QR_REGISTRY_ID = '0xYOUR_REGISTRY_ID';
export const ADMIN_CAP_ID = '0xYOUR_ADMIN_CAP_ID';
```

### Example: Mint Bottle NFT
```typescript
async function mintBottleNFT(
  wallet: WalletAccount,
  bottleData: BottleData
) {
  const tx = new TransactionBlock();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::bottle_nft::mint_bottle`,
    arguments: [
      tx.pure(ADMIN_CAP_ID),
      tx.pure(QR_REGISTRY_ID),
      tx.pure(bottleData.name),
      tx.pure(bottleData.vintage),
      tx.pure(bottleData.region),
      tx.pure(bottleData.winery),
      tx.pure(bottleData.wineType),
      tx.pure(bottleData.bottleNumber),
      tx.pure(bottleData.totalSupply),
      tx.pure(bottleData.customText),
      tx.pure(bottleData.imageUrl),
      tx.pure(bottleData.qrCode),
      tx.pure(wallet.address),
      tx.object('0x6'), // Clock object
    ]
  });
  
  const result = await wallet.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: {
      showEffects: true,
      showObjectChanges: true,
    }
  });
  
  return result;
}
```

### Example: Mint Cork Tokens
```typescript
async function mintCorks(
  recipientAddress: string,
  amount: number,
  reason: string
) {
  const tx = new TransactionBlock();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::cork_token::mint`,
    arguments: [
      tx.pure(ADMIN_CAP_ID),
      tx.pure(CORK_TREASURY_ID),
      tx.pure(recipientAddress),
      tx.pure(amount * 1_000_000), // Convert to micro-units
      tx.pure(reason),
    ]
  });
  
  const result = await wallet.signAndExecuteTransactionBlock({
    transactionBlock: tx
  });
  
  return result;
}
```

### Example: Redeem Reward
```typescript
async function redeemReward(
  wallet: WalletAccount,
  rewardId: string,
  userCorkBalance: number
) {
  const tx = new TransactionBlock();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::rewards::redeem_reward`,
    arguments: [
      tx.pure(REWARDS_CATALOG_ID),
      tx.object(rewardId),
      tx.pure(userCorkBalance),
      tx.object('0x6'), // Clock
    ]
  });
  
  const result = await wallet.signAndExecuteTransactionBlock({
    transactionBlock: tx
  });
  
  return result;
}
```

---

## 🧪 Testing

### Manual Testing on Testnet

#### 1. Create User Profile
```bash
sui client call \
  --package $PACKAGE_ID \
  --module tier_system \
  --function create_profile \
  --args $PROFILE_REGISTRY "CORK-TEST" "[]" $CLOCK \
  --gas-budget 10000000
```

#### 2. Mint Bottle NFT
```bash
sui client call \
  --package $PACKAGE_ID \
  --module bottle_nft \
  --function mint_bottle \
  --args $ADMIN_CAP $QR_REGISTRY "Sunset Orange 2023" 2023 "Douro Valley" "Cork Collective" "Orange Wine" 127 500 '["To the winner"]' "https://..." "QR001" $YOUR_ADDRESS $CLOCK \
  --gas-budget 10000000
```

#### 3. Mint Cork Tokens
```bash
sui client call \
  --package $PACKAGE_ID \
  --module cork_token \
  --function mint \
  --args $ADMIN_CAP $TREASURY $YOUR_ADDRESS 50000000 "bottle_purchase" \
  --gas-budget 10000000
```

#### 4. Query Owned Objects
```bash
# View your NFTs
sui client objects $YOUR_ADDRESS

# View specific bottle
sui client object $BOTTLE_NFT_ID

# View Cork balance
sui client balance $YOUR_ADDRESS
```

---

## 📊 On-Chain Data Queries

### Get User's Bottles
```typescript
async function getUserBottles(userAddress: string) {
  const objects = await suiClient.getOwnedObjects({
    owner: userAddress,
    filter: {
      StructType: `${PACKAGE_ID}::bottle_nft::BottleNFT`
    },
    options: {
      showContent: true,
      showType: true
    }
  });
  
  return objects.data;
}
```

### Get Cork Balance
```typescript
async function getCorkBalance(userAddress: string) {
  const balance = await suiClient.getBalance({
    owner: userAddress,
    coinType: `${PACKAGE_ID}::cork_token::CORK_TOKEN`
  });
  
  return parseInt(balance.totalBalance) / 1_000_000; // Convert from micro-units
}
```

### Verify Bottle by QR
```typescript
async function verifyBottleQR(qrCode: string) {
  const result = await suiClient.devInspectTransactionBlock({
    transactionBlock: {
      sender: '0x0',
      kind: {
        moveCall: {
          package: PACKAGE_ID,
          module: 'bottle_nft',
          function: 'check_ownership',
          arguments: [QR_REGISTRY_ID, qrCode, userAddress]
        }
      }
    }
  });
  
  return result;
}
```

---

## 🔐 Security Considerations

### Admin Capabilities
- `AdminCap` objects control privileged operations
- Transfer to secure multi-sig wallet in production
- Consider time-locks for critical operations

### Token Economics
- Monitor mint/burn ratios
- Implement rate limiting for minting
- Add emergency pause functionality

### NFT Integrity
- QR codes must be unique and cryptographically secure
- Consider adding signature verification
- Implement transfer restrictions if needed

### Best Practices
- Always validate user permissions
- Emit events for all state changes
- Use proper error codes
- Test on testnet extensively before mainnet

---

## 📝 Configuration File

Create `/contracts/config.json` after deployment:

```json
{
  "network": "testnet",
  "packageId": "0xYOUR_PACKAGE_ID",
  "objects": {
    "adminCap": "0xADMIN_CAP_ID",
    "corkTreasury": "0xTREASURY_ID",
    "qrRegistry": "0xQR_REGISTRY_ID",
    "profileRegistry": "0xPROFILE_REGISTRY_ID",
    "rewardsCatalog": "0xREWARDS_CATALOG_ID"
  },
  "tokens": {
    "corkToken": "cork_collective::cork_token::CORK_TOKEN"
  }
}
```

---

## 🎯 Hackathon Demo Checklist

- [ ] Deploy all 4 contracts to testnet
- [ ] Save all object IDs to config
- [ ] Mint test bottles (3-5 samples)
- [ ] Create test rewards (8-10 items)
- [ ] Test complete purchase flow
- [ ] Test QR verification
- [ ] Test reward redemption
- [ ] Test tier progression
- [ ] Prepare SUI Explorer links
- [ ] Fund demo wallets with gas

---

## 🐛 Troubleshooting

### Build Errors
```bash
# Clean build
sui move clean

# Update dependencies
sui move build --fetch-deps-only

# Check syntax
sui move build --lint
```

### Gas Issues
```bash
# Request more testnet SUI
sui client faucet

# Check gas objects
sui client gas

# Merge gas objects if fragmented
sui client merge-coin --primary-coin <COIN_ID> --coin-to-merge <COIN_ID>
```

### Object Not Found
- Ensure you're on correct network (testnet vs devnet)
- Verify object ID is correct
- Check object hasn't been consumed by transaction

---

## 📚 Resources

- [SUI Move Documentation](https://docs.sui.io/build/move)
- [SUI TypeScript SDK](https://sdk.mystenlabs.com/typescript)
- [SUI Explorer](https://suiexplorer.com/?network=testnet)
- [SUI Faucet](https://faucet.testnet.sui.io/)

---

## 🚀 Next Steps

1. **Deploy Contracts** → Follow deployment instructions
2. **Test Locally** → Use SUI CLI to verify functions
3. **Integrate Frontend** → Update App.tsx with contract calls
4. **Prepare Demo** → Test complete user journey
5. **Win Hackathon** → Show working blockchain integration! 🏆

---

Built with ❤️ for the SUI Move Hackathon
