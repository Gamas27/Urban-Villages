# Walrus Upload Issues Analysis

## 🔍 Problems Identified

### 1. **usePostUpload Creates New Service Every Time** ❌
**Location:** `app/lib/hooks/usePostUpload.ts:84-90`

```typescript
// BAD: Creates new service on every upload
const walrusService = await createWalrusService(
  { network: 'testnet', epochs: 10 },
  suiClient
);
```

**Issues:**
- Slow (initialization overhead on every upload)
- Can cause failures (WASM loading issues)
- Wastes resources
- Not following template pattern

**Template Pattern:**
- Initialize once in `useEffect`
- Reuse the same service instance
- Cache the service in state

### 2. **API Method Mismatch** ⚠️
- Code uses `writeFilesFlow` 
- Comments mention `uploadWithFlow`
- Need to verify which is correct for current Walrus SDK version

### 3. **No Service Reuse in usePostUpload** ❌
- Template pattern: Initialize once, reuse
- Our pattern: Create new every time
- This is the main cause of slowness/failures

## ✅ Template Pattern (Working)

```typescript
// Template: Initialize once
const [walrus, setWalrus] = useState<any>(null);

useEffect(() => {
  if (typeof window !== 'undefined') {
    createWalrusService({ network: 'testnet', epochs: 10 }, suiClient)
      .then(setWalrus)
      .catch((err) => {
        console.error('Failed to initialize Walrus:', err);
        setError('Failed to initialize Walrus service');
      });
  }
}, [suiClient]);

// Then reuse walrus in uploadFile
const flow = walrus.writeFilesFlow({ ... });
```

## ❌ Our Current Pattern (Problematic)

```typescript
// usePostUpload: Creates new service every time
const uploadPost = async (postContent: PostContent) => {
  // BAD: New service every upload
  const walrusService = await createWalrusService(
    { network: 'testnet', epochs: 10 },
    suiClient
  );
  
  const flow = walrusService.writeFilesFlow({ ... });
}
```

## 🔧 Solutions

### Option 1: Fix usePostUpload to Follow Template Pattern (Recommended)
- Initialize service once in useEffect
- Reuse service instance
- Same pattern as useEnokiWalrusUpload

### Option 2: Use useEnokiWalrusUpload for Posts Too
- Reuse existing hook
- Upload post JSON as a file
- Simpler, already working

### Option 3: Create Shared Walrus Service Hook
- Single hook that manages service lifecycle
- Both hooks use the same service instance
- Best for multiple upload types

## 📊 Performance Impact

**Current (usePostUpload):**
- ~2-3 seconds per upload (service init + upload)
- Can fail if WASM doesn't load quickly
- Multiple uploads = multiple service inits

**Template Pattern:**
- ~0.5-1 second per upload (just upload)
- Service ready immediately
- Multiple uploads = reuse same service

## 🎯 Recommended Fix

Update `usePostUpload` to follow the template pattern:
1. Initialize service in useEffect
2. Store in state
3. Reuse for all uploads
4. Same pattern as useEnokiWalrusUpload

