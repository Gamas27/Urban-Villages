// Tier System - Gamified loyalty tiers for Cork Collective
// Deployed on SUI blockchain

module cork_collective::tier_system {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use std::option::{Self, Option};
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::vec_set::{Self, VecSet};

    // ===== Constants =====
    
    /// Tier thresholds
    const TIER_SIPPER: u8 = 0;
    const TIER_ADVOCATE: u8 = 1;
    const TIER_GUARDIAN: u8 = 2;

    const ADVOCATE_THRESHOLD: u64 = 300;
    const GUARDIAN_THRESHOLD: u64 = 1000;

    // ===== Errors =====
    const EProfileAlreadyExists: u64 = 0;
    const ENotOwner: u64 = 1;
    const EInvalidTier: u64 = 2;

    // ===== Structs =====

    /// Admin capability
    struct AdminCap has key, store {
        id: UID
    }

    /// User profile with tier progression
    struct UserProfile has key {
        id: UID,
        /// Profile owner
        owner: address,
        /// Current Cork balance (synced from wallet)
        cork_balance: u64,
        /// Current tier level
        tier: u8,
        /// Total bottles purchased
        bottles_purchased: u64,
        /// Join date (epoch timestamp)
        join_date: u64,
        /// Referral code for this user
        referral_code: String,
        /// Users referred by this user
        referrals: VecSet<address>,
        /// Total Corks earned lifetime
        lifetime_corks_earned: u64,
        /// Total Corks spent lifetime
        lifetime_corks_spent: u64,
        /// Member since (human readable)
        member_since: String
    }

    /// Global registry for profiles
    struct ProfileRegistry has key {
        id: UID,
        /// Address -> Profile ID mapping
        total_members: u64,
        /// Tier counts for stats
        sipper_count: u64,
        advocate_count: u64,
        guardian_count: u64
    }

    // ===== Events =====

    struct ProfileCreated has copy, drop {
        profile_id: ID,
        owner: address,
        referral_code: String,
        referred_by: Option<address>,
        timestamp: u64
    }

    struct TierUpgraded has copy, drop {
        profile_id: ID,
        owner: address,
        old_tier: u8,
        new_tier: u8,
        cork_balance: u64,
        timestamp: u64
    }

    struct ReferralRegistered has copy, drop {
        referrer: address,
        referee: address,
        timestamp: u64
    }

    struct CorksUpdated has copy, drop {
        profile_id: ID,
        owner: address,
        old_balance: u64,
        new_balance: u64,
        change: i64,
        timestamp: u64
    }

    // ===== Init Function =====

    fun init(ctx: &mut TxContext) {
        // Create admin capability
        transfer::transfer(AdminCap {
            id: object::new(ctx)
        }, tx_context::sender(ctx));

        // Create shared registry
        transfer::share_object(ProfileRegistry {
            id: object::new(ctx),
            total_members: 0,
            sipper_count: 0,
            advocate_count: 0,
            guardian_count: 0
        });
    }

    // ===== Public Entry Functions =====

    /// Create user profile
    public entry fun create_profile(
        registry: &mut ProfileRegistry,
        referral_code_input: vector<u8>,
        referred_by: Option<address>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let owner = tx_context::sender(ctx);
        let profile_id = object::new(ctx);
        let id_copy = object::uid_to_inner(&profile_id);
        let timestamp = clock::timestamp_ms(clock);

        // Generate referral code (in production, make this unique)
        let referral_code = if (vector::length(&referral_code_input) > 0) {
            string::utf8(referral_code_input)
        } else {
            // Default format: CORK-{first 8 chars of address}
            string::utf8(b"CORK-MEMBER")
        };

        let profile = UserProfile {
            id: profile_id,
            owner,
            cork_balance: 0,
            tier: TIER_SIPPER,
            bottles_purchased: 0,
            join_date: timestamp,
            referral_code,
            referrals: vec_set::empty(),
            lifetime_corks_earned: 0,
            lifetime_corks_spent: 0,
            member_since: string::utf8(b"November 2024")
        };

        // Update registry
        registry.total_members = registry.total_members + 1;
        registry.sipper_count = registry.sipper_count + 1;

        // Handle referral
        let referred_by_addr = if (option::is_some(&referred_by)) {
            let referrer = option::extract(&mut referred_by);
            option::some(referrer)
        } else {
            option::none()
        };

        event::emit(ProfileCreated {
            profile_id: id_copy,
            owner,
            referral_code: profile.referral_code,
            referred_by: referred_by_addr,
            timestamp
        });

        transfer::transfer(profile, owner);
    }

    /// Update Cork balance (called by Cork token contract)
    public entry fun update_cork_balance(
        profile: &mut UserProfile,
        new_balance: u64,
        is_earning: bool,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);

