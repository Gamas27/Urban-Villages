# Feed Backend Integration - Complete!

## ✅ What's Done

### 1. Database Schema ✅
- **Posts table** created in Supabase
- Stores posts from all users
- Includes Walrus blob IDs for images
- Indexed for fast queries

### 2. API Routes ✅
- **GET /api/posts** - Fetch posts (with village filter, pagination)
- **POST /api/posts** - Create new post

### 3. Client Integration ✅
- **Feed.tsx** - Now loads from backend API instead of localStorage
- **PostComposer.tsx** - Now saves to backend API instead of localStorage
- **Posts API client** - Helper functions in `app/lib/api/postsApi.ts`

---

## 🚀 How It Works Now

### Image Upload (Walrus) ✅
1. User selects image in PostComposer
2. **Image uploads to Walrus** (decentralized storage)
3. **Walrus blob ID** returned (e.g., `blob_abc123...`)
4. **Blob ID stored in database** with post
5. **Feed displays images** using `WalrusImage` component

### Posts Storage (Supabase) ✅
1. User creates post with text + image
2. **Post saved to Supabase** via `/api/posts`
3. **All users see the post** in their feed
4. **Posts persist** across devices and sessions

### Feed Display ✅
1. Feed loads from `/api/posts` on mount
2. **Refreshes every 10 seconds** automatically
3. **Village filter** works automatically
4. **All users see each other's posts** 🎉

---

## 📋 Next Step: Run Migration

**You need to run the posts migration in Supabase:**

1. Go to Supabase SQL Editor:
   ```
   https://supabase.com/dashboard/project/dfpwykfhjuxoiwnrqjhz/sql
   ```

2. Copy contents of:
   ```
   app/lib/db/migrations/002_posts_schema.sql
   ```

3. Paste and click **Run**

4. ✅ Posts table created!

---

## 🧪 Testing

### Test Creating a Post

1. **Open your app** in browser
2. **Complete onboarding** (if not done)
3. **Go to Feed** tab
4. **Click compose** button
5. **Write post** with or without image
6. **Upload image** (if wanted) → Will upload to Walrus
7. **Click Post** → Should save to database
8. **Check feed** → Your post should appear!

### Test Multi-User View

1. **User A** creates a post
2. **User B** (different browser/device) opens feed
3. **User B sees User A's post** ✅
4. **User B creates a post**
5. **User A refreshes** → Sees User B's post ✅

### Test Images on Walrus

1. **Create post with image**
2. **Check console** → Should show Walrus upload progress
3. **Post appears with image** → Image loaded from Walrus
4. **Open in different browser** → Image still loads ✅

---

## 🎯 What This Enables

### For Hackathon Testers:

✅ **Shared Social Feed** - All users see each other's posts  
✅ **Image Sharing** - Images stored on Walrus (decentralized)  
✅ **Village Filtering** - See posts from your village or all villages  
✅ **Real-time Updates** - Feed refreshes every 10 seconds  
✅ **Cross-Device** - Posts visible on any device  

### For Demo:

✅ **Show Social Activity** - Real posts from real users  
✅ **Demonstrate Walrus** - Images loading from decentralized storage  
✅ **Cross-User Interaction** - Users can see each other's posts  
✅ **Engagement Metrics** - Track posts, likes, comments  

---

## 📊 Database Schema

### Posts Table:
- `id` - UUID primary key
- `user_id` - Foreign key to users table
- `namespace` - User's namespace (e.g., "maria.lisbon")
- `village` - Village ID
- `text` - Post content
- `image_blob_id` - Walrus blob ID for image
- `post_type` - Type of post (regular, purchase, etc.)
- `cork_earned` - CORK tokens earned
- `likes` - Like count
- `comments` - Comment count
- `created_at` - Timestamp

### Indexes:
- `idx_posts_user_id` - Fast user queries
- `idx_posts_village` - Fast village filtering
- `idx_posts_created_at` - Fast chronological sorting
- `idx_posts_village_created_at` - Fast village + time queries

---

## 🔧 Configuration

### Environment Variables
Already set up from previous backend setup:
- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅

### No Additional Setup Needed!
Just run the migration and you're done.

---

## 🐛 Troubleshooting

### Posts not appearing?

1. **Check migration ran** - Go to Supabase → Table Editor → Should see `posts` table
2. **Check API endpoint** - Visit `/api/posts` in browser, should return JSON
3. **Check console** - Look for errors when creating/loading posts
4. **Check network tab** - See if API calls are succeeding

### Images not loading?

1. **Check Walrus upload** - Console should show upload progress
2. **Check blob ID** - Should be stored in database with post
3. **Check WalrusImage component** - Should display images from Walrus
4. **Check WAL tokens** - Might need WAL tokens for Walrus uploads (but test mode might work)

### Feed not refreshing?

1. **Check auto-refresh** - Feed refreshes every 10 seconds automatically
2. **Check manual refresh** - Can refresh page to see new posts
3. **Check postCreated event** - New posts should trigger immediate refresh

---

## 📝 Files Changed

### New Files:
- `app/lib/db/migrations/002_posts_schema.sql` - Database migration
- `app/api/posts/route.ts` - Posts API routes
- `app/lib/api/postsApi.ts` - Posts API client

### Updated Files:
- `app/cork/Feed.tsx` - Now loads from backend API
- `app/cork/PostComposer.tsx` - Now saves to backend API

### Unchanged:
- `app/cork/lib/postStorage.ts` - Still exists but not used by Feed/PostComposer
- `app/components/WalrusImage.tsx` - Used to display Walrus images ✅

---

## ✅ Status

**Ready to test!** Just run the migration and create some posts! 🚀

**All users will now see each other's posts, and images are stored on Walrus!**

