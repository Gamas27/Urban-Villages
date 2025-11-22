# Order & Verification Flow Documentation

## 🔄 Complete User Journey: Purchase → Delivery → Verification

### **Problem Identified**
Currently, bottles appear in "My Collection" immediately after purchase, but users don't physically have them yet. This creates confusion and doesn't demonstrate the provenance tracking story.

### **Solution: Order Tracking System**

---

## 📦 Order States

```
1. MINTING     → NFT created on blockchain (instant)
2. PROCESSING  → Order being prepared for shipment (1-2 days)
3. SHIPPED     → Package in transit (3-7 days)
4. DELIVERED   → Package arrived at customer (notification sent)
5. VERIFIED    → Customer scanned QR code (bottle moves to collection)
```

---

## 🎯 User Experience Flow

### **Step 1: Purchase**
```
User Action: Click "Purchase" on bottle
System Action:
  ├─ Process payment (Stripe)
  ├─ Mint Bottle NFT on SUI blockchain
  ├─ Mint 50 Cork tokens to user's wallet
  ├─ Create Order record (status: "minting")
  ├─ Show MintingConfirmation modal with transaction hash
  └─ Redirect to "Orders" tab
```

### **Step 2: Order Tracking**
```
User sees:
  └─ OrderTracking component showing:
      ├─ ✓ NFT Minted (blockchain link)
      ├─ ⏳ Processing (est. ship date)
      ├─ ⏳ Shipped (tracking number TBD)
      ├─ ⏳ Delivered (not yet)
      └─ ⏳ Verified (scan QR when delivered)
```

### **Step 3: Shipment Updates**
```
Background Jobs:
  ├─ Winery marks order as "shipped" (admin action)
  ├─ System updates order status → "shipped"
  ├─ Adds tracking number from Shippo
  ├─ Sends email notification
  └─ Sends SMS notification (optional)

User sees:
  └─ OrderTracking updated:
      ├─ ✓ NFT Minted
      ├─ ✓ Processing
      ├─ ⏳ Shipped (tracking link available)
      ├─ ⏳ Delivered
      └─ ⏳ Verified
```

### **Step 4: Delivery**
```
Shipment carrier marks delivered:
  ├─ Webhook from Shippo updates order → "delivered"
  ├─ Push notification sent: "Your bottle has arrived!"
  ├─ Email sent: "Scan QR to verify"
  └─ SMS sent: "Package delivered - verify now"

User sees:
  └─ OrderTracking shows:
      ├─ ✓ NFT Minted
      ├─ ✓ Processing
      ├─ ✓ Shipped
      ├─ ✓ Delivered
      └─ ⏳ Verified ← BIG BUTTON: "Scan QR to Verify"
```

### **Step 5: QR Verification**
```
User Action: 
  ├─ Taps "Scan QR to Verify"
  ├─ Opens QR Scanner
  ├─ Scans physical QR code on bottle
  └─ System verifies:
      ├─ QR code matches order
      ├─ NFT ownership confirmed
      └─ Bottle not previously verified

System Action:
  ├─ Update order status → "verified"
  ├─ Add provenance event: "Bottle verified by owner"
  ├─ Move bottle to "My Collection"
  ├─ Show success animation
  └─ Update stats (bottles verified count)
```

---

## 🗂️ Database Schema Updates

### **Orders Table**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  bottle_id UUID REFERENCES bottles(id),
  
  -- Order Details
  order_number VARCHAR(50) UNIQUE,
  total_price DECIMAL(10,2),
  
  -- Status Flow
  status VARCHAR(50) DEFAULT 'minting',
    -- 'minting', 'processing', 'shipped', 'delivered', 'verified', 'cancelled'
  
  -- Blockchain
  nft_object_id VARCHAR(66),
  mint_transaction_digest VARCHAR(100),
  
  -- Shipping
  shipping_address JSONB,
  tracking_number VARCHAR(255),
  carrier VARCHAR(100),
  
  -- Important Dates
  ordered_at TIMESTAMPTZ DEFAULT NOW(),
  minted_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  
  -- Estimated Dates
  est_ship_date DATE,
  est_delivery_date DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
