import React from 'react';
import { TrendingUp, Users, Sparkles, ArrowUpRight } from 'lucide-react';

interface ImpactMetric {
  label: string;
  value: string;
  change: string;
  icon: string;
}

export function CommunityImpact() {
  const metrics: ImpactMetric[] = [
    {
      label: 'Community Fund',
      value: '€45,200',
      change: '+€3,450 this month',
      icon: '💰'
    },
    {
      label: 'Active Projects',
      value: '12',
      change: '3 new this month',
      icon: '🚀'
    },
    {
      label: 'Events Hosted',
      value: '8',
      change: 'Next: Wine tasting 11/25',
      icon: '🎉'
    },
    {
      label: 'Local Businesses',
      value: '34',
      change: 'In the network',
      icon: '🏪'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
          </div>
          Your Community Impact
        </h3>
        <div className="flex items-center gap-1 text-green-600">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Every purchase contributes 5% to the community treasury, funding local development voted on by Cork token holders.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{metric.icon}</span>
              <span className="text-xs text-gray-600">{metric.label}</span>
            </div>
            <div className="text-xl text-gray-900 mb-1">{metric.value}</div>
            <div className="text-xs text-green-600">{metric.change}</div>
          </div>
        ))}
      </div>

      {/* Your Personal Contribution */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-900">Your Contribution</span>
          <div className="flex items-center gap-1 text-green-600">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-2xl text-gray-900">57.5</span>
          <span className="text-sm text-gray-500 mb-1">Corks to treasury</span>
        </div>
        <p className="text-xs text-gray-600">
          From your 23 bottle purchases • You've helped fund 2.3 community projects 🙌
        </p>
      </div>
    </div>
  );
}
