'use client';

import { useState, useEffect } from 'react';
import { Package, QrCode, Sparkles, Trophy, Search, Filter, Grid3x3, LayoutList, Share2, Download, ExternalLink, Calendar, MapPin, Award } from 'lucide-react';
import { MOCK_USER } from './data/mockData';
import { getVillageById } from './data/villages';
import { Button } from '@/components/ui/button';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { bottleApi } from '@/lib/api';
import { LoadingState, SkeletonCard } from '@/components/ui/LoadingState';
import { WalrusImage } from '@/components/WalrusImage';
import { isWalrusUrl } from '@/lib/placeholders';

interface CollectionProps {
  village: string;
}

type CollectionTab = 'all' | 'village' | 'rare';
type ViewMode = 'grid' | 'list';

interface NFTBottle {
  id: string;
  name: string;
  village: string;
  vintage: number;
  mintDate: string;
  image: string;
  imageBlobId?: string; // Walrus blobId if image is stored on Walrus
  qrCode: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
  attributes: {
    vineyard: string;
    grapes: string;
    bottles: string;
  };
  tokenId: string;
}

export function Collection({ village }: CollectionProps) {
  const account = useCurrentAccount();
  const currentVillage = getVillageById(village);
  const [activeTab, setActiveTab] = useState<CollectionTab>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBottle, setSelectedBottle] = useState<NFTBottle | null>(null);
  const [nftBottles, setNftBottles] = useState<NFTBottle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch owned bottles on mount and when account changes
  const fetchBottles = async () => {
    if (!account) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await bottleApi.getOwnedBottlesByAddress(account.address);
        
        if (result.success && result.data) {
          if (result.data.length === 0) {
            // No bottles owned - show empty state
            setNftBottles([]);
            setLoading(false);
            return;
          }
          
          // Transform API data to NFTBottle format
          const transformedBottles: NFTBottle[] = result.data.map((bottle: any, index: number) => {
            // Extract blobId from imageUrl if it's a Walrus URL
            let imageBlobId: string | undefined;
            let imageUrl = bottle.imageUrl || '';
            
            if (isWalrusUrl(imageUrl)) {
              // Extract blobId from Walrus URL (format: https://aggregator.walrus-testnet.walrus.space/v1/{blobId})
              const match = imageUrl.match(/\/v1\/([^/?]+)/);
              if (match) {
                imageBlobId = match[1];
              }
            }
            
            // Determine rarity based on bottle number vs total supply
            const bottleNum = bottle.bottleNumber || 0;
            const totalSupply = bottle.totalSupply || 1000;
            const rarityRatio = bottleNum / totalSupply;
            let rarity: 'Common' | 'Rare' | 'Legendary' = 'Common';
            if (rarityRatio < 0.1) {
              rarity = 'Legendary';
            } else if (rarityRatio < 0.3) {
              rarity = 'Rare';
            }
            
            // Extract village from region or use default
            const region = (bottle.region || '').toLowerCase();
            let village = 'lisbon'; // default
            if (region.includes('porto') || region.includes('douro')) {
              village = 'porto';
            } else if (region.includes('paris') || region.includes('france')) {
              village = 'paris';
            }
            
            return {
              id: bottle.objectId || `bottle-${index}`,
              name: bottle.name || 'Unknown Wine',
              village,
              vintage: bottle.vintage || new Date().getFullYear(),
              mintDate: new Date().toISOString().split('T')[0], // Use current date as fallback
              image: imageUrl || '',
              imageBlobId,
              qrCode: bottle.qrCode || '',
              rarity,
              tokenId: bottle.objectId || '',
              attributes: {
                vineyard: bottle.winery || 'Unknown Winery',
                grapes: bottle.wineType || 'Unknown',
                bottles: `${bottleNum}/${totalSupply}`,
              },
            };
          });
          
          setNftBottles(transformedBottles);
        } else {
          // No data returned - show empty state
          setNftBottles([]);
          if (result.error) {
            setError(result.error);
          }
        }
      } catch (err) {
        console.error('Error fetching bottles:', err);
        setError('Failed to load collection');
      } finally {
        setLoading(false);
      }
    };

    fetchBottles();

    // Listen for purchase completion events to refresh collection
    const handlePurchaseComplete = () => {
      // Small delay to allow blockchain state to update
      setTimeout(() => {
        fetchBottles();
      }, 2000);
    };

    window.addEventListener('purchaseComplete', handlePurchaseComplete);

    return () => {
      window.removeEventListener('purchaseComplete', handlePurchaseComplete);
    };
  }, [account]);

  const stats = {
    total: nftBottles.length,
    common: nftBottles.filter(b => b.rarity === 'Common').length,
    rare: nftBottles.filter(b => b.rarity === 'Rare').length,
    legendary: nftBottles.filter(b => b.rarity === 'Legendary').length,
    villages: new Set(nftBottles.map(b => b.village)).size,
  };

  const rarityConfig = {
    'Common': { 
      color: 'bg-gray-100 text-gray-700 border-gray-300',
      gradient: 'from-gray-400 to-gray-600',
      icon: '⚪'
    },
    'Rare': { 
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      gradient: 'from-purple-400 to-purple-600',
      icon: '💎'
    },
    'Legendary': { 
      color: 'bg-orange-100 text-orange-700 border-orange-300',
      gradient: 'from-orange-400 to-orange-600',
      icon: '👑'
    },
  };

  // Filter bottles based on search and active tab
  const filteredBottles = nftBottles.filter(bottle => {
    const matchesSearch = bottle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bottle.attributes.vineyard.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'village') return matchesSearch && bottle.village === village;
    if (activeTab === 'rare') return matchesSearch && (bottle.rarity === 'Rare' || bottle.rarity === 'Legendary');
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingState
        loading={loading}
        error={error}
        onRetry={() => {
          if (account) {
            setError(null);
            setLoading(true);
            bottleApi.getOwnedBottlesByAddress(account.address).then((result) => {
              if (result.success && result.data) {
                // TODO: Transform actual data
                setNftBottles([]);
              } else {
                setError(result.error || 'Failed to load bottles');
              }
              setLoading(false);
            });
          }
        }}
        loadingText="Loading your collection..."
        errorTitle="Failed to load collection"
      >
        {/* Collection Tabs */}
      <div className="sticky top-[72px] z-20 bg-white border-b border-gray-200">
        <div className="flex items-center max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'all'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            All Bottles
            {activeTab === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('village')}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'village'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            This Village
            {activeTab === 'village' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('rare')}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'rare'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            Rare & Legendary
            {activeTab === 'rare' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
        </div>
      </div>

      <div className="p-4 pb-6 space-y-4">
        {/* Stats Header */}
        <div className="bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl mb-1">My Collection</h2>
              <p className="text-sm text-white/90">
                NFT Wine Bottles on SUI
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur px-3 py-2 rounded-xl text-center">
              <div className="text-lg">{stats.total}</div>
              <div className="text-xs text-white/80">Total</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <div className="text-xl mb-1">⚪</div>
              <div className="text-sm">{stats.common}</div>
              <div className="text-[10px] text-white/70">Common</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <div className="text-xl mb-1">💎</div>
              <div className="text-sm">{stats.rare}</div>
              <div className="text-[10px] text-white/70">Rare</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <div className="text-xl mb-1">👑</div>
              <div className="text-sm">{stats.legendary}</div>
              <div className="text-[10px] text-white/70">Legendary</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <div className="text-xl mb-1">🏘️</div>
              <div className="text-sm">{stats.villages}</div>
              <div className="text-[10px] text-white/70">Villages</div>
            </div>
          </div>
        </div>

        {/* Hero Feature Callout */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">🏆 Hackathon Hero Feature</h3>
              <p className="text-xs text-white/90 mb-2">
                Each bottle is a unique SUI NFT with provenance data stored on Walrus. Scan QR codes on physical bottles to verify authenticity!
              </p>
              <div className="flex items-center gap-2 text-[10px] text-white/80">
                <span>✓ SUI Blockchain</span>
                <span>•</span>
                <span>✓ Walrus Storage</span>
                <span>•</span>
                <span>✓ QR Verification</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and View Controls */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className="px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {viewMode === 'list' ? (
              <Grid3x3 className="w-5 h-5 text-gray-600" />
            ) : (
              <LayoutList className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* NFT Bottles - List View */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            {filteredBottles.map((bottle) => {
              const bottleVillage = getVillageById(bottle.village);
              const rarityStyle = rarityConfig[bottle.rarity];
              
              return (
                <div key={bottle.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div className="flex gap-4 p-4">
                    {/* Bottle Image */}
                    <div className="relative w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      {bottle.imageBlobId ? (
                        <WalrusImage
                          blobId={bottle.imageBlobId}
                          alt={bottle.name}
                          className="w-full h-full object-cover"
                          type="post"
                        />
                      ) : (
                        <img 
                          src={bottle.image || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400'} 
                          alt={bottle.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-2 left-2 w-6 h-6 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-sm">
                        {rarityStyle.icon}
                      </div>
                    </div>

                    {/* Bottle Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate mb-1">{bottle.name}</h3>
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            {bottleVillage?.emoji} {bottleVillage?.name} • {bottle.vintage}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded-lg border text-[10px] whitespace-nowrap ${rarityStyle.color}`}>
                          {bottle.rarity}
                        </div>
                      </div>

                      {/* Attributes */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2 text-[10px] text-gray-600">
                          <Award className="w-3 h-3" />
                          <span className="truncate">{bottle.attributes.vineyard}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-600">
                          <Package className="w-3 h-3" />
                          <span>Edition: {bottle.attributes.bottles}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setSelectedBottle(bottle)}
                          className="flex-1 py-2 px-3 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-lg text-xs h-auto hover:from-orange-600 hover:to-purple-700"
                        >
                          <QrCode className="w-3 h-3 inline mr-1" />
                          View NFT
                        </Button>
                        <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* NFT Footer */}
                  <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-[10px] text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Minted {new Date(bottle.mintDate).toLocaleDateString()}
                      </span>
                      <span className="font-mono text-purple-600">Token: {bottle.tokenId.slice(0, 10)}...</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* NFT Bottles - Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 gap-3">
            {filteredBottles.map((bottle) => {
              const bottleVillage = getVillageById(bottle.village);
              const rarityStyle = rarityConfig[bottle.rarity];
              
              return (
                <div key={bottle.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all">
                  {/* Bottle Image */}
                  <div className="relative aspect-[3/4] bg-gray-100">
                    {bottle.imageBlobId ? (
                      <WalrusImage
                        blobId={bottle.imageBlobId}
                        alt={bottle.name}
                        className="w-full h-full object-cover"
                        type="post"
                      />
                    ) : (
                      <img 
                        src={bottle.image || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400'} 
                        alt={bottle.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-2 left-2 w-7 h-7 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-sm">
                      {rarityStyle.icon}
                    </div>
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg border text-[10px] ${rarityStyle.color}`}>
                      {bottle.rarity}
                    </div>
                  </div>

                  {/* Bottle Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate mb-1">{bottle.name}</h3>
                    <p className="text-[10px] text-gray-600 mb-2 flex items-center gap-1">
                      {bottleVillage?.emoji} {bottleVillage?.name}
                    </p>
                    
                    <Button
                      onClick={() => setSelectedBottle(bottle)}
                      className="w-full py-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-lg text-[10px] h-auto hover:from-orange-600 hover:to-purple-700"
                    >
                      <QrCode className="w-3 h-3 inline mr-1" />
                      View NFT
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredBottles.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              {searchQuery ? (
                <Search className="w-10 h-10 text-gray-400" />
              ) : (
                <Package className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg mb-2">
              {searchQuery ? 'No bottles found' : 'No bottles in this view'}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search' : 'Purchase bottles from the Shop to build your collection!'}
            </p>
            {!searchQuery && (
              <Button className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700">
                Browse Shop
              </Button>
            )}
          </div>
        )}
      </div>

      {/* NFT Detail Modal */}
      {selectedBottle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header Image */}
            <div className="relative h-80 bg-gray-100">
              {selectedBottle.imageBlobId ? (
                <WalrusImage
                  blobId={selectedBottle.imageBlobId}
                  alt={selectedBottle.name}
                  className="w-full h-full object-cover"
                  type="post"
                />
              ) : (
                <img 
                  src={selectedBottle.image || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400'} 
                  alt={selectedBottle.name}
                  className="w-full h-full object-cover"
                />
              )}
              <button
                onClick={() => setSelectedBottle(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                ✕
              </button>
              <div className={`absolute top-4 left-4 px-3 py-2 rounded-full border ${rarityConfig[selectedBottle.rarity].color}`}>
                <span className="text-lg mr-1">{rarityConfig[selectedBottle.rarity].icon}</span>
                <span className="text-sm font-semibold">{selectedBottle.rarity}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl mb-2">{selectedBottle.name}</h2>
                <p className="text-sm text-gray-600">
                  {getVillageById(selectedBottle.village)?.emoji} {getVillageById(selectedBottle.village)?.name} • Vintage {selectedBottle.vintage}
                </p>
              </div>

              {/* Attributes */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <h3 className="font-semibold text-sm">Provenance Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vineyard</span>
                    <span className="font-medium">{selectedBottle.attributes.vineyard}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grapes</span>
                    <span className="font-medium">{selectedBottle.attributes.grapes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Edition</span>
                    <span className="font-medium">{selectedBottle.attributes.bottles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mint Date</span>
                    <span className="font-medium">{new Date(selectedBottle.mintDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Blockchain Info */}
              <div className="bg-purple-50 rounded-2xl p-4 space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Blockchain Details
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-gray-600 mb-1">Token ID</p>
                    <p className="font-mono bg-white rounded-lg px-3 py-2 break-all">{selectedBottle.tokenId}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>✓ Stored on Walrus</span>
                    <span>•</span>
                    <span>✓ Minted on SUI</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button className="py-3 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700">
                  <QrCode className="w-4 h-4 mr-2" />
                  Show QR Code
                </Button>
                <Button variant="outline" className="py-3">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on SUI
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 py-3">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" className="flex-1 py-3">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      </LoadingState>
    </div>
  );
}