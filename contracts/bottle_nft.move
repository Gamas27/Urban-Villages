// Bottle NFT - Unique provenance NFT for each wine bottle
// Deployed on SUI blockchain

module cork_collective::bottle_nft {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use std::option::{Self, Option};
    use sui::event;
    use sui::vec_map::{Self, VecMap};
    use sui::clock::{Self, Clock};

    // ===== Errors =====
    const ENotOwner: u64 = 0;
    const EInvalidQRCode: u64 = 1;
    const EAlreadyClaimed: u64 = 2;
    const ENotAuthorized: u64 = 3;

    // ===== Structs =====

    /// Admin capability for minting bottles
    struct AdminCap has key, store {
        id: UID
    }

    /// Main Bottle NFT object
    struct BottleNFT has key, store {
        id: UID,
        /// Wine name (e.g., "Sunset Orange 2023")
        name: String,
        /// Vintage year
        vintage: u64,
        /// Wine region (e.g., "Douro Valley, Portugal")
        region: String,
        /// Winery name
        winery: String,
        /// Wine type (e.g., "Orange Wine", "Red Wine")
        wine_type: String,
        /// Bottle number in the batch (e.g., #127/500)
        bottle_number: u64,
        /// Total bottles in this batch
        total_supply: u64,
        /// Purchase date (epoch timestamp)
        purchase_date: u64,
        /// Custom personalization text
        custom_text: Option<String>,
        /// Image URL (IPFS or CDN)
        image_url: String,
        /// Unique QR code identifier
        qr_code: String,
        /// Current owner address
        owner: address,
        /// Verification status
        is_verified: bool,
        /// Provenance events (timestamp -> event description)
        provenance_events: VecMap<u64, String>,
        /// Cork tokens earned from this bottle
        corks_earned: u64
    }

    /// Shared registry for QR code verification
    struct QRRegistry has key {
        id: UID,
        /// QR code -> Bottle ID mapping
        qr_to_bottle: VecMap<String, ID>
    }

    // ===== Events =====

    struct BottleMinted has copy, drop {
        bottle_id: ID,
        name: String,
        vintage: u64,
        owner: address,
        bottle_number: u64,
        qr_code: String,
        timestamp: u64
    }

    struct BottleTransferred has copy, drop {
        bottle_id: ID,
        from: address,
        to: address,
        timestamp: u64
    }

    struct BottleVerified has copy, drop {
        bottle_id: ID,
        qr_code: String,
        verifier: address,
        timestamp: u64
    }

    struct ProvenanceAdded has copy, drop {
        bottle_id: ID,
        event_type: String,
        timestamp: u64
    }

    // ===== Init Function =====

    fun init(ctx: &mut TxContext) {
        // Create admin capability
        transfer::transfer(AdminCap {
            id: object::new(ctx)
        }, tx_context::sender(ctx));

        // Create shared QR registry
        transfer::share_object(QRRegistry {
            id: object::new(ctx),
            qr_to_bottle: vec_map::empty()
        });
    }

    // ===== Public Entry Functions =====

    /// Mint a new bottle NFT (called after purchase)
    public entry fun mint_bottle(
        _admin: &AdminCap,
        registry: &mut QRRegistry,
        name: vector<u8>,
        vintage: u64,
        region: vector<u8>,
        winery: vector<u8>,
        wine_type: vector<u8>,
        bottle_number: u64,
        total_supply: u64,
        custom_text: Option<vector<u8>>,
        image_url: vector<u8>,
        qr_code: vector<u8>,
        recipient: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let bottle_id = object::new(ctx);
        let id_copy = object::uid_to_inner(&bottle_id);
        let qr_string = string::utf8(qr_code);

        // Convert custom_text to Option<String>
        let custom_text_string = if (option::is_some(&custom_text)) {
            option::some(string::utf8(option::extract(&mut custom_text)))
        } else {
            option::none()
        };

        // Create initial provenance entry
        let provenance_events = vec_map::empty();
        vec_map::insert(
            &mut provenance_events,
            clock::timestamp_ms(clock),
            string::utf8(b"Bottle minted and purchased")
        );

        let bottle = BottleNFT {
            id: bottle_id,
            name: string::utf8(name),
            vintage,
            region: string::utf8(region),
            winery: string::utf8(winery),
            wine_type: string::utf8(wine_type),
            bottle_number,
            total_supply,
            purchase_date: clock::timestamp_ms(clock),
            custom_text: custom_text_string,
            image_url: string::utf8(image_url),
            qr_code: qr_string,
            owner: recipient,
            is_verified: true,
            provenance_events,
            corks_earned: 50 // Base corks from purchase
        };

        // Register QR code
        vec_map::insert(&mut registry.qr_to_bottle, qr_string, id_copy);

        // Emit event
        event::emit(BottleMinted {
            bottle_id: id_copy,
            name: bottle.name,
            vintage: bottle.vintage,
            owner: recipient,
            bottle_number,
            qr_code: qr_string,
            timestamp: clock::timestamp_ms(clock)
        });

        // Transfer to recipient
        transfer::public_transfer(bottle, recipient);
    }

