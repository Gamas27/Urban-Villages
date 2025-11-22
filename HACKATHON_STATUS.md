# Hackathon Demo - Current Status

## ✅ What's Working

### 1. **Onboarding & Identity** ✅
- [x] Enoki integration (Google login)
- [x] Embedded wallet creation
- [x] Namespace contract deployed
- [x] Namespace registration working
- [x] Profile picture upload UI (blocked by WAL tokens)

**Deployed:**
- Package ID: `0x1465dc2888257bd5e03cab860558e96ba806999f7fca4515f8c8378460a27d7b`
- Registry ID: `0xb042e36d39e1268bd5bf4cfc194098a593717e1e0349a8521abf3d689f83aa91`

### 2. **Social Platform** ✅
- [x] Post creation UI
- [x] Feed display
- [x] Village switching
- [x] Follow system
- [ ] Post images (blocked by WAL tokens)

### 3. **Smart Contracts (Code Ready)** ✅
- [x] `cork_token.move` - Exists
- [x] `bottle_nft.move` - Exists
- [x] `rewards.move` - Exists
- [x] `tier_system.move` - Exists
- [ ] **NOT DEPLOYED YET** - Need to deploy to testnet

---

## ❌ Current Blockers

### 1. **Walrus Uploads (WAL Token Issue)**
**Problem**: Walrus requires WAL tokens, sponsored transactions only cover gas (SUI)

**Impact**: 
- Profile pictures can't be uploaded
- Post images can't be uploaded
- NFT images can't be stored

**Solutions for Demo:**
1. **Use placeholder images** (quickest)
2. **WAL token faucet** (more work)
3. **Alternative storage** (IPFS, CDN)

**Recommendation**: Use placeholder images for demo, mention Walrus integration in presentation

### 2. **Smart Contracts Not Deployed**
**Status**: Contracts exist but not deployed to testnet

**Need to deploy:**
- Cork Token
- Bottle NFT
- Rewards (optional)
- Tier System (optional)

---

## 🎯 Demo Priorities

### MUST HAVE (Core Demo)

1. **Onboarding Flow** ✅
   - Google login → Namespace registration
   - Show `username.village` identity
   - **Status**: Working!

2. **Social Feed** ✅
   - Create post
   - View feed
   - Switch villages
   - **Status**: Working (just needs images)

3. **Smart Contracts** ⚠️
   - Deploy Cork Token & Bottle NFT
   - Integrate with frontend
   - **Status**: Code ready, need deployment

4. **Purchase Flow** ❌
   - Purchase UI
   - Mint NFT
   - Mint Corks
   - **Status**: Need to implement

### NICE TO HAVE (Bonus)

5. **Collection View** ❌
   - Display NFTs
   - **Status**: Need to implement

6. **QR Scanner** ❌
   - Can use mock data
   - **Status**: Need to implement

7. **Rewards** ❌
   - Can simplify for demo
   - **Status**: Need to implement

---

## 📋 Action Items

### Immediate (For Demo)

1. **Fix Walrus Issue**
   - [ ] Decide: Placeholders vs WAL faucet vs alternative
   - [ ] Implement chosen solution
   - [ ] Test image uploads

2. **Deploy Smart Contracts**
   - [ ] Deploy Cork Token to testnet
   - [ ] Deploy Bottle NFT to testnet
   - [ ] Get Package IDs
   - [ ] Update frontend with Package IDs

3. **Implement Purchase Flow**
   - [ ] Wire up purchase UI to contracts
   - [ ] Test minting flow
   - [ ] Show confirmation modal

4. **Test End-to-End**
   - [ ] Complete onboarding
   - [ ] Create post
   - [ ] Make purchase
   - [ ] View collection

### Optional (If Time Permits)

5. **Collection View**
   - [ ] Display owned NFTs
   - [ ] Show metadata

6. **QR Scanner**
   - [ ] Basic scanner UI
   - [ ] Mock verification

7. **Activity Feed**
   - [ ] Show transaction history
   - [ ] Link to explorer

---

## 🚀 Demo Script (Simplified)

### 1. Onboarding (30s) ✅
- "Watch how easy it is - just sign in with Google"
- Show Enoki wallet creation
- Show namespace registration (`username.village`)
- "No wallet extension needed!"

### 2. Social Platform (1 min) ✅
- Show feed
- Create a post (with placeholder image)
- Show village switching
- "This is a complete social platform"

### 3. Namespace Identity (30s) ✅
- Show `username.village` everywhere
- "No wallet addresses visible"
- "Portable identity across villages"

### 4. Smart Contracts (1 min) ⚠️
- Show deployed contracts in explorer
- Explain architecture
- "Production-ready Move contracts"
- **Note**: Need to deploy first!

### 5. Vision (30s)
- Show multi-village concept
- Explain scalability
- "This works for any community"

---

## 💡 Quick Wins

1. **Use placeholder images** - Unblock Walrus immediately
2. **Deploy contracts** - Get Package IDs, wire up frontend
3. **Mock purchase flow** - Show UI even if contracts not ready
4. **Focus on what works** - Onboarding + Social = strong demo

---

## 📊 Status Summary

| Feature | Status | Priority |
|---------|--------|----------|
| Onboarding | ✅ Working | MUST |
| Namespace | ✅ Deployed | MUST |
| Social Feed | ✅ Working | MUST |
| Walrus | ⚠️ Blocked | MUST (use placeholder) |
| Smart Contracts | ⚠️ Not Deployed | MUST |
| Purchase Flow | ❌ Not Implemented | MUST |
| Collection | ❌ Not Implemented | NICE |
| QR Scanner | ❌ Not Implemented | NICE |

---

**Next Step**: Let's decide on Walrus workaround and deploy the smart contracts!

