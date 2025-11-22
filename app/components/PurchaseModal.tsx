import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Sparkles, Shield, QrCode, CheckCircle } from 'lucide-react';

interface PurchaseModalProps {
  wine: any;
  village: string;
  onClose: () => void;
}

export function PurchaseModal({ wine, village, onClose }: PurchaseModalProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

  const handlePurchase = async () => {
    setIsPurchasing(true);
    // Simulate transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsPurchasing(false);
    setIsPurchased(true);
  };

  const treasuryAmount = wine.price * 0.05;
  const bottleNumber = Math.floor(Math.random() * wine.total) + 1;

  if (isPurchased) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Purchase Successful!</h3>
              <p className="opacity-70">Your NFT has been minted</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="font-semibold">{wine.name}</p>
              <p className="text-sm opacity-60">Bottle #{bottleNumber}</p>
              <Badge>NFT Minted on SUI</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-60">CORK Earned</span>
                <span className="font-semibold">+{wine.corkReward} CORK</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-60">Treasury Contribution</span>
                <span className="font-semibold">€{treasuryAmount.toFixed(2)}</span>
              </div>
            </div>
            <Button onClick={onClose} className="w-full">
              View in Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Bottle NFT</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Wine Info */}
          <div className="flex gap-4">
            <img
              src={wine.image}
              alt={wine.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <h4 className="font-semibold">{wine.name}</h4>
              <p className="text-sm opacity-70">{wine.description}</p>
              <Badge className="mt-2">{village} Village</Badge>
            </div>
          </div>

          <Separator />

          {/* Transaction Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold">Transaction Breakdown</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Bottle Price</span>
                <span className="font-semibold">€{wine.price}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-amber-600">
                  <Sparkles className="w-4 h-4" />
                  CORK Reward
                </span>
                <span className="font-semibold text-amber-600">+{wine.corkReward}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 opacity-70">
                  <Shield className="w-4 h-4" />
                  Village Treasury (5%)
                </span>
                <span>€{treasuryAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* NFT Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
            <p className="text-sm font-semibold">NFT Includes:</p>
            <ul className="text-xs space-y-1 opacity-70">
              <li>• Unique bottle number</li>
              <li>• Provenance data (harvest, bottling, vineyard)</li>
              <li>• Winemaker signature</li>
              <li>• QR code for verification</li>
              <li>• Stored on SUI blockchain</li>
              <li>• Images on Walrus storage</li>
            </ul>
          </div>

          {/* Action */}
          <Button
            onClick={handlePurchase}
            disabled={isPurchasing}
            className="w-full"
            size="lg"
          >
            {isPurchasing ? 'Minting NFT...' : `Purchase for €${wine.price}`}
          </Button>

          <p className="text-xs text-center opacity-60">
            Transaction will be processed on SUI testnet
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
