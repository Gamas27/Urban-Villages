# Cork Collective - Production MVP Architecture

**Version**: 1.0  
**Last Updated**: November 2024  
**Status**: Pre-Launch Planning

---

## 🎯 Executive Summary

Cork Collective is a blockchain-powered loyalty platform for natural wine retailers, combining NFT bottle provenance with fungible token rewards. This document outlines the production-grade architecture for a 6-month MVP launch targeting 5,000 users and 3-5 winery partners.

**Key Differentiators:**
- First blockchain loyalty program for wine industry
- Solves real fraud problem (€3B/year wine counterfeiting)
- Zero-friction UX for non-crypto users
- Real-world utility (provenance verification)

---

## 📊 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Web App (Next.js)  │  Mobile App (React Native)  │  Admin Panel│
│  - Customer facing  │  - Camera QR scanning        │  - Winery   │
│  - Wallet embedded  │  - Push notifications        │  - Analytics│
└──────────────┬──────────────────────────┬────────────────────────┘
               │                          │
               ▼                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                              │
│  - Rate limiting        - Authentication     - Load balancing    │
│  - Request logging      - API versioning     - CORS handling     │
└──────────────┬──────────────────────────┬────────────────────────┘
               │                          │
       ┌───────┴────────┐        ┌────────┴─────────┐
       ▼                ▼        ▼                  ▼
┌─────────────┐  ┌──────────────┐  ┌──────────────────┐
│   Backend   │  │   Blockchain │  │  External APIs   │
│   Services  │  │   Services   │  │  & Integrations  │
└─────────────┘  └──────────────┘  └──────────────────┘
       │                │                    │
       ├─ User Service  ├─ SUI Node         ├─ Stripe (payments)
       ├─ Bottle Svc    ├─ Wallet Mgmt      ├─ Sendgrid (email)
       ├─ Rewards Svc   ├─ Gas Sponsorship  ├─ Twilio (SMS)
       ├─ Analytics     ├─ Transaction Mgmt ├─ AWS S3 (storage)
       └─ Admin Svc     └─ Contract Indexer └─ Shippo (shipping)
              │                │                    │
              ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL  │  Redis Cache  │  SUI Blockchain  │  S3/CDN       │
│  (Relational)│  (Session)    │  (Immutable)     │  (Media)      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Technology Stack

### **Frontend**

#### Web Application
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand + React Query
- **Wallet Integration**: @mysten/dapp-kit
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Deployment**: Vercel (Edge Functions)

#### Mobile Application
- **Framework**: React Native 0.73+ (Expo)
- **Navigation**: React Navigation v6
- **Camera**: expo-camera (QR scanning)
- **Notifications**: expo-notifications
- **Secure Storage**: expo-secure-store
- **Deployment**: 
  - iOS: TestFlight → App Store
  - Android: Google Play Console

#### Admin Dashboard
- **Framework**: Next.js 14 (separate app)
- **Auth**: Clerk or Auth0
- **Analytics**: Recharts + Custom dashboards
- **Real-time**: Pusher or Socket.io
- **Deployment**: Vercel

---

### **Backend**

#### API Server
- **Framework**: Node.js + Express (or Fastify for performance)
- **Language**: TypeScript
- **Architecture**: Microservices (modular monolith initially)
- **API Design**: RESTful + GraphQL (future)
- **Validation**: Zod schemas
- **Testing**: Jest + Supertest
- **Deployment**: Railway / Render / AWS ECS

#### Database
- **Primary DB**: PostgreSQL 15+ (Supabase managed)
  - User profiles
  - Transaction history
  - Reward catalog
  - Analytics events
  - Admin logs

- **Cache**: Redis 7+ (Upstash managed)
  - Session storage
  - Rate limiting
  - Real-time data
  - Job queues

- **Search**: Elasticsearch (future) or PostgreSQL full-text
  - Bottle search
  - User search
  - Transaction search

#### Background Jobs
- **Queue**: BullMQ (Redis-based)
- **Jobs**:
  - Email sending
  - NFT minting
  - Cork distribution
  - Analytics aggregation
  - Webhook processing
  - Daily tier recalculation

---

### **Blockchain Layer**

#### SUI Integration
- **Network**: SUI Mainnet
- **Node**: Managed RPC (Mysten Labs or QuickNode)
- **SDK**: @mysten/sui.js v0.50+
- **Contracts**: Move language (deployed addresses in env)

#### Wallet Management
- **Embedded Wallets**: zkLogin (SUI native)
  - Email/Google OAuth → SUI address
  - Gasless transactions
  - Key recovery via OAuth

- **External Wallets**: 
  - Sui Wallet
  - Ethos Wallet
  - Browser extension wallets

#### Transaction Management
- **Sponsorship**: Meta-transactions for free user experience
- **Gas Tank**: Pre-funded account for sponsoring
- **Batching**: Combine operations to reduce costs
- **Retries**: Exponential backoff for failed txs
- **Monitoring**: Track gas usage and costs

