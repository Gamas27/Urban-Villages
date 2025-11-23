# 🚀 CORK COLLECTIVE - QUICK START GUIDE
## From Current State → Hackathon Submission in 32 Hours

---

## ✅ WHAT WE HAVE

### Your Repository: https://github.com/Gamas27/Urban-Villages
- ✅ Next.js 15 + React 19
- ✅ SUI SDK installed (`@mysten/dapp-kit` + `@mysten/sui`)
- ✅ Wallet connection working
- ✅ Tailwind CSS + shadcn/ui
- ✅ Counter example (shows SUI patterns)
- ✅ Project structure ready

### BSA Template: https://github.com/bsaepfl/bsa-sui-template-frontend-2025
- ✅ Walrus integration example found! (`WalrusUpload.tsx`)
- ✅ Packages: `@mysten/walrus@^0.8.4` + `walrus@^0.10.1`
- ✅ Complete upload flow implementation

---

## 🎯 IMMEDIATE ACTIONS (Next 2 Hours)

### 1. Install Walrus Packages
```bash
cd Urban-Villages
pnpm add @mysten/walrus@^0.8.4 walrus@^0.10.1
```

### 2. Create Integration Files
Copy these files I created for you:

```bash
# Create directories
mkdir -p app/lib/hooks
mkdir -p app/cork

# Copy files from my workspace
# ↓ These are ready to use
app/lib/walrus.ts
app/lib/hooks/useWalrusUpload.ts
app/components/WalrusImage.tsx
```

### 3. Update package.json
Ensure your dependencies match:
```json
{
  "@mysten/dapp-kit": "^0.19.9",
  "@mysten/sui": "^1.45.0",
  "@mysten/walrus": "^0.8.4",
  "walrus": "^0.10.1"
}
```

### 4. Test Walrus Upload
Create a simple test component:

```typescript
// app/test-walrus/page.tsx
'use client';

import { useWalrusUpload } from '@/lib/hooks/useWalrusUpload';

export default function TestWalrus() {
  const { uploadFile, uploading, error } = useWalrusUpload();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const result = await uploadFile(file);
    if (result) {
      alert(`Success! BlobID: ${result.blobId}`);
    }
  };

  return (
    <div className="p-8">
      <h1>Test Walrus Upload</h1>
      <input type="file" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

Run: `pnpm dev` and test at `http://localhost:3000/test-walrus`

---

## 🏗️ BUILD CORK COLLECTIVE (Next 24 Hours)

### Phase 1: Core Components (Hours 2-8)

#### 1.1 Create Village Data Structure
```typescript
// app/cork/data/villages.ts
export interface Village {
  id: string;
  name: string;
  country: string;
  wineType: string;
  color: string;
  members: number;
  treasury: number;
}

export const VILLAGES: Village[] = [
  {
    id: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    wineType: 'Orange Wine',
    color: '#FF6B35',
    members: 47,
    treasury: 2500,
  },
  {
    id: 'porto',
    name: 'Porto',
    country: 'Portugal',
    wineType: 'Port Wine',
    color: '#8B0000',
    members: 32,
    treasury: 1800,
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    wineType: 'Riesling',
    color: '#FFD700',
    members: 28,
    treasury: 1200,
  },
];
```

#### 1.2 Create Onboarding Flow
```typescript
// app/cork/Onboarding.tsx
'use client';

import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useWalrusUpload } from '@/lib/hooks/useWalrusUpload';
import { VILLAGES } from './data/villages';

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const account = useCurrentAccount();
  const { uploadFile, uploading } = useWalrusUpload();
  
  const [step, setStep] = useState(1); // 1=village, 2=username, 3=profile
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [profilePicBlobId, setProfilePicBlobId] = useState<string | null>(null);

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file);
    if (result) {
      setProfilePicBlobId(result.blobId);
    }
  };

  const handleComplete = () => {
    // TODO: Register namespace on SUI
    // Format: username.village (e.g., maria.lisbon)
    // Store profilePicBlobId in metadata
    
    onComplete();
  };

  // ... UI for 3-step flow
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-purple-50">
      {/* Step 1: Village Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">Choose Your Village</h1>
          <div className="grid grid-cols-3 gap-4">
            {VILLAGES.map((village) => (
              <button
                key={village.id}
                onClick={() => {
                  setSelectedVillage(village.id);
                  setStep(2);
                }}
                className="p-6 border-2 rounded-lg hover:border-blue-500"
              >
                <h3 className="text-xl font-bold">{village.name}</h3>
                <p>{village.wineType}</p>
                <p className="text-sm text-gray-600">{village.members} members</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Username */}
      {step === 2 && (
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">Claim Your Namespace</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full p-4 border rounded-lg"
          />
          <p className="text-lg">
            Your namespace: <strong>@{username}.{selectedVillage}</strong>
          </p>
          <button
            onClick={() => setStep(3)}
            disabled={!username}
            className="w-full bg-blue-600 text-white p-4 rounded-lg"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 3: Profile Picture */}
      {step === 3 && (
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">Upload Profile Picture</h1>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicUpload}
            disabled={uploading}
            className="w-full"
          />
          {uploading && <p>Uploading to Walrus...</p>}
          {profilePicBlobId && (
            <img
              src={`https://aggregator.walrus-testnet.walrus.space/v1/${profilePicBlobId}`}
              alt="Profile"
              className="w-32 h-32 rounded-full"
            />
          )}
          <button
            onClick={handleComplete}
            disabled={!profilePicBlobId || uploading}
            className="w-full bg-blue-600 text-white p-4 rounded-lg"
          >
            Complete Onboarding
          </button>
        </div>
      )}
    </div>
  );
}
```

#### 1.3 Create Main App Shell
```typescript
// app/cork/CorkApp.tsx
'use client';

