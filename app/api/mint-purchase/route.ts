import { NextRequest, NextResponse } from 'next/server';
import { Transaction } from '@mysten/sui/transactions';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromB64 } from '@mysten/sui/utils';

/**
 * API Route for Minting Bottle NFT and CORK Tokens on Purchase
 * 
 * This route uses the deployer's private key (from env) to mint on behalf of users.
 * AdminCap is owned by the deployer, so only the deployer can call mint functions.
 * 
 * Environment Variables Required:
 * - ADMIN_PRIVATE_KEY: Base64-encoded Ed25519 private key of the deployer
 * - NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID: Cork Token package ID
 * - NEXT_PUBLIC_CORK_TREASURY_ID: Cork Token Treasury ID
 * - NEXT_PUBLIC_CORK_ADMIN_CAP_ID: Cork Token AdminCap ID
 * - NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID: Bottle NFT package ID
 * - NEXT_PUBLIC_BOTTLE_REGISTRY_ID: Bottle NFT Registry ID
 * - NEXT_PUBLIC_BOTTLE_ADMIN_CAP_ID: Bottle NFT AdminCap ID
 * - NEXT_PUBLIC_SUI_NETWORK: Network (testnet, mainnet, devnet)
 */

const network = (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'testnet' | 'mainnet' | 'devnet';
const suiClient = new SuiClient({
  url: getFullnodeUrl(network),
});

// CORK token has 6 decimals
const CORK_DECIMALS = 6;

function toMicroCork(amount: number): bigint {
  return BigInt(Math.floor(amount * 10 ** CORK_DECIMALS));
}

export async function POST(req: NextRequest) {
  try {
    // Check if admin private key is configured
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
    if (!adminPrivateKey) {
      return NextResponse.json(
        { error: 'Admin private key not configured. Add ADMIN_PRIVATE_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    // Get contract IDs from environment
    const corkPackageId = process.env.NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID;
    const corkTreasuryId = process.env.NEXT_PUBLIC_CORK_TREASURY_ID;
    const corkAdminCapId = process.env.NEXT_PUBLIC_CORK_ADMIN_CAP_ID;
    const bottlePackageId = process.env.NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID;
    const bottleRegistryId = process.env.NEXT_PUBLIC_BOTTLE_REGISTRY_ID;
    const bottleAdminCapId = process.env.NEXT_PUBLIC_BOTTLE_ADMIN_CAP_ID;

    if (!corkPackageId || !corkTreasuryId || !corkAdminCapId) {
      return NextResponse.json(
        { error: 'Cork Token contract IDs not configured in environment variables' },
        { status: 500 }
      );
    }

    if (!bottlePackageId || !bottleRegistryId || !bottleAdminCapId) {
      return NextResponse.json(
        { error: 'Bottle NFT contract IDs not configured in environment variables' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      recipient,        // User's wallet address
      wineName,         // Wine name
      vintage,          // Vintage year
      region,           // Region
      winery,           // Winery name
      wineType,         // Wine type
      bottleNumber,     // Bottle number
      totalSupply,      // Total supply
      imageUrl,         // Image URL
      qrCode,           // QR code
      corkAmount,       // CORK tokens to mint (default: 50)
      customText,       // Optional custom text
    } = body;

    if (!recipient || !wineName || !vintage || !region || !winery || !wineType) {
      return NextResponse.json(
        { error: 'Missing required fields: recipient, wineName, vintage, region, winery, wineType are required' },
        { status: 400 }
      );
    }

    // Load admin keypair
    const keypair = Ed25519Keypair.fromSecretKey(fromB64(adminPrivateKey));
    const adminAddress = keypair.toSuiAddress();

    // Create a Programmable Transaction Block that mints both NFT and CORK tokens
    const tx = new Transaction();

    // Step 1: Mint CORK tokens
    const microCork = toMicroCork(corkAmount || 50);
    tx.moveCall({
      target: `${corkPackageId}::cork_token::mint`,
      arguments: [
        tx.object(corkAdminCapId),        // AdminCap (owned by deployer)
        tx.object(corkTreasuryId),        // Treasury (shared object)
        tx.pure.address(recipient),       // Recipient address
        tx.pure.u64(microCork),           // Amount in micro-CORK
        tx.pure.string('bottle_purchase'), // Reason
      ],
    });

    // Step 2: Mint Bottle NFT
    const customTextArg = customText || '';
    tx.moveCall({
      target: `${bottlePackageId}::bottle_nft::mint_bottle`,
      arguments: [
        tx.object(bottleAdminCapId),      // AdminCap (owned by deployer)
        tx.object(bottleRegistryId),      // QRRegistry (shared object)
        tx.pure.string(wineName),         // name
        tx.pure.u64(Number(vintage)),     // vintage
        tx.pure.string(region),           // region
        tx.pure.string(winery),            // winery
        tx.pure.string(wineType),         // wine_type
        tx.pure.u64(Number(bottleNumber || 1)), // bottle_number
        tx.pure.u64(Number(totalSupply || 500)), // total_supply
        tx.pure.option('string', customTextArg ? tx.pure.string(customTextArg) : null), // custom_text
        tx.pure.string(imageUrl || ''),    // image_url
        tx.pure.string(qrCode || `QR-${Date.now()}`), // qr_code
        tx.pure.address(recipient),       // recipient
        tx.object('0x6'),                 // Clock
      ],
    });

    // Build, sign and execute transaction
    const txBytes = await tx.build({ client: suiClient });
    const signature = keypair.signTransactionBlock(txBytes);
    
    const result = await suiClient.executeTransactionBlock({
      transactionBlock: txBytes,
      signature,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
      },
    });

    // Extract NFT object ID from transaction events or object changes
    let nftId: string | null = null;
    if (result.objectChanges) {
      const createdBottle = result.objectChanges.find(
        (change) =>
          change.type === 'created' &&
          change.objectType?.includes('BottleNFT')
      );
      if (createdBottle && 'objectId' in createdBottle) {
        nftId = createdBottle.objectId;
      }
    }

    // Also check events
    if (!nftId && result.events) {
      const bottleEvent = result.events.find((e) =>
        e.type.includes('BottleMinted')
      );
      if (bottleEvent?.parsedJson) {
        const data = bottleEvent.parsedJson as any;
        nftId = data.bottle_id || null;
      }
    }

    return NextResponse.json({
      success: true,
      digest: result.digest,
      nftId,
      adminAddress, // For debugging
    });
  } catch (error) {
    console.error('[mint-purchase] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      {
        error: 'Failed to mint purchase',
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}

