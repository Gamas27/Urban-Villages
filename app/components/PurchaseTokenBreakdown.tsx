import React from 'react';
import { Coins, Crown, ArrowRight, Users, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface PurchaseTokenBreakdownProps {
  bottlePrice: number;
  corkAmount: number;
}

export function PurchaseTokenBreakdown({ bottlePrice, corkAmount }: PurchaseTokenBreakdownProps) {
  const treasuryFee = Math.round(corkAmount * 0.05); // 5% to treasury
  const userReceives = corkAmount - treasuryFee;
  const urbanEquivalent = (corkAmount / 5).toFixed(1);

  return (
    <div className="space-y-3">
      {/* Main Earning Card */}
      <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-orange-100">You Earn</p>
                <p className="text-xl text-white font-semibold">+{userReceives} $CORK</p>
              </div>
            </div>
            <div className="text-4xl">🎉</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <p className="text-xs text-white/80 mb-2">Token Breakdown:</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/80">Base reward</span>
                <span className="text-white font-medium">{corkAmount} CORK</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/80">Cork treasury (5%)</span>
                <span className="text-white font-medium">-{treasuryFee} CORK</span>
              </div>
              <div className="h-px bg-white/20 my-1"></div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white font-medium">Your balance</span>
                <span className="text-white font-semibold">+{userReceives} CORK</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <h4 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          How Your Tokens Flow
        </h4>

        <div className="space-y-3">
          {/* User Tokens */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
              <Coins className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{userReceives} CORK to you</p>
              <p className="text-xs text-gray-500">Use for votes & rewards</p>
            </div>
            <div className="text-xs text-green-600 font-medium">95%</div>
          </motion.div>

          {/* Community Treasury */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{treasuryFee} CORK to treasury</p>
              <p className="text-xs text-gray-500">Funds wine community</p>
            </div>
            <div className="text-xs text-purple-600 font-medium">5%</div>
          </motion.div>
        </div>
      </div>

      {/* Optional: Convert to URBAN */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Crown className="w-4 h-4 text-purple-600" />
          <h4 className="text-sm text-gray-900">Need $URBAN instead?</h4>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">{userReceives} CORK</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-purple-700 font-medium">~{urbanEquivalent} URBAN</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500">
          You can swap CORK → URBAN anytime to use tokens across other villages
        </p>
      </div>

      {/* Info */}
      <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
        <p className="text-xs text-blue-700">
          <span className="font-medium">💡 Pro tip:</span> Keep CORK to support local wine community, or swap to URBAN for cross-village benefits
        </p>
      </div>
    </div>
  );
}