import { useState } from 'react';
import { Onboarding } from './Onboarding';
import { MainApp } from './MainApp';

export default function CorkApp() {
  const [isOnboarded, setIsOnboarded] = useState(false);

  if (!isOnboarded) {
    return <Onboarding onComplete={() => setIsOnboarded(true)} />;
  }

  return <MainApp />;
}
```

#### 1.4 Update Main Page
```typescript
// app/page.tsx
import CorkApp from "./cork/CorkApp";

export default function Home() {
  return <CorkApp />;
}
```

---

### Phase 2: Social Features (Hours 8-16)

#### 2.1 Feed Component
```typescript
// app/cork/Feed.tsx
'use client';

import { WalrusImage } from '@/components/WalrusImage';

interface Post {
  id: string;
  author: string;
  namespace: string;
  village: string;
  text: string;
  imageBlobId?: string;
  timestamp: number;
  corkEarned: number;
}

export function Feed({ tab }: { tab: 'village' | 'following' | 'all' }) {
  const mockPosts: Post[] = [
    {
      id: '1',
      author: 'Maria',
      namespace: 'maria.lisbon',
      village: 'Lisbon',
      text: 'Just opened Bottle #47! 🍷',
      imageBlobId: 'mock-blob-id', // Replace with real Walrus blob
      timestamp: Date.now(),
      corkEarned: 10,
    },
    // ... more posts
  ];

  return (
    <div className="space-y-4">
      {mockPosts.map((post) => (
        <div key={post.id} className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold">@{post.namespace}</span>
            <span className="text-sm text-gray-600">{post.village}</span>
          </div>
          <p>{post.text}</p>
          {post.imageBlobId && (
            <WalrusImage
              blobId={post.imageBlobId}
              alt="Post image"
              className="mt-2 rounded-lg w-full"
            />
          )}
          <div className="text-sm text-green-600 mt-2">
            +{post.corkEarned} CORK earned
          </div>
        </div>
      ))}
    </div>
  );
}
```

#### 2.2 Post Composer
```typescript
// app/cork/PostComposer.tsx
'use client';

import { useState } from 'react';
import { useWalrusUpload } from '@/lib/hooks/useWalrusUpload';
import { WalrusImage } from '@/components/WalrusImage';

export function PostComposer({ onPost }: { onPost: () => void }) {
  const { uploadFile, uploading } = useWalrusUpload();
  const [text, setText] = useState('');
  const [imageBlobId, setImageBlobId] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file);
    if (result) {
      setImageBlobId(result.blobId);
    }
  };

  const handlePost = async () => {
    // TODO: Create post transaction on SUI
    // Include text and imageBlobId
    onPost();
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's happening in your village?"
        className="w-full p-2 border rounded"
        rows={3}
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
      />

      {imageBlobId && (
        <WalrusImage
          blobId={imageBlobId}
          alt="Post preview"
          className="rounded-lg max-h-64"
        />
      )}

      <button
        onClick={handlePost}
        disabled={uploading || !text}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        {uploading ? 'Uploading...' : 'Post'}
      </button>
    </div>
  );
}
```

---

### Phase 3: Shop & NFTs (Hours 16-22)

#### 3.1 Shop Component
```typescript
// app/cork/Shop.tsx
'use client';

import { WalrusImage } from '@/components/WalrusImage';

interface Wine {
  id: string;
  name: string;
  price: number;
  corkReward: number;
  available: number;
  total: number;
  imageBlobId: string;
  description: string;
}

