/**
 * Bottle NFT Service
 * Handles Bottle NFT operations (mint, transfer, queries)
 * Uses Enoki wallets via dapp-kit hooks
 */

import { Transaction } from '@mysten/sui/transactions';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

const BOTTLE_NFT_PACKAGE_ID = process.env.NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID || '0x0';
const BOTTLE_REGISTRY_ID = process.env.NEXT_PUBLIC_BOTTLE_REGISTRY_ID || '0x0';

const network = (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'testnet' | 'mainnet' | 'devnet';

// Create SuiClient instance for queries
const suiClient = new SuiClient({
  url: getFullnodeUrl(network),
});

export interface BottleNFTData {
  name: string;
  vintage: number;
  region: string;
  winery: string;
  wineType: string;
  bottleNumber: number;
  totalSupply: number;
  customText?: string;
  imageUrl: string;
  qrCode: string;
}

/**
 * Mint a Bottle NFT
 * 
 * @param adminCapId - AdminCap object ID (owned by deployer/admin)
 * @param bottleData - Bottle metadata
 * @param recipient - Address to receive the NFT
 * @param signAndExecute - Transaction signing function from dapp-kit
 * @returns Transaction digest and NFT object ID
 */
export async function mintBottleNFT(
  adminCapId: string,
  bottleData: BottleNFTData,
  recipient: string,
  signAndExecute: (params: { transaction: Transaction }) => Promise<{ digest: string }>
): Promise<{ digest: string; nftId: string | null }> {
  if (!BOTTLE_NFT_PACKAGE_ID || BOTTLE_NFT_PACKAGE_ID === '0x0') {
    throw new Error('Bottle NFT contract not deployed. Set NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID in .env.local');
  }

  if (!BOTTLE_REGISTRY_ID || BOTTLE_REGISTRY_ID === '0x0') {
    throw new Error('Bottle NFT Registry not configured. Set NEXT_PUBLIC_BOTTLE_REGISTRY_ID in .env.local');
  }

  const tx = new Transaction();

  // Convert customText to Option<vector<u8>>
  // If customText is provided, pass it as string, otherwise pass empty string
  const customTextArg = bottleData.customText || '';

  tx.moveCall({
    target: `${BOTTLE_NFT_PACKAGE_ID}::bottle_nft::mint_bottle`,
    arguments: [
      tx.object(adminCapId),                    // AdminCap (owned by admin)
      tx.object(BOTTLE_REGISTRY_ID),            // QRRegistry (shared object)
      tx.pure.string(bottleData.name),          // name: vector<u8>
      tx.pure.u64(bottleData.vintage),         // vintage: u64
      tx.pure.string(bottleData.region),        // region: vector<u8>
      tx.pure.string(bottleData.winery),        // winery: vector<u8>
      tx.pure.string(bottleData.wineType),      // wine_type: vector<u8>
      tx.pure.u64(bottleData.bottleNumber),    // bottle_number: u64
      tx.pure.u64(bottleData.totalSupply),     // total_supply: u64
      tx.pure.option('string', customTextArg ? tx.pure.string(customTextArg) : null), // custom_text: Option<vector<u8>>
      tx.pure.string(bottleData.imageUrl),     // image_url: vector<u8>
      tx.pure.string(bottleData.qrCode),        // qr_code: vector<u8>
      tx.pure.address(recipient),              // recipient: address
      tx.object('0x6'),                        // Clock object (standard Sui system object)
    ],
  });

  const result = await signAndExecute({ transaction: tx });

  // Extract NFT object ID from transaction events
  let nftId: string | null = null;
  try {
    const txResult = await suiClient.getTransactionBlock({
      digest: result.digest,
      options: { showEffects: true, showEvents: true, showObjectChanges: true },
    });

    // Look for BottleMinted event
    if (txResult.events) {
      const bottleEvent = txResult.events.find((e) =>
        e.type.includes('BottleMinted')
      );
      if (bottleEvent?.parsedJson) {
        const data = bottleEvent.parsedJson as any;
        nftId = data.bottle_id || null;
      }
    }

    // Also check object changes for the created NFT
    if (!nftId && txResult.objectChanges) {
      const createdBottle = txResult.objectChanges.find(
        (change) =>
          change.type === 'created' &&
          change.objectType?.includes('BottleNFT')
      );
      if (createdBottle && 'objectId' in createdBottle) {
        nftId = createdBottle.objectId;
      }
    }
  } catch (error) {
    // If we can't extract NFT ID, that's okay - we still have the transaction digest
  }

  return { digest: result.digest, nftId };
}

/**
 * Get all Bottle NFTs owned by an address
 * 
 * @param owner - Owner's wallet address
 * @returns Array of Bottle NFT objects
 */
export async function getOwnedBottles(owner: string): Promise<any[]> {
  if (!BOTTLE_NFT_PACKAGE_ID || BOTTLE_NFT_PACKAGE_ID === '0x0') {
    return [];
  }

  try {
    const coinType = `${BOTTLE_NFT_PACKAGE_ID}::bottle_nft::BottleNFT`;
    
    // Get all owned objects of type BottleNFT
    const objects = await suiClient.getOwnedObjects({
      owner,
      filter: { StructType: coinType },
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    });

    return objects.data.map((obj) => {
      if (obj.data?.content && 'fields' in obj.data.content) {
        return {
          objectId: obj.data.objectId,
          ...obj.data.content.fields,
        };
      }
      return null;
    }).filter(Boolean);
  } catch (error) {
    return [];
  }
}

/**
 * Get a specific Bottle NFT by object ID
 * 
 * @param objectId - NFT object ID
 * @returns Bottle NFT data or null
 */
export async function getBottleNFT(objectId: string): Promise<any | null> {
  try {
    const object = await suiClient.getObject({
      id: objectId,
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    });

    if (object.data?.content && 'fields' in object.data.content) {
      return {
        objectId: object.data.objectId,
        ...object.data.content.fields,
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

