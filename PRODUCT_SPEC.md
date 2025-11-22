# Cork Collective: Product Specification Document
## SUI Move Hackathon - Urban Villages Platform

**Version:** 1.0  
**Date:** November 21, 2025  
**Timeline:** 32 hours  
**Team:** Natural Wine Maker + Web3 Community Builder  

---

## 📋 Executive Summary

**Cork Collective** is the flagship implementation of **Urban Villages** - a modular community platform that enables location-based collectives to tokenize real-world assets, build community treasuries, and foster social engagement through blockchain technology.

For the hackathon, we're demonstrating a natural wine collective where:
- Members purchase numbered wine bottles as NFTs with full provenance
- Social engagement earns token rewards
- Transaction fees fund community development
- Identity is powered by **SUI Namespace** (`username.village`)
- Content is stored on **Walrus** decentralized storage

---

## 🎯 Problem Statement

Local communities (wine makers, artists, neighborhoods, cultural groups) lack infrastructure to:
- **Tokenize resources** and prove provenance
- **Build collective treasuries** through transparent mechanisms  
- **Reward engagement** and participation
- **Scale across regions** while maintaining local identity
- **Onboard non-crypto users** with web2 UX

---

## 💡 Solution: Urban Villages

A modular platform where communities create **villages** - autonomous economic zones with:

### Core Capabilities
1. **Namespace Identity** (SUI Namespace)
   - Human-readable: `username.village`
   - Portable across all villages
   - Replaces wallet address UX

2. **Decentralized Storage** (Walrus)
   - Profile pictures
   - Social post images
   - NFT artwork & certificates
   - Community content

3. **Tokenized Assets**
   - RWA NFTs with provenance (wine bottles, art, etc.)
   - Community-specific tokens ($CORK for wine collective)
   - Treasury management

4. **Social Layer**
   - Template-based posting
   - Cross-village discovery
   - Engagement rewards
   - Follow/community building

---

## 🏗️ Technical Architecture

### Blockchain Stack
```
┌─────────────────────────────────────┐
│         Frontend (React)            │
├─────────────────────────────────────┤
│  SUI Namespace SDK  │  Walrus SDK   │
├─────────────────────────────────────┤
│       SUI Blockchain                │
│  - Namespaces                       │
│  - NFT Smart Contracts              │
│  - Token Contracts ($CORK)          │
│  - Treasury Management              │
├─────────────────────────────────────┤
│       Walrus Storage                │
│  - Images & Media                   │
│  - User Content                     │
│  - NFT Metadata                     │
└─────────────────────────────────────┘
```

### Smart Contracts (SUI Move)

#### 1. Namespace Registry
```move
// Simplified structure
struct VillageNamespace {
    username: String,
    village: String,
    owner: address,
    profile_pic_url: String, // Walrus URI
    created_at: u64,
}
```

#### 2. Bottle NFT
```move
struct BottleNFT {
    id: UID,
    bottle_number: u64,
    wine_name: String,
    vintage: String,
    vineyard: String,
    harvest_date: String,
    bottling_date: String,
    image_url: String, // Walrus URI
    provenance_data: String, // JSON on Walrus
    owner: address,
}
```

#### 3. CORK Token
```move
struct CorkToken {
    total_supply: u64,
    treasury_balance: u64,
    village_id: String,
}

// Treasury receives 5% of all transactions
public fun purchase_bottle(
    payment: Coin<SUI>,
    bottle_id: u64,
    ctx: &mut TxContext
) {
    // 5% to treasury
    // 95% to seller/community
    // Mint CORK reward to buyer
}
```

---

## 🎨 Feature Specifications

### Phase 1: Core Features (Hackathon Deliverable)

#### 1.1 Onboarding Flow

**User Story:** *"As a new user, I want to join a village and claim my identity in under 2 minutes."*

**Steps:**
1. **Welcome Screen**
   - Value propositions
   - "Get Started" CTA
   