        let old_balance = profile.cork_balance;
        let change: i64 = if (new_balance >= old_balance) {
            ((new_balance - old_balance) as i64)
        } else {
            -(((old_balance - new_balance) as i64))
        };

        profile.cork_balance = new_balance;

        // Update lifetime stats
        if (is_earning) {
            profile.lifetime_corks_earned = profile.lifetime_corks_earned + (change as u64);
        } else {
            profile.lifetime_corks_spent = profile.lifetime_corks_spent + ((if (change < 0) { -change } else { change }) as u64);
        };

        event::emit(CorksUpdated {
            profile_id: object::id(profile),
            owner: profile.owner,
            old_balance,
            new_balance,
            change,
            timestamp: clock::timestamp_ms(clock)
        });

        // Check for tier upgrade
        check_and_update_tier(profile, clock);
    }

    /// Increment bottle purchase count
    public entry fun record_bottle_purchase(
        profile: &mut UserProfile,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        profile.bottles_purchased = profile.bottles_purchased + 1;
    }

    /// Register a referral
    public entry fun register_referral(
        profile: &mut UserProfile,
        referee: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        
        vec_set::insert(&mut profile.referrals, referee);

        event::emit(ReferralRegistered {
            referrer: profile.owner,
            referee,
            timestamp: clock::timestamp_ms(clock)
        });
    }

    // ===== Internal Functions =====

    /// Check Cork balance and upgrade tier if threshold reached
    fun check_and_update_tier(
        profile: &mut UserProfile,
        clock: &Clock
    ) {
        let old_tier = profile.tier;
        let new_tier = calculate_tier(profile.cork_balance);

        if (new_tier > old_tier) {
            profile.tier = new_tier;

            event::emit(TierUpgraded {
                profile_id: object::id(profile),
                owner: profile.owner,
                old_tier,
                new_tier,
                cork_balance: profile.cork_balance,
                timestamp: clock::timestamp_ms(clock)
            });
        };
    }

    /// Calculate tier based on Cork balance
    fun calculate_tier(cork_balance: u64): u8 {
        if (cork_balance >= GUARDIAN_THRESHOLD) {
            TIER_GUARDIAN
        } else if (cork_balance >= ADVOCATE_THRESHOLD) {
            TIER_ADVOCATE
        } else {
            TIER_SIPPER
        }
    }

    // ===== Public View Functions =====

    /// Get profile info
    public fun get_profile_info(profile: &UserProfile): (address, u64, u8, u64, String) {
        (
            profile.owner,
            profile.cork_balance,
            profile.tier,
            profile.bottles_purchased,
            profile.referral_code
        )
    }

    /// Get tier name
    public fun get_tier_name(tier: u8): vector<u8> {
        if (tier == TIER_GUARDIAN) {
            b"Terroir Guardian"
        } else if (tier == TIER_ADVOCATE) {
            b"Natural Wine Advocate"
        } else {
            b"Casual Sipper"
        }
    }

    /// Get tier discount percentage (basis points)
    public fun get_tier_discount(tier: u8): u64 {
        if (tier == TIER_GUARDIAN) {
            20 // 20% discount
        } else if (tier == TIER_ADVOCATE) {
            15 // 15% discount
        } else {
            10 // 10% discount
        }
    }

    /// Get Corks needed for next tier
    public fun corks_to_next_tier(profile: &UserProfile): u64 {
        if (profile.tier == TIER_GUARDIAN) {
            0 // Already at max tier
        } else if (profile.tier == TIER_ADVOCATE) {
            GUARDIAN_THRESHOLD - profile.cork_balance
        } else {
            ADVOCATE_THRESHOLD - profile.cork_balance
        }
    }

    /// Get tier progress percentage
    public fun tier_progress(profile: &UserProfile): u64 {
        if (profile.tier == TIER_GUARDIAN) {
            100
        } else if (profile.tier == TIER_ADVOCATE) {
            // Progress from 300 to 1000
            let progress = profile.cork_balance - ADVOCATE_THRESHOLD;
            let range = GUARDIAN_THRESHOLD - ADVOCATE_THRESHOLD;
            (progress * 100) / range
        } else {
            // Progress from 0 to 300
            (profile.cork_balance * 100) / ADVOCATE_THRESHOLD
        }
    }

    /// Get total referrals count
    public fun get_referral_count(profile: &UserProfile): u64 {
        vec_set::size(&profile.referrals)
    }

    /// Get lifetime stats
    public fun get_lifetime_stats(profile: &UserProfile): (u64, u64, u64) {
        (
            profile.lifetime_corks_earned,
            profile.lifetime_corks_spent,
            profile.bottles_purchased
        )
    }

    // ===== Test Functions =====
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }

    #[test_only]
    public fun get_tier_for_testing(profile: &UserProfile): u8 {
        profile.tier
    }
}
