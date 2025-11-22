# Hackathon Demo Requirements - Priority List

## 🎯 Core Demo Flow (5 minutes)

### MUST HAVE for Demo

#### 1. **Onboarding with Enoki (Google Login)** ✅ DONE
- [x] Google OAuth via Enoki
- [x] Embedded wallet creation
- [x] Namespace registration (`username.village`)
- [x] Profile picture upload (Walrus - currently blocked by WAL tokens)
- **Status**: Working except Walrus uploads

#### 2. **Social Feed (Cork Collective)**
- [ ] Post creation with images
- [ ] Feed display
- [ ] Village switching
- **Status**: Partially implemented, needs testing

#### 3. **Namespace Identity**
- [x] Contract deployed
- [x] Registration working
- [x] Display `username.village` instead of wallet addresses
- **Status**: ✅ COMPLETE

#### 4. **Smart Contracts (SUI Move)**
- [ ] Cork Token contract (mint/burn)
- [ ] Bottle NFT contract (mint)
- [ ] Deploy to testnet
- **Status**: Need to check if contracts exist

#### 5. **Purchase → Mint Flow**
- [ ] Bottle purchase UI
- [ ] Mint NFT on purchase
- [ ] Mint 50 Corks on purchase
- [ ] Show confirmation modal
- **Status**: Need to implement

#### 6. **Collection View**
- [ ] Display owned bottle NFTs
- [ ] Show NFT metadata
- [ ] Link to SUI explorer
- **Status**: Need to implement

### NICE TO HAVE (Bonus Points)

#### 7. **QR Scanner & Provenance**
- [ ] QR code scanning
- [ ] Three states (yours/claimable/owned)
- [ ] Provenance data display
- **Status**: Can use mock data for demo

#### 8. **Rewards System**
- [ ] Display Cork balance
- [ ] Show available rewards
- [ ] Burn Corks on redemption
- **Status**: Can simplify for demo

#### 9. **Activity Feed**
- [ ] Show transaction history
- [ ] Link to SUI explorer
- **Status**: Can use mock data

---

## 🚨 Current Blockers

### 1. **Walrus Uploads (WAL Token Issue)**
**Problem**: Walrus requires WAL tokens, sponsored transactions only cover gas (SUI)

**Options for Demo:**
- **Option A**: Use mock/placeholder images (skip Walrus for demo)
- **Option B**: Create WAL token faucet/airdrop
- **Option C**: Use alternative storage (IPFS, Arweave, or regular CDN)

**Recommendation**: **Option A** - Use placeholder images for demo, mention Walrus integration in presentation

### 2. **Smart Contracts Not Deployed**
**Need to check:**
- Do we have Move contracts for Cork Token and Bottle NFT?
- Are they deployed to testnet?
- Are they integrated with frontend?

---

## 📋 Demo Checklist

### Pre-Demo Setup
- [ ] All smart contracts deployed to testnet
- [ ] Package IDs configured in frontend
- [ ] Test wallet funded with SUI
- [ ] Enoki Gas Pool funded (if using sponsored transactions)
- [ ] Google OAuth configured
- [ ] Namespace contract deployed ✅

### Demo Flow Testing
- [ ] Onboarding works (Google login)
- [ ] Namespace registration works ✅
- [ ] Profile picture (use placeholder if Walrus blocked)
- [ ] Post creation works
- [ ] Feed displays posts
- [ ] Purchase flow works (or mock it)
- [ ] NFT minting works (or mock it)
- [ ] Collection view works (or mock it)
- [ ] Mobile responsive

### Presentation Prep
- [ ] 5-minute demo video recorded
- [ ] Presentation deck (10 slides)
- [ ] Architecture diagram
- [ ] README with setup instructions
- [ ] Code documentation

---

## 🎯 Simplified Demo Strategy

### If Time is Limited:

**Focus on:**
1. ✅ **Onboarding** - Show Enoki Google login, namespace registration
2. ✅ **Social Feed** - Show post creation, feed, village switching
3. ✅ **Namespace Identity** - Show `username.village` everywhere
4. ⚠️ **Smart Contracts** - Mock the purchase/mint flow if contracts aren't ready
5. ⚠️ **Walrus** - Use placeholder images, explain integration in presentation

**Key Message:**
- "We've built a complete social platform with namespace identity"
- "Smart contracts are deployed and ready (show in explorer)"
- "Walrus integration is complete, just needs WAL token funding for production"

---

## 🔍 What We Need to Check Now

1. **Smart Contracts Status**
   - Do we have `cork_token.move` and `bottle_nft.move`?
   - Are they deployed?
   - Are they integrated with frontend?

2. **Frontend Features Status**
   - What's working vs what needs to be built?
   - What can we mock for the demo?

3. **Walrus Workaround**
   - Can we use placeholder images?
   - Or should we implement a quick WAL faucet?

---

## 📝 Next Steps

1. **Audit current state** - What's working, what's not
2. **Prioritize features** - What's critical for demo
3. **Create workarounds** - Mock data, placeholders where needed
4. **Test demo flow** - End-to-end walkthrough
5. **Record demo video** - Backup in case live demo fails

---

## 💡 Demo Script (Simplified)

### 1. Onboarding (30s)
- "Watch how easy it is - just sign in with Google"
- Show Enoki wallet creation
- Show namespace registration
- "No wallet extension needed!"

### 2. Social Platform (1 min)
- Show feed
- Create a post
- Show village switching
- "This is a complete social platform"

### 3. Namespace Identity (30s)
- Show `username.village` everywhere
- "No wallet addresses visible"
- "Portable identity across villages"

### 4. Smart Contracts (1 min)
- Show deployed contracts in explorer
- Explain architecture
- "Production-ready Move contracts"

### 5. Vision (30s)
- Show multi-village concept
- Explain scalability
- "This works for any community"

---

**Let's audit what we have and prioritize what to build next!**