2. **Invite Code (Optional)**
   - Input: Text field for invite code
   - Validation: Check format `CORK-USERNAME-XXX`
   - Reward preview: "You and inviter earn 50 CORK"
   
3. **Village Selection**
   - Display: 3 villages (Lisbon, Porto, Berlin)
   - Info per village:
     - Name & country
     - Wine type
     - Member count
     - Treasury size
   - Action: Select one
   
4. **Namespace Claiming**
   - Input: Username (alphanumeric, 3-20 chars)
   - Display: Preview `@username.village`
   - Integration: **SUI Namespace registration**
   - Validation: Check availability
   - Transaction: Gasless via zkLogin
   
5. **Profile Picture**
   - Upload photo OR generate avatar
   - Integration: **Walrus upload**
   - Display: Walrus branding
   - Transaction: Store URI on-chain

**Success State:**
- User has `username.village` namespace on SUI
- Profile pic stored on Walrus
- 100 CORK welcome bonus
- Redirected to main app

**Technical Requirements:**
- SUI Namespace SDK for registration
- Walrus SDK for image upload
- zkLogin or embedded wallet (gasless)
- Local storage for session

---

#### 1.2 Shop & Purchase Flow

**User Story:** *"As a wine enthusiast, I want to buy a numbered bottle NFT with full provenance."*

**Shop Interface:**
- Grid view: 2 wines per village
- Per wine card:
  - Image (Walrus-hosted)
  - Name & description
  - Price in EUR
  - CORK reward amount
  - Availability: "23/50 available"
  - "Purchase Bottle" CTA

**Purchase Modal:**
1. **Transaction Breakdown**
   ```
   Bottle Price:        €45
   + CORK Reward:       +100 CORK
   Village Treasury:    €2.25 (5%)
   ```
   
2. **NFT Details**
   - Unique bottle number
   - Provenance data:
     - Vineyard: "Quinta do Vale, Alentejo"
     - Harvest: "September 2023"
     - Bottling: "March 2024"
     - Winemaker: "João Silva"
   - Stored on SUI, images on Walrus
   
3. **Confirm Purchase**
   - Transaction via SUI
   - Mint NFT with metadata
   - Transfer CORK tokens
   - 5% to village treasury

**Success State:**
- NFT appears in user profile
- CORK balance updated
- Transaction recorded
- QR code generated for bottle

**Technical Requirements:**
- NFT minting contract
- CORK token transfer
- Treasury allocation logic
- Walrus metadata storage
- QR code generation (links to namespace + bottle)

---

#### 1.3 Social Feed

**User Story:** *"As a community member, I want to see what's happening in my village and follow interesting people."*

**Feed Tabs:**
1. **My Village** - Activity from current village only
2. **Following** - Posts from users you follow (any village)
3. **All Villages** - Discovery feed (all activity)

**Post Types:**
- **Purchase**: "User bought Bottle #X"
- **Social Post**: User-generated content with image
- **Join**: "User joined Village"
- **Milestone**: "Village reached X members"

**Post Card Components:**
- Avatar + namespace (`@username.village`)
- Village badge
- Content text
- Image (if applicable) - Walrus-hosted
- Walrus indicator badge
- CORK reward earned (if applicable)
- Actions: Like, Comment, Share
- Timestamp

**Follow System:**
- One-click follow/unfollow
- Works across villages
- Shows follower/following counts
- Feed filters based on follows

**Technical Requirements:**
- Post indexing (can be local state for MVP)
- Walrus image display
- Follow state management
- Feed filtering logic

---

#### 1.4 Post Composer

**User Story:** *"As a member, I want to share my wine experiences and earn rewards."*

**Templates:**
1. "Just opened [bottle]! 🍷"
2. "Tasting notes: [text]"
3. "Visiting the vineyard 🍇"
4. "Write your own..."

**Composition Flow:**
1. Select template OR write custom
2. Add text content
3. Upload photo (optional)
   - Integration: **Walrus upload**
   - Max 1 image per post
