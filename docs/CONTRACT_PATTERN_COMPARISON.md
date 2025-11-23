# Contract Pattern Comparison - Bootcamp vs Our Contracts

## Overview
Comparing our `cork_token.move` and `bottle_nft.move` with bootcamp examples to ensure we're following the same patterns.

---

## 🔍 Key Differences Found

### 1. **Struct Visibility (Move 2024 Edition)**

**Bootcamp Pattern:**
```move
// gold.move
public struct GOLD has drop {}

// staking.move
public struct AdminCap has key, store {
    id: UID,
}

// collection.move
public struct Dropout has key, store {
    id: UID,
    // ...
}
```

**Our Contracts:**
```move
// cork_token.move
struct CORK_TOKEN has drop {}  // ❌ Missing 'public'
struct AdminCap has key, store {  // ❌ Missing 'public'
struct Treasury has key {  // ❌ Missing 'public'

// bottle_nft.move
struct AdminCap has key, store {  // ❌ Missing 'public'
struct BottleNFT has key, store {  // ❌ Missing 'public'
struct QRRegistry has key {  // ❌ Missing 'public'
```

**Fix Required:** Add `public` keyword to all struct declarations.

---

### 2. **Transfer Functions**

**Bootcamp Pattern:**
```move
// gold.move
transfer::public_transfer(treasury_cap, ctx.sender());
transfer::public_freeze_object(metadata);

// staking.move
transfer::public_share_object(pool);
transfer::public_transfer(admin_cap, ctx.sender());

// collection.move
transfer::public_transfer(disp, sender);
transfer::public_transfer(publisher, sender);
transfer::transfer(cap, sender);  // Note: AdminCap uses transfer::transfer
transfer::share_object(state);  // Note: Uses share_object (not public_share_object)
```

**Our Contracts:**
```move
// cork_token.move
transfer::share_object(Treasury {...});  // ❌ Should be public_share_object
transfer::transfer(AdminCap {...}, ...);  // ⚠️ Could use public_transfer

// bottle_nft.move
transfer::transfer(AdminCap {...}, ...);  // ⚠️ Could use public_transfer
transfer::share_object(QRRegistry {...});  // ❌ Should be public_share_object
```

**Fix Required:**
- Use `transfer::public_share_object()` for shared objects
- Use `transfer::public_transfer()` for owned objects (for consistency)

---

### 3. **Treasury Cap Handling**

**Bootcamp Pattern (gold.move):**
```move
fun init(otw: GOLD, ctx: &mut TxContext) {
    let (treasury_cap, metadata) = coin::create_currency<GOLD>(...);
    transfer::public_transfer(treasury_cap, ctx.sender());  // Direct transfer
    transfer::public_freeze_object(metadata);
}
```

**Our Pattern (cork_token.move):**
```move
fun init(witness: CORK_TOKEN, ctx: &mut TxContext) {
    let (treasury_cap, metadata) = coin::create_currency(...);
    transfer::public_freeze_object(metadata);
    
    // Store treasury cap in a shared object for controlled access
    transfer::share_object(Treasury {
        id: object::new(ctx),
        cap: treasury_cap
    });
}
```

**Analysis:** Our approach is **intentional and valid** - we want controlled access via shared Treasury object, not direct ownership. This is a design choice, not a bug.

---

### 4. **AdminCap Transfer**

**Bootcamp Pattern:**
```move
// staking.move
transfer::public_transfer(admin_cap, ctx.sender());

// collection.move
transfer::transfer(cap, sender);  // Uses transfer::transfer
```

**Our Contracts:**
```move
// cork_token.move
transfer::transfer(AdminCap {...}, tx_context::sender(ctx));

// bottle_nft.move
transfer::transfer(AdminCap {...}, tx_context::sender(ctx));
```

**Analysis:** Both patterns work. `transfer::transfer()` is fine for AdminCap since it's a capability object. However, `public_transfer` is more explicit and consistent with bootcamp examples.

---

### 5. **Shared Object Abilities**

**Bootcamp Pattern:**
```move
// staking.move
public struct StakingPool has key, store {  // Has 'store' ability
    // ...
}
transfer::public_share_object(pool);

// collection.move
public struct State has key {  // No 'store' ability
    // ...
}
transfer::share_object(state);  // Uses share_object (not public_share_object)
```

**Our Contracts:**
```move
// cork_token.move
struct Treasury has key {  // ❌ Missing 'store' ability
    id: UID,
    cap: TreasuryCap<CORK_TOKEN>
}

// bottle_nft.move
struct QRRegistry has key {  // ❌ Missing 'store' ability
    id: UID,
    qr_to_bottle: VecMap<String, ID>
}
```

