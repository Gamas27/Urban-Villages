// Rewards Redemption - Handle Cork burning and reward fulfillment
// Deployed on SUI blockchain

module cork_collective::rewards {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::vec_map::{Self, VecMap};

    // ===== Constants =====
    
    /// Redemption status
    const STATUS_PENDING: u8 = 0;
    const STATUS_FULFILLED: u8 = 1;
    const STATUS_CANCELLED: u8 = 2;
    const STATUS_SHIPPED: u8 = 3;

    // ===== Errors =====
    const EInsufficientCorks: u64 = 0;
    const ERewardNotAvailable: u64 = 1;
    const ENotOwner: u64 = 2;
    const ERewardNotFound: u64 = 3;

    // ===== Structs =====

    /// Admin capability
    struct AdminCap has key, store {
        id: UID
    }

    /// Reward definition (experiences, products, discounts)
    struct Reward has key, store {
        id: UID,
        /// Reward name
        name: String,
        /// Description
        description: String,
        /// Cork cost to redeem
        cork_cost: u64,
        /// Is reward currently available?
        available: bool,
        /// Image URL
        image_url: String,
        /// Reward category (product, experience, discount)
        category: String,
        /// Stock quantity (0 = unlimited)
        stock: u64,
        /// Times redeemed
        redemption_count: u64,
        /// Creation date
        created_at: u64
    }

    /// Redemption record - created when user redeems
    struct RedemptionRecord has key {
        id: UID,
        /// User who redeemed
        user: address,
        /// Reward ID
        reward_id: ID,
        /// Reward name (for display)
        reward_name: String,
        /// Corks burned
        corks_burned: u64,
        /// Redemption timestamp
        redeemed_at: u64,
        /// Status (pending, fulfilled, cancelled, shipped)
        status: u8,
        /// Shipping/fulfillment details
        fulfillment_notes: VecMap<u64, String>,
        /// Tracking number (if shipped)
        tracking_number: String
    }

    /// Shared rewards catalog
    struct RewardsCatalog has key {
        id: UID,
        /// Total rewards created
        total_rewards: u64,
        /// Total redemptions
        total_redemptions: u64,
        /// Total Corks burned
        total_corks_burned: u64
    }

    // ===== Events =====

    struct RewardCreated has copy, drop {
        reward_id: ID,
        name: String,
        cork_cost: u64,
        timestamp: u64
    }

    struct RewardRedeemed has copy, drop {
        redemption_id: ID,
        user: address,
        reward_id: ID,
        reward_name: String,
        corks_burned: u64,
        timestamp: u64
    }

    struct RedemptionStatusUpdated has copy, drop {
        redemption_id: ID,
        old_status: u8,
        new_status: u8,
        timestamp: u64
    }

    struct RewardUpdated has copy, drop {
        reward_id: ID,
        available: bool,
        stock: u64,
        timestamp: u64
    }

    // ===== Init Function =====

    fun init(ctx: &mut TxContext) {
        // Create admin capability
        transfer::transfer(AdminCap {
            id: object::new(ctx)
        }, tx_context::sender(ctx));

        // Create shared catalog
        transfer::share_object(RewardsCatalog {
            id: object::new(ctx),
            total_rewards: 0,
            total_redemptions: 0,
            total_corks_burned: 0
        });
    }

    // ===== Public Entry Functions =====

    /// Create a new reward (admin only)
    public entry fun create_reward(
        _admin: &AdminCap,
        catalog: &mut RewardsCatalog,
        name: vector<u8>,
        description: vector<u8>,
        cork_cost: u64,
        image_url: vector<u8>,
        category: vector<u8>,
        stock: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let reward_id = object::new(ctx);
        let id_copy = object::uid_to_inner(&reward_id);
        let timestamp = clock::timestamp_ms(clock);

        let reward = Reward {
            id: reward_id,
            name: string::utf8(name),
            description: string::utf8(description),
            cork_cost,
            available: true,
            image_url: string::utf8(image_url),
            category: string::utf8(category),
            stock,
            redemption_count: 0,
            created_at: timestamp
        };

        catalog.total_rewards = catalog.total_rewards + 1;

        event::emit(RewardCreated {
            reward_id: id_copy,
            name: reward.name,
            cork_cost,
            timestamp
        });

        transfer::share_object(reward);
    }