#### Indexer
- **Tool**: Custom indexer or SuiVision API
- **Purpose**: Query blockchain data efficiently
- **Indexed Data**:
  - User bottle ownership
  - Cork balances
  - Transaction history
  - Tier progression
  - Redemption records

---

### **Infrastructure**

#### Hosting
- **Frontend**: Vercel (Global CDN, Edge Functions)
- **Backend**: Railway or AWS ECS (Docker containers)
- **Database**: Supabase (managed PostgreSQL)
- **Cache**: Upstash (managed Redis)
- **Media**: AWS S3 + CloudFront CDN
- **Blockchain**: Mysten RPC endpoints

#### DevOps
- **CI/CD**: GitHub Actions
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (future scale) or Railway
- **Monitoring**: Datadog or Sentry
- **Logging**: Better Stack (Logtail)
- **Secrets**: Doppler or AWS Secrets Manager

#### Security
- **SSL/TLS**: Let's Encrypt (auto-renewal)
- **WAF**: Cloudflare
- **DDoS Protection**: Cloudflare
- **API Security**: Rate limiting, CORS, helmet.js
- **Data Encryption**: 
  - At rest: PostgreSQL encryption
  - In transit: TLS 1.3
  - Sensitive fields: Field-level encryption (AES-256)

---

## 🗄️ Database Schema

### **PostgreSQL Schema**

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(50),
  
  -- Blockchain
  sui_address VARCHAR(66) UNIQUE NOT NULL,
  wallet_type VARCHAR(50) NOT NULL, -- 'zklogin', 'external'
  
  -- OAuth (for zkLogin)
  oauth_provider VARCHAR(50), -- 'google', 'apple', 'email'
  oauth_sub VARCHAR(255), -- OAuth subject identifier
  
  -- Profile
  avatar_url TEXT,
  referral_code VARCHAR(50) UNIQUE,
  referred_by UUID REFERENCES users(id),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_sui_address ON users(sui_address);
CREATE INDEX idx_users_referral_code ON users(referral_code);
```

#### Bottles Table
```sql
CREATE TABLE bottles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Blockchain
  nft_object_id VARCHAR(66) UNIQUE NOT NULL, -- SUI object ID
  owner_id UUID REFERENCES users(id),
  
  -- Wine Details
  name VARCHAR(255) NOT NULL,
  vintage INTEGER NOT NULL,
  region VARCHAR(255) NOT NULL,
  winery VARCHAR(255) NOT NULL,
  wine_type VARCHAR(100) NOT NULL,
  
  -- Batch Info
  bottle_number INTEGER NOT NULL,
  total_supply INTEGER NOT NULL,
  
  -- Personalization
  custom_text TEXT,
  custom_image_url TEXT,
  
  -- Provenance
  qr_code VARCHAR(100) UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  
  -- Purchase
  purchase_price DECIMAL(10,2),
  purchase_date TIMESTAMPTZ NOT NULL,
  corks_earned INTEGER DEFAULT 50,
  
  -- Status
  is_verified BOOLEAN DEFAULT true,
  is_claimed BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bottles_owner ON bottles(owner_id);
CREATE INDEX idx_bottles_qr ON bottles(qr_code);
CREATE INDEX idx_bottles_nft ON bottles(nft_object_id);
```

#### Provenance Events Table
```sql
CREATE TABLE provenance_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bottle_id UUID REFERENCES bottles(id) ON DELETE CASCADE,
  
  event_type VARCHAR(100) NOT NULL, -- 'minted', 'transferred', 'scanned', 'shipped'
  description TEXT,
  metadata JSONB, -- Flexible data storage
  
  -- Location (if applicable)
  location VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  -- Actor
  actor_id UUID REFERENCES users(id),
  actor_address VARCHAR(66), -- SUI address
  
  -- Blockchain
  transaction_digest VARCHAR(100),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_provenance_bottle ON provenance_events(bottle_id);
CREATE INDEX idx_provenance_type ON provenance_events(event_type);
```

#### Cork Transactions Table
```sql
CREATE TABLE cork_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  
  -- Transaction Details
  type VARCHAR(50) NOT NULL, -- 'earned', 'spent', 'bonus', 'referral'
  amount INTEGER NOT NULL, -- Can be negative for spending
  balance_after INTEGER NOT NULL,
  
  -- Context
  reason VARCHAR(255),
  related_bottle_id UUID REFERENCES bottles(id),
  related_reward_id UUID REFERENCES rewards(id),
  
  -- Blockchain
  transaction_digest VARCHAR(100),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cork_tx_user ON cork_transactions(user_id);
