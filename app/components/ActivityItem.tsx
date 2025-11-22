import { ShoppingBag, Gift, UserPlus, TrendingUp, Calendar } from 'lucide-react';

interface Activity {
  type: 'purchase' | 'reward' | 'bonus' | 'event';
  description: string;
  corks: number;
  date: string;
}

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const getIcon = () => {
    switch (activity.type) {
      case 'purchase':
        return <ShoppingBag className="w-5 h-5" />;
      case 'reward':
        return <Gift className="w-5 h-5" />;
      case 'bonus':
        return <UserPlus className="w-5 h-5" />;
      case 'event':
        return <Calendar className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getColor = () => {
    switch (activity.type) {
      case 'purchase':
        return 'bg-blue-100 text-blue-700';
      case 'reward':
        return 'bg-rose-100 text-rose-700';
      case 'bonus':
        return 'bg-green-100 text-green-700';
      case 'event':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const isPositive = activity.corks > 0;

  return (
    <div className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColor()}`}>
          {getIcon()}
        </div>
        <div>
          <p className="text-gray-900">{activity.description}</p>
          <p className="text-sm text-gray-500">{activity.date}</p>
        </div>
      </div>

      <div
        className={`text-lg ${
          isPositive ? 'text-green-600' : 'text-rose-600'
        }`}
      >
        {isPositive ? '+' : ''}
        {activity.corks} Corks
      </div>
    </div>
  );
}
