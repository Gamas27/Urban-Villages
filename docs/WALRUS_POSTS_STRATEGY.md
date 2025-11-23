# Posts on Walrus: Strategy & Implementation

## Current Situation

**Now:**
- ✅ Images → Walrus (decentralized)
- ❌ Posts → Supabase (centralized)

**Why Supabase for Posts:**
- Fast queries (village filter, pagination)
- Real-time updates
- Easy analytics

**Problem:**
- Not fully decentralized
- Requires backend server
- Images and posts on different systems

---

## Solution: Posts on Walrus + Index Strategy

### Option 1: Fully Decentralized (Posts + Index on SUI)

**Architecture:**
```
Post Content (JSON) → Walrus
Post Reference (blobId, metadata) → SUI Smart Contract
Query → Read from SUI → Fetch from Walrus
```

**Pros:**
- ✅ Fully decentralized
- ✅ Censorship-resistant
- ✅ Web3 native

**Cons:**
- ❌ Gas costs for indexing
- ❌ Slower queries
- ❌ More complex

### Option 2: Hybrid (Posts on Walrus, Index in Supabase)

**Architecture:**
```
Post Content (JSON) → Walrus
Post Index (blobId, village, timestamp) → Supabase
Query → Supabase index → Fetch from Walrus
```

**Pros:**
- ✅ Posts decentralized (Walrus)
- ✅ Fast queries (Supabase index)
- ✅ Best performance

**Cons:**
- ❌ Index is centralized
- ❌ Hybrid approach

### Option 3: Everything on Walrus + JSON Index

**Architecture:**
```
Posts → Walrus (individual JSON files)
Post List → Walrus (index JSON file)
Query → Fetch index → Fetch posts
```

**Pros:**
- ✅ Fully decentralized
- ✅ No backend needed

**Cons:**
- ❌ Must load entire index
- ❌ No efficient filtering
- ❌ Slow for large datasets

---

## Recommendation: Hybrid Approach

**Best for Hackathon:**
- Posts stored on **Walrus** (decentralized)
- Index stored in **Supabase** (fast queries)

**Why:**
- ✅ Posts are decentralized (main content)
- ✅ Fast queries (index enables filtering)
- ✅ Images + Posts both on Walrus (consistent)
- ✅ Easy to demo
- ✅ Can migrate index to SUI later

---

## Implementation Plan

### 1. Post Structure on Walrus

```json
{
  "id": "post_abc123",
  "namespace": "maria.lisbon",
  "village": "lisbon",
  "text": "Just opened Bottle #47!",
  "imageBlobId": "blob_xyz789",
  "type": "regular",
  "corkEarned": 10,
  "timestamp": 1234567890,
  "author": "maria"
}
```

### 2. Index in Supabase

```sql
CREATE TABLE post_index (
  id TEXT PRIMARY KEY,
  blob_id TEXT UNIQUE NOT NULL,  -- Walrus blob ID
  namespace TEXT,
  village TEXT,
  timestamp BIGINT,
  author TEXT,
  -- Index for fast queries
  INDEX idx_village_timestamp (village, timestamp DESC)
);
```

### 3. Query Flow

```
1. Query Supabase index (fast)
   SELECT blob_id FROM post_index WHERE village = 'lisbon' ORDER BY timestamp DESC LIMIT 50

2. Fetch posts from Walrus (in parallel)
   GET walrus://blob_id_1
   GET walrus://blob_id_2
   ...

3. Display in feed
```

---

## Benefits of Hybrid Approach

### ✅ Decentralized Storage
- Post content on Walrus (permanent)
- Images on Walrus (consistent)
- Both are decentralized

### ✅ Fast Queries
- Index in Supabase enables fast filtering
- Pagination works efficiently
- Real-time updates possible

### ✅ Migration Path
- Can move index to SUI later
- Posts already on Walrus
- No re-upload needed

---

## Full Implementation

I can implement:
1. ✅ Posts stored as JSON on Walrus
2. ✅ Index in Supabase (for queries)
3. ✅ API routes fetch from Walrus
4. ✅ Fallback to Supabase for now

**Want me to implement this?**

---

## Alternative: Fully On-Chain

Store post references directly on SUI:
- Post content on Walrus
- Post metadata in smart contract
- Query from on-chain data

**More decentralized but:**
- Gas costs for each post
- Slower queries
- More complex

---

## My Recommendation

**For Hackathon:** Hybrid (Posts on Walrus + Supabase Index)
- ✅ Fast enough to demo
- ✅ Posts are decentralized
- ✅ Easy to implement

**For Production:** Migrate index to SUI
- ✅ Fully decentralized
- ✅ No backend dependency
- ✅ True web3 platform

---

**Should I implement the hybrid approach (Posts on Walrus + Supabase Index)?**

