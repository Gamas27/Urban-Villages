# Enoki API Keys Guide

## 🔑 Understanding Enoki API Keys

Enoki provides two types of API keys for different use cases:

---

## ✅ Public API Key (Use This Now)

**Purpose:** Frontend operations (wallet registration, user authentication)

**Where to Use:**
- ✅ Frontend code (React components)
- ✅ Client-side JavaScript
- ✅ Public GitHub repositories (with caution)
- ✅ Environment variables with `NEXT_PUBLIC_` prefix

**What It's Used For:**
- Registering Enoki wallets (`registerEnokiWallets()`)
- User authentication flows
- Wallet operations visible to users

**Security:**
- Safe to expose in client-side code
- Has rate limits to prevent abuse
- Cannot access sensitive backend operations

**Current Usage in Code:**
```typescript
// app/lib/enoki.ts
apiKey: process.env.NEXT_PUBLIC_ENOKI_API_KEY || ''
```

**How to Get It:**
1. Go to [Enoki Developer Portal](https://enoki.mystenlabs.com/)
2. Select your project
3. Go to "API Keys" section
4. Copy your **Public API Key**

---

## 🔒 Private API Key (For Backend Only)

**Purpose:** Backend operations (gas sponsorship, sensitive operations)

**Where to Use:**
- ❌ **NEVER** in frontend code
- ❌ **NEVER** in client-side JavaScript
- ❌ **NEVER** in public repositories
- ✅ Backend API routes only
- ✅ Server-side environment variables (without `NEXT_PUBLIC_`)

**What It's Used For:**
- Gas sponsorship (paying gas fees for users)
- Creating sponsored transactions
- Backend API calls to Enoki

**Security:**
- **MUST** be kept secret
- Higher rate limits than public key
- Can access sensitive operations

**Where to Store:**
```bash
# Backend environment variables (e.g., .env in your backend service)
ENOKI_PRIVATE_API_KEY=your_private_api_key_here
```

**How to Get It:**
1. Go to [Enoki Developer Portal](https://enoki.mystenlabs.com/)
2. Select your project
3. Go to "API Keys" section
4. Copy your **Private API Key**
5. **Keep it secret!** Store only in backend environment variables

---

## 📋 Quick Decision Guide

### For Your Current Setup (Frontend Only):

```
✅ Use PUBLIC API KEY
   - Add to .env.local
   - Use in app/lib/enoki.ts
   - Safe to commit (if you're okay with it being public)
```

### For Future Gas Sponsorship (Backend):

```
🔒 Use PRIVATE API KEY
   - Store in backend environment variables
   - Create API route: /api/sponsor-transaction
   - Never expose in frontend code
```

---

## 🎯 Current Implementation Status

**What You Need Now:**
- ✅ **Public API Key** → Add to `.env.local` as `NEXT_PUBLIC_ENOKI_API_KEY`
- ❌ Private API Key → Not needed yet (only for gas sponsorship)

**Current Code Pattern:**
```typescript
// ✅ CORRECT: Using public key in frontend
registerEnokiWallets({
  apiKey: process.env.NEXT_PUBLIC_ENOKI_API_KEY, // Public key - OK!
  // ...
});
```

---

## 🔐 Security Best Practices

### ✅ DO:
- ✅ Use public API key in frontend code
- ✅ Store public key in `NEXT_PUBLIC_ENOKI_API_KEY`
- ✅ Use private key only in backend services
- ✅ Store private key in secure environment variables (without `NEXT_PUBLIC_`)
- ✅ Use different keys for testnet and mainnet

### ❌ DON'T:
- ❌ Put private API key in frontend code
- ❌ Commit private API keys to Git
- ❌ Expose private keys in client-side environment variables
- ❌ Use private keys with `NEXT_PUBLIC_` prefix
- ❌ Share private keys in screenshots or documentation

---

## 💡 Example: Gas Sponsorship Setup (Future)

If you want to add gas sponsorship later, you'd create a backend API route:

```typescript
// pages/api/sponsor-transaction.ts (or app/api/sponsor-transaction/route.ts)
import { EnokiClient } from '@mysten/enoki';

const enokiClient = new EnokiClient({
  apiKey: process.env.ENOKI_PRIVATE_API_KEY, // Private key - backend only!
});

export async function POST(req: Request) {
  const { transactionKindBytes, sender } = await req.json();
  
  const sponsored = await enokiClient.createSponsoredTransaction({
    network: 'testnet',
    transactionKindBytes,
    sender,
  });
  
  return Response.json(sponsored);
}
```

**Notice:** Private key is used in backend code, never exposed to frontend.

---

## 📝 Summary

| Key Type | Use Case | Location | Security |
|----------|----------|----------|----------|
| **Public** | Frontend wallet registration | `.env.local` with `NEXT_PUBLIC_` | Safe to expose |
| **Private** | Backend gas sponsorship | Backend env vars (no `NEXT_PUBLIC_`) | Must keep secret |

**For your current setup:** Use the **Public API Key** only!

