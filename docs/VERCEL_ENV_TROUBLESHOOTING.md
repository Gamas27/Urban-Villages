# 🔧 Vercel Environment Variable Troubleshooting

## Problem: Variable Set But Still Missing

If you've added `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to Vercel but it's still showing as missing:

---

## ✅ Checklist

### 1. Variable Name is Correct
- ✅ Must be exactly: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- ❌ Common mistakes:
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID ` (trailing space)
  - `NEXT_PUBLIC_GOOGLE_CLIENT` (missing `_ID`)
  - `GOOGLE_CLIENT_ID` (missing `NEXT_PUBLIC_`)

### 2. Variable is Set for Correct Environment
- ✅ Check which environment it's set for:
  - **Production** (for production deployments)
  - **Preview** (for preview deployments)
  - **Development** (for local development)
- ⚠️ If you only set it for "Development", it won't work in Production!

### 3. Value is Not Empty
- ✅ Make sure the value field is not empty
- ✅ No extra spaces or quotes around the value
- ✅ The actual Google Client ID (not a placeholder)

### 4. Redeploy After Adding Variable
- ✅ **CRITICAL:** Vercel needs to rebuild to pick up new environment variables
- ✅ After adding the variable, trigger a new deployment:
  - Push a new commit, OR
  - Go to Deployments tab > Click "..." > "Redeploy"

### 5. Clear Build Cache (if needed)
- If variable still not working after redeploy:
  - Go to Deployments > Click "..." > "Redeploy" > Check "Use existing Build Cache" = **OFF**

---

## 🧪 How to Verify

### Method 1: Check Vercel Dashboard
1. Go to Project Settings > Environment Variables
2. Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is listed
3. Check which environments it's enabled for
4. Click on it to see the value (first few characters)

### Method 2: Check Build Logs
1. Go to Deployments tab
2. Click on latest deployment
3. Check "Build Logs"
4. Look for environment variable loading (Next.js shows which vars are available)

### Method 3: Add Debug Endpoint
Create a test endpoint to check if variable is available:

```typescript
// app/api/debug-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasGoogleClientId: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    googleClientIdPrefix: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.substring(0, 20) || 'NOT SET',
    allEnvVars: Object.keys(process.env)
      .filter(key => key.startsWith('NEXT_PUBLIC_'))
      .sort(),
  });
}
```

Then visit: `https://your-domain.vercel.app/api/debug-env`

---

## 🚨 Common Issues

### Issue 1: Variable Set But Not Redeployed
**Symptom:** Variable shows in Vercel dashboard but not in app
**Fix:** Redeploy the project

### Issue 2: Variable Set for Wrong Environment
**Symptom:** Works in Preview but not Production
**Fix:** Make sure variable is set for "Production" environment

### Issue 3: Typo in Variable Name
**Symptom:** Variable not found
**Fix:** Double-check spelling: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

### Issue 4: Build Cache Issue
**Symptom:** Variable added but still not working after redeploy
**Fix:** Redeploy with "Use existing Build Cache" = OFF

### Issue 5: Value Has Extra Characters
**Symptom:** Variable set but value is wrong
**Fix:** Make sure no quotes, spaces, or special characters around the value

---

## 📝 Step-by-Step Fix

1. **Verify Variable in Vercel:**
   - Go to Settings > Environment Variables
   - Find `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - Check it's set for "Production"
   - Verify the value is correct

2. **Redeploy:**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - Wait for build to complete

3. **Test:**
   - Visit your Vercel URL
   - Open browser console
   - Look for: `✅ Enoki initialized successfully with Google login`
   - OR: `⚠️ Google Client ID is missing!` (if still not working)

4. **If Still Not Working:**
   - Clear build cache and redeploy
   - Double-check variable name and value
   - Check build logs for any errors

---

## 🔍 Debugging Commands

### Check if variable is in build:
Look at Vercel build logs for:
```
> Build environment variables:
> NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
```

### Test locally with same value:
```bash
# In .env.local, use the exact same value as Vercel
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<same-value-as-vercel>
pnpm dev
# Check if it works locally
```

---

**Still not working?** Check the build logs and browser console for specific error messages.

