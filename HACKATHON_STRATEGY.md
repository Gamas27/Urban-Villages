# Cork Collective - SUI Move Hackathon Strategy

## 🎯 Project Overview
Cork Collective is a blockchain-powered loyalty rewards program for natural wine, featuring NFT bottle provenance verification and fungible token rewards on SUI blockchain.

---

## 📋 Smart Contracts to Deploy

### 1. **Cork Token Contract** (Fungible Token)
**File**: `cork_token.move`

**Purpose**: ERC-20 style fungible token for loyalty rewards

**Key Functions**:
```move
module cork_collective::cork_token {
    // Initialize Cork token
    public entry fun init(ctx: &mut TxContext)
    
    // Mint Corks to user wallet
    public entry fun mint(
        recipient: address,
        amount: u64,
        ctx: &mut TxContext
    )
    
    // Burn Corks for redemption
    public entry fun burn(
        amount: u64,
        ctx: &mut TxContext
    )
    
    // Transfer Corks between users
    public entry fun transfer(
        recipient: address,
        amount: u64,
        ctx: &mut TxContext
    )
    
    // Get balance
    public fun balance_of(owner: address): u64
}
```

**Integration Points**:
- Purchase bottle → Mint 50 Corks
- Referral → Mint 100 Corks
- Event attendance → Mint 50-150 Corks
- Redeem reward → Burn Corks
- Display balance in header

---

### 2. **Bottle NFT Contract** (Non-Fungible Token)
**File**: `bottle_nft.move`

**Purpose**: Unique NFT for each bottle with provenance data

**Key Functions**:
```move
module cork_collective::bottle_nft {
    struct BottleNFT has key, store {
        id: UID,
        name: String,
        vintage: u64,
        region: String,
        winery: String,
        bottle_number: u64,
        total_supply: u64,
        purchase_date: u64,
        custom_text: Option<String>,
        image_url: String,
        qr_code: String,
        provenance_hash: vector<u8>,
        owner: address,
        is_verified: bool
    }
    
    // Mint new bottle NFT on purchase
    public entry fun mint_bottle(
        name: vector<u8>,
        vintage: u64,
        region: vector<u8>,
        bottle_number: u64,
        custom_text: Option<vector<u8>>,
        image_url: vector<u8>,
        ctx: &mut TxContext
    ): BottleNFT
    
    // Transfer ownership (secondary market)
    public entry fun transfer_bottle(
        bottle: &mut BottleNFT,
        recipient: address,
        ctx: &mut TxContext
    )
    
    // Verify authenticity via QR scan
    public fun verify_bottle(
        bottle: &BottleNFT,
        qr_code: vector<u8>
    ): bool
    
    // Get bottle metadata
    public fun get_metadata(bottle: &BottleNFT): (String, u64, String, u64)
    
    // Update provenance (add shipping, storage events)
    public entry fun add_provenance_event(
        bottle: &mut BottleNFT,
        event_type: vector<u8>,
        timestamp: u64,
        ctx: &mut TxContext
    )
}
```

**Integration Points**:
- Purchase completion → Mint NFT
- QR Scanner → Verify authenticity
- Collection view → Display owned NFTs
- Provenance viewer → Show bottle history

---

### 3. **Tier Management Contract**
**File**: `tier_system.move`

**Purpose**: Manage user tier progression and benefits

**Key Functions**:
```move
module cork_collective::tier_system {
    struct UserProfile has key {
        id: UID,
        owner: address,
        cork_balance: u64,
        tier: u8, // 0=Sipper, 1=Advocate, 2=Guardian
        bottles_purchased: u64,
        join_date: u64,
        referral_code: String
    }
    
    // Create user profile
    public entry fun create_profile(
        referral_code: Option<vector<u8>>,
        ctx: &mut TxContext
    )
    
    // Update tier based on Cork balance
    public fun update_tier(profile: &mut UserProfile)
    
    // Get tier benefits
    public fun get_benefits(tier: u8): vector<String>
    
    // Calculate discount percentage
    public fun get_discount(tier: u8): u64
}
```

**Integration Points**:
- Onboarding → Create profile
- Dashboard → Display current tier
- Purchase → Apply tier discount
- Activity → Track progression

---

### 4. **Rewards Redemption Contract**
**File**: `rewards.move`

