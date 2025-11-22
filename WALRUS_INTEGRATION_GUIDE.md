# 🎯 WALRUS INTEGRATION - COMPLETE GUIDE

## ✅ FOUND IT! Here's What the BSA Template Uses:

### Package Dependencies (from their package.json):
```json
{
  "@mysten/walrus": "^0.8.4",
  "walrus": "^0.10.1"
}
```

---

## 📦 Step 1: Install Walrus Packages

Run this in your Urban-Villages repo:

```bash
pnpm add @mysten/walrus@^0.8.4 walrus@^0.10.1
```

---

## 🔧 Step 2: Create Walrus Service

Create this file: `app/lib/walrus.ts`

```typescript
import { WalrusClient } from '@mysten/walrus';

export interface WalrusServiceConfig {
  network: 'testnet' | 'mainnet';
  epochs: number;
}

/**
 * Creates a Walrus client for file uploads
 * Network: testnet
 * Storage duration: 10 epochs (~30 days on testnet)
 */
export function createWalrusService(config: WalrusServiceConfig = { network: 'testnet', epochs: 10 }) {
  return new WalrusClient({
    network: config.network,
  });
}

/**
 * Get the public URL for a Walrus blob
 */
export function getWalrusUrl(blobId: string, network: 'testnet' | 'mainnet' = 'testnet'): string {
  const aggregator = network === 'testnet' 
    ? 'https://aggregator.walrus-testnet.walrus.space'
    : 'https://aggregator.walrus.walrus.space';
  
  return `${aggregator}/v1/${blobId}`;
}

/**
 * Get WalrusCan explorer URL
 */
export function getWalrusScanUrl(blobId: string, network: 'testnet' | 'mainnet' = 'testnet'): string {
  return `https://walruscan.com/${network}/blob/${blobId}`;
}
```

---

## 🖼️ Step 3: Create Upload Hook for Cork Collective

Create this file: `app/lib/hooks/useWalrusUpload.ts`

```typescript
'use client';

import { useState, useMemo } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { createWalrusService, getWalrusUrl } from '../walrus';

export interface UploadResult {
  blobId: string;
  url: string;
  metadataId: string;
}