CREATE INDEX idx_cork_tx_type ON cork_transactions(type);
CREATE INDEX idx_cork_tx_created ON cork_transactions(created_at DESC);
```

#### User Profiles Table (Tier System)
```sql
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  
  -- Tier
  current_tier VARCHAR(50) DEFAULT 'sipper', -- 'sipper', 'advocate', 'guardian'
  cork_balance INTEGER DEFAULT 0,
  
  -- Stats
  bottles_purchased INTEGER DEFAULT 0,
  total_corks_earned INTEGER DEFAULT 0,
  total_corks_spent INTEGER DEFAULT 0,
  referrals_count INTEGER DEFAULT 0,
  
  -- Achievements
  first_purchase_at TIMESTAMPTZ,
  tier_upgraded_at TIMESTAMPTZ,
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_tier ON user_profiles(current_tier);
CREATE INDEX idx_profiles_balance ON user_profiles(cork_balance DESC);
```

#### Rewards Table
```sql
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Details
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'product', 'experience', 'discount'
  
  -- Pricing
  cork_cost INTEGER NOT NULL,
  
  -- Media
  image_url TEXT NOT NULL,
  images JSONB, -- Multiple images
  
  -- Inventory
  stock INTEGER DEFAULT 0, -- 0 = unlimited
  total_redeemed INTEGER DEFAULT 0,
  
  -- Availability
  is_active BOOLEAN DEFAULT true,
  available_from TIMESTAMPTZ,
  available_until TIMESTAMPTZ,
  
  -- Restrictions
  min_tier VARCHAR(50), -- Minimum tier required
  max_redemptions_per_user INTEGER,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rewards_active ON rewards(is_active);
CREATE INDEX idx_rewards_category ON rewards(category);
CREATE INDEX idx_rewards_cost ON rewards(cork_cost);
```

#### Redemptions Table
```sql
CREATE TABLE redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  reward_id UUID REFERENCES rewards(id) NOT NULL,
  
  -- Transaction
  corks_spent INTEGER NOT NULL,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'fulfilled', 'cancelled'
  
  -- Fulfillment
  shipping_address JSONB,
  tracking_number VARCHAR(255),
  shipped_at TIMESTAMPTZ,
  fulfilled_at TIMESTAMPTZ,
  
  -- Blockchain
  transaction_digest VARCHAR(100),
  
  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_redemptions_user ON redemptions(user_id);
CREATE INDEX idx_redemptions_status ON redemptions(status);
CREATE INDEX idx_redemptions_created ON redemptions(created_at DESC);
```

#### Wineries/Partners Table
```sql
CREATE TABLE wineries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Business Info
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  
  -- Contact
  email VARCHAR(255),
  phone VARCHAR(50),
  website VARCHAR(255),
  
  -- Location
  address TEXT,
  city VARCHAR(255),
  region VARCHAR(255),
  country VARCHAR(255),
  
  -- Media
  logo_url TEXT,
  banner_url TEXT,
  images JSONB,
  
  -- Integration
  api_key VARCHAR(255) UNIQUE,
  webhook_url TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  verified BOOLEAN DEFAULT false,
  
  -- Stats
  total_bottles_sold INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wineries_slug ON wineries(slug);
CREATE INDEX idx_wineries_active ON wineries(is_active);
```

#### Analytics Events Table
```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Event
  event_name VARCHAR(100) NOT NULL,
  event_category VARCHAR(100),
  
  -- User
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(100),
  
  -- Context
  properties JSONB,
  
  -- Device
  user_agent TEXT,
  ip_address INET,
  device_type VARCHAR(50),
  
  -- Location
  country VARCHAR(100),
  city VARCHAR(100),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_event ON analytics_events(event_name);
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);
```

---

## 🔌 API Design

### **REST API Endpoints**

#### Authentication
```
POST   /api/v1/auth/register           - Create account
POST   /api/v1/auth/login              - Login
POST   /api/v1/auth/logout             - Logout
POST   /api/v1/auth/refresh            - Refresh token
POST   /api/v1/auth/verify-email       - Verify email
POST   /api/v1/auth/reset-password     - Reset password
```

#### Users
```
GET    /api/v1/users/me                - Get current user
PUT    /api/v1/users/me                - Update profile
GET    /api/v1/users/me/stats          - Get user statistics
GET    /api/v1/users/me/tier           - Get tier info
POST   /api/v1/users/me/referral       - Generate referral link
```

#### Bottles
```
GET    /api/v1/bottles                 - List available bottles (shop)
GET    /api/v1/bottles/:id             - Get bottle details
GET    /api/v1/bottles/qr/:qrCode      - Verify bottle by QR
POST   /api/v1/bottles/purchase        - Purchase bottle
GET    /api/v1/bottles/my-collection   - Get user's bottles
GET    /api/v1/bottles/:id/provenance  - Get bottle history
POST   /api/v1/bottles/:id/scan        - Log QR scan event
```

#### Cork Tokens
```
GET    /api/v1/corks/balance           - Get Cork balance
GET    /api/v1/corks/transactions      - Get Cork history
POST   /api/v1/corks/transfer          - Transfer Corks (future)
```

#### Rewards
```
GET    /api/v1/rewards                 - List available rewards
GET    /api/v1/rewards/:id             - Get reward details
POST   /api/v1/rewards/:id/redeem      - Redeem reward
GET    /api/v1/rewards/my-redemptions  - Get redemption history
GET    /api/v1/rewards/:id/eligibility - Check if user can redeem
```

#### Activity
```
GET    /api/v1/activity                - Get user activity feed
GET    /api/v1/activity/stats          - Get activity statistics
```

#### Admin (Protected)
```
GET    /api/v1/admin/users             - List all users
GET    /api/v1/admin/analytics         - Dashboard analytics
POST   /api/v1/admin/bottles/mint      - Mint new bottle
PUT    /api/v1/admin/redemptions/:id   - Update redemption status
POST   /api/v1/admin/rewards           - Create reward
PUT    /api/v1/admin/rewards/:id       - Update reward
POST   /api/v1/admin/corks/mint        - Mint Corks to user
```

### **API Response Format**

```typescript
// Success Response
{
  "success": true,
  "data": {
    // Response payload
  },
  "meta": {
    "timestamp": "2024-11-18T10:30:00Z",
    "requestId": "req_abc123"
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_CORKS",
    "message": "Not enough Corks to redeem this reward",
    "details": {
      "required": 150,
      "available": 100
    }
  },
  "meta": {
    "timestamp": "2024-11-18T10:30:00Z",
    "requestId": "req_abc123"
  }
}