4. Preview post
5. Publish

**Rewards:**
- Text-only post: 5 CORK
- Post with image: 10 CORK
- First post of day: +5 CORK bonus

**Success State:**
- Post appears in feed immediately
- CORK reward credited
- Walrus upload confirmed

**Technical Requirements:**
- Walrus image upload
- Post creation transaction
- CORK token mint/transfer
- Feed update trigger

---

#### 1.5 Profile & Identity

**User Story:** *"As a user, I want to view my collection, track rewards, and share my profile."*

**Profile Header:**
- Large avatar (Walrus-hosted)
- Namespace: `@username.village`
- Village badge
- Stats:
  - CORK balance
  - NFTs owned
  - Friends invited
  - Posts created

**Tabs:**

**1. My NFTs**
- Grid of owned bottle NFTs
- Per NFT:
  - Image
  - Name & bottle number
  - Acquisition date
  - Actions:
    - "View QR Code" - for verification
    - "View on Explorer" - SUI explorer link
    - "Share" - social sharing

**2. Activity**
- Transaction history
- Posts created
- Rewards earned
- Purchases made

**3. Rewards**
- CORK breakdown:
  - Welcome bonus: 100 CORK
  - Purchases: X CORK
  - Posts: Y CORK
  - Referrals: Z CORK
- Referral stats
- Invite link generator

**Technical Requirements:**
- NFT ownership query from SUI
- Token balance tracking
- Activity history indexing
- QR code generation

---

#### 1.6 Invite System

**User Story:** *"As an active member, I want to invite friends and earn rewards."*

**Invite Modal:**
- Generated invite code: `CORK-MARIA-5X9`
- Shareable link: `cork.collective/lisbon/join?ref=CODE`
- Copy buttons
- Share options: Email, Message, Social
- Stats:
  - Friends invited: 5
  - CORK earned: 250

**Mechanics:**
- Each invite code unique to user
- Tracked on-chain
- Both inviter and invitee earn 50 CORK
- Shown during onboarding

**Technical Requirements:**
- Code generation algorithm
- On-chain tracking
- Reward distribution
- Deep linking

---

#### 1.7 Village System

**User Story:** *"As a user, I can switch between villages and discover other communities."*

**Village Structure:**
```typescript
interface Village {
  id: string;           // 'lisbon', 'porto', 'berlin'
  name: string;         // 'Lisbon'
  country: string;      // 'Portugal'
  wineType: string;     // 'Orange Wine'
  color: string;        // Brand color
  members: number;
  treasury: number;     // In CORK
  wines: Wine[];
}
```

**Demo Villages:**

**1. Lisbon Village**
- Wine: Portuguese Orange Wine
- 2 bottle types (50 + 30 units)
- 47 members
- 2,500 CORK treasury

**2. Porto Village**
- Wine: Port Wine
- 2 bottle types (30 + 40 units)
- 32 members
- 1,800 CORK treasury

**3. Berlin Village**
- Wine: German Riesling
- 1 bottle type (25 units)
- 28 members
- 1,200 CORK treasury

**Village Switching:**
- Dropdown in header
- Instant switch
- Shop updates to village wines
- Feed "My Village" tab updates
- User's primary village = onboarding choice

**Technical Requirements:**
- Village data structure
- Content filtering by village
- Treasury tracking per village

---

### Phase 2: Future Features (Post-Hackathon)

#### 2.1 Governance
- Proposal creation
- Token-weighted voting
- Treasury allocation decisions

#### 2.2 Trading
- Secondary NFT marketplace
- Cross-village trading
- Price discovery

#### 2.3 Events
- Virtual tastings
- Vineyard visits
- Community meetups

#### 2.4 Advanced Social
- Direct messaging
- Group chats per village
- Video posts

#### 2.5 Multi-Asset Types
- Real estate tokens
- Art NFTs
- Event tickets
- Business network memberships

---

## 🎬 Hackathon Demo Script (5 Minutes)

