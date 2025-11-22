import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart, Sparkles, Info } from 'lucide-react';
import { PurchaseModal } from './PurchaseModal';

interface ShopProps {
  village: string;
}

const VILLAGE_WINES = {
  lisbon: [
    {
      id: 'lisbon-orange',
      name: 'Orange Wine 2023',
      description: 'Natural orange wine from Alentejo region',
      price: 45,
      available: 23,
      total: 50,
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
      corkReward: 100,
    },
    {
      id: 'lisbon-white',
      name: 'Wild Ferment White 2022',
      description: 'Indigenous yeast fermentation',
      price: 38,
      available: 12,
      total: 30,
      image: 'https://images.unsplash.com/photo-1474722883778-ab3972a8e6a1?w=800&q=80',
      corkReward: 85,
    },
  ],
  porto: [
    {
      id: 'porto-reserve',
      name: 'Port Wine Reserve',
      description: 'Aged 10 years in oak barrels',
      price: 65,
      available: 18,
      total: 30,
      image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80',
      corkReward: 130,
    },
    {
      id: 'porto-ruby',
      name: 'Ruby Port',
      description: 'Young and fruity port wine',
      price: 35,
      available: 25,
      total: 40,
      image: 'https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?w=800&q=80',
      corkReward: 75,
    },
  ],
  berlin: [
    {
      id: 'berlin-riesling',
      name: 'Riesling 2023',
      description: 'Dry Riesling from Mosel Valley',
      price: 42,
      available: 15,
      total: 25,
      image: 'https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?w=800&q=80',
      corkReward: 95,
    },
  ],
};

export function Shop({ village }: ShopProps) {
  const [selectedWine, setSelectedWine] = useState<any>(null);
  const wines = VILLAGE_WINES[village as keyof typeof VILLAGE_WINES] || [];

  return (
    <div className="space-y-6">
      {/* Village Info */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-2">{village.charAt(0).toUpperCase() + village.slice(1)} Village Bottles</h2>
          <p className="opacity-70">Each bottle is a unique NFT with full provenance on SUI blockchain</p>
        </CardContent>
      </Card>

      {/* Wines Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {wines.map((wine) => (
          <Card key={wine.id} className="overflow-hidden">
            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src={wine.image}
                alt={wine.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{wine.name}</CardTitle>
                  <p className="text-sm opacity-70 mt-1">{wine.description}</p>
                </div>
                <Badge variant="secondary">
                  {wine.available}/{wine.total}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pricing */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold">€{wine.price}</p>
                  <p className="text-sm opacity-60">+ {wine.corkReward} CORK</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-60">5% to treasury</p>
                  <p className="text-xs font-semibold text-amber-600">€{(wine.price * 0.05).toFixed(2)}</p>
                </div>
              </div>

              {/* Features */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1">
                <div className="flex items-start gap-2 text-sm">
                  <Info className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">NFT Provenance Includes:</p>
                    <ul className="text-xs opacity-70 mt-1 space-y-0.5">
                      <li>• Bottle number & vintage</li>
                      <li>• Vineyard location & producer</li>
                      <li>• Harvest date & bottling date</li>
                      <li>• QR code for verification</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                className="w-full gap-2"
                size="lg"
                onClick={() => setSelectedWine(wine)}
                disabled={wine.available === 0}
              >
                <ShoppingCart className="w-4 h-4" />
                {wine.available === 0 ? 'Sold Out' : 'Purchase Bottle'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedWine && (
        <PurchaseModal
          wine={selectedWine}
          village={village}
          onClose={() => setSelectedWine(null)}
        />
      )}
    </div>
  );
}
