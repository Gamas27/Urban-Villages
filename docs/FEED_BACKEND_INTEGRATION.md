# Feed Backend Integration

## Current Situation

**Problem**: Posts are stored in `localStorage`, so:
- ❌ Each user only sees their own posts
- ❌ Posts don't persist across devices
- ❌ Multiple testers can't see each other's posts

**Solution**: Store posts in Supabase backend so:
- ✅ All users see each other's posts
- ✅ Posts persist across devices
- ✅ Real-time social feed for hackathon testers

---

## What I've Set Up

### 1. Database Schema (`002_posts_schema.sql`)
- **Posts table** - Stores all social feed posts
- **Indexes** - Fast queries by village, user, timestamp
- **View** - `feed_posts` with user info joined

### 2. API Routes (`/api/posts`)
- **GET /api/posts** - Get posts (with village filter, pagination)
- **POST /api/posts** - Create new post

### 3. Client Helper (`app/lib/api/postsApi.ts`)
- `getPosts()` - Fetch posts from backend
- `createPost()` - Create post in backend

---

## Next Steps

### Step 1: Run Migration

1. Go to Supabase SQL Editor: https://supabase.com/dashboard/project/dfpwykfhjuxoiwnrqjhz/sql
2. Copy contents of: `app/lib/db/migrations/002_posts_schema.sql`
3. Paste and click **Run**
4. ✅ Posts table created!

### Step 2: Update Feed.tsx

**Current**: Loads from `localStorage`  
**Change**: Load from `/api/posts`

### Step 3: Update PostComposer.tsx

**Current**: Saves to `localStorage`  
**Change**: Save to `/api/posts`

---

## How It Works

### Images on Walrus ✅

- **PostComposer** already uploads images to Walrus
- **imageBlobId** is stored with post in database
- **Feed** displays images using `WalrusImage` component
- ✅ **Images work perfectly!**

### Posts in Backend

- **Post text** stored in database
- **Walrus blob ID** stored in database
- **User info** joined from users table
- **Village filtering** works automatically
- ✅ **All users see each other's posts!**

---

## Testing

After integration:

1. **User A** creates a post → Saved to database
2. **User B** refreshes feed → Sees User A's post
3. **User A** on different device → Sees their posts
4. **Images** load from Walrus → Display correctly

---

## Migration Strategy

Option 1: **Fresh Start** (Recommended for Hackathon)
- Start fresh with backend posts
- Old localStorage posts won't migrate

Option 2: **Migration Script** (Optional)
- Export localStorage posts
- Import to database via API

---

**Ready to integrate! See integration steps below.**

