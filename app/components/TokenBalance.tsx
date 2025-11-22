import React from 'react';
import { Coins, Crown, TrendingUp, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface TokenBalanceProps {
  corkBalance: number;
  urbanBalance: number;
  compact?: boolean;
  onClick?: () => void;
}

export function TokenBalance({ corkBalance, urbanBalance, compact = false, onClick }: TokenBalanceProps) {
  if (compact) {
    return (
      <button 
        onClick={onClick}
        className="flex items-center gap-2 active:scale-95 transition-transform"
      >
        {/* CORK Token */}
        <div className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg shadow-amber-500/30 flex items-center gap-1.5">
          <Coins className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-sm font-semibold">{corkBalance}</span>
        </div>
        
        {/* URBAN Token */}
        <div className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/30 flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-sm font-semibold">{urbanBalance}</span>
        </div>
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {/* CORK Token Card */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 rounded-2xl p-5 relative overflow-hidden cursor-pointer"
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Coins className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs text-orange-100">Community Token</div>
                  <div className="text-sm text-white font-medium">$CORK</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl text-white font-semibold">{corkBalance.toLocaleString()}</div>
              <div className="text-xs text-orange-100">Cork Collective</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-white/80 mt-3 pt-3 border-t border-white/20">
            <Info className="w-3.5 h-3.5" />
            <span>Earn by purchasing wine • Spend on rewards</span>
          </div>
        </div>
      </motion.div>

      {/* URBAN Token Card */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-purple-500 via-violet-600 to-pink-600 rounded-2xl p-5 relative overflow-hidden cursor-pointer"
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs text-purple-100">Governance Token</div>
                  <div className="text-sm text-white font-medium">$URBAN</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl text-white font-semibold">{urbanBalance.toLocaleString()}</div>
              <div className="text-xs text-purple-100">Urban Villages</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-white/80 mt-3 pt-3 border-t border-white/20">
            <Info className="w-3.5 h-3.5" />
            <span>Vote on platform • Stake for rewards • Swap between villages</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-3 border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs text-gray-500">CORK Value</span>
          </div>
          <div className="text-sm text-gray-900">€{(corkBalance * 0.1).toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-xs text-gray-500">URBAN Value</span>
          </div>
          <div className="text-sm text-gray-900">€{(urbanBalance * 0.5).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