export function Shop({ village }: { village: string }) {
  const wines: Wine[] = [
    {
      id: 'lisbon-orange-1',
      name: 'Portuguese Orange Wine 2023',
      price: 45,
      corkReward: 100,
      available: 23,
      total: 50,
      imageBlobId: 'wine-image-blob', // Pre-upload before hackathon
      description: 'Quinta do Vale, Alentejo',
    },
    // ... more wines
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      {wines.map((wine) => (
        <div key={wine.id} className="border rounded-lg p-4">
          <WalrusImage
            blobId={wine.imageBlobId}
            alt={wine.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <h3 className="font-bold mt-4">{wine.name}</h3>
          <p className="text-sm text-gray-600">{wine.description}</p>
          <div className="flex justify-between mt-4">
            <span>€{wine.price}</span>
            <span className="text-green-600">+{wine.corkReward} CORK</span>
          </div>
          <p className="text-sm text-gray-500">
            {wine.available}/{wine.total} available
          </p>
          <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg">
            Purchase Bottle
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

### Phase 4: Smart Contracts (Hours 22-28)

#### Move Contracts Needed:
1. **Namespace Registry** - Store username.village mappings
2. **CORK Token** - Fungible token for rewards
3. **Bottle NFT** - Wine bottle NFTs with provenance
4. **Treasury** - Village treasury management

```move
// move/cork/sources/bottle_nft.move
module cork::bottle_nft {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::String;

    struct BottleNFT has key, store {
        id: UID,
        bottle_number: u64,
        wine_name: String,
        vintage: String,
        vineyard: String,
        image_blob_id: String, // Walrus blob ID!
        provenance_blob_id: String, // Full provenance JSON on Walrus
        owner: address,
    }

    public fun mint(
        bottle_number: u64,
        wine_name: String,
        vintage: String,
        vineyard: String,
        image_blob_id: String,
        provenance_blob_id: String,
        ctx: &mut TxContext
    ): BottleNFT {
        BottleNFT {
            id: object::new(ctx),
            bottle_number,
            wine_name,
            vintage,
            vineyard,
            image_blob_id,
            provenance_blob_id,
            owner: tx_context::sender(ctx),
        }
    }

    // ... transfer, burn, etc.
}
```

---

## 🎬 DEMO PREPARATION (Hours 28-32)

### Recording Checklist:
- [ ] Screen recording software ready
- [ ] Wallet with test SUI funded
- [ ] Pre-mint 5 demo NFTs
- [ ] Pre-upload wine images to Walrus
- [ ] Test complete flow 3x

### Demo Script (5 minutes):
1. **Intro (30s):** Problem + Solution
2. **Onboarding (60s):** Claim `maria.lisbon` namespace + Walrus profile pic
3. **Purchase (90s):** Buy Bottle #47 NFT → Show Walrus image + provenance
4. **Social (60s):** Post with Walrus image → Earn CORK rewards
5. **Network (45s):** Switch villages, cross-village activity
6. **Vision (30s):** Future roadmap

---

## ✅ FINAL SUBMISSION CHECKLIST

### Code Repository:
- [ ] Clean commit history
- [ ] README with setup instructions
- [ ] Architecture diagram
- [ ] Deployed contracts on testnet
- [ ] `.env.example` with required variables

### Demo Video:
- [ ] 5-minute max
- [ ] Clear audio
- [ ] HD screen recording
- [ ] Highlights: SUI Namespace + Walrus integrations
- [ ] Uploaded to YouTube/Vimeo

### Presentation:
- [ ] 10-slide deck
- [ ] Problem → Solution → Demo → Vision
- [ ] Technical architecture
- [ ] Network effects shown

---

## 🆘 BACKUP PLANS

### If Walrus Upload Fails:
- Show code implementation
- Explain integration approach
- Use mock blobIds
- Demo with pre-uploaded images

### If Smart Contracts Don't Deploy:
- Show Move code
- Explain architecture
- Mock contract calls in frontend
- Focus on UX + integrations

### If Time Runs Out:
**Priority Order:**
1. ✅ Walrus image upload working (MUST HAVE)
2. ✅ SUI Namespace claiming (MUST HAVE)
3. ✅ Beautiful UI showing complete flow (MUST HAVE)
4. ⚠️ Smart contracts deployed (NICE TO HAVE)
5. ⚠️ Full functionality working (NICE TO HAVE)

---

## 📞 EMERGENCY CONTACTS

- BSA Team: Check their GitHub/Discord for Walrus questions
- SUI Namespace Docs: [Find docs URL]
- Walrus Testnet Status: https://walruscan.com/testnet

---

**NOW GO BUILD! You have everything you need! 🚀🍷**
