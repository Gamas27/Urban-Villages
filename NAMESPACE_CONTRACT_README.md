# Namespace Contract - Implementation Summary

## Overview

The namespace contract enables registration of `username.village` namespaces on the SUI blockchain, creating a custom identity system for Urban Villages users.

## Contract Structure

**File:** `contracts/namespace.move`

### Key Features

1. **Namespace Registration**: Users can register unique `username.village` combinations (e.g., `maria.lisbon`)
2. **Profile Picture Integration**: Supports Walrus blob IDs for profile pictures
3. **Registry System**: Shared registry maps namespace strings to Namespace object IDs
4. **Ownership Management**: Namespaces are owned objects that can be transferred
5. **Metadata Storage**: Stores creation/update timestamps and user information

### Main Functions

#### `register`
Registers a new namespace on-chain.

```move
public entry fun register(
    registry: &mut Registry,
    namespace: vector<u8>,      // Full namespace: "username.village"
    username: vector<u8>,
    village: vector<u8>,
    profile_pic_blob_id: vector<u8>,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**Parameters:**
- `registry`: Shared Registry object (created on init)
- `namespace`: Full namespace string (formatted in frontend as `"username.village"`)
- `username`: Username component (e.g., `"maria"`)
- `village`: Village component (e.g., `"lisbon"`)
- `profile_pic_blob_id`: Walrus blob ID for profile picture (can be empty)
- `clock`: Sui Clock object (`0x6`)
- `ctx`: Transaction context

**Events Emitted:**
- `NamespaceRegistered`: Contains namespace, owner, namespace_id, timestamp

#### `is_available`
Checks if a namespace is available for registration.

```move
public fun is_available(
    registry: &Registry,
    namespace: vector<u8>  // Full namespace: "username.village"
): bool
```

Returns `true` if namespace doesn't exist, `false` if taken.

#### `update_profile_pic`
Updates the profile picture blob ID for a namespace.

```move
public entry fun update_profile_pic(
    namespace: &mut Namespace,
    new_blob_id: vector<u8>,
    clock: &Clock,
    ctx: &mut TxContext
)
```

Requires namespace ownership.

#### `transfer_namespace`
Transfers namespace ownership to another address.

```move
public entry fun transfer_namespace(
    namespace: &mut Namespace,
    recipient: address,
    clock: &Clock,
    ctx: &mut TxContext
)
```

Requires namespace ownership.

## Frontend Integration

**File:** `app/lib/namespace.ts`

### Usage Example

```typescript
import { registerNamespace } from '@/lib/namespace';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';

function MyComponent() {
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  
  const handleRegister = async () => {
    try {
      const digest = await registerNamespace(
        'maria',              // username
        'lisbon',             // village
        'blob-id-123',        // profilePicBlobId (optional)
        signAndExecute
      );
      console.log('Namespace registered:', digest);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
}
```

### Environment Variables Required

After deploying the contract, add these to `.env.local`:

```env
NEXT_PUBLIC_NAMESPACE_PACKAGE_ID=0x...    # Package ID from deployment
NEXT_PUBLIC_NAMESPACE_REGISTRY_ID=0x...   # Registry object ID from deployment
```

## Deployment Steps

1. **Build the contract:**
   ```bash
   sui move build
   ```

2. **Deploy to testnet:**
   ```bash
   sui client publish --gas-budget 100000000
   ```

3. **Note the output:**
   - Package ID: The ID of the published package
   - Registry ID: The ID of the created Registry object (from the `init` function)

4. **Update environment variables:**
   - Set `NEXT_PUBLIC_NAMESPACE_PACKAGE_ID` to the Package ID
   - Set `NEXT_PUBLIC_NAMESPACE_REGISTRY_ID` to the Registry object ID

5. **Test registration:**
   - Use the frontend to register a test namespace
   - Verify on Sui Explorer that the namespace object was created

## Contract Architecture

### Objects

- **`Registry`**: Shared object that maps namespace strings to Namespace object IDs
- **`Namespace`**: Owned object containing namespace metadata (username, village, owner, profile pic, timestamps)

### Error Codes

- `ENamespaceAlreadyExists` (0): Namespace already registered
- `ENotOwner` (1): User doesn't own the namespace
- `EInvalidNamespace` (2): Invalid namespace format
- `ENamespaceNotFound` (3): Namespace doesn't exist (not currently used)

## Notes

1. **String Formatting**: Move doesn't support string concatenation, so the frontend formats the namespace string (`"username.village"`) before calling the contract.

2. **Clock Object**: The Sui Clock object (`0x6`) is a shared system object used for timestamps. It's automatically available on all networks.

3. **Validation**: Basic validation is done in the contract, but full format validation (alphanumeric checks, length limits, etc.) should be done in the frontend for better UX.

4. **Profile Pictures**: Profile pictures are stored as Walrus blob IDs (strings). The actual image data is stored in Walrus decentralized storage.

## Next Steps

1. Deploy contract to testnet
2. Update frontend with deployed contract IDs
3. Test registration flow end-to-end
4. Implement namespace resolution and lookup features
5. Add namespace metadata query functions

