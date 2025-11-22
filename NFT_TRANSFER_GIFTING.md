# NFT Transfer & Gifting Feature

## 🎁 Use Case: Birthday Gift Scenario

**Problem**: "I have a few bottles and I want to give 1 to a friend for his birthday and pass ownership of the NFT"

**Solution**: Complete on-chain NFT transfer with provenance tracking

---

## 🔄 Transfer Flow

### **Method 1: Direct Wallet Transfer** (Friend has SUI wallet)

```
1. User clicks "Gift This Bottle" on their collection
2. Select "Transfer to Wallet Address"
3. Enter friend's SUI wallet address
4. Add optional gift message
5. Confirm transfer
6. NFT transfers on-chain (instant)
7. Provenance updated: "Gifted to [address]"
8. Physical bottle handed over separately
9. Friend scans QR → verifies they're new owner
```

### **Method 2: Email Invite** (Friend is new to crypto)

```
1. User clicks "Gift This Bottle"
2. Select "Invite via Email"
3. Enter friend's email address
4. Add gift message
5. Confirm transfer
6. System:
   ├─ Creates embedded wallet for friend (zkLogin)
   ├─ Transfers NFT to new wallet
   ├─ Sends email: "You received a wine bottle NFT!"
   └─ Email contains claim link
7. Friend clicks link → auto-login via email
8. Sees bottle in collection (already owns it!)
9. Physical bottle handed over
10. Friend scans QR → verifies ownership
```

---

## 🎯 Key Features

### **1. Dual Transfer Methods**

| Method | Best For | Speed | Crypto Knowledge |
|--------|----------|-------|------------------|
| **Wallet Transfer** | Crypto-savvy friends | Instant | Required |
| **Email Invite** | Normies | Instant (claim later) | None |

### **2. Provenance Tracking**

Every transfer creates an immutable provenance record:

```
Bottle #127 History:
├─ Nov 1, 2024  - Minted by Cork Collective
├─ Nov 1, 2024  - Purchased by Alice (0x123...)
├─ Nov 5, 2024  - Verified via QR scan
├─ Nov 18, 2024 - Gifted to Bob (0xabc...)
│                 Message: "Happy Birthday!"
└─ Nov 18, 2024 - Verified by Bob via QR scan
```

### **3. Physical + Digital**

- **Digital**: NFT transfers on blockchain (instant)
- **Physical**: Bottle handed over in person
- **Verification**: Friend scans QR to prove they own it
- **Result**: Complete ownership transfer with provenance

---

## 🔐 Smart Contract Integration

### **SUI Move Function**

```move
// bottle_nft.move
public entry fun transfer_bottle(
    bottle: BottleNFT,
    recipient: address,
    gift_message: Option<vector<u8>>,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    
    // Add provenance event
    vec_map::insert(
        &mut bottle.provenance_events,
        clock::timestamp_ms(clock),
        string::utf8(b"Gifted to new owner")
    );
    
    // Update owner
    bottle.owner = recipient;
    
    // Emit transfer event
    event::emit(BottleTransferred {
        bottle_id: object::id(&bottle),
        from: sender,
        to: recipient,
        gift_message,
        timestamp: clock::timestamp_ms(clock)
    });
    
    // Transfer NFT
    transfer::public_transfer(bottle, recipient);
}
```

### **Frontend Integration**

