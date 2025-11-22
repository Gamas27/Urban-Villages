import { Lock, Check } from 'lucide-react';

interface Tier {
  id: string;
  name: string;
  icon: string;
  minCorks: number;
  benefits: string[];
  color: string;
  current?: boolean;
}

interface TierCardProps {
  tier: Tier;
  isUnlocked: boolean;
  isCurrent?: boolean;
  userCorks: number;
}

export function TierCard({ tier, isUnlocked, isCurrent, userCorks }: TierCardProps) {
  return (
    <div
      className={`relative rounded-2xl p-6 transition-all duration-300 ${
        isCurrent
          ? 'bg-gradient-to-br ' + tier.color + ' text-white shadow-2xl scale-105 ring-4 ring-white'
          : isUnlocked
          ? 'bg-white border-2 border-gray-200 shadow-md hover:shadow-lg'
          : 'bg-gray-50 border-2 border-gray-200 opacity-75'
      }`}
    >
      {isCurrent && (
        <div className="absolute -top-3 -right-3 bg-amber-400 text-gray-900 px-4 py-1 rounded-full text-sm shadow-lg">
          Current Tier
        </div>
      )}

      <div className="text-center mb-4">
        <div className="text-5xl mb-3">{tier.icon}</div>
        <h4 className={`text-xl mb-1 ${isCurrent ? 'text-white' : 'text-gray-900'}`}>
          {tier.name}
        </h4>
        <p className={`text-sm ${isCurrent ? 'text-white/90' : 'text-gray-600'}`}>
          {tier.minCorks} Corks {!isUnlocked && `(${tier.minCorks - userCorks} needed)`}
        </p>
      </div>

      <div className="space-y-2">
        {tier.benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-2">
            {isUnlocked ? (
              <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isCurrent ? 'text-white' : 'text-green-600'}`} />
            ) : (
              <Lock className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-400" />
            )}
            <span className={`text-sm ${isCurrent ? 'text-white/95' : isUnlocked ? 'text-gray-700' : 'text-gray-500'}`}>
              {benefit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
