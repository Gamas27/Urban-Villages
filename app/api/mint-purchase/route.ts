import { NextRequest, NextResponse } from 'next/server';
import { Transaction } from '@mysten/sui/transactions';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';
import { fromB64 } from '@mysten/sui/utils';
import type { Keypair } from '@mysten/sui/cryptography';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';

/**
 * API Route for Minting Bottle NFT and CORK Tokens on Purchase
 * 
 * This route uses the deployer's private key (from env) to mint on behalf of users.
 * AdminCap is owned by the deployer, so only the deployer can call mint functions.
 * 
 * Environment Variables Required:
 * - ADMIN_PRIVATE_KEY: Private key of the deployer in Bech32 format (suiprivkey...) or base64 format
 *   Supports both Ed25519 and secp256k1 key schemes
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

    // Load admin keypair - support both Ed25519 and secp256k1
    // Also support both Bech32 (suiprivkey...) and base64 formats
    let keypair: Keypair;
    let adminAddress: string;
    
    // Check if key is in Bech32 format (starts with "suiprivkey")
    const isBech32 = adminPrivateKey.startsWith('suiprivkey');
    
    try {
      if (isBech32) {
        // Use Sui SDK's built-in Bech32 decoder
        const { secretKey, scheme } = decodeSuiPrivateKey(adminPrivateKey);
        
        // Create keypair based on the scheme
        // Scheme values are: 'ED25519', 'Secp256k1', 'Secp256r1'
        // Convert scheme to string for comparison (SignatureScheme is an enum)
        const schemeStr = String(scheme);
        if (schemeStr === 'ED25519') {
          keypair = Ed25519Keypair.fromSecretKey(secretKey);
        } else if (schemeStr === 'Secp256k1') {
          keypair = Secp256k1Keypair.fromSecretKey(secretKey);
        } else {
          throw new Error(`Unsupported key scheme: ${schemeStr} (expected 'ED25519' or 'Secp256k1')`);
        }
        adminAddress = keypair.toSuiAddress();
      } else {
        // Base64 format - try Ed25519 first, then secp256k1
        try {
          keypair = Ed25519Keypair.fromSecretKey(fromB64(adminPrivateKey));
          adminAddress = keypair.toSuiAddress();
        } catch (ed25519Error) {
          keypair = Secp256k1Keypair.fromSecretKey(fromB64(adminPrivateKey));
          adminAddress = keypair.toSuiAddress();
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      // Log detailed error for debugging
      console.error('[mint-purchase] Key parsing error:', {
        isBech32,
        keyPrefix: adminPrivateKey.substring(0, 20) + '...',
        error: errorMessage,
        stack: errorStack,
      });
      
      return NextResponse.json(
        { 
          error: 'Invalid admin private key format.',
          details: isBech32 
            ? `Failed to parse Bech32 key: ${errorMessage}. Make sure the key starts with "suiprivkey" and was exported correctly.`
            : `Failed to parse base64 key: ${errorMessage}. Key must be base64-encoded Ed25519 or secp256k1 private key, or Bech32 format (suiprivkey...).`,
          hint: isBech32 
            ? 'Verify the key was exported correctly with: sui keytool export --key-identity <alias>'
            : 'Export with: sui keytool export --key-identity <alias> (outputs Bech32 format)',
          debug: process.env.NODE_ENV === 'development' ? errorStack : undefined,
        },
        { status: 500 }
      );
    }

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
        // @ts-expect-error - tx.pure.option type definition issue with transaction arguments
        tx.pure.option('string', customText ? tx.pure.string(customText) : null), // custom_text
        tx.pure.string(imageUrl || ''),    // image_url
        tx.pure.string(qrCode || `QR-${Date.now()}`), // qr_code
        tx.pure.address(recipient),       // recipient
        tx.object('0x6'),                 // Clock
      ],
    });

    // Build, sign and execute transaction
    const txBytes = await tx.build({ client: suiClient });
    const signedTransaction = await keypair.signTransaction(txBytes);
    
    const result = await suiClient.executeTransactionBlock({
      transactionBlock: signedTransaction.bytes,
      signature: signedTransaction.signature,
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

    // Log transaction to backend (non-blocking)
    try {
      const logResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/users/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: recipient,
          transactionType: 'purchase',
          transactionDigest: result.digest,
          nftId: nftId || undefined,
          tokenAmount: corkAmount || 50,
          metadata: {
            wineName,
            vintage,
            region,
            winery,
            wineType,
            bottleNumber,
            totalSupply,
          },
        }),
      }).catch((err) => {
        console.error('[mint-purchase] Failed to log transaction:', err);
      });
    } catch (logError) {
      // Don't fail the purchase if logging fails
      console.error('[mint-purchase] Transaction logging error:', logError);
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