### Act 1: Problem (30 seconds)
*"Local communities struggle to tokenize resources and build treasuries transparently. Wine makers, artists, neighborhoods need web3 infrastructure that feels like web2."*

### Act 2: Onboarding (45 seconds)
**[Screen Recording]**
- "I'm Maria, joining Lisbon Village with an invite from Pedro"
- Claim namespace: `maria.lisbon` ✓ SUI Namespace
- Upload profile pic ✓ Walrus storage
- "I now have portable identity across all villages"

### Act 3: Purchase (60 seconds)
**[Screen Recording]**
- Browse Lisbon wines - Portuguese Orange Wine
- Select Bottle #47
- Transaction breakdown:
  - €45 → 100 CORK earned → 5% to treasury
- NFT minted with provenance ✓ SUI blockchain
- Images stored ✓ Walrus
- QR code generated → resolves to namespace

*"Each bottle is a unique NFT with full provenance - harvest date, vineyard, winemaker notes. All stored on Walrus, permanent and decentralized."*

### Act 4: Social Engagement (60 seconds)
**[Screen Recording]**
- Open post composer
- Select template: "Just opened Bottle #47! 🍷"
- Upload tasting photo ✓ Walrus upload
- Post → "Earned 10 CORK!"
- Scroll feed:
  - Pedro's vineyard photo
  - Anna joined Berlin Village
  - João's tasting notes
- All images from Walrus

*"Social engagement earns rewards. Every photo uploads to Walrus - decentralized, permanent. The more I contribute, the more I earn."*

### Act 5: Network Effects (45 seconds)
**[Screen Recording]**
- Switch to "All Villages" feed
- See Porto Village - Port wine collective
- See Berlin Village - Riesling collective
- Follow @anna.berlin
- See cross-village activity
- Generate invite link

*"Villages are interconnected. I can follow Anna in Berlin, discover new communities, invite friends. Each village operates independently but shares infrastructure."*

### Act 6: Treasury & Impact (30 seconds)
**[Screen Recording]**
- Village treasury dashboard
- 2,500 CORK collected
- Transaction breakdown
- Future: Governance proposals

*"Every transaction feeds our treasury. This funds vineyard equipment, community events, local development. This is community-owned infrastructure."*

### Act 7: Vision (30 seconds)
**[Visuals: Map with villages lighting up]**

*"Wine is just the beginning. Imagine neighborhoods tokenizing local resources, artists funding galleries, communities building together. Urban Villages makes it possible. Powered by **SUI Namespace** for identity and **Walrus** for decentralized content. One platform, infinite communities."*

---

## 🔧 Technical Implementation

### SUI Namespace Integration

**Registration Flow:**
```typescript
import { SuiNamespace } from '@mysten/sui-namespace';

async function claimNamespace(username: string, village: string) {
  const namespace = `${username}.${village}`;
  
  // Check availability
  const available = await suiNamespace.checkAvailability(namespace);
  
  if (!available) {
    throw new Error('Namespace taken');
  }
  
  // Register on SUI
  const tx = await suiNamespace.register({
    namespace,
    owner: userAddress,
    metadata: {
      profilePicUrl: walrusImageUrl,
      village,
      createdAt: Date.now(),
    }
  });
  
  return tx;
}
```

**Resolution:**
```typescript
// QR code scans lead to:
// cork.collective/resolve/maria.lisbon

async function resolveNamespace(namespace: string) {
  const data = await suiNamespace.resolve(namespace);
  
  // Returns:
  // - Owner address
  // - Profile data
  // - Associated NFTs
  // - Village membership
}
```

---

### Walrus Integration

**Image Upload:**
```typescript
import { WalrusClient } from '@walrus/sdk';

async function uploadImage(file: File): Promise<string> {
  const walrus = new WalrusClient({
    network: 'testnet'
  });
  
  // Upload to Walrus
  const result = await walrus.upload(file);
  
  // Returns permanent URI
  // walrus://blob-id-here
  return result.uri;
}
```