**Purpose**: Handle Cork burning and reward fulfillment

**Key Functions**:
```move
module cork_collective::rewards {
    struct Reward has key, store {
        id: UID,
        name: String,
        description: String,
        cork_cost: u64,
        available: bool,
        image_url: String
    }
    
    struct RedemptionRecord has key {
        id: UID,
        user: address,
        reward_id: ID,
        timestamp: u64,
        status: u8 // 0=pending, 1=fulfilled, 2=cancelled
    }
    
    // Redeem reward
    public entry fun redeem_reward(
        reward: &Reward,
        cork_token: &mut CorkToken,
        ctx: &mut TxContext
    )
    
    // Create new reward (admin only)
    public entry fun create_reward(
        name: vector<u8>,
        cork_cost: u64,
        ctx: &mut TxContext
    )
    
    // Get redemption history
    public fun get_user_redemptions(user: address): vector<RedemptionRecord>
}
```

**Integration Points**:
- Rewards tab → Display available rewards
- Redeem button → Burn Corks + create record
- Activity → Show redemption history

---

### 5. **Gasless Transaction Relayer** (Optional - Advanced)
**File**: `relayer.move`

**Purpose**: Enable gasless transactions for non-crypto users

**Key Functions**:
```move
module cork_collective::relayer {
    // Sponsored transaction for email/Google users
    public entry fun sponsored_mint(
        recipient: address,
        amount: u64,
        signature: vector<u8>,
        ctx: &mut TxContext
    )
    
    // Batch operations for efficiency
    public entry fun batch_operations(
        operations: vector<Operation>,
        ctx: &mut TxContext
    )
}
```

---

## 🏗️ Contract Deployment Order

1. **Cork Token** - Deploy first (foundation)
2. **Tier System** - Deploy second (depends on Cork balance)
3. **Bottle NFT** - Deploy third (mints Cork tokens on purchase)
4. **Rewards** - Deploy fourth (burns Cork tokens)
5. **Relayer** - Deploy last (wraps other contracts)

---

## 🔗 Frontend Integration

### SDK Setup
```typescript
// /lib/sui-client.ts
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';

export const suiClient = new SuiClient({ 
  url: getFullnodeUrl('testnet') 
});

export const PACKAGE_ID = '0x...'; // Deployed package address
export const CORK_TOKEN_TYPE = `${PACKAGE_ID}::cork_token::Cork`;
```

### Integration Points

**1. Purchase Flow**
```typescript
async function completePurchase(bottleId: number, customText: string) {
  const tx = new TransactionBlock();
  
  // 1. Mint Bottle NFT
  const [nft] = tx.moveCall({
    target: `${PACKAGE_ID}::bottle_nft::mint_bottle`,
    arguments: [
      tx.pure(bottleData.name),
      tx.pure(bottleData.vintage),
      tx.pure(customText || "")
    ]
  });
  
  // 2. Mint Cork tokens (50 per bottle)
  tx.moveCall({
    target: `${PACKAGE_ID}::cork_token::mint`,
    arguments: [
      tx.pure(userAddress),
      tx.pure(50)
    ]
  });
  
  const result = await wallet.signAndExecuteTransactionBlock({ tx });
  return result;
}
```

**2. QR Scanner Verification**
```typescript
async function verifyBottle(qrCode: string) {
  const result = await suiClient.devInspectTransactionBlock({
    transactionBlock: {
      moveCall: {
        target: `${PACKAGE_ID}::bottle_nft::verify_bottle`,
        arguments: [qrCode]
      }
    }
  });
  
  return result.verified;
}
```

**3. Reward Redemption**
```typescript
async function redeemReward(rewardId: string, corkCost: number) {
  const tx = new TransactionBlock();
  
  // Burn Corks
  tx.moveCall({
    target: `${PACKAGE_ID}::cork_token::burn`,
    arguments: [tx.pure(corkCost)]
  });
  
  // Create redemption record
  tx.moveCall({
    target: `${PACKAGE_ID}::rewards::redeem_reward`,
    arguments: [tx.pure(rewardId)]
  });
  
  await wallet.signAndExecuteTransactionBlock({ tx });
}
```

---

## 🎭 Hackathon Deliverable Strategy

