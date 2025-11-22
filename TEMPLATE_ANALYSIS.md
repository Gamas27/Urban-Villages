# Urban Villages Repository - Template Analysis

## 📊 Current Repository Structure

**Repository:** https://github.com/Gamas27/Urban-Villages  
**Framework:** Next.js 15 + React 19  
**Status:** BSA SUI Template with Counter example app

---

## ✅ What's Already Set Up

### 1. **SUI Integration** ✓
```json
"@mysten/dapp-kit": "0.18.0",
"@mysten/sui": "1.38.0",
"@tanstack/react-query": "^5.87.1"
```

**Files:**
- `app/networkConfig.ts` - Network configuration
- `app/providers.tsx` - SUI providers setup
- `app/App.tsx` - Example using `useCurrentAccount`
- `app/Counter.tsx` - Example contract interactions
- `app/CreateCounter.tsx` - Example contract calls

**What This Gives Us:**
- ✅ Wallet connection working
- ✅ Account management
- ✅ Transaction signing
- ✅ Contract interaction patterns
- ✅ Query client setup

---

### 2. **UI Components** ✓
```json
"@radix-ui/react-navigation-menu": "^1.2.14",
"@radix-ui/react-slot": "^1.2.3",
"lucide-react": "^0.544.0"
```

**Files:**
- `app/components/ui/` - shadcn/ui components
- `app/components/Navbar.tsx` - Navigation example
- `app/lib/utils.ts` - cn() utility

**What This Gives Us:**
- ✅ shadcn/ui already configured
- ✅ Tailwind CSS 4.1.13
- ✅ Component library ready
- ✅ Radix UI primitives

---

### 3. **Project Structure** ✓
```
app/
├── App.tsx              - Main app logic
├── components/          - React components
│   ├── ui/             - shadcn/ui components
│   ├── Navbar.tsx      - Example component
│   └── CounterList.tsx - List component
├── lib/                - Utilities
├── providers.tsx       - Context providers
├── layout.tsx          - Root layout
├── page.tsx            - Home page
├── globals.css         - Global styles
├── networkConfig.ts    - SUI network config
└── constants.ts        - App constants

move/
└── counter/            - Example Move contracts
```

---

## ❌ What's Missing (Need to Add)

### 1. **Walrus Integration**
- ❌ No Walrus SDK installed
- ❌ No upload functionality
- ❌ No image retrieval

**Action Required:**
- Install Walrus SDK
- Create `app/lib/walrus.ts`
- Create upload hook

---

### 2. **SUI Namespace Integration**
- ❌ No namespace SDK
- ❌ No registration logic

**Action Required:**
- Research SUI Namespace SDK
- Create `app/lib/namespace.ts`
- Implement claiming flow

---

### 3. **Cork Collective Components**
- ❌ No onboarding flow
- ❌ No shop/NFT components
- ❌ No social feed
- ❌ No village system

**Action Required:**
- Migrate our prototype components
- Adapt to Next.js structure
- Use existing SUI patterns

---

## 🔄 Migration Strategy

### Phase 1: Add Missing Integrations (Hours 0-6)

#### 1.1 Install Walrus SDK
```bash
pnpm add @walrus-sdk/client  # or whatever the package is
```

#### 1.2 Create Walrus Integration
```typescript
// app/lib/walrus.ts
export async function uploadToWalrus(file: File): Promise<string> {
  // Implementation
}

export function getWalrusUrl(blobId: string): string {
  // Implementation
}
```

#### 1.3 Create Namespace Integration
```typescript
// app/lib/namespace.ts
export async function claimNamespace(
  username: string,
  village: string
): Promise<string> {
  // Implementation
}
```

---

### Phase 2: Migrate Cork Collective Components (Hours 6-14)

#### 2.1 Keep Template Structure
```
app/
├── cork/                    # New folder for Cork Collective
│   ├── Onboarding.tsx      # From our prototype
│   ├── MainApp.tsx         # From our prototype
│   ├── Feed.tsx            # From our prototype
│   ├── Shop.tsx            # From our prototype
│   ├── Profile.tsx         # From our prototype
│   └── ...
├── components/             # Keep existing
├── lib/                    # Add walrus.ts, namespace.ts
└── page.tsx               # Update to use Cork Collective
```

#### 2.2 Adapt Components to Next.js
**Our Prototype (Vite/React):**
```tsx
import { Button } from './ui/button';
```

**Next.js Structure:**
```tsx
import { Button } from '@/components/ui/button';
```

---

### Phase 3: Smart Contracts (Hours 14-20)

#### 3.1 Replace Counter Example
```
move/
├── counter/         # Remove or keep for reference
├── cork_token/      # New: CORK token contract
├── bottle_nft/      # New: Bottle NFT contract
└── namespace/       # New: Namespace registry
```

#### 3.2 Deploy Contracts
- Deploy to SUI testnet
- Update `app/constants.ts` with addresses

---

### Phase 4: Wire Everything Up (Hours 20-26)

#### 4.1 Update Entry Points
```typescript
// app/page.tsx
import CorkCollective from "./cork/CorkCollective";

export default function Home() {
  return <CorkCollective />;
}
```

#### 4.2 Update Providers
```typescript
// app/providers.tsx - already has SUI providers
// Just ensure it wraps our Cork components
```

---

## 🎯 Concrete Next Steps

### Step 1: Install Dependencies (Now)
```bash
cd Urban-Villages

# Install Walrus (need to find correct package)
pnpm add @walrus/sdk  # TBD - need actual package name

# Install any additional UI components we need
pnpm dlx shadcn-ui@latest add dialog
pnpm dlx shadcn-ui@latest add tabs
pnpm dlx shadcn-ui@latest add avatar
# ... etc
```

