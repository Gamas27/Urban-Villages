# Troubleshooting: Duplicate Module Error

## Issue
```
Duplicate module found: 0x0000000000000000000000000000000000000000000000000000000000000002::groth16
```

## Solution Options

### Option 1: Clean Build Cache (Try This First)

```bash
cd "/Users/joaogameiro/Urban Villages/contracts"

# Remove all build artifacts
rm -rf build .move

# Clean Sui cache
rm -rf ~/.move

# Rebuild
sui move build
```

### Option 2: Publish with --skip-dependency-verification

```bash
sui client publish --gas-budget 100000000 --skip-dependency-verification
```

### Option 3: Try Publishing to Devnet First

```bash
# Switch to devnet
sui client switch --env devnet

# Get devnet tokens
sui client faucet

# Try publishing
sui client publish --gas-budget 100000000
```

### Option 4: Update Sui CLI

The error might be due to an older Sui CLI version. Try updating:

```bash
# Update Sui CLI
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/MystenLabs/sui/releases/latest/download/sui-installer.sh | sh

# Verify version
sui --version
```

### Option 5: Create Separate Package for Namespace

If the issue persists, create a separate package just for the namespace contract:

```bash
# Create new directory
mkdir -p ../namespace-contract/sources
cd ../namespace-contract

# Copy namespace.move
cp ../contracts/namespace.move sources/

# Create new Move.toml
cat > Move.toml << EOF
[package]
name = "namespace"
version = "0.1.0"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet", override = true }

[addresses]
namespace = "0x0"
EOF

# Build and publish
sui move build
sui client publish --gas-budget 100000000
```

### Option 6: Check for Conflicting Modules

The error might be caused by other Move files in the same package. Check if any other modules are importing groth16:

```bash
cd "/Users/joaogameiro/Urban Villages/contracts"
grep -r "groth16" *.move
```

If found, that module might be causing the conflict.

---

## Recommended Steps (In Order)

1. **Clean build cache** (Option 1)
2. **Try with --skip-dependency-verification** (Option 2)
3. **Update Sui CLI** (Option 4)
4. **Try devnet** (Option 3)
5. **Create separate package** (Option 5) - Last resort

---

## Alternative: Use Sui CLI v1.60 or Earlier

If you're on v1.61.1, try downgrading to v1.60:

```bash
# Install specific version
curl -L https://github.com/MystenLabs/sui/releases/download/testnet-v1.60.0/sui-testnet-v1.60.0-ubuntu-x86_64.tgz -o sui.tgz
tar -xzf sui.tgz
sudo mv sui /usr/local/bin/
```

---

## Still Having Issues?

1. Check Sui CLI version: `sui --version`
2. Check network: `sui client active-env`
3. Check balance: `sui client gas`
4. Try with verbose output: `RUST_BACKTRACE=1 sui client publish --gas-budget 100000000`

