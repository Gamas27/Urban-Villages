# 🍷 Cork Collective: Non-Web3 User Onboarding Strategy

## The Problem

**Current Web3 UX:**
```
User → "Connect Wallet" → Download app → Create seed phrase → Fund with crypto → ABANDONED ❌
Conversion Rate: ~2%
```

**Cork Collective Solution:**
```
User → Email/Google login → Pay with card → Own NFTs → Learn gradually ✅
Conversion Rate: ~60% (standard e-commerce)
```

---

## 🎯 Three-Tier User Experience

### Tier 1: "Normie Mode" (Day 1-7)
**Goal:** Get them buying wine ASAP, hide blockchain complexity

**UX Flow:**
1. Click "Buy Wine"
2. Sign in with email/Google (no "wallet" mentioned)
3. Personalize bottle
4. Pay with credit card (Stripe)
5. See confirmation: "Your bottle is verified on the blockchain ✓"

**What happens behind the scenes:**
- Backend creates embedded wallet tied to email
- Backend mints NFT to that wallet
- Backend pays all gas fees (~$0.0001 per mint)
- User gets NFT + Cork tokens automatically

**User sees:**
- "My Collection" tab (not "My NFTs")
- QR codes work
- Provenance data visible
- No wallet UI, no seed phrases

---

### Tier 2: "Curious Mode" (Week 1-4)
**Goal:** Educate about what they own, no pressure

**Triggers:**
- After 3rd purchase: "Did you know you own 3 NFTs?"
- In profile: "Learn about your blockchain assets"
- Email: "Your Cork Collective journey"

**What they learn:**
- ✓ Each bottle is a unique NFT
- ✓ Cork tokens are real cryptocurrency
- ✓ Everything lives on SUI blockchain
- ✓ You actually OWN these (we just hold them for you)

**Actions available:**
- View assets on SUI Explorer
- Share NFT links with friends
- See transaction history
- Learn about Web3 (optional articles)

---

### Tier 3: "Power User Mode" (Month 1+)
**Goal:** Full Web3 features for those who want them

**Available actions:**
- Export wallet (get private key)
- Connect external wallet
- Trade NFTs on marketplaces
- Use Cork tokens in DeFi
- Vote with tokens (DAO governance)

**Important:** This is OPTIONAL. 95% of users will never need this.

---

## 🛠️ Technical Implementation

### Option 1: zkLogin (SUI Native - BEST for Hackathon!)

**Why:** Built specifically for SUI, perfect for demo

```typescript
// User signs in with Google
import { zkLogin } from '@mysten/zklogin';

const session = await zkLogin.authenticate({
  provider: 'google',
  clientId: 'YOUR_GOOGLE_CLIENT_ID'
});

// Get SUI address from OAuth token
const suiAddress = zkLogin.getAddress(session.jwt);

// Now you can sign transactions on behalf of user
// using zkLogin proofs (user never sees private key)
```

**Pros:**
- ✅ Native to SUI
- ✅ No third-party dependencies
- ✅ Judges will love it (shows deep SUI knowledge)

**Cons:**
- ⚠️ More complex to implement
- ⚠️ Requires understanding of zero-knowledge proofs

---

### Option 2: Mock Implementation (Fastest for Hackathon)

**For a 2-day hackathon, FAKE IT:**

```typescript
// In your backend/frontend state
interface User {
  email: string;
  embeddedWallet: {
    address: string; // Generate deterministically from email
    // Private key stored securely in YOUR backend
  };
  nfts: BottleNFT[];
  corkBalance: number;
}

// When user "buys" a bottle
async function purchaseBottle(userId: string, bottleData: any) {
  // 1. Process payment (mock Stripe)
  await mockStripeCharge(user.email, bottleData.price);
  
  // 2. Mint NFT using YOUR backend wallet
  const nft = await mintBottleNFT({
    recipient: user.embeddedWallet.address,
    ...bottleData
  });
  
  // 3. Award Cork tokens
  await awardCorks(userId, 50);
  
  // 4. Store in database
  await db.users.update(userId, {
    nfts: [...user.nfts, nft],
    corkBalance: user.corkBalance + 50
  });
}
```

**For demo purposes:**
- Show the CONCEPT
- Explain how it would work in production
- Focus on UX, not implementation details

---

## 💳 Payment Flow (Non-Web3 User)

### Frontend (What User Sees)
```tsx
<SimpleCheckout
  bottle={selectedBottle}
  customText="Happy Birthday Sarah!"
  onComplete={() => {
    // Show success message
    showToast("NFT minted! View in My Collection");
  }}
/>
```

### Backend (What Actually Happens)
```typescript
// 1. Verify payment
const payment = await stripe.charges.create({
  amount: bottle.price * 100,
  currency: 'usd',
  customer: user.stripeCustomerId
});

// 2. Get/create user's embedded wallet
let wallet = await getEmbeddedWallet(user.email);
if (!wallet) {
  wallet = await createEmbeddedWallet(user.email);
}

// 3. Mint NFT on SUI (using YOUR sponsor wallet)
const tx = new TransactionBlock();
tx.moveCall({
  target: `${PACKAGE_ID}::bottle_nft::mint_bottle`,
  arguments: [
    tx.pure(bottle.name),
    tx.pure(bottle.vintage),
    tx.pure(bottle.region),
    tx.pure(customText || ''),
    tx.pure(wallet.address), // Send to user's embedded wallet
  ],
});

const result = await sponsorWallet.signAndExecuteTransactionBlock({
  transactionBlock: tx,
  // YOU pay the gas fee
});

// 4. Award Cork tokens (same pattern)
const corksResult = await mintCorks(wallet.address, 50);

// 5. Update database
await db.users.update(user.id, {
  nfts: [...user.nfts, result.nftId],
  corkBalance: user.corkBalance + 50,
  totalSpent: user.totalSpent + bottle.price
});

// 6. Send confirmation email
await sendEmail(user.email, {
  subject: "Your bottle NFT is ready!",
  body: `
    Hi ${user.name},
    
    Your ${bottle.name} has been verified on the blockchain!
    
    🎨 Custom message: "${customText}"
    🪙 Earned: 50 Cork tokens
    📦 NFT ID: ${result.nftId}
    
    View it here: https://corkcollective.com/bottles/${result.nftId}
  `
});
```

