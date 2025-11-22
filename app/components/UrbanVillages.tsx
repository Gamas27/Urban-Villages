import React from 'react';
import { Wine, Building2, Music, Palette, Utensils, Dumbbell, ArrowRight, Sparkles, Users, Coins, Globe } from 'lucide-react';

interface Village {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  resource: string;
  description: string;
  status: 'active' | 'coming-soon';
  members?: number;
  tokenSupply?: number;
}

export function UrbanVillages() {
  const villages: Village[] = [
    {
      id: 'cork-collective',
      name: 'Cork Collective',
      icon: <Wine className="w-5 h-5" />,
      color: 'from-rose-500 to-purple-600',
      resource: 'Natural Wine',
      description: 'Tokenizing wine provenance & building wine culture community',
      status: 'active',
      members: 234,
      tokenSupply: 50000
    },
    {
      id: 'culture-commons',
      name: 'Culture Commons',
      icon: <Palette className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      resource: 'Art & Culture',
      description: 'NFT gallery, artist residencies, and cultural event spaces',
      status: 'coming-soon'
    },
    {
      id: 'food-village',
      name: 'Food Village',
      icon: <Utensils className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      resource: 'Local Food',
      description: 'Farm-to-table network, chef collaborations, community kitchens',
      status: 'coming-soon'
    },
    {
      id: 'venue-network',
      name: 'Venue Network',
      icon: <Building2 className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-600',
      resource: 'Real Estate',
      description: 'Shared spaces, co-working, event venues, community buildings',
      status: 'coming-soon'
    },
    {
      id: 'sound-collective',
      name: 'Sound Collective',
      icon: <Music className="w-5 h-5" />,
      color: 'from-green-500 to-teal-500',
      resource: 'Music & Events',
      description: 'Concert series, DJ collectives, music equipment sharing',
      status: 'coming-soon'
    },
    {
      id: 'wellness-hub',
      name: 'Wellness Hub',
      icon: <Dumbbell className="w-5 h-5" />,
      color: 'from-cyan-500 to-blue-500',
      resource: 'Health & Fitness',
      description: 'Gym passes, yoga studios, wellness programs, sports leagues',
      status: 'coming-soon'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Vision Header */}
      <div className="bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4">
            <Globe className="w-4 h-4 text-white" />
            <span className="text-white text-xs">Urban Villages Ecosystem</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl text-white mb-3">Modular Community Platform</h2>
          <p className="text-purple-100 text-sm sm:text-base mb-6 max-w-xl">
            Cork Collective is the first "Urban Village" - a blueprint for tokenizing community resources and building autonomous local economies on SUI blockchain.
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="text-2xl text-white mb-1">6</div>
              <div className="text-xs text-purple-100">Villages Planned</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="text-2xl text-white mb-1">1</div>
              <div className="text-xs text-purple-100">Live (Cork)</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="text-2xl text-white mb-1">∞</div>
              <div className="text-xs text-purple-100">Scalable</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          The Urban Villages Model
        </h3>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-md">
              1
            </div>
            <div>
              <h4 className="text-sm text-gray-900 mb-1">Choose Your Resource</h4>
              <p className="text-xs text-gray-600">
                Start with any community resource: wine, food, art, real estate, events, services. Each becomes a tokenized economy.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-md">
              2
            </div>
            <div>
              <h4 className="text-sm text-gray-900 mb-1">Create Fungible Tokens</h4>
              <p className="text-xs text-gray-600">
                Issue SUI Move tokens for your resource (Cork tokens, Food tokens, Art tokens). Use as currency, rewards, or governance.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md">
              3
            </div>
            <div>
              <h4 className="text-sm text-gray-900 mb-1">NFT Provenance Layer</h4>
              <p className="text-xs text-gray-600">
                Each physical item (bottle, artwork, space rental) gets unique NFT with blockchain-verified provenance and QR codes.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white shadow-md">
              4
            </div>
            <div>
              <h4 className="text-sm text-gray-900 mb-1">Community Treasury</h4>
              <p className="text-xs text-gray-600">
                Transaction fees fund local development: events, infrastructure, arts, business networks - democratically allocated.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-rose-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md">
              5
            </div>
            <div>
              <h4 className="text-sm text-gray-900 mb-1">Scale & Connect</h4>
              <p className="text-xs text-gray-600">
                Launch new villages, cross-pollinate communities, build network effects. Wine + Art + Food = vibrant local economy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Villages Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-gray-900">Urban Villages</h3>
          <span className="text-xs text-gray-500">1 active • 5 planned</span>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-3">
          {villages.map((village) => (
            <div
              key={village.id}
              className={`bg-white rounded-2xl p-4 border border-gray-100 relative overflow-hidden ${
                village.status === 'active' ? 'ring-2 ring-purple-500 shadow-lg' : 'opacity-75'
              }`}
            >
              {/* Status Badge */}
              {village.status === 'active' ? (
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  LIVE
                </div>
              ) : (
                <div className="absolute top-3 right-3 bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full text-xs">
                  Coming Soon
                </div>
              )}

              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${village.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  {village.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 mb-0.5">{village.name}</h4>
                  <p className="text-xs text-gray-500">{village.resource}</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-3">{village.description}</p>

              {village.status === 'active' && (
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                  <div>
                    <div className="flex items-center gap-1 text-gray-500 mb-0.5">
                      <Users className="w-3 h-3" />
                      <span className="text-xs">Members</span>
                    </div>
                    <div className="text-sm text-gray-900">{village.members}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-500 mb-0.5">
                      <Coins className="w-3 h-3" />
                      <span className="text-xs">Supply</span>
                    </div>
                    <div className="text-sm text-gray-900">{village.tokenSupply?.toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Why This Matters */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          Why Modular Communities?
        </h3>
        
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex gap-3">
            <div className="text-lg">🏘️</div>
            <div>
              <span className="font-medium text-gray-900">Local First:</span> Build autonomous economic systems that keep value circulating in your community
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-lg">🔗</div>
            <div>
              <span className="font-medium text-gray-900">Composable:</span> Villages can connect and collaborate - wine village partners with food village for events
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-lg">⚡</div>
            <div>
              <span className="font-medium text-gray-900">Web3 Native:</span> Gasless transactions, embedded wallets - normies get blockchain benefits without complexity
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-lg">🌱</div>
            <div>
              <span className="font-medium text-gray-900">Sustainable Growth:</span> Treasury funds real community development: spaces, events, infrastructure, culture
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