```

### **Update Bottles Table**
```sql
ALTER TABLE bottles 
ADD COLUMN order_id UUID REFERENCES orders(id),
ADD COLUMN verification_status VARCHAR(50) DEFAULT 'pending';
  -- 'pending', 'verified', 'transferred'
```

---

## 📱 UI Components

### **1. Orders Tab** (New)
```typescript
// Shows pending orders (not yet verified)
<OrdersTab>
  {orders.filter(o => o.status !== 'verified').map(order => (
    <OrderCard order={order} />
  ))}
</OrdersTab>
```

### **2. OrderTracking Component** (Created)
```typescript
<OrderTracking 
  order={order}
  onVerifyQR={() => openQRScanner()}
/>

// Shows 5-step progress
// Current step highlighted
// Action buttons for current step
```

### **3. Collection Tab** (Updated)
```typescript
// Only shows verified bottles
<CollectionTab>
  {bottles.filter(b => b.verification_status === 'verified').map(bottle => (
    <BottleCard bottle={bottle} verified={true} />
  ))}
</CollectionTab>
```

### **4. Dashboard Stats** (Updated)
```typescript
// Split stats
<Stats>
  <Stat label="Verified Bottles" value={verifiedCount} />
  <Stat label="Pending Orders" value={pendingCount} />
  <Stat label="Total Corks" value={corkBalance} />
</Stats>
```

---

## 🔗 API Endpoints

### **Orders**
```
GET    /api/v1/orders              - Get user's orders
GET    /api/v1/orders/:id          - Get order details
GET    /api/v1/orders/:id/track    - Get shipping tracking info
POST   /api/v1/orders/:id/verify   - Verify bottle with QR
PUT    /api/v1/orders/:id/cancel   - Cancel order (if not shipped)
```

### **Admin (Winery)**
```
GET    /api/v1/admin/orders                - All orders
PUT    /api/v1/admin/orders/:id/ship       - Mark as shipped
PUT    /api/v1/admin/orders/:id/tracking   - Add tracking number
POST   /api/v1/admin/orders/:id/refund     - Process refund
```

---

## 🎬 Demo Narrative for Hackathon

### **Scene: Order Tracking**

**Presenter**: 
> "Let me show you what happens after you purchase a bottle. This is where blockchain really shines."

[Navigate to Orders tab]

> "Right after payment, we immediately mint your Bottle NFT on SUI. You can see the transaction hash here – click it and you're on the SUI explorer. The NFT is yours instantly, even though the bottle is still being shipped."

[Point to timeline]

> "But we don't just throw it in your collection and call it done. You can track the actual journey: Processing, Shipped with real tracking, and when it's Delivered..."

[Click "Scan QR to Verify" button]

> "...you get this big prompt to scan the QR code. This is the magic moment. You're holding the physical bottle, you scan the code, and the blockchain verifies three things:
> 1. This QR code matches your NFT
> 2. You own this NFT
> 3. Nobody has verified this bottle before
>
> That's provenance. That's anti-counterfeiting. That's why this matters."

[Scan QR - success animation]

> "Now it moves to your verified collection. Forever on-chain. Immutable proof you own this bottle."

---

## 🔔 Notification Strategy

### **Email Notifications**
```
1. Order Confirmed
   Subject: "Your order is confirmed! 🍷"
   Content: NFT details, estimated delivery

2. Order Shipped
   Subject: "Your bottle is on its way! 📦"
   Content: Tracking number, carrier info

3. Order Delivered
   Subject: "Your bottle has arrived! Scan to verify 🎉"
   Content: QR scanning instructions

4. Verification Complete
   Subject: "Bottle verified! Welcome to your collection ✓"
   Content: Provenance link, collection stats
```

### **Push Notifications** (Mobile)
```
1. "📦 Your order is being prepared"
2. "🚚 Your bottle shipped! Track it here"
3. "🏠 Package delivered - scan QR to verify"
4. "✅ Bottle verified! View in collection"
```

### **SMS** (Optional - High Value)
```
1. "Cork Collective: Your bottle shipped! Track: [link]"
2. "Cork Collective: Package delivered! Scan QR to verify ownership"
```

---

## 🧪 Testing Scenarios

### **Happy Path**
```
1. Purchase bottle → Order created (minting)
2. Wait 1 minute → Auto-update to processing
3. Admin marks shipped → Email sent, tracking added
4. Simulate delivery webhook → Status = delivered
5. User scans QR → Bottle verified, moves to collection
```

### **Edge Cases**
```
1. User tries to verify before delivery
   → "Bottle not delivered yet"

