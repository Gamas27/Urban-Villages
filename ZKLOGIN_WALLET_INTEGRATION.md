# zkLogin Wallet Integration - Complete

## ✅ What Changed

The app now uses **zkLogin for everything** - no wallet extension needed!

### Before
- ❌ Users had to connect a wallet extension for Walrus uploads
- ❌ Two-step process: zkLogin + wallet connection
- ❌ Confusing UX with wallet connection prompts

### After
- ✅ Single zkLogin authentication
- ✅ Automatic SUI address from Google account
- ✅ Walrus uploads work with zkLogin (via proving service)
- ✅ No wallet extension required

## 🔧 Technical Changes

### 1. Walrus Uploads Now Use zkLogin

**Before:** `useWalrusUpload` (required wallet extension)
```typescript
const account = useCurrentAccount(); // Required wallet
const { uploadFile } = useWalrusUpload();
```

**After:** `useZkLoginWalrusUpload` (uses zkLogin)
```typescript
const zkUser = getCurrentUser(); // From zkLogin
const { uploadFile } = useZkLoginWalrusUpload();
```

### 2. Components Updated

- **Onboarding.tsx**: Uses `useZkLoginWalrusUpload` instead of `useWalrusUpload`
- **PostComposer.tsx**: Uses `useZkLoginWalrusUpload` instead of `useWalrusUpload`
- Removed all `ConnectButton` prompts
- Removed all `useCurrentAccount` checks

### 3. Transaction Signing

zkLogin transaction signing uses a **proving service**:
- Default: `https://prover-dev.mystenlabs.com/v1`
- Configurable via `NEXT_PUBLIC_ZKLOGIN_PROVER_URL`

The proving service:
1. Receives transaction bytes + JWT + salt
2. Generates zero-knowledge proof
3. Returns signature inputs
4. Transaction is executed on-chain

## 🎯 User Flow

1. **User clicks "Continue with Google"**
   - Redirects to Google OAuth
   - User signs in
   - Returns with JWT token

2. **zkLogin completes**
   - JWT is parsed
   - SUI address is derived from JWT + salt
   - User data stored in sessionStorage

3. **User uploads profile picture**
   - Uses zkLogin address automatically
   - No wallet connection needed
   - Transaction signed via proving service

4. **User creates post with image**
   - Uses zkLogin address automatically
   - No wallet connection needed
   - Transaction signed via proving service

## 🔐 Security

- **Salt**: Unique per user, stored in sessionStorage
- **JWT**: Validated and parsed securely
- **Address**: Deterministically derived from JWT + salt
- **Transactions**: Signed via zero-knowledge proofs (no private keys exposed)

## 📝 Configuration

### Required Environment Variables

```bash
# Google OAuth Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id

# Optional: Custom proving service URL
NEXT_PUBLIC_ZKLOGIN_PROVER_URL=https://prover-dev.mystenlabs.com/v1
```

### Google OAuth Setup

1. Create OAuth credentials in Google Console
2. Add redirect URI: `http://localhost:3000/auth/callback`
3. Copy Client ID to `.env.local`

## 🚀 Testing

1. Start dev server: `pnpm dev`
2. Go to `/cork`
3. Click "Continue with Google"
4. Sign in with Google
5. Complete onboarding
6. Try uploading profile picture (should work without wallet!)
7. Try creating post with image (should work without wallet!)

## ⚠️ Important Notes

### Proving Service

The default proving service (`https://prover-dev.mystenlabs.com/v1`) is for **development only**.

For production:
- Set up your own proving service
- Or use a trusted third-party service
- Configure via `NEXT_PUBLIC_ZKLOGIN_PROVER_URL`

### Transaction Costs

- Users still need SUI tokens for gas fees
- But they can receive them via airdrop or purchase
- No wallet extension needed to receive tokens

## 🎉 Benefits

✅ **Better UX**: Single authentication flow  
✅ **Lower barrier**: No wallet installation  
✅ **Familiar**: OAuth login (Google, Facebook, etc.)  
✅ **Secure**: Zero-knowledge proofs  
✅ **Automatic**: Address derived automatically  

## 📚 Related Files

- `app/lib/zkLogin.ts` - zkLogin authentication logic
- `app/lib/hooks/useZkLoginWalrusUpload.ts` - Walrus uploads with zkLogin
- `app/auth/callback/page.tsx` - OAuth callback handler
- `app/cork/Onboarding.tsx` - Onboarding with zkLogin
- `app/cork/PostComposer.tsx` - Post creation with zkLogin

