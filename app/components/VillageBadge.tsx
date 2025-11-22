import React from 'react';
import { Wine } from 'lucide-react';

export function VillageBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1.5 rounded-full border border-purple-200">
      <div className="w-5 h-5 bg-gradient-to-br from-rose-500 to-purple-600 rounded-lg flex items-center justify-center">
        <Wine className="w-3 h-3 text-white" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-purple-900">Cork Collective</span>
        <span className="text-xs text-purple-600">•</span>
        <span className="text-xs text-purple-600">Urban Village #1</span>
      </div>
    </div>
  );
}