```typescript
async function giftBottle(
  bottleNftId: string,
  recipientAddress: string,
  giftMessage: string
) {
  const tx = new TransactionBlock();
  
  // Transfer bottle NFT
  tx.moveCall({
    target: `${PACKAGE_ID}::bottle_nft::transfer_bottle`,
    arguments: [
      tx.object(bottleNftId),           // The bottle NFT
      tx.pure(recipientAddress),        // New owner
      tx.pure(giftMessage),             // Gift message
      tx.object('0x6'),                 // Clock
    ]
  });
  
  // Sign and execute
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

---

## 📊 Database Updates

### **Add Transfer Records Table**

```sql
CREATE TABLE bottle_transfers (
  id UUID PRIMARY KEY,
  bottle_id UUID REFERENCES bottles(id),
  
  -- Transfer Details
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  from_address VARCHAR(66),
  to_address VARCHAR(66),
  
  -- Gift Details
  gift_message TEXT,
  transfer_method VARCHAR(50), -- 'wallet', 'email'
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'claimed', 'completed'
  
  -- Blockchain
  transaction_digest VARCHAR(100),
  
  -- Email Invite (if method = 'email')
  invite_email VARCHAR(255),
  invite_claimed_at TIMESTAMPTZ,
  
  transferred_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transfers_bottle ON bottle_transfers(bottle_id);
CREATE INDEX idx_transfers_from ON bottle_transfers(from_user_id);
CREATE INDEX idx_transfers_to ON bottle_transfers(to_user_id);
```

### **Update Bottles Table**

```sql
ALTER TABLE bottles
ADD COLUMN transfer_count INTEGER DEFAULT 0,
ADD COLUMN current_owner_since TIMESTAMPTZ,
ADD COLUMN is_gift BOOLEAN DEFAULT FALSE;
```

---

## 🎨 UX Design

### **Gift Button Location**

```
My Collection > Click Bottle > "Gift This Bottle" button
                                    │
                    ┌───────────────┴────────────────┐
                    │                                │
              Wallet Transfer                  Email Invite
                    │                                │
        Enter SUI address                    Enter email
                    │                                │
           Add gift message                 Add gift message
                    │                                │
              Confirm details                Confirm details
                    │                                │
        ┌───────────┴────────────────────────────────┘
        │
Transfer on blockchain
        │
Success! NFT transferred
```

### **UI States**

1. **Collection View** - "Gift" button on each verified bottle
2. **Gift Modal** - Choose transfer method
3. **Details Form** - Enter recipient + message
4. **Confirmation** - Review before transfer
5. **Transferring** - Blockchain transaction in progress
6. **Success** - Transfer complete with next steps

---

## 📧 Email Templates

### **Gift Claim Email** (Email Invite Method)

```html
Subject: 🎁 You received a wine bottle NFT!

Hi!

{sender_name} has gifted you a bottle from Cork Collective:

🍷 {bottle_name} {vintage}
📦 Bottle #{bottle_number}/500

Message from {sender_name}:
"{gift_message}"

This bottle comes with a unique NFT on the SUI blockchain,
proving its authenticity and provenance.

[Claim Your Bottle NFT] ← Big Button

What's Next:
1. Click the button to create your account (no crypto knowledge needed!)
2. View your bottle's complete provenance history
3. Get the physical bottle from {sender_name}
4. Scan the QR code to verify you're the owner

Learn more about Cork Collective: https://corkcollective.io

---
Cork Collective | Verified on SUI
```

### **Transfer Confirmation Email** (To Sender)

```html
Subject: ✓ Bottle NFT transferred to {recipient}

Hi {sender_name},

You've successfully gifted your bottle NFT:

🍷 {bottle_name} {vintage}
→ Transferred to: {recipient}

Transaction: {sui_explorer_link}

Next Steps:
• Give {recipient} the physical bottle
• They should scan the QR code to verify ownership
• You can view the transfer in Activity history

Thank you for using Cork Collective!
```

---

## 🔒 Security & Validation

### **Pre-Transfer Checks**

```typescript
async function validateTransfer(bottleId: string, userId: string) {
  // 1. User owns the bottle
  const bottle = await db.bottles.findOne({ id: bottleId });
  if (bottle.owner_id !== userId) {
    throw new Error('You do not own this bottle');
  }
  
  // 2. Bottle is verified (not pending delivery)
  if (bottle.verification_status !== 'verified') {
    throw new Error('Bottle must be verified before transfer');
  }
  
  // 3. NFT ownership matches database
  const onChainOwner = await suiClient.getObject(bottle.nft_object_id);
  if (onChainOwner.owner !== userWalletAddress) {
    throw new Error('NFT ownership mismatch');
  }
  
  // 4. No pending transfers
  const pendingTransfer = await db.transfers.findOne({
    bottle_id: bottleId,
    status: 'pending'
  });
  if (pendingTransfer) {
    throw new Error('Transfer already in progress');
  }
  
  return true;
}
```

### **Address Validation**

```typescript
function validateSuiAddress(address: string): boolean {
  // SUI addresses are 66 characters (0x + 64 hex chars)
  const suiAddressRegex = /^0x[a-fA-F0-9]{64}$/;
  return suiAddressRegex.test(address);
}
```

### **Prevent Self-Transfer**

```typescript
if (recipientAddress === senderAddress) {
  throw new Error('Cannot transfer to yourself');
}
```

---

## 🎭 Demo Script for Hackathon

### **Setup** (Before Demo)
```
1. Have 2 devices/browsers:
   - Browser A: Your account with verified bottle
   - Browser B: Friend's account (or new signup)
2. Or use wallet addresses you control
```

### **Live Demo** (2 minutes)

**Presenter**:
> "One of the coolest blockchain features is true ownership transfer. Watch this."

[Show collection with verified bottle]

> "I have this Sunset Orange 2023. My friend's birthday is coming up. Let me give him this bottle."

[Click "Gift This Bottle"]

> "I can either transfer to his wallet address if he's already using crypto..."

[Select "Email Invite"]

> "...or I can just use his email. We'll create an embedded wallet for him automatically."

[Enter email: friend@example.com]
[Add message: "Happy Birthday! Enjoy this natural wine 🍷"]

> "I'll add a birthday message. Now let's review..."

[Show confirmation screen]

> "Look at what happens: NFT transfers on-chain, provenance gets updated with 'Gifted to [name]', and he gets an email to claim it."

[Click "Transfer NFT"]

> "Transaction broadcasting to SUI... and done. 3 seconds."

[Show success screen with transaction hash]

> "Now watch this..."

[Switch to Browser B or phone]
[Friend clicks email link]

> "He gets this email, clicks the link, and boom - the bottle is already in his collection. No wallet setup, no seed phrases, nothing. Just email login."

[Show bottle in friend's collection]

> "Now when I hand him the physical bottle, he scans the QR code..."

[Scan QR]

> "...and the blockchain verifies HE'S the owner now, not me. Complete provenance chain:
> - Winery minted it
> - I bought it
> - I verified it
> - I gifted it to him
> - He verified it
>
> That's the power of blockchain for physical goods. True ownership, complete history, zero friction."

---

## 📈 Analytics & Metrics

### **Transfer Metrics**

```sql
-- Transfer success rate
SELECT 
  COUNT(*) FILTER (WHERE status = 'completed') * 100.0 / COUNT(*) as success_rate,
  AVG(EXTRACT(EPOCH FROM (claimed_at - transferred_at))) as avg_claim_time_seconds
FROM bottle_transfers
WHERE transfer_method = 'email';

-- Most gifted bottles
SELECT 
  b.name,
  b.vintage,
  COUNT(t.id) as gift_count
FROM bottles b
JOIN bottle_transfers t ON t.bottle_id = b.id
GROUP BY b.id
ORDER BY gift_count DESC
LIMIT 10;

-- Gift patterns
SELECT 
  DATE_TRUNC('month', transferred_at) as month,
  transfer_method,
  COUNT(*) as transfers
FROM bottle_transfers
GROUP BY month, transfer_method
ORDER BY month DESC;
```

### **Key Metrics**

- **Transfer Rate**: % of bottles transferred vs kept
- **Claim Rate**: % of email invites claimed
- **Time to Claim**: How long until email recipients claim
- **Secondary Transfers**: Bottles transferred multiple times
- **Gift Virality**: New users acquired via gifts

---

## 🚀 Advanced Features (Future)

### **1. Transfer with Conditions**

```typescript
// Time-locked transfer (claim after specific date)
transferWithTimelock(
  bottle,
  recipient,
  unlockDate // "2024-12-25" for Christmas gift
);

// Transfer with price (sell bottle)
transferWithPayment(
  bottle,
  recipient,
  priceInSUI
);
```

### **2. Partial Ownership**

```move
// Fractional NFT ownership
// Split bottle ownership for investment
struct FractionalBottle {
  bottle_id: ID,
  total_shares: u64,
  shareholders: VecMap<address, u64>
}
```

### **3. Gift Registry**

```typescript
// Create wishlist for special occasions
createGiftRegistry({
  occasion: 'Birthday',
  date: '2024-12-01',
  wishlist: [bottleId1, bottleId2, bottleId3]
});
```

### **4. Batch Gifting**

```typescript
// Send multiple bottles to multiple people
batchGift([
  { bottle: bottle1, recipient: friend1, message: "..." },
  { bottle: bottle2, recipient: friend2, message: "..." },
  { bottle: bottle3, recipient: friend3, message: "..." }
]);
```

---

## 🎯 Why This Feature Matters

### **For Users**
✅ **Give real ownership** - Not just a message, actual asset transfer  
✅ **No friction** - Friend doesn't need crypto knowledge  
✅ **Provenance preserved** - Complete history of ownership  
✅ **Verifiable gifts** - QR scan proves authenticity

### **For Business**
✅ **Viral growth** - Each gift onboards new user  
✅ **Network effects** - More users = more valuable ecosystem  
✅ **Secondary market** - Enables bottle trading/selling  
✅ **Brand storytelling** - Provenance adds value

### **For Blockchain**
✅ **Real-world utility** - Not just speculation  
✅ **Demonstrates ownership** - Core blockchain value prop  
✅ **Social proof** - "My friend uses it, I trust it"  
✅ **Onboarding tool** - Non-crypto users enter via gifts

---

## 🏆 Competitive Advantage

**Other wine NFT projects**:
- Mint NFT → you own it → done

**Cork Collective**:
- Mint → verify → gift → re-verify → trade → full provenance
- Complete lifecycle tracking
- Social gifting drives adoption
- Email onboarding removes barriers

---

## ✅ Implementation Checklist

### **MVP (Hackathon)**
- [x] GiftBottleFlow component
- [ ] Mock transfer with animation
- [ ] Show before/after ownership states
- [ ] Demo with 2 accounts/devices
- [ ] Provenance update visual

### **Production (v1)**
- [ ] Real SUI blockchain transfers
- [ ] Email invite system
- [ ] zkLogin wallet creation
- [ ] Transfer validation
- [ ] Email templates
- [ ] Analytics tracking

### **Production (v2)**
- [ ] Batch transfers
- [ ] Gift scheduling
- [ ] Transfer with payment
- [ ] Gift registry/wishlist
- [ ] Social sharing

---

## 🎤 Pitch Points

**To Judges:**
> "Every bottle is an NFT that can be gifted. Your friend doesn't need crypto knowledge - we create a wallet via email, transfer the NFT instantly, and they see it in their collection. When you hand them the physical bottle, they scan the QR to verify ownership. Complete provenance: winery → you → your friend, all on-chain."

**To Investors:**
> "Each gift is a viral loop. User A gifts bottle to User B. User B is now on our platform. User B gifts to User C. That's how we scale - social gifting with zero acquisition cost."

**To Users:**
> "Give a bottle, give the story. Your friend doesn't just get wine - they get the complete provenance, verified on blockchain. They can see where it came from, when you bought it, and that you gifted it to them. It's like a digital certificate of authenticity that lives forever."

---

This is **real blockchain utility**. Not speculation. Not hype. Actual ownership transfer of physical goods with complete provenance tracking.

🎁🍷⛓️
