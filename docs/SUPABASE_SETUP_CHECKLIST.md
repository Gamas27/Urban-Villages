# Supabase Setup Checklist

## ✅ Your Credentials (Ready!)

- **Project**: urban-villages
- **Project ID**: dfpwykfhjuxoiwnrqjhz
- **URL**: https://dfpwykfhjuxoiwnrqjhz.supabase.co

---

## Step 1: Add Environment Variables to `.env.local`

Open your `.env.local` file and add these lines:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://dfpwykfhjuxoiwnrqjhz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_1Hv9wwuMwp8YRpLI49_rVA_yLcl61Hk
SUPABASE_SERVICE_ROLE_KEY=sb_secret_D9sVtpw_NMjYeAL54SQHMQ_4jt8EN7m
```

**Note**: You can copy these from `.env.local.supabase` file I created.

---

## Step 2: Run Database Migration

1. **Open Supabase Dashboard**:
   - Go to: https://supabase.com/dashboard/project/dfpwykfhjuxoiwnrqjhz

2. **Open SQL Editor**:
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Copy Migration SQL**:
   - Open: `app/lib/db/migrations/001_initial_schema.sql`
   - Copy all the SQL code

4. **Paste and Run**:
   - Paste into SQL Editor
   - Click "Run" (or press Cmd+Enter)

5. **Verify Tables Created**:
   - Go to "Table Editor" in left sidebar
   - You should see 4 tables:
     - ✅ `users`
     - ✅ `onboarding_events`
     - ✅ `transactions`
     - ✅ `nft_ownership`

---

## Step 3: Test Connection

### Option A: Test Endpoint (Easiest)

1. **Make sure `.env.local` has the variables**
2. **Restart dev server**:
   ```bash
   pnpm dev
   ```

3. **Visit test endpoint**:
   ```
   http://localhost:3000/api/test-db
   ```

4. **Check response**:
   - Should show `"configured": true`
   - Should show `"connected": true`
   - Should show `"tablesExist": true`

### Option B: Test Analytics Endpoint

1. **Visit**:
   ```
   http://localhost:3000/api/admin/analytics
   ```

2. **Should return JSON**:
   ```json
   {
     "totals": {
       "users": 0,
       "completedOnboarding": 0,
       ...
     }
   }
   ```

---

## Step 4: Add to Vercel (For Production)

1. **Go to Vercel Dashboard**:
   - Your project → Settings → Environment Variables

2. **Add these variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://dfpwykfhjuxoiwnrqjhz.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_1Hv9wwuMwp8YRpLI49_rVA_yLcl61Hk
   SUPABASE_SERVICE_ROLE_KEY = sb_secret_D9sVtpw_NMjYeAL54SQHMQ_4jt8EN7m
   ```

3. **Important Settings**:
   - Mark `SUPABASE_SERVICE_ROLE_KEY` as **"Server-side only"** ✅
   - Select **"Production, Preview, Development"** for all environments

4. **Redeploy**:
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

---

## Step 5: Verify Everything Works

### Test User Creation (via API)

```bash
curl -X POST http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890abcdef",
    "username": "testuser",
    "village": "lisbon",
    "onboardingCompleted": true
  }'
```

### Check in Supabase Dashboard

1. Go to **Table Editor** → **users**
2. You should see your test user!

### Test Analytics

Visit: `http://localhost:3000/api/admin/analytics`

Should show:
- Total users: 1
- Completed onboarding: 1

---

## Troubleshooting

### ❌ "Database not configured"

**Solution**: 
- Check `.env.local` has the variables
- Restart dev server: `pnpm dev`

### ❌ "Users table does not exist"

**Solution**:
- Run the migration SQL in Supabase SQL Editor
- Check file: `app/lib/db/migrations/001_initial_schema.sql`

### ❌ "Connection error" or "Failed to connect"

**Solution**:
- Verify project URL is correct: `https://dfpwykfhjuxoiwnrqjhz.supabase.co`
- Check anon key matches your Supabase dashboard
- Ensure Supabase project is active (not paused)

### ❌ Test endpoint shows errors

**Solution**:
- Visit `/api/test-db` to see detailed error messages
- Check browser console for errors
- Check server terminal for errors

---

## Quick Commands

```bash
# Restart dev server (after adding env vars)
pnpm dev

# Test connection
curl http://localhost:3000/api/test-db

# Test analytics
curl http://localhost:3000/api/admin/analytics

# Check env vars are loaded (in browser console on any page)
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
```

---

## Next Steps After Setup

1. ✅ Environment variables added
2. ✅ Migration run
3. ✅ Connection tested
4. ⏭️ **Integrate tracking** (see `docs/BACKEND_INTEGRATION_EXAMPLES.md`)
5. ⏭️ **Deploy to Vercel**
6. ⏭️ **Test with real users!**

---

## Files to Reference

- **Configuration Guide**: `docs/SUPABASE_CONFIG.md`
- **Integration Examples**: `docs/BACKEND_INTEGRATION_EXAMPLES.md`
- **Migration SQL**: `app/lib/db/migrations/001_initial_schema.sql`
- **Test Endpoint**: `app/api/test-db/route.ts`

---

**You're all set! 🚀**

Once you complete Steps 1-3, your backend will be ready to track hackathon users!