**Fix Required:** 
- Add `store` ability to shared objects if using `public_share_object`
- OR keep `key` only if using `share_object` (but bootcamp examples prefer `public_share_object`)

---

### 6. **Context Sender Access**

**Bootcamp Pattern:**
```move
// gold.move, staking.move, collection.move
ctx.sender()  // Direct access

// staking.move
let sender = ctx.sender();
```

**Our Contracts:**
```move
// cork_token.move, bottle_nft.move
tx_context::sender(ctx)  // Using module function
```

**Analysis:** Both work. `ctx.sender()` is shorthand for `tx_context::sender(ctx)`. Bootcamp uses shorthand, we use explicit. Both are valid.

---

### 7. **Clock Usage**

**Bootcamp Pattern:**
```move
// collection.move
public fun admin_mint(
    clock: &Clock, // 0x6
    ctx: &mut TxContext
): Dropout {
    let now = clock.timestamp_ms();
    // ...
}
```

**Our Pattern:**
```move
// bottle_nft.move
public entry fun mint_bottle(
    clock: &Clock,
    ctx: &mut TxContext
) {
    clock::timestamp_ms(clock)  // Using module function
}
```

**Analysis:** Both work. `clock.timestamp_ms()` is shorthand for `clock::timestamp_ms(clock)`. Bootcamp uses shorthand, we use explicit. Both are valid.

---

### 8. **Event Emission**

**Bootcamp Pattern:**
- Events are defined but not always emitted in examples
- When emitted, uses `event::emit()`

**Our Pattern:**
```move
// Both contracts
event::emit(CorksMinted {...});
event::emit(BottleMinted {...});
```

**Analysis:** ✅ Correct pattern

---

### 9. **Error Constants**

**Bootcamp Pattern:**
```move
// staking.move, collection.move
const ERequestedValueTooHigh: u64 = 0;
const EWrongAmount: u64 = 0;
```

**Our Pattern:**
```move
// Both contracts
const EInsufficientBalance: u64 = 0;
const ENotAuthorized: u64 = 1;
```

**Analysis:** ✅ Correct pattern

---

### 10. **Test Functions**

**Bootcamp Pattern:**
```move
#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(ctx);  // or init(OTW {}, ctx)
}
```

**Our Pattern:**
```move
#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(CORK_TOKEN {}, ctx);  // cork_token
    init(ctx);  // bottle_nft
}
```

**Analysis:** ✅ Correct pattern

---

## 📋 Summary of Required Fixes

### Critical (Move 2024 Edition Requirements)

1. **Add `public` to all struct declarations:**
   - `cork_token.move`: `CORK_TOKEN`, `AdminCap`, `Treasury`
   - `bottle_nft.move`: `AdminCap`, `BottleNFT`, `QRRegistry`

2. **Fix shared object transfers:**
   - `cork_token.move`: `transfer::share_object` → `transfer::public_share_object`
   - `bottle_nft.move`: `transfer::share_object` → `transfer::public_share_object`

3. **Add `store` ability to shared objects:**
   - `cork_token.move`: `Treasury` needs `store` ability
   - `bottle_nft.move`: `QRRegistry` needs `store` ability

### Optional (Consistency Improvements)

4. **Use `public_transfer` for AdminCap:**
   - Both contracts: `transfer::transfer` → `transfer::public_transfer` (for consistency)

5. **Consider using shorthand:**
   - `ctx.sender()` instead of `tx_context::sender(ctx)`
   - `clock.timestamp_ms()` instead of `clock::timestamp_ms(clock)`

---

## ✅ What We're Doing Right

1. ✅ Event emission pattern
2. ✅ Error constant definitions
3. ✅ Test function pattern
4. ✅ Treasury cap in shared object (intentional design)
5. ✅ Clock usage (explicit is fine)
6. ✅ Struct abilities (`key, store` for NFTs, `key` for shared objects)

---

## 🎯 Action Plan

1. **Fix struct visibility** (Critical for Move 2024)
2. **Fix shared object transfers** (Critical for Move 2024)
3. **Add `store` ability** (Required for `public_share_object`)
4. **Optional: Use `public_transfer` for consistency**

---

## 📝 Notes

- Our **Treasury design** (shared object) is intentional and valid - different from bootcamp's direct transfer
- Our **explicit function calls** (`tx_context::sender`, `clock::timestamp_ms`) are valid, just more verbose than bootcamp's shorthand
- Bootcamp examples use **both** `transfer::transfer` and `transfer::public_transfer` - both work, but `public_transfer` is more explicit
- Bootcamp examples use **both** `share_object` and `public_share_object` - `public_share_object` is preferred for shared objects