### **Core Demo Flow (5 minutes)**

#### **Act 1: The Problem** (30 seconds)
> "Natural wine lacks authenticity verification. Customers can't prove provenance. Loyalty programs use centralized points that have no real value."

#### **Act 2: The Solution** (30 seconds)
> "Cork Collective uses SUI blockchain to mint NFTs for every bottle, creating immutable provenance records. Cork tokens are real digital assets customers truly own."

#### **Act 3: The Demo** (4 minutes)

**Scene 1: Onboarding (30s)**
- Show modal with Email/Google/Wallet options
- Emphasize: "Non-crypto users get embedded wallets - no friction"
- Click "Continue with Email"
- ✅ Wallet created behind the scenes on SUI testnet

**Scene 2: Purchase Journey (1 min)**
- Browse shop → Select "Sunset Orange 2023"
- Show personalization flow with custom message
- Click "Complete Purchase"
- ✅ Show MintingConfirmation modal with:
  - NFT being created on SUI
  - 50 Corks minted
  - Transaction hash visible

**Scene 3: QR Verification - THE HERO FEATURE (1.5 min)**
- Navigate to Collection
- Click bottle → "View Provenance"
- QR Scanner opens with three states demo:
  1. **Green border**: "This is YOUR bottle" (owned NFT)
  2. **Blue border**: "Claimable bottle" (new purchase)
  3. **Yellow border**: "Already owned" (someone else's NFT)
- Show provenance data:
  - Winery details
  - Bottling date
  - Shipping history
  - Current owner
  - NFT ID on SUI explorer

**Scene 4: Rewards & Gamification (45s)**
- Show Cork balance in header: "450 Corks"
- Navigate to Rewards
- Show "How to Earn" methods
- Scroll to redemption options
- Attempt to redeem "Cork Tote Bag" (80 Corks)
- ✅ Transaction burns tokens, creates redemption record

**Scene 5: Activity Feed** (15s)
- Show blockchain transaction history
- Highlight: "Every action is on-chain and verifiable"
- Point out transaction hashes linking to SUI explorer

---

### **Technical Highlights to Emphasize**

1. **Gasless Transactions**
   - "Email users don't pay gas fees - we sponsor transactions"
   - "This is crucial for mainstream adoption"

2. **SUI Move Advantages**
   - "Object-centric model perfect for NFTs"
   - "Parallel execution = fast confirmations"
   - "Lower fees than Ethereum"

3. **Real Web3 Integration**
   - Show actual transaction hashes
   - Link to SUI explorer
   - Demonstrate wallet connection options

4. **UX Excellence**
   - "Zero learning curve for non-crypto users"
   - "Premium mobile-first design"
   - "Instant QR verification"

---

## 📦 Minimum Viable Demo (What to Have Working)

### ✅ **MUST HAVE** (Core Judging Criteria)

1. **Smart Contracts Deployed on SUI Testnet**
   - Cork Token contract (mint/burn working)
   - Bottle NFT contract (mint working)
   - At least basic functionality callable from frontend

2. **QR Scanner Provenance Verification**
   - Three states working (yours/claimable/owned)
   - Mock data showing NFT metadata
   - Visual demonstration of ownership verification

3. **Purchase → Mint Flow**
   - Complete bottle purchase
   - Show minting confirmation
   - Demonstrate NFT appears in collection
   - Show Corks credited to balance

4. **Transaction History**
   - Activity feed showing blockchain events
   - Link to SUI explorer for verification

### 🎁 **NICE TO HAVE** (Bonus Points)

1. **Gasless Transactions**
   - Meta-transaction relayer working
   - Sponsored gas for email users

2. **Reward Redemption**
   - Actually burn tokens on redemption
   - Create on-chain redemption record

3. **Tier System**
   - On-chain tier calculation
   - Discount logic in smart contract

4. **Secondary Market**
   - NFT transfer between wallets
   - Ownership history tracking

---

## 🎪 Presentation Script

### **Slide 1: Hook** (30s)
> "Show of hands - how many of you have bought wine and wondered if it's authentic? How many loyalty programs have you joined where points expired or had zero real value?"

### **Slide 2: Problem** (30s)
- Wine fraud is a $3B/year problem
- 70% of loyalty points go unredeemed
- No proof of authenticity or provenance
- Centralized points have no ownership

### **Slide 3: Solution** (45s)
- Every bottle = SUI NFT with provenance
- QR codes link physical bottles to blockchain
- Cork tokens are real digital assets
- Gasless transactions for mainstream users

### **Slide 4: Live Demo** (4 min)
[Execute demo flow above]

### **Slide 5: Technical Architecture** (1 min)
- Show smart contract diagram
- Highlight SUI Move advantages
- Explain gasless transaction flow

### **Slide 6: Market Opportunity** (45s)
- Wine industry: $450B globally
- Natural wine: fastest growing segment (30% YoY)
- Loyalty programs: $200B market
- NFT utility: proven product-market fit

### **Slide 7: What's Next** (30s)
- Launch with Portuguese natural wine collective
- Integrate with existing POS systems
- Mobile app with camera QR scanning
- Multi-winery marketplace

### **Slide 8: Team & Ask** (30s)
- Your background (web3 community + wine)
- Seeking: Pilot partners, SUI ecosystem support
- Contact info

---

## 🧪 Testing Checklist Before Demo

- [ ] All smart contracts deployed to SUI testnet
- [ ] Package ID configured in frontend
- [ ] Test wallet funded with SUI tokens
- [ ] Mock bottle purchase flow working
- [ ] QR scanner three states demo-able
- [ ] Minting confirmation modal showing transaction
- [ ] Collection displaying NFTs
- [ ] Activity feed populated
- [ ] Cork balance updating correctly
- [ ] Rewards page showing earn + redeem
- [ ] Mobile responsive (demo on phone?)
- [ ] Backup video recording of working demo
- [ ] SUI explorer links working

---

## 🚀 Post-Hackathon Roadmap

### **Phase 1: MVP Launch** (Month 1-2)
- Partner with 1-2 natural wine shops
- Real QR codes on physical bottles
- Basic mobile app (camera integration)
- Manual fulfillment of rewards

### **Phase 2: Automation** (Month 3-4)
- POS system integration
- Automated Cork minting
- Email/SMS notifications
- Reward vendor integrations

### **Phase 3: Expansion** (Month 5-6)
- Multi-winery marketplace
- Secondary NFT market
- Community DAO for batch voting
- Stake Corks for exclusive releases

### **Phase 4: Scale** (Month 7-12)
- International expansion
- Other product categories (beer, spirits)
- White-label loyalty platform
- Mobile SDK for partners

---

## 💡 Competitive Advantages

1. **Real Utility**: NFTs solve actual wine fraud problem
2. **Zero Friction**: Non-crypto users never see blockchain
3. **Proven Market**: Natural wine community already engaged
4. **Network Effects**: More wineries = more valuable collection
5. **SUI Advantage**: Fast, cheap transactions enable micro-rewards

---

## 🎯 Success Metrics for Judges

- **Technical Excellence**: Smart contracts deployed and functional
- **User Experience**: Non-technical people can use it
- **Real Problem**: Addresses actual pain point (fraud)
- **Market Fit**: Clear path to adoption
- **Innovation**: Unique use of blockchain for physical goods
- **Completeness**: End-to-end journey demonstrable

---

## 📞 Quick Reference

**Contract Addresses** (Update after deployment)
```
Cork Token: 0x...
Bottle NFT: 0x...
Tier System: 0x...
Rewards: 0x...
Package ID: 0x...
```

**Testnet Resources**
- Faucet: https://faucet.testnet.sui.io/
- Explorer: https://suiexplorer.com/?network=testnet
- Docs: https://docs.sui.io/

**Demo Accounts**
- Admin Wallet: 0x...
- Test User 1: user@corkcollective.io
- Test User 2: demo@corkcollective.io

---

## 🏆 Why We'll Win

1. **Complete Vision**: Not just NFTs - complete loyalty ecosystem
2. **Real Traction**: Existing web3 community ready to pilot
3. **Technical Depth**: Gasless transactions, embedded wallets
4. **Market Timing**: Natural wine boom + NFT utility narrative
5. **Founder Fit**: Wine expert + crypto native = perfect combo
6. **Demo Quality**: Production-ready UI, not prototype wireframes

**This isn't a hackathon project - it's a company launch with a working MVP.**

🍷🚀
