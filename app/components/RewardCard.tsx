import { Lock, Sparkles } from 'lucide-react';

interface Reward {
  id: number;
  name: string;
  description: string;
  corks: number;
  image: string;
  available: boolean;
}

interface RewardCardProps {
  reward: Reward;
  userCorks: number;
}

export function RewardCard({ reward, userCorks }: RewardCardProps) {
  const canAfford = userCorks >= reward.corks;
  const isAvailable = reward.available;

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 ${
        canAfford && isAvailable
          ? 'hover:shadow-xl hover:scale-105 cursor-pointer'
          : 'opacity-75'
      }`}
    >
      <div
        className={`h-32 flex items-center justify-center text-6xl ${
          canAfford && isAvailable
            ? 'bg-gradient-to-br from-rose-100 to-purple-100'
            : 'bg-gray-100'
        }`}
      >
        {reward.image}
      </div>

      <div className="p-4">
        <h4 className="text-gray-900 mb-1">{reward.name}</h4>
        <p className="text-sm text-gray-600 mb-3">{reward.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className={`${canAfford ? 'text-gray-900' : 'text-gray-500'}`}>
              {reward.corks} Corks
            </span>
          </div>

          {!isAvailable ? (
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Lock className="w-4 h-4" />
              <span>Locked</span>
            </div>
          ) : canAfford ? (
            <button className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition-colors">
              Redeem
            </button>
          ) : (
            <span className="text-sm text-gray-400">
              Need {reward.corks - userCorks}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
