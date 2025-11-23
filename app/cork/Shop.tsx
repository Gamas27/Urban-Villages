'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Package, ShoppingCart, Clock, Check, X, Search, Filter, Heart, Truck, MapPin, Calendar } from 'lucide-react';
import { getWinesByVillage, type Wine } from './data/mockData';
import { Button } from '@/components/ui/button';
import { PurchaseModal } from './PurchaseModal';
import { getVillageById } from './data/villages';

interface ShopProps {
  village: string;
}

type ShopTab = 'browse' | 'cart' | 'orders';

interface CartItem {
  wine: Wine;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  items: {
    wine: Wine;
    quantity: number;
    price: number;
  }[];
  total: number;
  corkEarned: number;
  nftMinted: boolean;
  trackingNumber?: string;
}

export function Shop({ village }: ShopProps) {
  const wines = getWinesByVillage(village);
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [activeTab, setActiveTab] = useState<ShopTab>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const villageData = getVillageById(village);

  // Cart with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cork_cart');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Filter out wines that no longer exist
          return parsed.filter((item: CartItem) => 
            wines.some(w => w.id === item.wine.id)
          );
        }
      } catch (err) {
        console.error('Failed to load cart from localStorage:', err);
      }
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cork_cart', JSON.stringify(cartItems));
      } catch (err) {
        console.error('Failed to save cart to localStorage:', err);
      }
    }
  }, [cartItems]);

  // Mock order history
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'UV-2024-1234',
      date: '2024-11-18',
      status: 'delivered',
      items: [
        {
          wine: {
            id: '1',
            name: '2023 Orange Skin Contact',
            vintage: '2023',
            vineyard: 'Quinta do Terroir',
            price: 28,
            corkReward: 280,
            imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
            available: 8,
            total: 10,
            description: 'Natural orange wine with extended skin contact',
            village: 'lisbon',
          },
          quantity: 1,
          price: 28,
        }
      ],
      total: 28,
      corkEarned: 280,
      nftMinted: true,
      trackingNumber: 'DHL1234567890',
    },
    {
      id: '2',
      orderNumber: 'UV-2024-1189',
      date: '2024-11-10',
      status: 'shipped',
      items: [
        {
          wine: {
            id: '2',
            name: '2022 Natural Red Blend',
            vintage: '2022',
            vineyard: 'Vinha Velha',
            price: 32,
            corkReward: 320,
            imageUrl: 'https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?w=400',
            available: 5,
            total: 15,
            description: 'Low intervention red blend',
            village: 'lisbon',
          },
          quantity: 2,
          price: 64,
        }
      ],
      total: 64,
      corkEarned: 640,
      nftMinted: true,
      trackingNumber: 'DHL0987654321',
    },
    {
      id: '3',
      orderNumber: 'UV-2024-1045',
      date: '2024-10-28',
      status: 'confirmed',
      items: [
        {
          wine: {
            id: '3',
            name: '2021 Amphora Orange',
            vintage: '2021',
            vineyard: 'Casa Ferreirinha',
            price: 45,
            corkReward: 450,
            imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400',
            available: 2,
            total: 5,
            description: 'Aged in clay amphora',
            village: 'porto',
          },
          quantity: 1,
          price: 45,
        }
      ],
      total: 45,
      corkEarned: 450,
      nftMinted: true,
    },
  ]);

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.wine.price * item.quantity), 0);
  const cartCorkReward = cartItems.reduce((sum, item) => sum + (item.wine.corkReward * item.quantity), 0);

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: Clock, label: 'Pending' },
    confirmed: { color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Check, label: 'Confirmed' },
    shipped: { color: 'bg-purple-100 text-purple-700 border-purple-300', icon: Truck, label: 'Shipped' },
    delivered: { color: 'bg-green-100 text-green-700 border-green-300', icon: Check, label: 'Delivered' },
  };

  const filteredWines = wines.filter(wine =>
    wine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wine.vineyard.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shop Tabs */}
      <div className="sticky top-[72px] z-20 bg-white border-b border-gray-200">
        <div className="flex items-center max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'browse'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            Browse
            {activeTab === 'browse' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'cart'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              Cart
              {cartItems.length > 0 && (
                <span className="bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </div>
            {activeTab === 'cart' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'orders'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            Orders
            {activeTab === 'orders' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
        </div>
      </div>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <div className="p-4 pb-6 space-y-4">
          {/* Shop Header */}
          <div className="bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-2xl mb-1">{villageData?.emoji} {villageData?.name} Shop</h2>
                <p className="text-sm text-white/90">
                  Each purchase mints a unique SUI NFT
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur px-3 py-2 rounded-xl text-center">
                <div className="text-lg">{wines.length}</div>
                <div className="text-xs text-white/80">Wines</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/90 bg-white/10 backdrop-blur rounded-lg px-3 py-2">
              <Sparkles className="w-4 h-4" />
              <span>Earn CORK tokens with every purchase</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search wines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Wine Grid */}
          <div className="space-y-4">
            {filteredWines.map((wine) => (
              <div
                key={wine.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex gap-4 p-4">
                  {/* Wine Image */}
                  <div className="relative w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={wine.imageUrl}
                      alt={wine.name}
                      className="w-full h-full object-cover"
                    />
                    <button className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Wine Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 truncate">{wine.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {wine.vineyard} • {wine.vintage}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg">
                        <Package className="w-3 h-3 text-purple-600" />
                        <span className="text-xs text-purple-700">
                          {wine.available}/{wine.total}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                        <Sparkles className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-700">+{wine.corkReward}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xl">€{wine.price}</p>
                        <p className="text-[10px] text-gray-500">+ gas fees</p>
                      </div>
                      <Button
                        onClick={() => setSelectedWine(wine)}
                        disabled={wine.available === 0}
                        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 disabled:opacity-50 text-sm h-auto"
                      >
                        {wine.available === 0 ? 'Sold Out' : 'Buy Now'}
                      </Button>
                    </div>

                    {wine.available < 10 && wine.available > 0 && (
                      <p className="text-[10px] text-orange-600 mt-2">
                        ⚠️ Only {wine.available} left
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredWines.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No wines found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
            </div>
          )}
        </div>
      )}

      {/* Cart Tab */}
      {activeTab === 'cart' && (
        <div className="p-4 pb-6 space-y-4">
          {cartItems.length > 0 ? (
            <>
              {/* Cart Items */}
              <div className="space-y-3">
                {cartItems.map((item, index) => (
                  <div key={index} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex gap-4">
                      <div className="w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={item.wine.imageUrl}
                          alt={item.wine.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{item.wine.name}</h3>
                            <p className="text-xs text-gray-600">{item.wine.vineyard}</p>
                          </div>
                          <button className="text-gray-400 hover:text-red-500 transition-colors ml-2">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-1">
                            <button className="text-gray-600 hover:text-gray-900">-</button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button className="text-gray-600 hover:text-gray-900">+</button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">€{item.wine.price * item.quantity}</p>
                            <p className="text-xs text-green-600">+{item.wine.corkReward * item.quantity} CORK</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="font-semibold mb-3">Order Summary</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>€{cartTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gas fees (est.)</span>
                    <span>€0.50</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      CORK Rewards
                    </span>
                    <span>+{cartCorkReward}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>€{(cartTotal + 0.5).toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full py-6 text-lg bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 mt-4">
                  Checkout ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                </Button>

                <p className="text-xs text-center text-gray-500">
                  🔐 Secure checkout • NFT minted on purchase
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg mb-2">Your cart is empty</h3>
              <p className="text-sm text-gray-600 mb-6">Add some bottles to get started!</p>
              <Button
                onClick={() => setActiveTab('browse')}
                className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
              >
                Browse Wines
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="p-4 pb-6 space-y-4">
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                const config = statusConfig[order.status];
                const StatusIcon = config.icon;
                
                return (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Order Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold mb-1">Order #{order.orderNumber}</p>
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs ${config.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{config.label}</span>
                        </div>
                      </div>

                      {order.trackingNumber && (
                        <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-2">
                          <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-blue-900 font-medium">Tracking Number</p>
                            <p className="text-xs text-blue-700 font-mono">{order.trackingNumber}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="p-4 space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={item.wine.imageUrl}
                              alt={item.wine.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.wine.name}</p>
                            <p className="text-xs text-gray-600">{item.wine.vineyard}</p>
                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">€{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="bg-gray-50 p-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Total</span>
                        <span className="font-semibold">€{order.total}</span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          CORK Earned
                        </span>
                        <span className="text-sm text-green-600 font-semibold">+{order.corkEarned}</span>
                      </div>
                      {order.nftMinted && (
                        <div className="flex items-center gap-2 bg-purple-50 rounded-lg px-3 py-2">
                          <Check className="w-4 h-4 text-purple-600" />
                          <span className="text-xs text-purple-900">NFT Minted on SUI</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg mb-2">No orders yet</h3>
              <p className="text-sm text-gray-600 mb-6">Your order history will appear here</p>
              <Button
                onClick={() => setActiveTab('browse')}
                className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
              >
                Start Shopping
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Purchase Modal */}
      {selectedWine && (
        <PurchaseModal
          wine={selectedWine}
          onClose={() => setSelectedWine(null)}
          onSuccess={() => {
            setSelectedWine(null);
            // TODO: Refresh wine list
          }}
        />
      )}
    </div>
  );
}