// Paginated Response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 156,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🔐 Authentication & Authorization

### **zkLogin Integration (SUI Native)**

```typescript
// Email/Google Login Flow
1. User clicks "Continue with Google"
2. OAuth redirect to Google
3. Google returns OAuth token
4. Backend generates SUI address from OAuth token
5. Store mapping: oauth_sub → sui_address
6. Create JWT for session management
7. Return user profile + wallet address
```

### **Session Management**

- **JWT Tokens**: Short-lived access tokens (15min)
- **Refresh Tokens**: Long-lived (30 days), rotated on use
- **Redis Storage**: Active sessions cached
- **Revocation**: Logout invalidates both tokens

### **Authorization Levels**

```typescript
enum Role {
  CUSTOMER = 'customer',        // Regular users
  WINERY = 'winery',           // Partner wineries
  ADMIN = 'admin',             // Cork Collective staff
  SUPER_ADMIN = 'super_admin'  // Platform owner
}

// Permissions
const permissions = {
  customer: ['read:own_bottles', 'redeem:rewards', 'scan:qr'],
  winery: ['read:analytics', 'mint:bottles', 'view:customers'],
  admin: ['*'], // All permissions
}
```

---

## 🎨 Frontend Architecture

### **State Management**

```typescript
// Zustand Stores

// Auth Store
interface AuthStore {
  user: User | null;
  walletAddress: string | null;
  isAuthenticated: boolean;
  login: (method: 'email' | 'google' | 'wallet') => Promise<void>;
  logout: () => Promise<void>;
}

// Bottles Store
interface BottlesStore {
  myBottles: Bottle[];
  shopBottles: Bottle[];
  selectedBottle: Bottle | null;
  fetchMyBottles: () => Promise<void>;
  purchaseBottle: (id: string) => Promise<void>;
}

// Corks Store
interface CorksStore {
  balance: number;
  transactions: CorkTransaction[];
  fetchBalance: () => Promise<void>;
}

// Rewards Store
interface RewardsStore {
  rewards: Reward[];
  redemptions: Redemption[];
  redeemReward: (id: string) => Promise<void>;
}
```

### **React Query Integration**

```typescript
// API Hooks with caching

// Get user's bottles (cached for 5 minutes)
const { data: bottles, isLoading } = useQuery({
  queryKey: ['bottles', 'my-collection'],
  queryFn: () => api.bottles.getMyCollection(),
  staleTime: 5 * 60 * 1000,
});

// Get Cork balance (cached for 30 seconds)
const { data: balance } = useQuery({
  queryKey: ['corks', 'balance'],
  queryFn: () => api.corks.getBalance(),
  staleTime: 30 * 1000,
  refetchInterval: 30 * 1000, // Poll every 30s
});

// Purchase bottle (mutation)
const purchaseMutation = useMutation({
  mutationFn: (bottleId: string) => api.bottles.purchase(bottleId),
  onSuccess: () => {
    // Invalidate caches
    queryClient.invalidateQueries(['bottles']);
    queryClient.invalidateQueries(['corks', 'balance']);
  }
});
```

### **Route Structure**

