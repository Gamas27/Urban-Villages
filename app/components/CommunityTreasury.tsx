import React from 'react';
import { TrendingUp, Users, Building2, Palette, Calendar, Coins, ArrowRight, Sparkles } from 'lucide-react';

interface TreasuryAllocation {
  category: string;
  percentage: number;
  amount: number;
  icon: React.ReactNode;
  color: string;
  projects: string[];
}

export function CommunityTreasury() {
  const treasuryBalance = 12450; // Total corks in community treasury
  const monthlyGrowth = 15.3; // % growth
  const contributingMembers = 234;

  const allocations: TreasuryAllocation[] = [
    {
      category: 'Culture & Arts',
      percentage: 30,
      amount: 3735,
      icon: <Palette className="w-4 h-4" />,
      color: 'from-purple-500 to-pink-500',
      projects: ['Local artist residencies', 'Community gallery', 'Music festival']
    },
    {
      category: 'Local Events',
      percentage: 25,
      amount: 3113,
      icon: <Calendar className="w-4 h-4" />,
      color: 'from-blue-500 to-cyan-500',
      projects: ['Wine tastings', 'Harvest celebrations', 'Community dinners']
    },
    {
      category: 'Real Estate',
      percentage: 20,
      amount: 2490,
      icon: <Building2 className="w-4 h-4" />,
      color: 'from-emerald-500 to-green-500',
      projects: ['Community wine cellar', 'Co-working space', 'Event venue']
    },
    {
      category: 'Business Network',
      percentage: 15,
      amount: 1868,
      icon: <Users className="w-4 h-4" />,
      color: 'from-amber-500 to-orange-500',
      projects: ['Local producer grants', 'Startup incubator', 'Trade partnerships']
    },
    {
      category: 'Resource Pool',
      percentage: 10,
      amount: 1245,
      icon: <Coins className="w-4 h-4" />,
      color: 'from-rose-500 to-red-500',
      projects: ['Emergency fund', 'Equipment sharing', 'Bulk purchasing']
    }
  ];

  return (
    <div className="space-y-4">
      {/* Treasury Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-xs">Community Treasury</span>
              </div>
              <h2 className="text-3xl text-white mb-1">{treasuryBalance.toLocaleString()} Corks</h2>
              <p className="text-purple-100 text-sm">Fueling community development</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-300 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+{monthlyGrowth}%</span>
              </div>
              <p className="text-xs text-purple-200">this month</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-white" />
                <span className="text-xs text-purple-100">Contributors</span>
              </div>
              <div className="text-xl text-white">{contributingMembers}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Coins className="w-4 h-4 text-white" />
                <span className="text-xs text-purple-100">From Purchases</span>
              </div>
              <div className="text-xl text-white">5% Fee</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h3 className="text-gray-900 mb-3 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          How Treasury Works
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs text-purple-600 font-medium mt-0.5">1</div>
            <div>
              <p className="text-sm text-gray-900 mb-0.5">Every Purchase Contributes</p>
              <p className="text-xs text-gray-500">5% of $CORK tokens from each bottle sale go to community treasury</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs text-purple-600 font-medium mt-0.5">2</div>
            <div>
              <p className="text-sm text-gray-900 mb-0.5">Community Votes with $CORK</p>
              <p className="text-xs text-gray-500">CORK holders vote on allocation across culture, events, real estate, and more</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs text-purple-600 font-medium mt-0.5">3</div>
            <div>
              <p className="text-sm text-gray-900 mb-0.5">Resources Deploy Locally</p>
              <p className="text-xs text-gray-500">Funds stay in Cork Collective, developing wine community infrastructure</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
            <p className="text-xs text-amber-700">
              <span className="font-medium">💡 $CORK vs $URBAN:</span> CORK tokens stay in this community. Want to participate in other villages? Swap CORK → URBAN (3% fee supports platform).
            </p>
          </div>
        </div>
      </div>

      {/* Treasury Allocations */}
      <div className="space-y-3">
        <h3 className="text-gray-900 px-1">Fund Allocation</h3>
        {allocations.map((allocation) => (
          <div key={allocation.category} className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${allocation.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
                  {allocation.icon}
                </div>
                <div>
                  <h4 className="text-sm text-gray-900">{allocation.category}</h4>
                  <p className="text-xs text-gray-500">{allocation.amount.toLocaleString()} Corks</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg text-gray-900">{allocation.percentage}%</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${allocation.color} rounded-full transition-all duration-700`}
                  style={{ width: `${allocation.percentage}%` }}
                />
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-1.5">
              <p className="text-xs text-gray-500 mb-1.5">Active Projects:</p>
              {allocation.projects.map((project, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>{project}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Impact Stats */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
          </div>
          Community Impact
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl text-gray-900 mb-1">12</div>
            <div className="text-xs text-gray-600">Projects Funded</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl text-gray-900 mb-1">€45K</div>
            <div className="text-xs text-gray-600">Local Investment</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl text-gray-900 mb-1">34</div>
            <div className="text-xs text-gray-600">Local Businesses</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl text-gray-900 mb-1">8</div>
            <div className="text-xs text-gray-600">Events This Month</div>
          </div>
        </div>
      </div>
    </div>
  );
}