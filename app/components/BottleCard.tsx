import { Sparkles, Plus } from 'lucide-react';

interface Bottle {
  id: number;
  name: string;
  vintage: number;
  region: string;
  price: number;
  corks: number;
  image: string;
  type: string;
  description: string;
}

interface BottleCardProps {
  bottle: Bottle;
  onSelect: (bottle: Bottle) => void;
}

export function BottleCard({ bottle, onSelect }: BottleCardProps) {
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
      onClick={() => onSelect(bottle)}
    >
      <div className="h-64 bg-gradient-to-br from-rose-100 to-purple-100 flex items-center justify-center text-8xl">
        {bottle.image}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="text-lg text-gray-900">{bottle.name}</h4>
            <p className="text-sm text-gray-600">{bottle.vintage} • {bottle.region}</p>
          </div>
          <span className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
            {bottle.type}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{bottle.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl text-gray-900">€{bottle.price}</div>
            <div className="flex items-center gap-1 text-sm text-amber-600">
              <Sparkles className="w-4 h-4" />
              <span>Earn {bottle.corks} Corks</span>
            </div>
          </div>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
            <Plus className="w-4 h-4" />
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