```
/                          - Landing page
/auth/login                - Login page
/auth/register             - Registration
/dashboard                 - User dashboard (QR scanner hero)
/shop                      - Browse bottles
/shop/:id                  - Bottle details
/shop/:id/personalize      - Personalization flow
/collection                - My bottles
/collection/:id            - Bottle details + provenance
/rewards                   - Earn + Redeem
/rewards/:id               - Reward details
/rewards/my-redemptions    - Redemption history
/activity                  - Transaction history
/profile                   - User settings
/referrals                 - Referral program

/admin/*                   - Admin routes (protected)
```

---

## 🔗 Integration Architecture

### **Payment Processing (Stripe)**

```typescript
// Purchase Flow
1. User selects bottle + personalization
2. Frontend creates PaymentIntent via backend
3. Stripe Elements collects payment
4. On success:
   - Backend verifies payment
   - Mints Bottle NFT on SUI
   - Mints 50 Cork tokens
   - Creates order record
   - Sends confirmation email
5. Show MintingConfirmation modal with tx hash
```

### **Email Service (SendGrid)**

**Transactional Emails:**
- Welcome email (with referral link)
- Purchase confirmation (with NFT details)
- Bottle shipped (with tracking)
- Reward redeemed (with fulfillment info)
- Tier upgrade celebration
- Weekly digest

**Templates:**
```
templates/
  ├── welcome.html
  ├── purchase-confirmation.html
  ├── bottle-shipped.html
  ├── reward-redeemed.html
  ├── tier-upgrade.html
  └── weekly-digest.html
```

### **SMS Notifications (Twilio)**

- Order confirmation
- Shipping updates
- Important account changes
- Time-sensitive promos

### **Shipping Integration (Shippo)**

```typescript
// Create shipping label
async function createShipment(redemption: Redemption) {
  const shipment = await shippo.shipments.create({
    address_from: WAREHOUSE_ADDRESS,
    address_to: redemption.shipping_address,
    parcels: [{
      length: '10',
      width: '8',
      height: '6',
      distance_unit: 'in',
      weight: '2',
      mass_unit: 'lb'
    }]
  });
  
  // Get cheapest rate
  const rate = shipment.rates.sort((a, b) => 
    parseFloat(a.amount) - parseFloat(b.amount)
  )[0];
  
  // Purchase label
  const transaction = await shippo.transactions.create({
    rate: rate.object_id,
    async: false
  });
  
  return {
    trackingNumber: transaction.tracking_number,
    labelUrl: transaction.label_url
  };
}
```

### **Analytics (Mixpanel + Custom)**

```typescript
// Track events
analytics.track('bottle_purchased', {
  bottle_id: bottle.id,
  bottle_name: bottle.name,
  price: bottle.price,
  corks_earned: 50,
  payment_method: 'card'
});

analytics.track('reward_redeemed', {
  reward_id: reward.id,
  reward_name: reward.name,
  corks_spent: reward.cork_cost
});

analytics.track('qr_scanned', {
  bottle_id: bottle.id,
  ownership_status: 'yours' | 'claimable' | 'owned'
});
```

### **QR Code Generation**

```typescript
// Server-side QR generation
import QRCode from 'qrcode';

async function generateBottleQR(bottle: Bottle): Promise<string> {
  const qrData = {
    id: bottle.id,
    qr_code: bottle.qr_code,
    nft_id: bottle.nft_object_id,
    verify_url: `https://corkcollective.io/verify/${bottle.qr_code}`
  };
  
  // Generate QR as data URL
  const qrDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 500,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  
  // Upload to S3
  const s3Key = `qr-codes/${bottle.id}.png`;
  await uploadToS3(qrDataURL, s3Key);
  
  return `https://cdn.corkcollective.io/${s3Key}`;
}
```

---

## 📱 Mobile App Architecture

### **React Native Structure**

```
mobile/
├── src/
│   ├── screens/
│   │   ├── DashboardScreen.tsx
│   │   ├── ScannerScreen.tsx       ← Camera QR scanning
│   │   ├── CollectionScreen.tsx
│   │   └── ...
│   ├── components/
│   │   ├── BottleCard.tsx
│   │   ├── QRScannerView.tsx       ← Custom camera component
│   │   └── ...
│   ├── navigation/
│   │   └── RootNavigator.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── wallet.ts
│   │   └── notifications.ts
│   ├── hooks/
│   │   ├── useCamera.ts
│   │   ├── useWallet.ts
│   │   └── ...
│   └── utils/
│       ├── qr-parser.ts
│       └── blockchain.ts
```

### **QR Scanner Implementation**

```typescript
// QRScannerScreen.tsx
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