    /// Transfer bottle ownership
    public entry fun transfer_bottle(
        bottle: BottleNFT,
        recipient: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let bottle_id = object::id(&bottle);
        
        // Add provenance event
        let BottleNFT {
            id,
            name,
            vintage,
            region,
            winery,
            wine_type,
            bottle_number,
            total_supply,
            purchase_date,
            custom_text,
            image_url,
            qr_code,
            owner: _,
            is_verified,
            mut provenance_events,
            corks_earned
        } = bottle;

        vec_map::insert(
            &mut provenance_events,
            clock::timestamp_ms(clock),
            string::utf8(b"Bottle transferred to new owner")
        );

        let updated_bottle = BottleNFT {
            id,
            name,
            vintage,
            region,
            winery,
            wine_type,
            bottle_number,
            total_supply,
            purchase_date,
            custom_text,
            image_url,
            qr_code,
            owner: recipient,
            is_verified,
            provenance_events,
            corks_earned
        };

        event::emit(BottleTransferred {
            bottle_id,
            from: sender,
            to: recipient,
            timestamp: clock::timestamp_ms(clock)
        });

        transfer::public_transfer(updated_bottle, recipient);
    }

    /// Verify bottle authenticity via QR code scan
    public entry fun verify_bottle(
        bottle: &BottleNFT,
        qr_code_input: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let qr_string = string::utf8(qr_code_input);
        assert!(bottle.qr_code == qr_string, EInvalidQRCode);

        event::emit(BottleVerified {
            bottle_id: object::id(bottle),
            qr_code: qr_string,
            verifier: tx_context::sender(ctx),
            timestamp: clock::timestamp_ms(clock)
        });
    }

    /// Add provenance event (shipping, storage, tasting, etc.)
    public entry fun add_provenance_event(
        bottle: &mut BottleNFT,
        event_type: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(bottle.owner == tx_context::sender(ctx), ENotOwner);

        let timestamp = clock::timestamp_ms(clock);
        let event_string = string::utf8(event_type);
        
        vec_map::insert(&mut bottle.provenance_events, timestamp, event_string);

        event::emit(ProvenanceAdded {
            bottle_id: object::id(bottle),
            event_type: event_string,
            timestamp
        });
    }

    // ===== Public View Functions =====

    /// Get bottle metadata
    public fun get_metadata(bottle: &BottleNFT): (String, u64, String, u64, u64) {
        (bottle.name, bottle.vintage, bottle.region, bottle.bottle_number, bottle.total_supply)
    }

    /// Get bottle owner
    public fun get_owner(bottle: &BottleNFT): address {
        bottle.owner
    }

    /// Get QR code
    public fun get_qr_code(bottle: &BottleNFT): String {
        bottle.qr_code
    }

    /// Check if bottle is verified
    public fun is_verified(bottle: &BottleNFT): bool {
        bottle.is_verified
    }

    /// Get custom text
    public fun get_custom_text(bottle: &BottleNFT): Option<String> {
        bottle.custom_text
    }

    /// Get image URL
    public fun get_image_url(bottle: &BottleNFT): String {
        bottle.image_url
    }

    /// Get Corks earned from this bottle
    public fun get_corks_earned(bottle: &BottleNFT): u64 {
        bottle.corks_earned
    }

    /// Check ownership status for QR scanner
    /// Returns: 0 = not found, 1 = yours, 2 = someone else's
    public fun check_ownership(
        registry: &QRRegistry,
        qr_code: vector<u8>,
        checker: address
    ): u8 {
        let qr_string = string::utf8(qr_code);
        
        if (vec_map::contains(&registry.qr_to_bottle, &qr_string)) {
            // Bottle exists - need to check actual ownership
            // In production, would query the bottle object
            // For demo, return 1 (yours) or 2 (someone else's)
            1 // Simplified for hackathon
        } else {
            0 // Not found
        }
    }

    // ===== Test Functions =====
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
