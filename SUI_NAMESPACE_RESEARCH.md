# SUI Namespace Implementation Research

## 🔍 Research Summary

After researching SUI blockchain namespace options, here are the findings:

---

## Option 1: SuiNS (Sui Name Service) - Official Service

### What is SuiNS?
- **Official SUI name service** provided by Mysten Labs
- Uses `@username` format (e.g., `@chris`)
- Previously used `.sui` extension (e.g., `chris.sui`) - both formats work
- Provides human-readable names that map to SUI addresses

### Integration Methods:

#### A. Off-Chain Resolution (Recommended for Frontend)
```typescript
// Use JSON-RPC or GraphQL endpoints
// Resolve name to address and vice versa
// No on-chain transactions needed for resolution

// Example API call:
const response = await fetch('https://api.suins.io/resolve/@username');
const address = response.address;
```

**Pros:**
- Fast resolution
- No gas fees for lookups
- Easy to integrate
- Official service

**Cons:**
- Requires external API dependency
- `@username` format (not `username.village`)
- May not support custom metadata

#### B. On-Chain Resolution (For Smart Contracts)
```move
// In Move contracts
use suins::core;

public fun resolve_name(name: String): address {
    // Resolve name to address on-chain
}
```

**Pros:**
- Works in smart contracts
- Decentralized resolution

**Cons:**
- More complex
- Gas costs for resolution
- Still uses `@username` format

### SuiNS SDK:
```bash
# Add to Move.toml
[dependencies]
suins = { git = "https://github.com/mystenlabs/suins-contracts/", subdir = "packages/suins", rev = "releases/mainnet/core/v3" }
```

**Documentation:**
- https://docs.suins.io/
- https://docs.suins.io/developer/integration

---

## Option 2: Custom Namespace Contract (Recommended for Urban Villages)

### Why Custom?
- **Format Requirement**: Need `username.village` format (e.g., `maria.lisbon`)
- **Custom Metadata**: Store village-specific data (profilePicBlobId, village, etc.)
- **Multi-Village Support**: Namespace belongs to a village, not global
- **Full Control**: Custom logic for availability, registration, transfers

### Implementation Approach:

#### Create Custom Move Contract:
```move
// contracts/namespace.move

module urban_villages::namespace {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string::{Self, String};

    struct Namespace has key, store {
        id: UID,
        username: String,
        village: String,
        owner: address,
        profile_pic_blob_id: String,  // Walrus blob ID
        created_at: u64,
    }

    struct Registry has key {
        id: UID,
        namespaces: Table<String, ID>,  // namespace -> Namespace object ID
    }

    // Register a new namespace
    public fun register(
        registry: &mut Registry,
        username: String,
        village: String,
        profile_pic_blob_id: String,
        ctx: &mut TxContext
    ): Namespace {
        let namespace_str = string::utf8(b"");
        // Format: username.village
        // Check availability
        // Create and return Namespace object
    }

    // Check if namespace is available
    public fun is_available(
        registry: &Registry,
        username: String,
        village: String
    ): bool {
        // Check if namespace exists in registry
    }

    // Resolve namespace to owner address
    public fun resolve(
        registry: &Registry,
        namespace: String
    ): address {
        // Look up namespace and return owner
    }
}
```

### Frontend Integration:
```typescript
// app/lib/namespace.ts

import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';

export async function registerNamespace(
  username: string,
  village: string,
  profilePicBlobId: string,
  signAndExecute: any
): Promise<string> {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::namespace::register`,
    arguments: [
      tx.object(REGISTRY_ID),
      tx.pure(username),
      tx.pure(village),
      tx.pure(profilePicBlobId),
    ],
  });

  const result = await signAndExecute({ transaction: tx });
  return result.digest;
}

export async function checkNamespaceAvailability(
  username: string,
  village: string
): Promise<boolean> {
  // Query on-chain registry
  // Return true if available
}
```

**Pros:**
- ✅ Custom `username.village` format
- ✅ Store custom metadata (profilePicBlobId, village, etc.)
- ✅ Full control over registration logic
- ✅ Village-specific namespaces
- ✅ Perfect fit for Urban Villages use case

**Cons:**
- Need to write and deploy Move contract
- Need to maintain registry
- More development time

---

## Option 3: Hybrid Approach

### Use SuiNS for Base Identity + Custom Metadata
- Register `@username` on SuiNS (official service)
- Store `username.village` mapping in custom contract
- Best of both worlds

**Pros:**
- Official name service for base identity
- Custom metadata for village-specific data

**Cons:**
- More complex
- Two systems to maintain

---

## 🎯 Recommendation for Urban Villages

### **Option 2: Custom Namespace Contract**

**Reasons:**
1. ✅ **Format Requirement**: Need `username.village` format
2. ✅ **Village-Specific**: Namespaces belong to villages, not global
3. ✅ **Custom Metadata**: Need to store profilePicBlobId, village info
4. ✅ **Full Control**: Can implement custom logic (transfers, expiration, etc.)
5. ✅ **Hackathon Demo**: Shows custom smart contract development

### Implementation Plan:

1. **Create Move Contract** (`contracts/namespace.move`)
   - Registry for all namespaces
   - Register function
   - Availability check
   - Resolve function
   - Transfer function (optional)

2. **Deploy to Testnet**
   - Get Registry object ID
   - Update frontend constants

3. **Create Frontend Service** (`app/lib/namespace.ts`)
   - `registerNamespace()` function
   - `checkAvailability()` function
   - `resolveNamespace()` function

4. **Integrate into Onboarding**
   - Check availability before registration
   - Register namespace after profile pic upload
   - Show success/error states

---

## 📚 Resources

### SuiNS (Official):
- Docs: https://docs.suins.io/
- Integration Guide: https://docs.suins.io/developer/integration
- Contracts: https://github.com/mystenlabs/suins-contracts

### SUI Move:
- Move Docs: https://docs.sui.io/build/move
- TypeScript SDK: https://sdk.mystenlabs.com/typescript
- Examples: https://github.com/MystenLabs/sui/tree/main/sui_programmability/examples

### Custom Namespace Examples:
- Look for ENS (Ethereum Name Service) patterns
- Adapt to SUI Move syntax
- Use Table for efficient lookups

---

## 🚀 Next Steps

1. ✅ Research complete
2. ⏳ Create `namespace.move` contract
3. ⏳ Deploy to testnet
4. ⏳ Create `app/lib/namespace.ts` service
5. ⏳ Integrate into Onboarding flow
6. ⏳ Test end-to-end

---

**Decision: Use Custom Namespace Contract for `username.village` format**

