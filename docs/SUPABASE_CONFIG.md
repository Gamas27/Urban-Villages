# Supabase Configuration Guide

## Your Supabase Credentials

Based on your provided credentials:

- **Project Name**: urban-villages
- **Project ID**: dfpwykfhjuxoiwnrqjhz
- **Project URL**: `https://dfpwykfhjuxoiwnrqjhz.supabase.co`
- **Database Password**: `%x.U_BLP7.dPp+L`

---

## Environment Variables Setup

### Step 1: Add to `.env.local` (Local Development)

Add these variables to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://dfpwykfhjuxoiwnrqjhz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_1Hv9wwuMwp8YRpLI49_rVA_yLcl61Hk
SUPABASE_SERVICE_ROLE_KEY=sb_secret_D9sVtpw_NMjYeAL54SQHMQ_4jt8EN7m
SUPABASE_DB_URL=postgresql://postgres.dfpwykfhjuxoiwnrqjhz:%x.U_BLP7.dPp+L@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Note**: The connection string format may vary. You can get the exact connection string from:
- Supabase Dashboard → Settings → Database → Connection String
- Choose "Connection pooling" → "Session mode" or "Transaction mode"

### Step 2: Add to Vercel (Production)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://dfpwykfhjuxoiwnrqjhz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_1Hv9wwuMwp8YRpLI49_rVA_yLcl61Hk
SUPABASE_SERVICE_ROLE_KEY = sb_secret_D9sVtpw_NMjYeAL54SQHMQ_4jt8EN7m
```

**Important**: 
- Mark `SUPABASE_SERVICE_ROLE_KEY` as **"Server-side only"** (keep it secret!)
- `NEXT_PUBLIC_*` variables are automatically exposed to the client (safe for anon key)
- Redeploy after adding variables

---

## Step 3: Run Database Migration

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/dfpwykfhjuxoiwnrqjhz
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `app/lib/db/migrations/001_initial_schema.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd+Enter)
7. ✅ Tables should be created!

---

## Step 4: Verify Connection

### Test Locally

1. Make sure `.env.local` has the variables above
2. Restart your dev server:
   ```bash
   pnpm dev
   ```
3. Check console for any Supabase connection errors

### Test API Routes

1. Visit: `http://localhost:3000/api/admin/analytics`
2. Should return JSON with stats (empty at first, but no errors)

### Test Database Connection

You can test by creating a user via the API:

```bash
curl -X POST http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890abcdef",
    "username": "testuser",
    "village": "lisbon"
  }'
```

Then check in Supabase Dashboard → Table Editor → `users` table

---

## Connection String Format

If the connection string above doesn't work, get it from Supabase:

1. Go to **Settings** → **Database**
2. Scroll to **Connection String**
3. Choose:
   - **Connection Pooling**: Yes (recommended)
   - **Mode**: Transaction (for serverless)
4. Copy the URI format
5. Replace `[YOUR-PASSWORD]` with: `%x.U_BLP7.dPp+L`

Example format:
```
postgresql://postgres.dfpwykfhjuxoiwnrqjhz:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## Security Notes

⚠️ **Keep these secret:**
- `SUPABASE_SERVICE_ROLE_KEY` - Full admin access (server-side only!)
- Database password - Never expose this

✅ **Safe to expose (public):**
- `NEXT_PUBLIC_SUPABASE_URL` - Public API endpoint
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Limited access via Row Level Security

---

## Troubleshooting

### Error: "Database not configured"
- Check that environment variables are set correctly
- Restart dev server after adding variables
- Check variable names (case-sensitive!)

### Error: "Failed to connect to database"
- Verify connection string format
- Check database password (URL-encode special characters if needed)
- Ensure Supabase project is active

### Error: "Table does not exist"
- Run the migration SQL in Supabase SQL Editor
- Check that migration completed successfully
- Verify table names match schema

### Error: "Row Level Security" blocking queries
- Check RLS policies in Supabase Dashboard
- The migration includes permissive policies for hackathon
- Adjust policies in Supabase → Authentication → Policies if needed

---

## Next Steps

1. ✅ Add environment variables to `.env.local`
2. ✅ Run migration in Supabase SQL Editor
3. ✅ Test connection locally
4. ✅ Add variables to Vercel
5. ✅ Deploy to Vercel
6. ✅ Test with real users!

---

## Quick Commands

```bash
# Restart dev server (after adding env vars)
pnpm dev

# Test API endpoint
curl http://localhost:3000/api/admin/analytics

# Check environment variables are loaded (in Next.js API route)
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
```

---

**Your backend is ready! 🚀**

