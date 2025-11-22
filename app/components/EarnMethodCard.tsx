import { LucideIcon } from 'lucide-react';

interface EarnMethod {
  icon: LucideIcon;
  title: string;
  description: string;
  bonus: string;
  color: string;
}

interface EarnMethodCardProps {
  method: EarnMethod;
}

export function EarnMethodCard({ method }: EarnMethodCardProps) {
  const Icon = method.icon;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${method.color}`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <h4 className="text-xl mb-2 text-gray-900">{method.title}</h4>
          <p className="text-gray-700 mb-3">{method.description}</p>
          <div className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-lg text-sm">
            💡 {method.bonus}
          </div>
        </div>
      </div>
    </div>
  );
}
