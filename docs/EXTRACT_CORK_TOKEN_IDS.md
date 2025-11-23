# Extract Cork Token IDs

To get the Cork Token Package ID, Treasury ID, and AdminCap ID, run:

```bash
sui client tx C276oJuESqTA2VsYU8DrMJJttA9buTp9KYgfwYVkvAgz
```

Look for:
- **Package ID** in "Published Objects" section
- **Treasury ID** in "Created Objects" section (should be Shared and have type `cork_token::Treasury`)
- **AdminCap ID** in "Created Objects" section (should be owned by your address and have type `cork_token::AdminCap`)

Or view on Sui Explorer:
https://testnet.suivision.xyz/txblock/C276oJuESqTA2VsYU8DrMJJttA9buTp9KYgfwYVkvAgz

