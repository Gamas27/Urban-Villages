# 🚀 Next Steps for Urban Villages

## ✅ What's Complete

1. ✅ **Enoki Integration** - Fully integrated
   - Wallet connection via Enoki
   - File uploads to Walrus with Enoki
   - All components migrated
   - Namespace service created (ready for contract)

2. ✅ **Frontend Components** - Working
   - Onboarding flow
   - PostComposer
   - MainApp structure
   - Feed, Shop, Friends components

3. ✅ **Existing Contracts** - Available
   - `bottle_nft.move`
   - `cork_token.move`
   - `rewards.move`
   - `tier_system.move`

---

## 🎯 Priority 1: Create Namespace Contract (High Priority)

**Status:** Frontend service ready, contract needed

**What to Do:**
1. Create `contracts/namespace.move`
   - Registry for all namespaces
   - Register function (`username.village` format)
   - Availability check function
   - Resolve function (namespace → address)
   - Store profilePicBlobId in metadata

2. Deploy to Testnet
   - Get Package ID
   - Get Registry object ID
   - Update `.env.local` with IDs

3. Update Namespace Service
   - Replace placeholder functions in `app/lib/namespace.ts`
   - Wire up real on-chain queries
   - Test registration flow

**Time Estimate:** 2-3 hours

**Why Priority:**
- Namespace registration is core to identity system
- Frontend is ready, just needs contract
- Key differentiator for hackathon demo

---

## 🎯 Priority 2: Test Enoki Integration (High Priority)

**Status:** Code complete, needs testing

**What to Do:**
1. Restart dev server: `pnpm dev`
2. Test wallet connection:
   - Click "Connect Wallet"
   - Verify Enoki (Google) option appears
   - Test Google login flow
3. Test file uploads:
   - Upload profile picture during onboarding
   - Upload image in post composer
   - Verify Walrus storage works
4. Test namespace registration:
   - Complete onboarding
   - Verify namespace registration attempt (will fail until contract deployed)

**Time Estimate:** 30 minutes

**Why Priority:**
- Ensure everything works before building more
- Catch any Enoki integration issues early

---

## 🎯 Priority 3: Enhance Onboarding Flow (Medium Priority)

**Status:** Basic flow works, can be improved

**What to Do:**
1. Add namespace availability check in username step
   - Real-time validation as user types
   - Show availability status
   - Prevent registration of taken namespaces

2. Add namespace registration status
   - Show success message after registration
   - Show namespace on-chain link
   - Handle registration errors gracefully

3. Store namespace metadata
   - Link namespace to user account
   - Display namespace in profile
   - Use namespace in posts/comments

**Time Estimate:** 1-2 hours

---

## 🎯 Priority 4: Connect Existing Contracts (Medium Priority)

**Status:** Contracts exist, need frontend integration

**What to Do:**
1. Deploy existing contracts to testnet:
   - `cork_token.move` - CORK token
   - `bottle_nft.move` - Wine bottle NFTs
   - `rewards.move` - Reward redemption
   - `tier_system.move` - Membership tiers

2. Create frontend services:
   - Token balance hooks
   - NFT minting hooks
   - Purchase flow integration

3. Wire up Shop component:
   - Connect purchase flow to NFT minting
   - Award CORK tokens after purchase
   - Update tier system

**Time Estimate:** 3-4 hours

---

## 🎯 Priority 5: Polish & Demo Prep (Lower Priority)

**Status:** Core features mostly complete

**What to Do:**
1. UI/UX improvements
   - Loading states
   - Error messages
   - Success animations
   - Mobile responsiveness

2. Demo video preparation
   - Script the flow
   - Record key interactions
   - Highlight Enoki + Namespace features

3. Documentation
   - Update README
   - Document deployment process
   - Create demo guide

**Time Estimate:** 2-3 hours

---

## 📋 Recommended Order

### Immediate (Next 1-2 hours):
1. ✅ **Test Enoki Integration** (30 min)
   - Verify wallet connection works
   - Test file uploads
   - Fix any issues

2. ⏳ **Create Namespace Contract** (2-3 hours)
   - Write `namespace.move`
   - Deploy to testnet
   - Update frontend service

### Short-term (Next 4-6 hours):
3. ⏳ **Enhance Onboarding**
   - Add availability check
   - Improve registration flow

4. ⏳ **Connect Existing Contracts**
   - Deploy contracts
   - Wire up shop/purchase flow

### When Ready:
5. ⏳ **Polish & Demo**
   - UI improvements
   - Video recording
   - Documentation

---

## 🔧 Quick Start: Test Enoki (Right Now)

```bash
# 1. Restart dev server
pnpm dev

# 2. Open browser to localhost:3000

# 3. Test wallet connection
- Click "Connect Wallet"
- Should see Enoki (Google) option
- Test login flow

# 4. Test onboarding
- Connect wallet
- Select village
- Enter username
- Upload profile picture
- Complete onboarding

# 5. Test post creation
- Create post with image
- Verify upload works
```

---

## 📝 Next Actions

**If you want to continue right now, I recommend:**

1. **Create the namespace Move contract** - This is the biggest missing piece
2. **Test Enoki integration** - Make sure everything works first

Which would you prefer to tackle first?