    /// Redeem a reward (burns Corks)
    public entry fun redeem_reward(
        catalog: &mut RewardsCatalog,
        reward: &mut Reward,
        user_cork_balance: u64, // Would integrate with cork_token in production
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let user = tx_context::sender(ctx);
        
        // Validate reward is available
        assert!(reward.available, ERewardNotAvailable);
        
        // Validate user has enough Corks
        assert!(user_cork_balance >= reward.cork_cost, EInsufficientCorks);

        // Check stock
        if (reward.stock > 0) {
            assert!(reward.stock > 0, ERewardNotAvailable);
            reward.stock = reward.stock - 1;
        };

        // Update reward stats
        reward.redemption_count = reward.redemption_count + 1;

        // Create redemption record
        let redemption_id = object::new(ctx);
        let id_copy = object::uid_to_inner(&redemption_id);
        let timestamp = clock::timestamp_ms(clock);

        let record = RedemptionRecord {
            id: redemption_id,
            user,
            reward_id: object::id(reward),
            reward_name: reward.name,
            corks_burned: reward.cork_cost,
            redeemed_at: timestamp,
            status: STATUS_PENDING,
            fulfillment_notes: vec_map::empty(),
            tracking_number: string::utf8(b"")
        };

        // Update catalog stats
        catalog.total_redemptions = catalog.total_redemptions + 1;
        catalog.total_corks_burned = catalog.total_corks_burned + reward.cork_cost;

        event::emit(RewardRedeemed {
            redemption_id: id_copy,
            user,
            reward_id: object::id(reward),
            reward_name: reward.name,
            corks_burned: reward.cork_cost,
            timestamp
        });

        // Transfer record to user
        transfer::transfer(record, user);

        // Note: In production, this would call cork_token::burn()
        // For hackathon, we're keeping it simple
    }

    /// Update redemption status (admin only)
    public entry fun update_redemption_status(
        _admin: &AdminCap,
        record: &mut RedemptionRecord,
        new_status: u8,
        note: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let old_status = record.status;
        record.status = new_status;

        // Add fulfillment note
        let timestamp = clock::timestamp_ms(clock);
        vec_map::insert(
            &mut record.fulfillment_notes,
            timestamp,
            string::utf8(note)
        );

        event::emit(RedemptionStatusUpdated {
            redemption_id: object::id(record),
            old_status,
            new_status,
            timestamp
        });
    }

    /// Add tracking number to redemption
    public entry fun add_tracking_number(
        _admin: &AdminCap,
        record: &mut RedemptionRecord,
        tracking_number: vector<u8>,
        ctx: &mut TxContext
    ) {
        record.tracking_number = string::utf8(tracking_number);
        record.status = STATUS_SHIPPED;
    }

    /// Update reward availability (admin only)
    public entry fun update_reward_availability(
        _admin: &AdminCap,
        reward: &mut Reward,
        available: bool,
        stock: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        reward.available = available;
        reward.stock = stock;

        event::emit(RewardUpdated {
            reward_id: object::id(reward),
            available,
            stock,
            timestamp: clock::timestamp_ms(clock)
        });
    }

    /// Bulk create rewards (admin only)
    public entry fun bulk_create_rewards(
        _admin: &AdminCap,
        catalog: &mut RewardsCatalog,
        names: vector<vector<u8>>,
        cork_costs: vector<u64>,
        stocks: vector<u64>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let len = vector::length(&names);
        assert!(len == vector::length(&cork_costs), 0);
        assert!(len == vector::length(&stocks), 0);

        let i = 0;
        while (i < len) {
            let name = *vector::borrow(&names, i);
            let cork_cost = *vector::borrow(&cork_costs, i);
            let stock = *vector::borrow(&stocks, i);

            create_reward(
                _admin,
                catalog,
                name,
                b"Reward description",
                cork_cost,
                b"https://example.com/image.png",
                b"product",
                stock,
                clock,
                ctx
            );

            i = i + 1;
        };
    }

    // ===== Public View Functions =====

    /// Get reward info
    public fun get_reward_info(reward: &Reward): (String, String, u64, bool, u64) {
        (
            reward.name,
            reward.description,
            reward.cork_cost,
            reward.available,
            reward.stock
        )
    }

    /// Get redemption info
    public fun get_redemption_info(record: &RedemptionRecord): (address, String, u64, u8, u64) {
        (
            record.user,
            record.reward_name,
            record.corks_burned,
            record.status,
            record.redeemed_at
        )
    }

    /// Check if user can redeem reward
    public fun can_redeem(reward: &Reward, user_cork_balance: u64): bool {
        reward.available && 
        user_cork_balance >= reward.cork_cost &&
        (reward.stock == 0 || reward.stock > 0)
    }

    /// Get status name
    public fun get_status_name(status: u8): vector<u8> {
        if (status == STATUS_FULFILLED) {
            b"Fulfilled"
        } else if (status == STATUS_CANCELLED) {
            b"Cancelled"
        } else if (status == STATUS_SHIPPED) {
            b"Shipped"
        } else {
            b"Pending"
        }
    }

    /// Get catalog stats
    public fun get_catalog_stats(catalog: &RewardsCatalog): (u64, u64, u64) {
        (
            catalog.total_rewards,
            catalog.total_redemptions,
            catalog.total_corks_burned
        )
    }

    // ===== Test Functions =====
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
