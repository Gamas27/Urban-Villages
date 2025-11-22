// Namespace Registry - Custom namespace system for Urban Villages
// Format: username.village (e.g., maria.lisbon)
// Deployed on SUI blockchain

module cork_collective::namespace {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use std::option::{Self, Option};
    use sui::table::{Self, Table};
    use sui::event;
    use sui::clock::{Self, Clock};

    // ===== Errors =====
    const ENamespaceAlreadyExists: u64 = 0;
    const ENotOwner: u64 = 1;
    const EInvalidNamespace: u64 = 2;
    const ENamespaceNotFound: u64 = 3;

    // ===== Structs =====

    /// Admin capability for managing registry
    struct AdminCap has key, store {
        id: UID
    }

    /// Namespace object - owned by user
    struct Namespace has key, store {
        id: UID,
        /// Username (e.g., "maria")
        username: String,
        /// Village ID (e.g., "lisbon")
        village: String,
        /// Full namespace string (username.village)
        namespace: String,
        /// Owner address
        owner: address,
        /// Profile picture blob ID from Walrus
        profile_pic_blob_id: String,
        /// Creation timestamp
        created_at: u64,
        /// Last update timestamp
        updated_at: u64,
    }

    /// Shared registry for all namespaces
    struct Registry has key {
        id: UID,
        /// Namespace string -> Namespace object ID mapping
        /// Format: "username.village" -> Namespace ID
        namespaces: Table<String, ID>,
    }

    // ===== Events =====

    struct NamespaceRegistered has copy, drop {
        namespace: String,
        username: String,
        village: String,
        owner: address,
        namespace_id: ID,
        timestamp: u64,
    }

    struct NamespaceUpdated has copy, drop {
        namespace: String,
        owner: address,
        field: String,
        timestamp: u64,
    }

    struct NamespaceTransferred has copy, drop {
        namespace: String,
        from: address,
        to: address,
        timestamp: u64,
    }

    // ===== Init Function =====

    /// Initialize the namespace registry
    /// Called once when the module is published
    fun init(ctx: &mut TxContext) {
        // Create admin capability
        transfer::public_transfer(AdminCap {
            id: object::new(ctx)
        }, tx_context::sender(ctx));

        // Create shared registry
        transfer::public_share_object(Registry {
            id: object::new(ctx),
            namespaces: table::new(ctx),
        });
    }

    // ===== Helper Functions =====

    /// Check if namespace format is valid
    /// Note: Full validation should be done in frontend
    /// This is a basic check for non-empty strings
    fun is_valid_namespace_str(namespace: String): bool {
        // Basic check - namespace should not be empty
        // More validation (format, length, etc.) should be done in frontend
        string::length(&namespace) > 0
    }

    // ===== Public Entry Functions =====

    /// Register a new namespace
    /// Format: username.village (e.g., "maria.lisbon")
    /// Note: Frontend should format the namespace string before calling this function
    public entry fun register(
        registry: &mut Registry,
        namespace: vector<u8>,  // Full namespace string: "username.village"
        username: vector<u8>,
        village: vector<u8>,
        profile_pic_blob_id: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let namespace_str = string::utf8(namespace);
        let username_str = string::utf8(username);
        let village_str = string::utf8(village);
        let blob_id_str = string::utf8(profile_pic_blob_id);

        // Validate namespace format
        assert!(is_valid_namespace_str(namespace_str), EInvalidNamespace);

        // Check if namespace already exists
        assert!(!table::contains(&registry.namespaces, namespace_str), ENamespaceAlreadyExists);

        let sender = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        // Create namespace object
        let namespace_id = object::new(ctx);
        let namespace_obj = Namespace {
            id: namespace_id,
            username: username_str,
            village: village_str,
            namespace: namespace_str,
            owner: sender,
            profile_pic_blob_id: blob_id_str,
            created_at: timestamp,
            updated_at: timestamp,
        };

        // Add to registry
        table::add(&mut registry.namespaces, namespace_str, object::id(&namespace_obj));

        // Transfer namespace to owner
        transfer::public_transfer(namespace_obj, sender);

        // Emit event
        event::emit(NamespaceRegistered {
            namespace: namespace_str,
            username: username_str,
            village: village_str,
            owner: sender,
            namespace_id: object::id(&namespace_obj),
            timestamp,
        });
    }

    /// Check if a namespace is available for registration
    /// Note: Frontend should format the namespace string before calling this
    public fun is_available(
        registry: &Registry,
        namespace: vector<u8>  // Full namespace string: "username.village"
    ): bool {
        let namespace_str = string::utf8(namespace);
        
        // Return true if namespace doesn't exist
        !table::contains(&registry.namespaces, namespace_str)
    }

    /// Resolve namespace to owner address
    public fun resolve(
        registry: &Registry,
        namespace: vector<u8>
    ): (address, Option<ID>) {
        let namespace_str = string::utf8(namespace);
        
        // Check if namespace exists
        if (!table::contains(&registry.namespaces, namespace_str)) {
            return (@0x0, option::none())
        };

        let namespace_id = *table::borrow(&registry.namespaces, namespace_str);
        // Note: To get owner address, we'd need to query the Namespace object
        // For now, return the namespace ID - frontend can query the object
        (@0x0, option::some(namespace_id))
    }

    /// Update profile picture blob ID
    public entry fun update_profile_pic(
        namespace: &mut Namespace,
        new_blob_id: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Check ownership
        assert!(namespace.owner == sender, ENotOwner);

        namespace.profile_pic_blob_id = string::utf8(new_blob_id);
        namespace.updated_at = clock::timestamp_ms(clock);

        // Emit event
        event::emit(NamespaceUpdated {
            namespace: namespace.namespace,
            owner: sender,
            field: string::utf8(b"profile_pic_blob_id"),
            timestamp: namespace.updated_at,
        });
    }

    /// Transfer namespace to another address
    public entry fun transfer_namespace(
        mut namespace: Namespace,
        recipient: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Check ownership
        assert!(namespace.owner == sender, ENotOwner);

        let old_owner = namespace.owner;
        let namespace_str = namespace.namespace;
        let timestamp = clock::timestamp_ms(clock);

        // Update owner and timestamp before transfer
        namespace.owner = recipient;
        namespace.updated_at = timestamp;

        // Transfer the object
        transfer::public_transfer(namespace, recipient);

        // Emit event
        event::emit(NamespaceTransferred {
            namespace: namespace_str,
            from: old_owner,
            to: recipient,
            timestamp,
        });
    }

    // ===== Public View Functions =====

    /// Get namespace metadata
    public fun get_namespace_info(namespace: &Namespace): (String, String, String, address, String, u64, u64) {
        (
            namespace.username,
            namespace.village,
            namespace.namespace,
            namespace.owner,
            namespace.profile_pic_blob_id,
            namespace.created_at,
            namespace.updated_at,
        )
    }
}

