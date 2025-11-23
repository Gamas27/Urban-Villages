'use client';

import { X, TrendingUp, Users } from 'lucide-react';
import { VILLAGES } from './data/villages';

interface VillageSwitchProps {
  currentVillage: string;
  onSelect: (villageId: string) => void;
  onClose: () => void;
}

export function VillageSwitch({ currentVillage, onSelect, onClose }: VillageSwitchProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white w-full md:max-w-2xl rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-y-auto pb-safe">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-semibold text-gray-900">Switch Village</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Villages Grid */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">
            Explore different villages and their communities. You can follow and interact with any village!
          </p>

          {VILLAGES.map((village) => {
            const isCurrent = village.id === currentVillage;

            return (
              <button
                key={village.id}
                onClick={() => onSelect(village.id)}
                className={`w-full bg-white rounded-2xl p-6 text-left hover:shadow-lg transition-all border-2 ${
                  isCurrent
                    ? 'border-purple-500 shadow-md'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Village Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${village.gradient} rounded-2xl flex items-center justify-center text-3xl flex-shrink-0`}>
                    {village.emoji}
                  </div>

                  {/* Village Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl">{village.name}</h3>
                      {isCurrent && (
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {village.country} • {village.wineType}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{village.members}</span>
                        <span className="text-gray-500">members</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">€{village.treasury.toLocaleString()}</span>
                        <span className="text-gray-500">treasury</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Footer */}
        <div className="p-4 bg-gradient-to-r from-orange-50 to-purple-50 border-t border-gray-200">
          <p className="text-sm text-gray-700">
            💡 <strong>Cross-Village Activity:</strong> You can view, post, and interact across all villages while remaining a member of your home village.
          </p>
        </div>
      </div>
    </div>
  );
}