export function QRScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    
    try {
      const qrData = JSON.parse(data);
      const bottle = await api.bottles.verifyQR(qrData.qr_code);
      
      // Navigate to bottle details
      navigation.navigate('BottleDetails', { bottle });
      
      // Haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Invalid QR Code', 'This QR code is not recognized.');
      setScanned(false);
    }
  };

  return (
    <Camera
      style={StyleSheet.absoluteFillObject}
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      barCodeScannerSettings={{
        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
      }}
    >
      {/* Scanning overlay */}
      <ScannerOverlay />
    </Camera>
  );
}
```

### **Push Notifications**

```typescript
// notifications.ts
import * as Notifications from 'expo-notifications';

// Configure handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Send notification types
const notifications = {
  bottleShipped: (tracking: string) => ({
    title: '🍷 Your bottle is on its way!',
    body: `Track your shipment: ${tracking}`,
    data: { type: 'shipment', tracking }
  }),
  
  rewardReady: (reward: string) => ({
    title: '🎁 Reward ready to claim!',
    body: `Your ${reward} is ready for pickup`,
    data: { type: 'reward_ready' }
  }),
  
  tierUpgrade: (tier: string) => ({
    title: '🎉 Tier Upgrade!',
    body: `Congratulations! You're now a ${tier}`,
    data: { type: 'tier_upgrade', tier }
  })
};
```

---

## 🔒 Security Implementation

### **Data Protection**

```typescript
// Field-level encryption for sensitive data
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 bytes
const ALGORITHM = 'aes-256-gcm';

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encrypted: string): string {
  const parts = encrypted.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encryptedText = parts[2];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### **Rate Limiting**

```typescript
// Redis-based rate limiter
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

const limiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to all routes
app.use('/api/', limiter);

// Stricter limits for sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts per 15 minutes
  skipSuccessfulRequests: true,
});

app.use('/api/auth/login', authLimiter);
```

### **Input Validation**

```typescript
// Zod schemas for validation
import { z } from 'zod';

const PurchaseBottleSchema = z.object({
  bottleId: z.string().uuid(),
  customText: z.string().max(200).optional(),
  paymentMethodId: z.string(),
  shippingAddress: z.object({
    name: z.string().min(1).max(100),
    street: z.string().min(1).max(200),
    city: z.string().min(1).max(100),
    state: z.string().length(2),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/),
    country: z.string().length(2),
  })
});

// Use in route handler
app.post('/api/bottles/purchase', async (req, res) => {
  try {
    const data = PurchaseBottleSchema.parse(req.body);
    // Process purchase
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.errors
        }
      });
    }
  }
});
```

### **CORS Configuration**

```typescript
import cors from 'cors';

const corsOptions = {
  origin: function (origin, callback) {
    const whitelist = [
      'https://corkcollective.io',
      'https://www.corkcollective.io',
      'https://admin.corkcollective.io',
    ];
    
    if (process.env.NODE_ENV === 'development') {
      whitelist.push('http://localhost:3000');
    }
    
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

---

## 📊 Monitoring & Analytics

### **Application Monitoring (Sentry)**

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  
  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers?.['authorization'];
    }
    return event;
  },
});

// Error tracking
app.use(Sentry.Handlers.errorHandler());
```

### **Logging (Pino + Better Stack)**

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: '@logtail/pino',
    options: {
      sourceToken: process.env.LOGTAIL_TOKEN
    }
  }
});

// Structured logging
logger.info({
  event: 'bottle_purchased',
  userId: user.id,
  bottleId: bottle.id,
  price: bottle.price,
  transactionDigest: txDigest
}, 'Bottle purchased successfully');
```

### **Metrics (Custom Dashboard)**

```typescript
// Track key metrics in PostgreSQL
async function recordMetric(metric: string, value: number, tags?: object) {
  await db.metrics.create({
    name: metric,
    value,
    tags,
    timestamp: new Date()
  });
}

// Business metrics
recordMetric('bottles_sold', 1, { winery_id: bottle.winery_id });
recordMetric('revenue', bottle.price, { currency: 'EUR' });
recordMetric('corks_distributed', 50, { reason: 'purchase' });
recordMetric('active_users', 1, { action: 'purchase' });

// System metrics
recordMetric('api_response_time', responseTime, { endpoint: '/api/bottles/purchase' });
recordMetric('blockchain_gas_cost', gasCost, { network: 'sui' });
```

---

## 🚀 Deployment Strategy

### **Environment Configuration**

```bash
# .env.production
NODE_ENV=production
API_URL=https://api.corkcollective.io
WEB_URL=https://corkcollective.io

# Database
DATABASE_URL=postgresql://user:pass@host:5432/cork_collective
REDIS_URL=redis://default:pass@host:6379

# SUI Blockchain
SUI_NETWORK=mainnet
SUI_RPC_URL=https://fullnode.mainnet.sui.io
PACKAGE_ID=0x...
CORK_TREASURY_ID=0x...
ADMIN_CAP_ID=0x...

# Wallet Management
ZKLOGIN_ENABLED=true
GAS_SPONSOR_ADDRESS=0x...
GAS_SPONSOR_PRIVATE_KEY=...

