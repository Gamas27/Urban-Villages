# Walrus Testing Guide

## ✅ Real Wallet Integration Complete

Walrus uploads now use **real wallet connections** - no mocks! Here's how to test:

## Prerequisites

1. **Install Sui Wallet Extension**
   - Chrome: https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/sui-wallet/
   - Or search "Sui Wallet" in your browser's extension store

2. **Get Testnet SUI Tokens** (for transaction fees)
   - Go to: https://discord.com/channels/916379725201563759/971488439931392130
   - Use the faucet: `!faucet YOUR_SUI_ADDRESS`
   - Or visit: https://discord.com/channels/916379725201563759/971488439931392130

## Testing Walrus Uploads

### Test 1: Profile Picture Upload (Onboarding)

1. Complete zkLogin authentication (Google OAuth)
2. Select your village
3. Enter username
4. On profile picture step:
   - **If wallet not connected**: You'll see a yellow banner with "Connect wallet" button
   - Click "Connect wallet" → Connect your Sui Wallet
   - Click the camera icon to upload a profile picture
   - Approve **2 transactions**:
     - **Register transaction**: Registers the blob on-chain
     - **Certify transaction**: Certifies the blob is stored
   - Wait for "✓ Uploaded to Walrus!" message
   - Complete onboarding

### Test 2: Post Image Upload

1. After onboarding, go to the Feed
2. Click the "+" button to create a post
3. Click "Add Image"
4. **If wallet not connected**: You'll see a yellow banner with "Connect wallet" button
5. Connect wallet if needed
6. Select an image file
7. Approve **2 transactions** (register + certify)
8. See the image preview with "✓ Stored on Walrus" badge
9. Post your content

## What Happens Behind the Scenes

1. **Encode**: File is encoded for Walrus storage
2. **Register Transaction**: 
   - Signs transaction with your wallet
   - Registers blob metadata on Sui blockchain
   - Returns blob object ID
3. **Upload**: File data uploaded to Walrus storage nodes
4. **Certify Transaction**:
   - Signs transaction with your wallet
   - Certifies the blob is properly stored
5. **Complete**: Returns `blobId` for displaying the image

## Expected Behavior

✅ **With Wallet Connected**:
- Image uploads work immediately
- 2 transaction approvals required
- Images stored on Walrus decentralized storage
- Images display using `WalrusImage` component

❌ **Without Wallet**:
- Upload button is disabled
- Yellow banner shows "Connect wallet" prompt
- User can skip and continue (for text-only posts)

## Troubleshooting

### "Please connect your wallet first"
- Make sure Sui Wallet extension is installed
- Click "Connect wallet" button
- Approve the connection in the wallet popup

### Transaction Fails
- Check you have SUI tokens in your wallet (for gas fees)
- Make sure you're on Sui Testnet
- Check wallet has enough balance (transactions cost ~0.001 SUI)

### Upload Stuck
- Check browser console for errors
- Make sure both transactions are approved
- Try refreshing and re-uploading

### Image Not Displaying
- Check that `blobId` is saved correctly
- Verify Walrus URL is correct
- Check network tab for failed requests

## Network Configuration

Currently using **Sui Testnet**:
- Network: `testnet`
- Walrus Aggregator: `https://aggregator.walrus-testnet.walrus.space`
- Storage Duration: 10 epochs (~30 days)

## Success Indicators

✅ Profile picture shows "✓ Uploaded to Walrus!"  
✅ Post images show "✓ Stored on Walrus" badge  
✅ Images load from Walrus URLs  
✅ `blobId` is stored in localStorage/posts  
✅ Transactions appear in Sui Explorer

