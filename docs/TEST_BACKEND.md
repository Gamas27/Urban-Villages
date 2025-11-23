# Test Your Backend

## ✅ Connection Verified!

Your Supabase backend is working perfectly! Now let's test the full functionality.

---

## Test 1: Create a User Profile

### Option A: Using curl

```bash
curl -X POST http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "username": "testuser",
    "village": "lisbon",
    "onboardingCompleted": true
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "wallet_address": "0x1234...",
    "username": "testuser",
    "village": "lisbon",
    "onboarding_completed_at": "...",
    "created_at": "..."
  },
  "isNewUser": true
}
```

### Option B: Using Browser

1. Open browser console (F12)
2. Run:
```javascript
fetch('/api/users/profile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    username: 'testuser',
    village: 'lisbon',
    onboardingCompleted: true
  })
})
.then(r => r.json())
.then(console.log);
```

---

## Test 2: Track Onboarding Event

```bash
curl -X POST http://localhost:3000/api/users/onboarding/track \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "eventType": "completed",
    "metadata": {
      "step": 5,
      "village": "lisbon"
    }
  }'
```

---

## Test 3: Log a Transaction

```bash
curl -X POST http://localhost:3000/api/users/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "transactionType": "purchase",
    "transactionDigest": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    "nftId": "0xnft1234567890",
    "tokenAmount": 50,
    "metadata": {
      "wineName": "Orange Wine",
      "village": "lisbon",
      "bottleNumber": 1
    }
  }'
```

---

## Test 4: View Analytics

Visit in browser:
```
http://localhost:3000/api/admin/analytics
```

**Expected Response:**
```json
{
  "period": "all",
  "totals": {
    "users": 1,
    "completedOnboarding": 1,
    "transactions": 1,
    "nfts": 1,
    "completionRate": 100
  },
  "distribution": {
    "villages": {
      "lisbon": 1
    },
    "onboardingEvents": {
      "completed": 1
    },
    "transactionTypes": {
      "purchase": 1
    }
  },
  "recent": {
    "users": [...],
    "transactions": [...]
  }
}
```

---

## Test 5: View in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/dfpwykfhjuxoiwnrqjhz
2. Click **Table Editor** in left sidebar
3. Check these tables:
   - **users** - Should have your test user
   - **onboarding_events** - Should have events
   - **transactions** - Should have transaction logs
   - **nft_ownership** - Should have NFT records

---

## Quick Test Script

Save this as `test-backend.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"
WALLET="0x1234567890abcdef1234567890abcdef12345678"

echo "🧪 Testing Backend..."

echo "\n1. Creating user..."
curl -s -X POST "$BASE_URL/api/users/profile" \
  -H "Content-Type: application/json" \
  -d "{\"walletAddress\":\"$WALLET\",\"username\":\"testuser\",\"village\":\"lisbon\",\"onboardingCompleted\":true}" \
  | jq '.'

echo "\n2. Tracking onboarding event..."
curl -s -X POST "$BASE_URL/api/users/onboarding/track" \
  -H "Content-Type: application/json" \
  -d "{\"walletAddress\":\"$WALLET\",\"eventType\":\"completed\"}" \
  | jq '.'

echo "\n3. Logging transaction..."
curl -s -X POST "$BASE_URL/api/users/transactions" \
  -H "Content-Type: application/json" \
  -d "{\"walletAddress\":\"$WALLET\",\"transactionType\":\"purchase\",\"transactionDigest\":\"0xtest123\",\"nftId\":\"0xnft123\",\"tokenAmount\":50}" \
  | jq '.'

echo "\n4. Getting analytics..."
curl -s "$BASE_URL/api/admin/analytics" | jq '.'

echo "\n✅ Tests complete!"
```

Run with: `bash test-backend.sh`

---

## Verify in Supabase Dashboard

After running tests, check:

1. **Table Editor** → **users**
   - Should see your test user
   - `onboarding_completed_at` should be set

2. **Table Editor** → **onboarding_events**
   - Should see events with `event_type = 'completed'`

3. **Table Editor** → **transactions**
   - Should see transaction logs
   - `transaction_type = 'purchase'`

4. **Table Editor** → **nft_ownership**
   - Should see NFT records

---

## Next Steps

✅ Backend is working!
⏭️ **Integrate tracking** into your onboarding flow (see `docs/BACKEND_INTEGRATION_EXAMPLES.md`)
⏭️ **Integrate tracking** into purchase flow
⏭️ **Deploy to Vercel** and test with real users!

---

**Your backend is ready to track hackathon users! 🚀**