export function useWalrusUpload() {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create Walrus service (client-side only)
  const walrus = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createWalrusService({ network: 'testnet', epochs: 10 });
  }, []);

  /**
   * Upload a file to Walrus
   * Returns: { blobId, url, metadataId }
   */
  const uploadFile = async (file: File): Promise<UploadResult | null> => {
    if (!currentAccount) {
      setError('Please connect your wallet first');
      return null;
    }

    if (!walrus) {
      setError('Walrus service not available');
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      // Read file as array buffer
      const contents = await file.arrayBuffer();

      // Create upload flow
      const flow = walrus.uploadWithFlow(
        [
          {
            contents: new Uint8Array(contents),
            identifier: file.name,
            tags: { 'content-type': file.type || 'application/octet-stream' },
          },
        ],
        { epochs: 10, deletable: true }
      );

      // Step 1: Encode
      await flow.encode();

      // Step 2: Register (returns transaction)
      const registerTx = flow.register({
        owner: currentAccount.address,
        epochs: 10,
        deletable: true,
      });

      // Step 3: Sign and execute register transaction
      let registerDigest: string;
      let blobObjectId: string | null = null;
      
      await new Promise<void>((resolve, reject) => {
        signAndExecute(
          { transaction: registerTx },
          {
            onSuccess: async ({ digest }) => {
              try {
                registerDigest = digest;
                const result = await suiClient.waitForTransaction({
                  digest,
                  options: { showEffects: true, showEvents: true },
                });

                // Extract blob object ID from BlobRegistered event
                if (result.events) {
                  const blobEvent = result.events.find((e) =>
                    e.type.includes('BlobRegistered')
                  );
                  if (blobEvent?.parsedJson) {
                    const data = blobEvent.parsedJson as any;
                    blobObjectId = data.object_id || data.objectId || null;
                  }
                }
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            onError: reject,
          }
        );
      });

      // Step 4: Upload data to storage nodes
      await flow.upload({ digest: registerDigest! });

      // Step 5: Certify (returns transaction)
      const certifyTx = flow.certify();

      // Step 6: Sign and execute certify transaction
      await new Promise<void>((resolve, reject) => {
        signAndExecute(
          { transaction: certifyTx },
          {
            onSuccess: async ({ digest }) => {
              try {
                await suiClient.waitForTransaction({ digest });
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            onError: reject,
          }
        );
      });

      // Step 7: Get blobId
      const files = await flow.listFiles();
      const blobId = files[0]?.blobId;

      if (!blobId) {
        throw new Error('Failed to get blobId after upload');
      }

      const metadataId = blobObjectId || blobId;

      return {
        blobId,
        url: getWalrusUrl(blobId),
        metadataId,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Upload failed: ${errorMsg}`);
      console.error('Walrus upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  /**
   * Upload text/string content to Walrus
   */
  const uploadText = async (text: string, contentType: string = 'text/plain'): Promise<UploadResult | null> => {
    if (!currentAccount) {
      setError('Please connect your wallet first');
      return null;
    }

    if (!walrus) {
      setError('Walrus service not available');
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      const flow = walrus.uploadWithFlow(
        [
          {
            contents: text,
            identifier: `content-${Date.now()}`,
            tags: { 'content-type': contentType },
          },
        ],
        { epochs: 10, deletable: true }
      );

      await flow.encode();

      const registerTx = flow.register({
        owner: currentAccount.address,
        epochs: 10,
        deletable: true,
      });

      let registerDigest: string;
      let blobObjectId: string | null = null;

      await new Promise<void>((resolve, reject) => {
        signAndExecute(
          { transaction: registerTx },
          {
            onSuccess: async ({ digest }) => {
              try {
                registerDigest = digest;
                const result = await suiClient.waitForTransaction({
                  digest,
                  options: { showEffects: true, showEvents: true },
                });

                if (result.events) {
                  const blobEvent = result.events.find((e) =>
                    e.type.includes('BlobRegistered')
                  );
                  if (blobEvent?.parsedJson) {
                    const data = blobEvent.parsedJson as any;
                    blobObjectId = data.object_id || data.objectId || null;
                  }
                }
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            onError: reject,
          }
        );
      });

      await flow.upload({ digest: registerDigest! });

      const certifyTx = flow.certify();
      await new Promise<void>((resolve, reject) => {
        signAndExecute(
          { transaction: certifyTx },
          {
            onSuccess: async ({ digest }) => {
              try {
                await suiClient.waitForTransaction({ digest });
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            onError: reject,
          }
        );
      });

      const files = await flow.listFiles();
      const blobId = files[0]?.blobId;

      if (!blobId) {
        throw new Error('Failed to get blobId after upload');
      }

      const metadataId = blobObjectId || blobId;

      return {
        blobId,
        url: getWalrusUrl(blobId),
        metadataId,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Upload failed: ${errorMsg}`);
      console.error('Walrus upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploadText,
    uploading,
    error,
    clearError: () => setError(null),
  };
}
```

---

## 🎨 Step 4: Create Image Display Component

Create this file: `app/components/WalrusImage.tsx`

```typescript
'use client';

import { useState } from 'react';
import { getWalrusUrl } from '@/lib/walrus';

interface WalrusImageProps {
  blobId: string;
  alt: string;
  className?: string;
  network?: 'testnet' | 'mainnet';
}

export function WalrusImage({ blobId, alt, className, network = 'testnet' }: WalrusImageProps) {
  const [error, setError] = useState(false);
  const url = getWalrusUrl(blobId, network);

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Failed to load</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
```

---

## 🍷 Step 5: Use in Cork Collective Components

### Example: Profile Picture Upload in Onboarding

```typescript
// app/cork/Onboarding.tsx

'use client';

import { useWalrusUpload } from '@/lib/hooks/useWalrusUpload';
import { useState } from 'react';

export function Onboarding() {
  const { uploadFile, uploading, error } = useWalrusUpload();
  const [profilePicBlobId, setProfilePicBlobId] = useState<string | null>(null);

  const handleProfilePicUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file);
    if (result) {
      setProfilePicBlobId(result.blobId);
      // Store this blobId with the user's namespace on-chain
      console.log('Profile pic uploaded:', result);
    }
  };

  return (
    <div>
      <h2>Upload Profile Picture</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleProfilePicUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading to Walrus...</p>}
      {error && <p>Error: {error}</p>}
      {profilePicBlobId && (
        <img 
          src={`https://aggregator.walrus-testnet.walrus.space/v1/${profilePicBlobId}`}
          alt="Profile"
        />
      )}
    </div>
  );
}
```

### Example: Post with Image

```typescript
// app/cork/PostComposer.tsx

'use client';

import { useWalrusUpload } from '@/lib/hooks/useWalrusUpload';
import { WalrusImage } from '@/components/WalrusImage';

export function PostComposer() {
  const { uploadFile, uploading } = useWalrusUpload();
  const [postImageBlobId, setPostImageBlobId] = useState<string | null>(null);
  const [postText, setPostText] = useState('');

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file);
    if (result) {
      setPostImageBlobId(result.blobId);
    }
  };

  const handlePost = async () => {
    // Create post with text and optional image blobId
    const post = {
      text: postText,
      imageBlobId: postImageBlobId,
      // ... other post data
    };
    // Submit to chain...
  };

  return (
    <div>
      <textarea
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        placeholder="What's happening?"
      />
      
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
      />

      {postImageBlobId && (
        <WalrusImage 
          blobId={postImageBlobId} 
          alt="Post image"
          className="w-full rounded-lg"
        />
      )}

      <button onClick={handlePost} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Post'}
      </button>
    </div>
  );
}
```

---

## 📊 Cork Collective Integration Points

### 1. **Onboarding - Profile Picture**
```typescript
const result = await uploadFile(profilePic);
// Store result.blobId in namespace metadata on-chain
```

### 2. **Post Composer - Image Uploads**
```typescript
const result = await uploadFile(postImage);
// Include result.blobId in post creation transaction
```

### 3. **Shop - Wine Bottle NFT Images**
```typescript
// Pre-upload wine images before hackathon
const bottleImage = await uploadFile(winePhoto);
// Use blobId in NFT metadata
```

### 4. **Display Images - Feed, Profile, Shop**
```typescript
<WalrusImage blobId={post.imageBlobId} alt="Post" />
<WalrusImage blobId={user.profilePicBlobId} alt="Profile" />
<WalrusImage blobId={wine.imageBlobId} alt="Wine" />
```

---

## ⚡ Quick Start Checklist

1. ✅ Install packages: `pnpm add @mysten/walrus@^0.8.4 walrus@^0.10.1`
2. ✅ Create `app/lib/walrus.ts`
3. ✅ Create `app/lib/hooks/useWalrusUpload.ts`
4. ✅ Create `app/components/WalrusImage.tsx`
5. ✅ Use in Cork components:
   - Onboarding → Profile pic
   - PostComposer → Post images
   - Feed → Display images
   - Shop → Wine bottle images

---

## 🎬 Demo Talking Points

**"Every image in Cork Collective is stored on Walrus - fully decentralized."**

- Profile pictures → Walrus ✓
- Post images → Walrus ✓
- NFT artwork → Walrus ✓
- Permanent, no central server

**Show in code:**
- `uploadFile()` hook usage
- `WalrusImage` component displaying from blobId
- Transaction on SUI blockchain + storage on Walrus

---

## 🔗 Resources

- Walrus SDK Docs: https://sdk.mystenlabs.com/walrus
- Walrus Testnet Aggregator: https://aggregator.walrus-testnet.walrus.space
- WalrusCan Explorer: https://walruscan.com/testnet
- BSA Template (your reference): https://github.com/bsaepfl/bsa-sui-template-frontend-2025/tree/feature/walrus-upload

---

**YOU'RE READY TO BUILD! 🚀**