2. User scans wrong QR code
   → "This QR doesn't match your order"

3. QR code already verified
   → "This bottle was already verified by [address]"

4. User scans someone else's QR
   → "This bottle belongs to another user"

5. Order cancelled after payment
   → Refund processed, NFT remains (could be transferred)
```

---

## 📊 Analytics & Metrics

### **Key Metrics to Track**
```
- Time to verification (purchase → verified)
- Orders stuck in each status
- QR scan success rate
- Shipping carrier performance
- Customer satisfaction by state
```

### **Funnel Analysis**
```
Purchases:        100%
Minted:           100% (should be automatic)
Shipped:           95% (5% cancelled)
Delivered:         92% (3% lost in transit)
Verified:          85% (7% haven't scanned yet)
```

### **Alerts**
```
- Order stuck in "processing" > 48 hours
- Order "delivered" but not verified > 7 days
- Tracking number not added within 24h of shipping
- High cancellation rate from specific region
```

---

## 🚀 Implementation Priority

### **Phase 1: MVP (Hackathon)**
- [x] OrderTracking component (visual only)
- [ ] Mock orders with different statuses
- [ ] QR verification flow (simulated)
- [ ] Show order in dashboard stats
- [ ] Basic status transitions

### **Phase 2: Production**
- [ ] Real order creation on purchase
- [ ] Admin panel for shipping updates
- [ ] Shippo integration for tracking
- [ ] Email notifications (SendGrid)
- [ ] Webhook handling for delivery updates

### **Phase 3: Polish**
- [ ] Push notifications (mobile)
- [ ] SMS notifications (high-value orders)
- [ ] Auto-reminders (verify after delivery)
- [ ] Advanced analytics dashboard
- [ ] Customer support tools

---

## 💡 Why This Matters for Hackathon

### **Differentiation**
✅ **Most NFT projects**: Mint → you own it, done  
✅ **Cork Collective**: Mint → track → deliver → verify (real-world utility)

### **Storytelling**
✅ Shows understanding of real user journey  
✅ Demonstrates blockchain + physical goods integration  
✅ Proves we've thought through operations  
✅ Highlights provenance verification (anti-fraud)

### **Technical Depth**
✅ Complex state management (5 order states)  
✅ Integration with shipping APIs  
✅ Webhook handling  
✅ Email/SMS notifications  
✅ QR code verification logic

### **Judge Appeal**
- **Technical judges**: Appreciate the complexity
- **Business judges**: See operational thinking
- **UX judges**: Love the clear user journey
- **Blockchain judges**: Understand the provenance value

---

## 🎯 Quick Demo Script

**30 Second Version:**
> "Watch this: I buy a bottle, NFT is minted instantly on SUI. I track shipping. Package arrives. I scan the QR code on the actual bottle. Blockchain verifies I own it. Now it's in my verified collection with complete provenance history. That's how you fight wine fraud with blockchain."

**2 Minute Version:**
> [Show purchase flow]  
> "Payment processed, NFT minted in 3 seconds. Here's the SUI transaction."
>
> [Show order tracking]  
> "I can see it's being prepared. Winery ships it, adds tracking. I get notified."
>
> [Show delivered status]  
> "Package arrives. But it's not in my collection yet - I need to verify ownership."
>
> [Scan QR code]  
> "I scan the physical QR code. System checks: Does this QR match my order? Do I own this NFT? Has anyone verified this bottle before?"
>
> [Success]  
> "Verified. Now it's permanently in my blockchain-verified collection. If I ever sell this bottle, the new owner can prove provenance all the way back to the winery."

---

**This flow demonstrates:**
1. ✅ Instant blockchain ownership
2. ✅ Real-world product tracking
3. ✅ Physical-digital verification
4. ✅ Anti-counterfeiting measures
5. ✅ Complete provenance chain

**This is not a toy project. This is production-ready thinking.**