# External APIs
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=...
TWILIO_ACCOUNT_SID=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# Security
JWT_SECRET=...
ENCRYPTION_KEY=...
CORS_ORIGIN=https://corkcollective.io

# Monitoring
SENTRY_DSN=...
LOGTAIL_TOKEN=...
```

### **CI/CD Pipeline (GitHub Actions)**

```yaml
# .github/workflows/deploy.yml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          railway up --service backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}

  deploy-contracts:
    needs: test
    runs-on: ubuntu-latest
    if: contains(github.event.head_commit.message, '[deploy-contracts]')
    steps:
      - uses: actions/checkout@v3
      - name: Install SUI CLI
        run: |
          curl -fsSL https://sui.io/install.sh | sh
      - name: Deploy Contracts
        run: |
          cd contracts
          sui client publish --gas-budget 100000000
        env:
          SUI_PRIVATE_KEY: ${{ secrets.SUI_DEPLOY_KEY }}
```

### **Docker Configuration**

```dockerfile
# Dockerfile (Backend)
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

```yaml
# docker-compose.yml (Local Development)
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: cork_collective
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

  backend:
    build: ./backend
    ports:
      - '3001:3001'
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/cork_collective
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

---

## 📈 Scalability Plan

### **Phase 1: MVP (0-5K users)**
- **Infrastructure**: Single server (Railway/Render)
- **Database**: Supabase free tier → Pro
- **Caching**: Upstash Redis free tier
- **CDN**: Cloudflare free tier
- **Cost**: ~$100/month

### **Phase 2: Growth (5K-50K users)**
- **Infrastructure**: Auto-scaling containers (3-10 instances)
- **Database**: Managed PostgreSQL with read replicas
- **Caching**: Redis cluster
- **CDN**: Cloudflare Pro
- **Search**: Elasticsearch cluster
- **Cost**: ~$500-1000/month

### **Phase 3: Scale (50K-500K users)**
- **Infrastructure**: Kubernetes cluster
- **Database**: Sharded PostgreSQL (by region)
- **Caching**: Redis Cluster with persistence
- **CDN**: Multi-region CDN
- **Search**: Elasticsearch cluster (3+ nodes)
- **Background Jobs**: Separate worker pools
- **Cost**: ~$3000-5000/month

### **Database Optimization**

```sql
-- Partitioning for large tables
CREATE TABLE analytics_events_2024_11 PARTITION OF analytics_events
FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');

-- Indexes for common queries
CREATE INDEX CONCURRENTLY idx_bottles_owner_purchased 
ON bottles(owner_id, purchase_date DESC);

CREATE INDEX CONCURRENTLY idx_cork_tx_user_created 
ON cork_transactions(user_id, created_at DESC);

-- Materialized views for analytics
CREATE MATERIALIZED VIEW daily_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_bottles,
  SUM(purchase_price) as total_revenue,
  COUNT(DISTINCT owner_id) as unique_buyers
FROM bottles
GROUP BY DATE(created_at);