**Image Retrieval:**
```typescript
// Display images from Walrus
<img 
  src={`https://walrus.gateway/${blobId}`}
  alt="Profile picture"
/>

// Or use SDK
const imageUrl = await walrus.getUrl(blobId);
```

**What Goes on Walrus:**
- ✅ Profile pictures
- ✅ Post images
- ✅ NFT bottle images
- ✅ NFT provenance certificates (JSON)
- ✅ Community event photos

---

### Smart Contract Architecture

**Deployment Plan:**
1. Deploy namespace registry contract
2. Deploy CORK token contract (per village)
3. Deploy bottle NFT contract
4. Deploy treasury management contract
5. Set up governance module (future)

**Testing:**
- Unit tests for each contract
- Integration tests for purchase flow
- Testnet deployment before demo
- Pre-mint 15 NFTs for demo (5 per village)

---

## 📊 Success Metrics

### Hackathon Judges Will See:

**1. Technical Integration ✓**
- [ ] SUI Namespace registration working
- [ ] Walrus uploads/retrieval working
- [ ] Smart contracts deployed on testnet
- [ ] Wallet integration (zkLogin)

**2. User Experience ✓**
- [ ] Onboarding < 2 minutes
- [ ] No wallet addresses visible (namespace everywhere)
- [ ] Smooth, web2-like UX
- [ ] Responsive design

**3. Innovation ✓**
- [ ] Multi-village architecture (scalable)
- [ ] Social layer + tokenization
- [ ] Real-world use case (wine provenance)
- [ ] Network effects demonstrated

**4. Completeness ✓**
- [ ] Full user journey working
- [ ] Multiple features integrated
- [ ] Professional design
- [ ] Clear value proposition

### Demo Success Criteria:
- ✅ 5-minute video: Clear narrative, no technical issues
- ✅ Live repo: Clean code, good documentation
- ✅ Presentation: Compelling vision + technical depth
- ✅ Q&A: Can explain architecture decisions

---

## ⏱️ 32-Hour Timeline

### Saturday (16 hours)

**Morning (0-6h): Foundation**
- [x] ~~Visual prototype~~ ✓ Complete
- [ ] SUI wallet setup + testnet
- [ ] SUI Namespace SDK integration
- [ ] Walrus SDK integration
- [ ] Test namespace registration
- [ ] Test Walrus upload

**Afternoon (6-12h): Blockchain Core**
- [ ] Deploy CORK token contract
- [ ] Deploy bottle NFT contract
- [ ] Deploy namespace registry
- [ ] Test minting flow
- [ ] Pre-mint 15 demo NFTs
- [ ] **RECORD onboarding footage**

**Evening (12-16h): Commerce**
- [ ] Wire up purchase flow to contracts
- [ ] Token transfer logic
- [ ] Treasury allocation
- [ ] QR code generation
- [ ] **RECORD purchase footage**

### Sunday (16 hours)

**Morning (16-22h): Social Layer**
- [ ] Post creation with Walrus
- [ ] Feed data population
- [ ] Follow system refinement
- [ ] Village switching polish
- [ ] **RECORD social footage**

**Afternoon (22-26h): Polish**
- [ ] Profile NFT display
- [ ] Invite system
- [ ] Treasury dashboard
- [ ] Responsive design check
- [ ] **RECORD network effects footage**

**Evening (26-32h): Video & Presentation**
- [ ] Edit demo video (5 min)
- [ ] Voice over recording
- [ ] Add graphics/overlays
- [ ] Presentation deck (10 slides)
- [ ] README documentation
- [ ] Submit to hackathon

---

## 🎯 Differentiation Strategy

### Why We'll Win:

**1. Complete User Journey**
- Not just a feature demo - full onboarding to purchase to social
- Shows realistic use case, not just concept

**2. Both Integrations Seamlessly Used**
- SUI Namespace: Core to identity system, not bolted on
- Walrus: Solves real storage problem for social/NFTs

**3. Scalable Vision**
- Multi-village shows network effects
- Clear path from wine → any community
- UrbanVillages platform potential

**4. Web2 UX**
- No wallet addresses visible
- Gasless transactions
- Familiar social feed
- < 2 min onboarding

**5. Real-World Validation**
- Actual wine maker building this
- Existing community to onboard
- Clear GTM strategy

---

## 📦 Deliverables Checklist

### Code Repository:
- [ ] Clean, documented codebase
- [ ] Smart contracts in `/contracts`
- [ ] Frontend in `/src`
- [ ] README with setup instructions
- [ ] Architecture documentation
- [ ] Integration guides (SUI + Walrus)

### Demo Assets:
- [ ] 5-minute demo video
- [ ] Presentation deck (PDF)
- [ ] Live demo link (if possible)
- [ ] Screenshots/GIFs

### Documentation:
- [ ] Product spec (this document)
- [ ] Technical architecture diagram
- [ ] Smart contract documentation
- [ ] API integration docs
- [ ] Future roadmap

---

## 🚀 Post-Hackathon Roadmap

### Week 1-2: Launch MVP
- Deploy to mainnet
- Onboard Lisbon wine collective (real users)
- Test with 50-100 members

### Month 1-3: Expand
- Add 2-3 more wine villages
- Implement governance
- Launch secondary marketplace

### Month 3-6: Scale
- Open platform to other asset types
- 10+ villages across Europe
- 1,000+ members

### Month 6-12: Platform
- Self-service village creation
- Multi-chain support
- Mobile apps
- 100+ villages, 10,000+ members

---

## 💬 Pitch Deck Outline

**Slide 1: Title**
- Cork Collective: Community-Owned Economies
- SUI Namespace + Walrus Integration

**Slide 2: Problem**
- Communities can't tokenize resources
- No transparent treasury mechanisms
- Web3 too complex for normal users

**Slide 3: Solution**
- Urban Villages platform
- Location-based tokenized collectives
- Web2 UX, Web3 infrastructure

**Slide 4: How It Works**
- Namespace identity (SUI)
- Decentralized storage (Walrus)
- NFT provenance + token rewards
- Social engagement layer

**Slide 5: Demo - Onboarding**
- Claim `maria.lisbon`
- Walrus profile storage
- < 2 min signup

**Slide 6: Demo - Purchase**
- Buy bottle NFT
- Provenance on SUI
- Images on Walrus
- Earn CORK tokens

**Slide 7: Demo - Social**
- Post with Walrus images
- Cross-village discovery
- Engagement rewards

**Slide 8: Network Effects**
- 3 villages demonstrated
- Scalable architecture
- Any asset type, any community

**Slide 9: Technical Architecture**
- SUI Namespace for identity
- Walrus for content
- Smart contracts for economy
- zkLogin for UX

**Slide 10: Vision**
- Wine → Art → Real Estate → Events
- 100 villages, 10,000 members
- Community-owned infrastructure
- Powered by SUI ecosystem

---

## 📞 Contact & Resources

**GitHub:** `github.com/cork-collective/urban-villages`  
**Demo:** `cork.collective`  
**Deck:** `pitch.cork.collective`

**SUI Namespace Docs:** [link]  
**Walrus SDK Docs:** [link]  
**Smart Contracts:** `/contracts` folder

---

## ✅ Final Pre-Launch Checklist

**48 Hours Before:**
- [ ] All SDKs installed and tested
- [ ] Testnet wallets funded
- [ ] Demo data prepared
- [ ] Video recording setup tested

**24 Hours Before:**
- [ ] Core integrations working
- [ ] Demo flow rehearsed
- [ ] Backup plans ready
- [ ] Sleep 😴

**Submission:**
- [ ] Video uploaded
- [ ] Code repo public
- [ ] Documentation complete
- [ ] Presentation ready

---

**Let's build the future of community-owned economies. 🍷**
