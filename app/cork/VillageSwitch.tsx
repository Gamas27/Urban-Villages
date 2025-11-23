'use client';

import { X, TrendingUp, Users, MapPin, CheckCircle2 } from 'lucide-react';
import { VILLAGES } from './data/villages';

interface VillageSwitchProps {
  currentVillage: string;
  onSelect: (villageId: string) => void;
  onClose: () => void;
}

export function VillageSwitch({ currentVillage, onSelect, onClose }: VillageSwitchProps) {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white w-full md:max-w-2xl rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-y-auto pb-safe shadow-2xl animate-in slide-in-from-bottom-4 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-orange-50 border-b border-gray-200 p-6 flex items-center justify-between rounded-t-3xl z-10 backdrop-blur-sm bg-opacity-95">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Switch Village</h2>
            <p className="text-sm text-gray-600">Choose your community</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-full transition-all hover:scale-110 active:scale-95"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Villages Grid */}
        <div className="p-6 space-y-3">
          {VILLAGES.map((village) => {
            const isCurrent = village.id === currentVillage;

            return (
              <button
                key={village.id}
                onClick={() => onSelect(village.id)}
                className={`w-full group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-200 ${
                  isCurrent
                    ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-400 shadow-lg shadow-purple-200/50 scale-[1.02]'
                    : 'bg-white border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {/* Active indicator glow */}
                {isCurrent && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                )}

                <div className="flex items-start gap-4 relative">
                  {/* Village Icon */}
                  <div className={`relative w-16 h-16 bg-gradient-to-br ${village.gradient} rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg transition-transform duration-200 ${isCurrent ? 'ring-4 ring-purple-300/50 scale-110' : 'group-hover:scale-110'}`}>
                    {village.emoji}
                    {isCurrent && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" fill="white" />
                      </div>
                    )}
                  </div>

                  {/* Village Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`text-xl font-bold ${isCurrent ? 'text-purple-900' : 'text-gray-900'}`}>
                        {village.name}
                      </h3>
                      {isCurrent && (
                        <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className={`w-4 h-4 ${isCurrent ? 'text-purple-600' : 'text-gray-500'}`} />
                      <p className={`text-sm font-medium ${isCurrent ? 'text-purple-700' : 'text-gray-600'}`}>
                        {village.country} • {village.wineType}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6">
                      <div className={`flex items-center gap-2 ${isCurrent ? 'text-purple-800' : 'text-gray-700'}`}>
                        <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-purple-100' : 'bg-gray-100'}`}>
                          <Users className={`w-4 h-4 ${isCurrent ? 'text-purple-600' : 'text-gray-600'}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{village.members}</span>
                          <span className={`text-xs ${isCurrent ? 'text-purple-600' : 'text-gray-500'}`}>members</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 ${isCurrent ? 'text-purple-800' : 'text-gray-700'}`}>
                        <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-purple-100' : 'bg-gray-100'}`}>
                          <TrendingUp className={`w-4 h-4 ${isCurrent ? 'text-purple-600' : 'text-gray-600'}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">€{village.treasury.toLocaleString()}</span>
                          <span className={`text-xs ${isCurrent ? 'text-purple-600' : 'text-gray-500'}`}>treasury</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover effect */}
                {!isCurrent && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-purple-500/5 group-hover:to-purple-500/5 transition-all duration-200 rounded-2xl pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {/* Info Footer */}
        <div className="p-6 bg-gradient-to-r from-orange-50 via-purple-50 to-pink-50 border-t border-gray-200 rounded-b-3xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Cross-Village Activity</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                You can view, post, and interact across all villages while remaining a member of your home village.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
