import React, { useState } from 'react';
import { Coins, Crown, ArrowRight, Info, Sparkles, TrendingUp, Users, Vote, Lock, Repeat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TokenEconomicsProps {
  corkBalance: number;
  urbanBalance: number;
}

export function TokenEconomics({ corkBalance, urbanBalance }: TokenEconomicsProps) {
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapAmount, setSwapAmount] = useState('');
  const [swapDirection, setSwapDirection] = useState<'cork-to-urban' | 'urban-to-cork'>('cork-to-urban');

  const swapRate = swapDirection === 'cork-to-urban' ? 5 : 0.18; // 5 CORK = 1 URBAN, or 1 URBAN = ~5.5 CORK (with 0.5 CORK fee)
  const swapFee = 0.03; // 3% swap fee

  const calculateSwapOutput = () => {
    const input = parseFloat(swapAmount) || 0;
    const afterFee = input * (1 - swapFee);
    if (swapDirection === 'cork-to-urban') {
      return (afterFee / 5).toFixed(2);
    } else {
      return (afterFee * 5).toFixed(2);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dual Token System Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-xs">Dual Token System</span>
          </div>
          
          <h2 className="text-2xl text-white mb-2">Two Tokens, One Ecosystem</h2>
          <p className="text-purple-100 text-sm">
            Community sovereignty meets platform interoperability
          </p>
        </div>
      </div>

      {/* Token Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* CORK Token */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900">$CORK</h3>
              <p className="text-xs text-gray-500">Community Token</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Coins className="w-3 h-3 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Earn from purchases</p>
                <p className="text-xs text-gray-500">50 CORK per bottle</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Vote className="w-3 h-3 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Vote on Cork initiatives</p>
                <p className="text-xs text-gray-500">Wine releases, events, treasury</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingUp className="w-3 h-3 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Redeem for rewards</p>
                <p className="text-xs text-gray-500">Exclusive wine perks</p>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-xs text-orange-700 font-medium">Local Value</span>
              </div>
              <p className="text-xs text-orange-600">
                CORK stays in Cork Collective, funding wine community development
              </p>
            </div>
          </div>
        </div>

        {/* URBAN Token */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900">$URBAN</h3>
              <p className="text-xs text-gray-500">Governance Token</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users className="w-3 h-3 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Platform governance</p>
                <p className="text-xs text-gray-500">Vote on Urban Villages features</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="w-3 h-3 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Stake for rewards</p>
                <p className="text-xs text-gray-500">Earn from ALL village activity</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Repeat className="w-3 h-3 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Cross-village currency</p>
                <p className="text-xs text-gray-500">Swap between community tokens</p>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-xs text-purple-700 font-medium">Global Value</span>
              </div>
              <p className="text-xs text-purple-600">
                URBAN connects all villages, enabling platform-wide benefits
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Token Flow Diagram */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          How Tokens Flow
        </h3>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-gray-900">Purchase wine → Earn $CORK</p>
              </div>
              <p className="text-xs text-gray-500">
                50 CORK earned • 2.5 CORK (5%) goes to Cork treasury
              </p>
              <div className="mt-2 bg-orange-50 rounded-lg p-2 text-xs text-orange-700">
                → Funds Cork Collective wine projects
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-gray-300" />
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 mb-1">Option A: Use $CORK locally</p>
              <p className="text-xs text-gray-500">
                Vote on wine releases • Redeem Cork rewards • Support wine culture
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-xs text-gray-400">OR</div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 mb-1">Option B: Swap to $URBAN</p>
              <p className="text-xs text-gray-500">
                Convert CORK → URBAN (3% fee goes to main treasury)
              </p>
              <div className="mt-2 bg-purple-50 rounded-lg p-2 text-xs text-purple-700">
                → Use URBAN across all villages (Real Estate, Events, etc.)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Swap Interface */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
          <Repeat className="w-5 h-5 text-purple-600" />
          Token Swap
        </h3>

        {/* Swap Direction Toggle */}
        <div className="bg-white rounded-xl p-1 flex gap-1 mb-4">
          <button
            onClick={() => setSwapDirection('cork-to-urban')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm transition-all ${
              swapDirection === 'cork-to-urban'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            CORK → URBAN
          </button>
          <button
            onClick={() => setSwapDirection('urban-to-cork')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm transition-all ${
              swapDirection === 'urban-to-cork'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            URBAN → CORK
          </button>
        </div>

        {/* From Token */}
        <div className="bg-white rounded-xl p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">From</span>
            <span className="text-xs text-gray-500">
              Balance: {swapDirection === 'cork-to-urban' ? corkBalance : urbanBalance}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${
              swapDirection === 'cork-to-urban' 
                ? 'from-amber-400 to-orange-500' 
                : 'from-purple-500 to-pink-500'
            } rounded-lg flex items-center justify-center`}>
              {swapDirection === 'cork-to-urban' ? (
                <Coins className="w-5 h-5 text-white" />
              ) : (
                <Crown className="w-5 h-5 text-white" />
              )}
            </div>
            <input
              type="number"
              value={swapAmount}
              onChange={(e) => setSwapAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-transparent text-xl text-gray-900 outline-none"
            />
            <button
              onClick={() => setSwapAmount(String(swapDirection === 'cork-to-urban' ? corkBalance : urbanBalance))}
              className="text-xs text-purple-600 font-medium"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={() => setSwapDirection(swapDirection === 'cork-to-urban' ? 'urban-to-cork' : 'cork-to-urban')}
            className="w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-purple-400 transition-colors active:scale-95"
          >
            <Repeat className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* To Token */}
        <div className="bg-white rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">To</span>
            <span className="text-xs text-gray-500">
              Balance: {swapDirection === 'urban-to-cork' ? corkBalance : urbanBalance}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${
              swapDirection === 'urban-to-cork' 
                ? 'from-amber-400 to-orange-500' 
                : 'from-purple-500 to-pink-500'
            } rounded-lg flex items-center justify-center`}>
              {swapDirection === 'urban-to-cork' ? (
                <Coins className="w-5 h-5 text-white" />
              ) : (
                <Crown className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1 text-xl text-gray-900">
              {swapAmount ? calculateSwapOutput() : '0.00'}
            </div>
          </div>
        </div>

        {/* Swap Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Exchange Rate</span>
            <span>
              {swapDirection === 'cork-to-urban' ? '5 CORK = 1 URBAN' : '1 URBAN = 5 CORK'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Swap Fee (3%)</span>
            <span>
              {swapAmount ? (parseFloat(swapAmount) * swapFee).toFixed(2) : '0.00'} {swapDirection === 'cork-to-urban' ? 'CORK' : 'URBAN'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Fee Destination</span>
            <span className="text-purple-600">Urban Villages Treasury</span>
          </div>
        </div>

        <button
          disabled={!swapAmount || parseFloat(swapAmount) <= 0}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all active:scale-95"
        >
          Swap Tokens
        </button>

        <div className="mt-3 bg-purple-50 rounded-lg p-3 border border-purple-100">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-purple-700">
              Swap fees fund the Urban Villages main treasury, supporting cross-village infrastructure and new community launches
            </p>
          </div>
        </div>
      </div>

      {/* Economic Model Benefits */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
        <h3 className="text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Why Dual Tokens?
        </h3>
        
        <div className="space-y-3">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
            <p className="text-sm text-gray-900 mb-1">✅ Community Sovereignty</p>
            <p className="text-xs text-gray-600">
              Cork Collective controls its own economy, treasury, and development
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
            <p className="text-sm text-gray-900 mb-1">✅ Value Protection</p>
            <p className="text-xs text-gray-600">
              CORK tokens stay local, preventing capital flight to other villages
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
            <p className="text-sm text-gray-900 mb-1">✅ Cross-Village Access</p>
            <p className="text-xs text-gray-600">
              URBAN enables participation in other villages (Real Estate, Events, etc.)
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
            <p className="text-sm text-gray-900 mb-1">✅ Platform Growth</p>
            <p className="text-xs text-gray-600">
              Swap fees fund new village launches and shared infrastructure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
