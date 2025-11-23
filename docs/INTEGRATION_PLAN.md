# Cork Collective - BSA SUI Template Integration Plan

## 🎯 Template Information

**Base Repository:** https://github.com/bsaepfl/bsa-sui-template-frontend-2025  
**Branch:** feature/walrus-upload  
**Status:** MUST USE - This is our foundation

---

## 📋 Step 1: Analyze Template (URGENT - Do This First)

### What We Need to Find:

#### 1. Project Structure
```
What does the template provide?
├── /src
│   ├── /components     - Existing UI components?
│   ├── /lib           - SDK integrations?
│   ├── /hooks         - SUI/Walrus hooks?
│   └── /utils         - Helper functions?
├── /contracts         - Move smart contracts?
├── package.json       - Dependencies?
└── README.md          - Setup instructions?
```

#### 2. SUI Integration Status
- [ ] Is @mysten/sui.js installed?
- [ ] Is wallet connection set up?
- [ ] Are there example smart contract calls?
- [ ] Is testnet configured?
- [ ] Is zkLogin implemented?

#### 3. Walrus Integration Status
- [ ] Is Walrus SDK installed?
- [ ] Is upload functionality working?
- [ ] How do we call the upload?
- [ ] How do we retrieve images?
- [ ] Are there UI components for upload?

#### 4. Existing Features
- [ ] Authentication/wallet connection?
- [ ] Profile system?
- [ ] Any sample contracts deployed?
- [ ] Styling framework (Tailwind?)?
- [ ] Component library (shadcn/ui?)?

---

## 🔧 Step 2: Adaptation Strategy

### Scenario A: Template Has Basic SUI + Walrus Setup

**What We Keep:**
- ✅ SUI wallet connection logic
- ✅ Walrus upload implementation
- ✅ Project structure & build config
- ✅ Any existing hooks/utilities

**What We Add:**
- 🆕 Cork Collective UI components (from our prototype)
- 🆕 Multi-village data structures
- 🆕 Social feed components
- 🆕 Shop & NFT minting
- 🆕 Namespace claiming flow
- 🆕 Token economics

**Integration Approach:**
```
1. Clone template
2. Keep /lib folder (SDK integrations)
3. Replace /components with our Cork Collective components
4. Adapt our components to use template's SUI/Walrus hooks
5. Deploy our smart contracts
6. Wire everything together
```

---

### Scenario B: Template Has Advanced Features

**If Template Includes:**
- Profile system → Adapt for namespace identity
- Upload UI → Use for post composer
- NFT examples → Adapt for bottle NFTs
- Token examples → Adapt for CORK token

**Integration Approach:**
```
1. Map template features to Cork Collective features
2. Extend rather than replace
3. Reuse existing smart contracts if applicable
4. Build Cork-specific logic on top
```

---

## 🚀 Step 3: Implementation Checklist

### Phase 1: Template Setup (Hours 0-2)
- [ ] Clone repository
- [ ] Checkout `feature/walrus-upload` branch
- [ ] Install dependencies
- [ ] Run template locally
- [ ] Test Walrus upload functionality
- [ ] Test SUI wallet connection
- [ ] Review all existing code

### Phase 2: Cork Collective Integration (Hours 2-8)
- [ ] Create `/components/cork` folder for our components
- [ ] Import our Onboarding flow
- [ ] Import our Shop components
- [ ] Import our Feed components
- [ ] Adapt to use template's SUI hooks
- [ ] Adapt to use template's Walrus hooks
- [ ] Test each component individually

### Phase 3: Smart Contracts (Hours 8-14)
- [ ] Review template's contract structure
- [ ] Deploy namespace registry contract
- [ ] Deploy CORK token contract
- [ ] Deploy bottle NFT contract
- [ ] Connect frontend to contracts
- [ ] Test minting flow
- [ ] Pre-mint demo NFTs

### Phase 4: Features (Hours 14-24)
- [ ] Complete onboarding with real SUI Namespace
- [ ] Complete shop with real minting
- [ ] Complete feed with real Walrus uploads
- [ ] Complete profile with real NFT display
- [ ] Add invite system
- [ ] Add village switching

### Phase 5: Demo & Polish (Hours 24-32)
- [ ] Record demo footage
- [ ] Edit video
- [ ] Write documentation
- [ ] Prepare presentation
- [ ] Final testing
- [ ] Submit

---

## 📝 Code Adaptation Examples