### Step 2: Create Integration Files
1. `app/lib/walrus.ts` - Walrus upload/retrieval
2. `app/lib/namespace.ts` - Namespace claiming
3. `app/constants.ts` - Update with Cork constants

### Step 3: Create Cork Folder
```bash
mkdir app/cork
```

Then copy our prototype components:
- Onboarding.tsx
- MainApp.tsx
- Feed.tsx
- Shop.tsx
- Profile.tsx
- PostComposer.tsx
- PurchaseModal.tsx
- InviteModal.tsx

### Step 4: Adapt Components
Update all imports from:
```tsx
import { Button } from './ui/button';
```

To:
```tsx
import { Button } from '@/components/ui/button';
```

### Step 5: Replace App.tsx
Either:
- A) Replace `app/App.tsx` with Cork logic
- B) Create `app/cork/CorkApp.tsx` and import in `page.tsx`

---

## 📝 Template Pattern Analysis

### How the Template Works

**1. Wallet Connection:**
```typescript
// app/providers.tsx
export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
```

**2. Using Current Account:**
```typescript
// Any component
import { useCurrentAccount } from "@mysten/dapp-kit";

function MyComponent() {
  const currentAccount = useCurrentAccount();
  
  if (!currentAccount) {
    return <p>Please connect wallet</p>;
  }
  
  return <p>Connected: {currentAccount.address}</p>;
}
```

**3. Contract Interactions:**
```typescript
// app/Counter.tsx example
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";

const { mutate: signAndExecute } = useSignAndExecuteTransaction();

const handleIncrement = () => {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::counter::increment`,
    arguments: [tx.object(counterId)],
  });

  signAndExecute({
    transaction: tx,
  }, {
    onSuccess: (result) => {
      console.log('Success!', result);
    },
  });
};
```

---

## 🔧 Cork Collective Adaptations

### Onboarding Component
```typescript
// app/cork/Onboarding.tsx

'use client'
import { useCurrentAccount } from "@mysten/dapp-kit";
import { claimNamespace } from "@/lib/namespace";
import { uploadToWalrus } from "@/lib/walrus";

export function Onboarding({ onComplete }) {
  const currentAccount = useCurrentAccount();
  
  // Use template's wallet connection
  // Add namespace claiming
  // Add Walrus upload
  
  // ... rest of our onboarding logic
}
```

### Shop Component
```typescript
// app/cork/Shop.tsx

'use client'
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { CORK_PACKAGE_ID } from "@/constants";

export function Shop({ village }) {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const handlePurchase = (wine) => {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${CORK_PACKAGE_ID}::bottle::mint`,
      arguments: [
        tx.pure(wine.id),
        tx.pure(wine.name),
        // ...
      ],
    });
    
    signAndExecute({ transaction: tx });
  };
  
  // ... rest of shop logic
}
```

---

## ⚠️ Critical Issues to Resolve

### 1. Walrus SDK - URGENT
**Problem:** Don't know the exact package name/usage  
**Solution:** Need to:
- Check BSA template documentation
- Look for `feature/walrus-upload` branch in bsaepfl/bsa-sui-template-frontend-2025
- Find example Walrus code

### 2. SUI Namespace SDK - URGENT  
**Problem:** Not sure if there's an official SDK  
**Solution:** Need to:
- Research SUI Namespace documentation
- May need to interact with Move contracts directly
- Check hackathon resources

### 3. Move Contracts - MEDIUM
**Problem:** Need to write Cork-specific contracts  
**Solution:**
- Use `move/counter` as reference
- Write cork_token, bottle_nft, namespace contracts
- Deploy to testnet

---

## 📊 Compatibility Matrix

| Feature | Template Has | We Need | Action |
|---------|-------------|---------|--------|
| Next.js | ✅ v15 | ✅ | Compatible |
| React | ✅ v19 | ✅ | Compatible |
| Tailwind | ✅ v4.1 | ✅ | Compatible |
| shadcn/ui | ✅ | ✅ | Compatible |
| SUI SDK | ✅ v1.38 | ✅ | Compatible |
| Wallet | ✅ dapp-kit | ✅ | Compatible |
| Walrus | ❌ | ✅ | **ADD** |
| Namespace | ❌ | ✅ | **ADD** |
| Move Contracts | ✅ Example | ✅ Custom | **REPLACE** |

---

## 🚀 Immediate Action Plan

### TODAY - Integration Setup (4 hours)
1. ✅ Analyze template (DONE)
2. ⏳ Find Walrus SDK documentation
3. ⏳ Find SUI Namespace documentation
4. ⏳ Create `app/lib/walrus.ts` stub
5. ⏳ Create `app/lib/namespace.ts` stub
6. ⏳ Test basic integration

### TOMORROW - Build Cork Collective (28 hours)
7. Migrate all prototype components to `app/cork/`
8. Adapt imports and patterns
9. Write Move contracts
10. Deploy contracts
11. Wire up all functionality
12. Test complete flow
13. Record demo video
14. Submit!

---

## 💡 Key Insights

1. **Template is solid** - Next.js + SUI already working
2. **Main gap is Walrus** - Need to add this SDK
3. **Namespace might be tricky** - May need direct Move calls
4. **Our UI is ready** - Just need to adapt imports
5. **Smart contracts** - Biggest unknown, need to write from scratch

---

## 🤔 Open Questions

1. **Walrus SDK:** What's the actual package? Is it `@walrus/sdk`? Check bsaepfl template
2. **Namespace SDK:** Is there an SDK or do we call Move directly?
3. **zkLogin:** Template uses regular wallet - do we need zkLogin for gasless?
4. **Testnet:** Which testnet is configured? Do we need to change?
5. **Pre-minting:** Should we pre-mint NFTs before hackathon starts?

---

**Next Step: Find the Walrus SDK documentation and update this plan!**