---

## 🎬 Hackathon Demo Script

### Setup (Before Demo)
1. Have 2 browser windows ready:
   - Window 1: Your app (logged in as non-web3 user)
   - Window 2: SUI Explorer

### Demo (3 minutes)

**[0:00-0:30] The Problem**
> "95% of people don't have crypto wallets. But we're making a Web3 loyalty program. 
> How do we onboard wine lovers who've never heard of blockchain?"

**[0:30-1:00] Our Solution**
> "We hide the complexity. Watch - I'm a normal customer..."
> - Click "Buy Wine"
> - Sign in with Google (show email login)
> - Personalize bottle: "Happy Birthday Mom!"
> - Pay with credit card
> - BOOM - done!

**[1:00-1:30] The Magic**
> "But behind the scenes..." (switch to code/diagram)
> - Show embedded wallet creation
> - Show NFT being minted
> - Show gas being paid by sponsor wallet
> "User has NO IDEA this happened. They just bought wine."

**[1:30-2:00] They Own Real Assets**
> Go to "My Collection"
> - Show bottle with "Blockchain Verified" badge
> - Click QR code → full provenance appears
> - Switch to SUI Explorer
> - Show ACTUAL on-chain NFT
> "This is a real SUI NFT. They can take it anywhere."

**[2:00-2:30] Progressive Education**
> Show settings menu:
> - "Want to learn about your NFTs?"
> - "Export wallet to use with SUI Wallet app"
> "95% will never click this. 5% become power users. Everyone wins."

**[2:30-3:00] The Vision**
> "This is how we bring Web3 to mainstream:
> - Familiar UX (email + credit card)
> - Real ownership (SUI blockchain)
> - Optional complexity (for those who want it)
> 
> Cork Collective: Natural wine meets Web3, no crypto required."

---

## 📊 Key Metrics

| Metric | Traditional Web3 | Cork Collective |
|--------|------------------|-----------------|
| Onboarding Time | 15-30 min | 2 min |
| Crypto Knowledge Required | High | Zero |
| Conversion Rate | 2% | 60% |
| Gas Fees Paid By | User | Platform |
| Wallet Setup | User (complex) | Auto (invisible) |
| First Purchase | After funding wallet | Immediate |

---

## 🚀 Implementation Priority (2-Day Hackathon)

### Day 1 - Must Have
- [x] Email/Google login UI (can be mocked)
- [x] Credit card payment UI (mock Stripe)
- [x] Show "embedded wallet created" in UI
- [x] Backend mints NFT to user's address
- [x] QR scanner works for anyone (no wallet needed)

### Day 2 - Nice to Have
- [ ] "Learn about Web3" modal with education
- [ ] zkLogin integration (if time permits)
- [ ] "Export wallet" flow
- [ ] SUI Explorer links

### Post-Hackathon - Production
- [ ] Real zkLogin implementation
- [ ] Real Stripe integration
- [ ] Secure key management
- [ ] Email notifications
- [ ] Mobile app with wallet export

---

## 💡 Talking Points for Judges

**"How do non-crypto users engage?"**
> "They don't know they're using crypto. Email login, credit card payment, done. 
> We handle wallets, gas fees, everything. They just see 'verified on blockchain' and their collection grows."

**"But isn't this centralized then?"**
> "Great question! We're custodial initially, but users have an exit ramp. 
> Their assets are on public SUI blockchain - they can export their wallet anytime. 
> We're like training wheels: start easy, remove when ready."

**"What about gas fees?"**
> "We pay them. At ~$0.0001 per mint on SUI, it's cheaper than Stripe fees. 
> Cost of customer acquisition. We can batch transactions to save even more."

**"How is this different from a regular database?"**
> "Two ways: First, provenance is immutable and public - anyone can verify. 
> Second, users actually OWN their NFTs - if we shut down tomorrow, they keep everything. 
> That's impossible with traditional loyalty programs."

---

## 🎯 Success Criteria

### Minimum Viable Demo
✅ User can "buy" bottle without wallet  
✅ NFT appears in their collection  
✅ QR code shows blockchain data  
✅ Clear explanation of what's happening  

### Impressive Demo
✅ All above +  
✅ Visual diagram of embedded wallet flow  
✅ Real SUI Explorer links  
✅ "Export wallet" button (even if mocked)  
✅ Side-by-side comparison (web3 user vs normie)  

### Winning Demo
✅ All above +  
✅ Working zkLogin integration  
✅ Real NFTs minted during demo  
✅ Multiple user types demonstrated  
✅ Clear roadmap to production  

---

## 🔗 Resources

- **SUI zkLogin Docs:** https://docs.sui.io/concepts/cryptography/zklogin
- **Embedded Wallet Providers:**
  - Dynamic: https://www.dynamic.xyz/
  - Privy: https://www.privy.io/
  - Magic: https://magic.link/
- **SUI TypeScript SDK:** https://github.com/MystenLabs/sui/tree/main/sdk/typescript
- **Gasless Transactions:** https://docs.sui.io/concepts/transactions/sponsored-transactions

---

**TL;DR:** Hide crypto complexity, use email + credit card, mint NFTs behind the scenes, let users graduate to full Web3 when ready. 🍷⛓️
