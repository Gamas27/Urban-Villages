# 🔑 Finding the Deployer Wallet Key

## Deployer Address
```
0x951ffaa17abaf3202acf52125d711df9f71f318c0772a08daeaf6d1d978b6f2f
```

This address deployed:
- Cork Token contract
- Bottle NFT contract (likely)
- Namespace contract (likely)

## Current Situation
- ❌ This address is **NOT** in your current Sui keystore
- ✅ Your keystore has: `hardcore-pearl` (different address)

## Options to Get the Private Key

### Option 1: Check Other Keystore Locations
The key might be in a different keystore. Check:
```bash
# Default keystore location
ls ~/.sui/sui_config/sui.keystore

# Or check if there are other keystores
find ~ -name "*.keystore" 2>/dev/null
```

### Option 2: Import from Another Format
If you have the private key in another format:

**From hex:**
```bash
# Convert hex to base64
echo -n "<hex-string>" | xxd -r -p | base64
```

**From mnemonic:**
```bash
# Import mnemonic to keystore
sui keytool import --key-identity deployer --key-encoding base64
# Then paste the mnemonic when prompted
```

**From JSON/other format:**
We can help convert it.

### Option 3: Check if Key is in Wallet Extension
If you used Sui Wallet browser extension:
1. Open Sui Wallet
2. Export the private key for address `0x951ffaa17abaf3202acf52125d711df9f71f318c0772a08daeaf6d1d978b6f2f`
3. Convert to base64 if needed

### Option 4: Import from File
If you have the key saved somewhere:
```bash
# Import from file
sui keytool import --key-identity deployer --key-encoding base64 < key-file.txt
```

## Once You Have the Key

### If key is in keystore:
```bash
# List to find the alias
sui keytool list

# Export it
sui keytool export --key-identity <alias> --key-encoding base64
```

### If you have the raw private key:
1. Convert to base64 (if not already)
2. Add to `.env.local`:
   ```env
   ADMIN_PRIVATE_KEY=<base64-string>
   ```

## Verify It's the Right Key

After importing/exporting, verify the address matches:
```bash
# Export and check address
sui keytool export --key-identity <alias> --key-encoding base64
# The exported key should correspond to address 0x951ffaa17abaf3202acf52125d711df9f71f318c0772a08daeaf6d1d978b6f2f
```

## Quick Test

Once you have the key in `.env.local`, test it:
```bash
# Check if it's set
grep ADMIN_PRIVATE_KEY .env.local

# Verify with script
source .env.local
./check-env.sh
```

---

**Need help?** Let me know:
- Do you have the private key in another format?
- Is it in a different keystore?
- Do you need help converting it?