CREATE UNIQUE INDEX ON daily_stats(date);
```

---

## 🧪 Testing Strategy

### **Unit Tests (Jest)**
```typescript
describe('BottleService', () => {
  describe('purchaseBottle', () => {
    it('should create bottle NFT and credit Corks', async () => {
      const result = await bottleService.purchase({
        userId: 'user-123',
        bottleId: 'bottle-456',
        paymentMethodId: 'pm_123'
      });
      
      expect(result.bottle.nft_object_id).toBeDefined();
      expect(result.corksEarned).toBe(50);
    });
    
    it('should fail if payment fails', async () => {
      await expect(
        bottleService.purchase({ /* invalid payment */ })
      ).rejects.toThrow('Payment failed');
    });
  });
});
```

### **Integration Tests (Supertest)**
```typescript
describe('POST /api/bottles/purchase', () => {
  it('should complete purchase flow', async () => {
    const response = await request(app)
      .post('/api/bottles/purchase')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        bottleId: 'bottle-123',
        paymentMethodId: 'pm_test_123'
      })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.transactionDigest).toBeDefined();
  });
});
```

### **E2E Tests (Playwright)**
```typescript
test('complete purchase journey', async ({ page }) => {
  // Login
  await page.goto('/auth/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');
  
  // Browse shop
  await page.goto('/shop');
  await page.click('[data-testid="bottle-card-1"]');
  
  // Personalize
  await page.fill('[name="customText"]', 'Happy Birthday!');
  await page.click('button:has-text("Continue")');
  
  // Checkout
  await page.fill('[name="cardNumber"]', '4242424242424242');
  await page.click('button:has-text("Purchase")');
  
  // Verify success
  await expect(page.locator('[data-testid="minting-confirmation"]')).toBeVisible();
});
```

---

## 📋 Launch Checklist

### **Pre-Launch (Week -4)**
- [ ] Deploy all smart contracts to SUI mainnet
- [ ] Complete security audit (smart contracts)
- [ ] Set up production infrastructure
- [ ] Configure monitoring and alerts
- [ ] Create operational runbooks
- [ ] Train customer support team
- [ ] Prepare marketing materials

### **Soft Launch (Week -2)**
- [ ] Invite beta testers (100 users)
- [ ] Monitor metrics closely
- [ ] Collect feedback
- [ ] Fix critical bugs
- [ ] Optimize performance bottlenecks

### **Public Launch (Week 0)**
- [ ] Press release
- [ ] Social media campaign
- [ ] Partner winery announcements
- [ ] Community events
- [ ] Influencer partnerships

### **Post-Launch (Week +1)**
- [ ] Daily monitoring
- [ ] User support
- [ ] Bug fixes
- [ ] Feature iterations
- [ ] Growth experiments

---

## 💰 Cost Breakdown (Monthly)

### **MVP Phase (Months 1-6)**

| Service | Cost |
|---------|------|
| Vercel (Frontend) | $20 |
| Railway (Backend) | $20 |
| Supabase (Database) | $25 |
| Upstash (Redis) | $10 |
| AWS S3/CloudFront | $15 |
| SUI RPC (Managed) | $50 |
| SUI Gas Costs | $100 |
| Stripe (Fees) | Variable |
| SendGrid | $15 |
| Twilio | $10 |
| Sentry | $26 |
| Domain/SSL | $2 |
| **TOTAL** | **~$293/mo** |

### **Growth Phase (Months 7-12)**

| Service | Cost |
|---------|------|
| Infrastructure | $500 |
| Database | $100 |
| Caching | $50 |
| CDN | $75 |
| Blockchain | $300 |
| Email/SMS | $100 |
| Monitoring | $100 |
| **TOTAL** | **~$1,225/mo** |

---

## 🎯 Success Metrics

### **North Star Metric**
**Active Bottle Collectors** - Users who own ≥1 verified bottle NFT

### **Key Metrics**

**Acquisition**
- New user signups/week
- Conversion rate (visitor → signup)
- User acquisition cost (CAC)
- Referral rate

**Activation**
- Time to first bottle purchase
- Onboarding completion rate
- First QR scan within 7 days

**Engagement**
- Daily/Monthly active users
- Bottles purchased per user
- QR scans per month
- Cork earning rate

**Retention**
- Week 1, 4, 12 retention
- Repeat purchase rate
- Cork redemption rate
- Tier progression rate

**Revenue**
- Monthly Recurring Revenue (MRR)
- Average Order Value (AOV)
- Lifetime Value (LTV)
- LTV:CAC ratio (target >3:1)

**Blockchain Metrics**
- NFTs minted/day
- Cork tokens distributed
- Gas costs per transaction
- Transaction success rate

---

## 🚧 Known Limitations & Trade-offs

### **MVP Constraints**

1. **Limited Winery Integration**
   - Manual bottle onboarding initially
   - No real-time inventory sync
   - Future: API for winery POS systems

2. **Simplified Tier System**
   - Tier calculation on backend (not 100% on-chain)
   - Future: Fully on-chain tier contracts

3. **Gasless Transactions**
   - Subsidized by platform (cost center)
   - Future: Hybrid model with optional user-paid gas

4. **Mobile App**
   - React Native (not native iOS/Android)
   - Future: Native apps for performance

5. **Search**
   - PostgreSQL full-text search
   - Future: Elasticsearch for advanced search

6. **Analytics**
   - Custom dashboards
   - Future: Segment/Amplitude integration

---

## 🔮 Future Roadmap

### **Q1 2025: Foundation**
- Launch MVP with 3 wineries
- Onboard first 1,000 users
- Establish support processes
- Gather user feedback

### **Q2 2025: Expansion**
- Add 10+ wineries
- Launch mobile apps (iOS/Android)
- Secondary marketplace (NFT resale)
- Enhanced provenance tracking

### **Q3 2025: Automation**
- Winery POS integration API
- Automated fulfillment
- Advanced analytics
- Community features (forums, events)

### **Q4 2025: Scale**
- International expansion
- White-label platform for other verticals
- DAO governance for community
- Staking mechanisms for exclusive releases

---

## 📞 Technical Contacts

**Lead Developer**: [Your Name]  
**Blockchain Engineer**: [TBD]  
**DevOps**: [TBD]  
**Product Manager**: [TBD]

**Emergency Contacts**:
- On-call: [phone]
- Status Page: https://status.corkcollective.io
- Support: support@corkcollective.io

---

**Document Version**: 1.0  
**Last Review**: November 18, 2024  
**Next Review**: December 1, 2024

---

*This architecture document is a living document and will be updated as the product evolves.*