### Example 1: Using Template's Walrus Upload

**If template has:**
```typescript
// From template
import { useWalrusUpload } from '@/lib/walrus';

function UploadExample() {
  const { upload, isUploading } = useWalrusUpload();
  
  const handleUpload = async (file: File) => {
    const uri = await upload(file);
    return uri;
  };
}
```

**We adapt our PostComposer:**
```typescript
// Our Cork Collective adaptation
import { useWalrusUpload } from '@/lib/walrus'; // From template

export function PostComposer({ user }: PostComposerProps) {
  const { upload, isUploading } = useWalrusUpload(); // Use template's hook
  const [imageUri, setImageUri] = useState<string>('');
  
  const handleImageUpload = async (file: File) => {
    const uri = await upload(file); // Template's upload
    setImageUri(uri);
    // Then create post with this URI
  };
  
  // Rest of our component...
}
```

---

### Example 2: Using Template's SUI Integration

**If template has:**
```typescript
// From template
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';

function MintExample() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  
  const mint = async () => {
    const tx = new TransactionBlock();
    // ... minting logic
  };
}
```

**We adapt our PurchaseModal:**
```typescript
// Our Cork Collective adaptation
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';

export function PurchaseModal({ wine }: PurchaseModalProps) {
  const client = useSuiClient();
  const account = useCurrentAccount();
  
  const handlePurchase = async () => {
    const tx = new TransactionBlock();
    
    // Mint bottle NFT
    tx.moveCall({
      target: `${PACKAGE_ID}::bottle::mint`,
      arguments: [
        tx.pure(wine.id),
        tx.pure(wine.name),
        // ... other args
      ],
    });
    
    // Transfer CORK tokens
    tx.moveCall({
      target: `${PACKAGE_ID}::cork::transfer_reward`,
      arguments: [
        tx.pure(wine.corkReward),
        tx.pure(account.address),
      ],
    });
    
    await client.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: account,
    });
  };
  
  // Rest of our component...
}
```

---

### Example 3: Adapting Routing

**If template uses:**
```typescript
// Template routing
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
```

**We adapt for Cork Collective:**
```typescript
// Our routing with villages
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Onboarding } from './components/cork/Onboarding';
import { MainApp } from './components/cork/MainApp';

function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  
  return (
    <Routes>
      <Route path="/" element={
        isOnboarded ? <MainApp /> : <Onboarding onComplete={handleOnboard} />
      } />
      <Route path="/:village/join" element={<Onboarding />} />
      <Route path="/resolve/:namespace" element={<NamespaceResolver />} />
    </Routes>
  );
}
```

---

## 🎯 Critical Questions to Answer (From Template Analysis)

### 1. Wallet Integration
- **Q:** Does template use @mysten/dapp-kit?
- **Q:** Is zkLogin set up or traditional wallet connect?
- **Q:** Can we do gasless transactions?

### 2. Walrus Implementation
- **Q:** What's the upload endpoint?
- **Q:** How are images retrieved?
- **Q:** Are there rate limits we need to handle?
- **Q:** Is there a UI component for file selection?

### 3. Smart Contract Structure
- **Q:** Are there example Move contracts?
- **Q:** Is there a deployment script?
- **Q:** What network (testnet/devnet)?
- **Q:** Are contract addresses configurable?

### 4. Styling & Components
- **Q:** Is Tailwind configured?
- **Q:** Is shadcn/ui installed?
- **Q:** What's the design system?
- **Q:** Can we use our existing components?

### 5. State Management
- **Q:** Is there state management (Zustand, Redux)?
- **Q:** How is user session handled?
- **Q:** Is there local storage usage?

---

## 📦 Files to Check First

### Priority 1: Configuration
```
1. package.json          - Dependencies
2. tsconfig.json         - TypeScript config
3. .env.example          - Environment variables
4. README.md            - Setup instructions
```

### Priority 2: Integration Code
```
5. /lib/walrus.ts       - Walrus integration
6. /lib/sui.ts          - SUI integration
7. /hooks/useSui.ts     - Custom hooks
8. /hooks/useWalrus.ts  - Walrus hooks
```

### Priority 3: Example Components
```
9. /components/Upload*   - Upload components
10. /components/Wallet*  - Wallet components
11. /components/Profile* - Profile components
12. /app/page.tsx       - Main entry point
```

