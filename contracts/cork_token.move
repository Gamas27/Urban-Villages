// Cork Token - Fungible Token for Cork Collective Loyalty Program
// Deployed on SUI blockchain

module cork_collective::cork_token {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, UID};
    use sui::balance::{Self, Balance};
    use sui::event;

    // ===== Errors =====
    const EInsufficientBalance: u64 = 0;
    const ENotAuthorized: u64 = 1;

    // ===== Structs =====

    /// One-time witness for Cork token
    struct CORK_TOKEN has drop {}

    /// Admin capability for minting operations
    struct AdminCap has key, store {
        id: UID
    }

    /// Treasury capability (created during init)
    struct Treasury has key {
        id: UID,
        cap: TreasuryCap<CORK_TOKEN>
    }

    // ===== Events =====

    struct CorksMinted has copy, drop {
        recipient: address,
        amount: u64,
        reason: vector<u8>,
        timestamp: u64
    }

    struct CorksBurned has copy, drop {
        burner: address,
        amount: u64,
        reason: vector<u8>,
        timestamp: u64
    }

    struct CorksTransferred has copy, drop {
        from: address,
        to: address,
        amount: u64,
        timestamp: u64
    }

    // ===== Init Function =====

    /// Initialize Cork token with supply management
    fun init(witness: CORK_TOKEN, ctx: &mut TxContext) {
        // Create the currency with decimals (6 decimals standard for SUI)
        let (treasury_cap, metadata) = coin::create_currency(
            witness,
            6, // decimals
            b"CORK", // symbol
            b"Cork Token", // name
            b"Loyalty reward token for Cork Collective natural wine program", // description
            option::none(), // icon url (can add later)
            ctx
        );

        // Make metadata immutable and public
        transfer::public_freeze_object(metadata);

        // Store treasury cap in a shared object for controlled access
        transfer::share_object(Treasury {
            id: object::new(ctx),
            cap: treasury_cap
        });

        // Create admin capability and transfer to deployer
        transfer::transfer(AdminCap {
            id: object::new(ctx)
        }, tx_context::sender(ctx));
    }

    // ===== Public Entry Functions =====

    /// Mint Cork tokens (admin only)
    /// Used for: bottle purchases, referrals, events, bonuses
    public entry fun mint(
        _admin: &AdminCap,
        treasury: &mut Treasury,
        recipient: address,
        amount: u64,
        reason: vector<u8>,
        ctx: &mut TxContext
    ) {
        let coin = coin::mint(&mut treasury.cap, amount, ctx);
        transfer::public_transfer(coin, recipient);

        event::emit(CorksMinted {
            recipient,
            amount,
            reason,
            timestamp: tx_context::epoch(ctx)
        });
    }

    /// Batch mint Cork tokens to multiple recipients
    /// Useful for promotional campaigns or event rewards
    public entry fun batch_mint(
        _admin: &AdminCap,
        treasury: &mut Treasury,
        recipients: vector<address>,
        amounts: vector<u64>,
        reason: vector<u8>,
        ctx: &mut TxContext
    ) {
        let len = vector::length(&recipients);
        assert!(len == vector::length(&amounts), ENotAuthorized);

        let i = 0;
        while (i < len) {
            let recipient = *vector::borrow(&recipients, i);
            let amount = *vector::borrow(&amounts, i);
            
            let coin = coin::mint(&mut treasury.cap, amount, ctx);
            transfer::public_transfer(coin, recipient);

            event::emit(CorksMinted {
                recipient,
                amount,
                reason,
                timestamp: tx_context::epoch(ctx)
            });

            i = i + 1;
        };
    }

    /// Burn Cork tokens for reward redemption
    public entry fun burn(
        treasury: &mut Treasury,
        coin: Coin<CORK_TOKEN>,
        reason: vector<u8>,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&coin);
        coin::burn(&mut treasury.cap, coin);

        event::emit(CorksBurned {
            burner: tx_context::sender(ctx),
            amount,
            reason,
            timestamp: tx_context::epoch(ctx)
        });
    }

    /// Transfer Cork tokens between users
    public entry fun transfer_corks(
        coin: Coin<CORK_TOKEN>,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&coin);
        transfer::public_transfer(coin, recipient);

        event::emit(CorksTransferred {
            from: tx_context::sender(ctx),
            to: recipient,
            amount,
            timestamp: tx_context::epoch(ctx)
        });
    }

    /// Split Cork tokens for partial redemption
    public entry fun split_and_transfer(
        coin: &mut Coin<CORK_TOKEN>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        assert!(coin::value(coin) >= amount, EInsufficientBalance);
        
        let split_coin = coin::split(coin, amount, ctx);
        transfer::public_transfer(split_coin, recipient);

        event::emit(CorksTransferred {
            from: tx_context::sender(ctx),
            to: recipient,
            amount,
            timestamp: tx_context::epoch(ctx)
        });
    }

    // ===== Public View Functions =====

    /// Get total supply of Cork tokens
    public fun total_supply(treasury: &Treasury): u64 {
        coin::total_supply(&treasury.cap)
    }

    // ===== Test Functions =====
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(CORK_TOKEN {}, ctx);
    }
}
