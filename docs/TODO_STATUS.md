# Current TODO Status - Hackathon Demo

## ✅ Completed

1. **Deploy Contracts** ✅
   - [x] Cork Token deployed to testnet
   - [x] Bottle NFT deployed to testnet
   - [x] Package IDs extracted and documented

## 🔄 In Progress

2. **Update Environment Variables** ⏳
   - [ ] Add Cork Token Package ID to `.env.local`
   - [ ] Add Bottle NFT Package ID to `.env.local`
   - [ ] Add Treasury ID to `.env.local`
   - [ ] Add QRRegistry ID to `.env.local`

## 📋 Next Priorities

### Priority 1: Frontend Integration (Critical)

3. **Integrate Purchase Flow** 🔴
   - [ ] Create `app/lib/cork-token.ts` for token operations
   - [ ] Create `app/lib/bottle-nft.ts` for NFT operations
   - [ ] Replace mock purchase in `PurchaseModal.tsx` with real contract calls
   - [ ] Call `mint_bottle` function on purchase
   - [ ] Call `mint` for Cork tokens (50 CORK per purchase)
   - [ ] Show real transaction hashes

4. **Integrate Collection View** 🔴
   - [ ] Query on-chain BottleNFT objects owned by user
   - [ ] Replace hardcoded `nftBottles` array with real data
   - [ ] Display NFT metadata from on-chain objects
   - [ ] Link to SUI explorer for each NFT

5. **Add Cork Token Balance** 🟡
   - [ ] Query user's CORK token balance
   - [ ] Display balance in UI (Profile, Shop, etc.)
   - [ ] Show balance updates after purchases

### Priority 2: Walrus Workaround (For Demo)

6. **Placeholder Images** 🟡
   - [ ] Add fallback to placeholder images when Walrus fails
   - [ ] Use placeholder for profile pictures
   - [ ] Use placeholder for post images
   - [ ] Show warning message about Walrus network issues

### Priority 3: Testing & Polish

7. **End-to-End Testing** 🟢
   - [ ] Test complete onboarding flow
   - [ ] Test purchase → mint flow
   - [ ] Test collection view
   - [ ] Test on mobile

8. **Demo Preparation** 🟢
   - [ ] Create demo script
   - [ ] Record backup video
   - [ ] Prepare presentation

---

## 📊 Current Status Summary

| Task | Status | Priority |
|------|--------|----------|
| Deploy Contracts | ✅ Done | Critical |
| Update .env.local | ⏳ Next | Critical |
| Purchase Flow Integration | 🔴 Pending | Critical |
| Collection Integration | 🔴 Pending | Critical |
| Cork Balance Display | 🟡 Pending | Important |
| Walrus Placeholder | 🟡 Pending | Important |
| Testing | 🟢 Pending | Nice to have |

---

## 🎯 Immediate Next Steps

1. **Update `.env.local`** with deployed contract IDs
2. **Create contract integration files** (`cork-token.ts`, `bottle-nft.ts`)
3. **Wire up PurchaseModal** to real contracts
4. **Wire up Collection** to on-chain queries

---

**Ready to start?** Let's begin with updating `.env.local` and creating the contract integration files!