### Priority 4: Smart Contracts
```
13. /contracts/**/*      - Move contracts
14. /scripts/deploy.*    - Deployment scripts
```

---

## 🔄 Migration Path for Our Prototype

### Current Prototype Components → Template Integration

| Our Component | Template Integration Strategy |
|--------------|-------------------------------|
| `Onboarding.tsx` | Adapt to use template's wallet connect |
| `MainApp.tsx` | Use as main layout, integrate template's providers |
| `Feed.tsx` | Keep UI, use template's data fetching |
| `Shop.tsx` | Keep UI, use template's contract calls |
| `PostComposer.tsx` | Use template's Walrus upload hook |
| `Profile.tsx` | Keep UI, use template's NFT queries |
| `PurchaseModal.tsx` | Use template's transaction signing |

---

## ⚠️ Risk Mitigation

### Risk 1: Template is Too Basic
**If:** Template only has minimal setup  
**Mitigation:** We have full implementation ready from prototype  
**Time Impact:** +4-6 hours to integrate from scratch

### Risk 2: Template Structure is Incompatible
**If:** Template uses different patterns (Next.js vs Vite, etc.)  
**Mitigation:** Adapt our components to match template patterns  
**Time Impact:** +3-4 hours refactoring

### Risk 3: SDK Versions Mismatch
**If:** Template uses older/newer SDK versions  
**Mitigation:** Test thoroughly, use template's versions  
**Time Impact:** +2-3 hours debugging

### Risk 4: Walrus Upload Has Issues
**If:** Upload is buggy or limited  
**Mitigation:** Mock Walrus for demo, show code  
**Time Impact:** Explain in pitch, show integration attempt

---

## ✅ Next Steps (IMMEDIATE)

### Step 1: Get Template Locally
```bash
# Clone the repository
git clone https://github.com/bsaepfl/bsa-sui-template-frontend-2025.git

# Checkout the branch
cd bsa-sui-template-frontend-2025
git checkout feature/walrus-upload

# Install dependencies
npm install

# Run locally
npm run dev
```

### Step 2: Analyze & Document
- [ ] Run the template
- [ ] Test Walrus upload
- [ ] Test SUI wallet
- [ ] Read all /lib files
- [ ] Check package.json dependencies
- [ ] Document findings

### Step 3: Create Integration Branch
```bash
# Create our branch
git checkout -b cork-collective-integration

# Start building
```

### Step 4: Begin Integration
- [ ] Create `/components/cork` folder
- [ ] Copy our prototype components
- [ ] Start adapting one by one
- [ ] Test each component

---

## 📞 Questions for Template Authors (If Needed)

If we get stuck, we can ask the BSA EPFL team:

1. **Walrus Upload:**
   - "What's the expected file size limit?"
   - "How do we retrieve uploaded images?"
   - "Is there error handling implemented?"

2. **SUI Integration:**
   - "Which testnet should we use?"
   - "Are example contracts included?"
   - "Is zkLogin configured?"

3. **Deployment:**
   - "What's the deployment process?"
   - "Are there environment variables needed?"

---

## 🎯 Success Criteria

**Template Integration is Successful When:**
- ✅ Can upload to Walrus from our components
- ✅ Can connect SUI wallet from our onboarding
- ✅ Can mint NFTs using template's patterns
- ✅ Can query blockchain data
- ✅ All our Cork Collective features work
- ✅ Demo is smooth and professional

---

## 📊 Revised Timeline (With Template)

### Hours 0-4: Template Integration
- Clone, setup, analyze template
- Test all template features
- Plan integration approach
- Create Cork components folder

### Hours 4-12: Core Features
- Integrate onboarding
- Integrate shop
- Wire up Walrus uploads
- Wire up SUI contracts

### Hours 12-20: Advanced Features  
- Social feed
- Profile system
- Village switching
- Invite system

### Hours 20-28: Polish & Demo
- Bug fixes
- Demo recording
- Documentation
- Presentation

### Hours 28-32: Submission
- Video editing
- Final testing
- Repo cleanup
- Submit

---

**NEXT ACTION: Please share key files from the template or give me access so I can analyze the structure and create the exact integration plan!**

Specifically, I need to see:
1. `package.json`
2. `/lib/walrus.ts` (or similar)
3. `/lib/sui.ts` (or similar)  
4. `README.md`
5. Main `App.tsx` or `page.tsx`

Then I can build Cork Collective perfectly on top of this template! 🚀
