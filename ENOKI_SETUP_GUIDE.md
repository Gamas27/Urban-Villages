# Enoki Integration Setup Guide

## 🎯 Overview

This guide will help you set up Enoki integration for Urban Villages. Enoki provides managed zkLogin infrastructure, embedded wallets, and transaction sponsorship.

## ✅ What's Already Done

1. ✅ Installed `@mysten/enoki` package
2. ✅ Created Enoki configuration (`app/lib/enoki.ts`)
3. ✅ Integrated Enoki initialization in providers (`app/providers.tsx`)
4. ✅ Created Enoki-based Walrus upload hook (`app/lib/hooks/useEnokiWalrusUpload.ts`)

## 📋 Setup Steps

### Step 1: Sign Up for Enoki

1. Go to [Enoki Developer Portal](https://enoki.mystenlabs.com/)
2. Sign up for an account
3. Create a new project
4. Get your **Public API Key** from the project dashboard

**Important:** 
- ✅ Use **Public API Key** for frontend (safe to expose in client code)
- ⚠️ Use **Private API Key** only for backend operations (gas sponsorship)
- For now, you only need the **Public API Key**

### Step 2: Configure Environment Variables

Create or update `.env.local` in the project root:

```bash
# Enoki Configuration (PUBLIC KEY - safe for frontend)
NEXT_PUBLIC_ENOKI_API_KEY=your_public_api_key_here

# SUI Network (testnet, mainnet, or devnet)
NEXT_PUBLIC_SUI_NETWORK=testnet

# Google OAuth (for zkLogin via Enoki)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# NOTE: Private API Key (for backend gas sponsorship) should be stored
# in your backend service environment variables, NOT in .env.local
# ENOKI_PRIVATE_API_KEY=your_private_api_key_here (backend only!)
```

### Step 3: Set Up Google OAuth (Optional)

If you want Google login via Enoki:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google Identity API"
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URI:
   - For development: `http://localhost:3000`
   - For production: `https://your-domain.com`
7. Copy the **Client ID**

Then add it to Enoki Developer Portal:
1. Go to your project in Enoki Portal
2. Navigate to "Auth Providers"
3. Add Google provider with your Client ID

### Step 4: Set Up Gas Pool (Optional - For Gasless Transactions)

1. In Enoki Developer Portal, go to "Gas Pool"
2. Create a new Gas Pool
3. Fund it with SUI tokens
4. Set usage limits and configure sponsorship rules

### Step 5: Restart Development Server

```bash
pnpm dev
```

## 🔄 How Enoki Integration Works

### Current Architecture

1. **Enoki Registration**: Enoki wallets are registered with `@mysten/dapp-kit`'s `WalletProvider`
2. **Wallet Selection**: Users can choose Enoki wallets (Google login) or regular wallets in the wallet selector
3. **Transaction Signing**: All transactions work through standard dapp-kit hooks
4. **Gas Sponsorship**: If configured, Enoki can sponsor gas fees automatically

### Wallet Flow

```
User clicks "Connect Wallet"
  ↓
Wallet selector appears
  ↓
User can choose:
  - Enoki (Google) → OAuth login → Embedded wallet created
  - Sui Wallet → Browser extension
  - Other wallets → Standard wallet flow
  ↓
Wallet connected via dapp-kit
  ↓
All hooks (useCurrentAccount, useSignAndExecuteTransaction) work automatically
```

## 🧪 Testing Enoki Integration

### Test Without Enoki API Key (Fallback Mode)

If you don't have an Enoki API key yet, the app will:
- Show a warning in console
- Fall back to existing zkLogin implementation
- Continue working normally

### Test With Enoki API Key

1. Add `NEXT_PUBLIC_ENOKI_API_KEY` to `.env.local`
2. Restart dev server
3. Open the app
4. Click "Connect Wallet"
5. You should see "Enoki (Google)" as an option
6. Click it to test Google OAuth flow

## 📝 Migration Status

### ✅ Completed
- [x] Enoki SDK installation
- [x] Enoki configuration setup
- [x] Provider integration
- [x] Enoki Walrus upload hook

### ⏳ In Progress
- [ ] Update Onboarding component to use Enoki
- [ ] Update PostComposer to use Enoki
- [ ] Create namespace service with Enoki
- [ ] Test end-to-end flow

### 📋 Next Steps
- [ ] Update authentication flow
- [ ] Remove old zkLogin implementation (after migration complete)
- [ ] Add gas sponsorship configuration
- [ ] Documentation updates

## 🔍 Troubleshooting

### Enoki Not Appearing in Wallet Selector

**Issue**: Enoki wallets don't show up in wallet selector

**Solutions**:
1. Check that `NEXT_PUBLIC_ENOKI_API_KEY` is set correctly
2. Verify Enoki initialization in browser console (should see "✅ Enoki initialized successfully")
3. Clear browser cache and reload
4. Check network tab for Enoki API calls

### Google OAuth Not Working

**Issue**: Google login doesn't work

**Solutions**:
1. Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set
2. Check redirect URI matches in Google Cloud Console
3. Verify Google provider is configured in Enoki Portal
4. Check browser console for OAuth errors

### Transactions Failing

**Issue**: Transactions fail to execute

**Solutions**:
1. Verify wallet is connected properly
2. Check that account has SUI for gas (or gas sponsorship is configured)
3. Verify network matches (testnet/mainnet)
4. Check transaction errors in browser console

## 📚 Resources

- **Enoki Documentation**: https://docs.enoki.mystenlabs.com
- **Enoki Developer Portal**: https://enoki.mystenlabs.com
- **Enoki Example App**: https://github.com/sui-foundation/enoki-example-app
- **SUI Documentation**: https://docs.sui.io

## 💡 Key Benefits

1. **No Wallet Extension Needed**: Users can use Google login instead
2. **Managed Infrastructure**: No need to run proving service
3. **Gas Sponsorship**: Optional gasless transactions
4. **Cross-Device**: Wallets persist across devices
5. **Seamless Integration**: Works with existing dapp-kit hooks

---

**Need Help?** Check the [Enoki Integration Analysis](./ENOKI_INTEGRATION_ANALYSIS.md) for more details.

