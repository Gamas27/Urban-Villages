import { X, Camera, CheckCircle, AlertCircle, Gift } from 'lucide-react';
import { useState, useEffect } from 'react';

interface QRScannerProps {
  onClose: () => void;
}

type ScanState = 'scanning' | 'owned' | 'claimable' | 'other-owner';

export function QRScanner({ onClose }: QRScannerProps) {
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [scannedBottle] = useState({
    name: 'Sunset Orange 2023',
    image: '🍊',
    vintage: 2023,
    region: 'Douro Valley, Portugal',
    bottleNumber: 127,
    nftId: 'sui:0x123abc...def789',
    producer: 'Cork Collective',
    grapeVariety: 'Indigenous Portuguese',
    alcoholContent: '12.5%',
    bottlingDate: '2024-03-15',
    owner: 'you', // 'you' | 'unclaimed' | 'other'
  });

  // Simulate QR scan after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const states: ScanState[] = ['owned', 'claimable', 'other-owner'];
      const randomState = states[Math.floor(Math.random() * states.length)];
      setScanState(randomState);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="max-w-md w-full">
        {scanState === 'scanning' ? (
          // Scanning Animation
          <div className="text-center">
            <div className="relative w-64 h-64 mx-auto mb-6">
              {/* QR Scanner Frame */}
              <div className="absolute inset-0 border-4 border-white/30 rounded-3xl"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-purple-500 rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-purple-500 rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-purple-500 rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-purple-500 rounded-br-3xl"></div>

              {/* Scanning Line */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-16 h-16 text-white/50" />
              </div>
            </div>
            <h3 className="text-2xl text-white mb-2">Scanning QR Code...</h3>
            <p className="text-white/70">Position the QR code within the frame</p>
          </div>
        ) : (
          // Scan Results
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* Result Header */}
            {scanState === 'owned' && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl">This is YOUR Bottle!</h3>
                    <p className="text-green-100 text-sm">Verified on SUI Blockchain</p>
                  </div>
                </div>
              </div>
            )}

            {scanState === 'claimable' && (
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Gift className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl">Claim This NFT!</h3>
                    <p className="text-amber-100 text-sm">In-store purchase detected</p>
                  </div>
                </div>
              </div>
            )}

            {scanState === 'other-owner' && (
              <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <AlertCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl">Already Owned</h3>
                    <p className="text-rose-100 text-sm">This bottle belongs to another user</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottle Details */}
            <div className="p-6 space-y-4">
              {/* Bottle Preview */}
              <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-2xl p-6 text-center border border-purple-100">
                <div className="text-6xl mb-3">{scannedBottle.image}</div>
                <h4 className="text-gray-900 mb-1">{scannedBottle.name}</h4>
                <p className="text-sm text-gray-600">{scannedBottle.vintage} • {scannedBottle.region}</p>
                <p className="text-xs text-gray-500 mt-2">Bottle #{scannedBottle.bottleNumber}/500</p>
              </div>

              {/* Provenance Details */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <h5 className="text-sm text-gray-900 flex items-center gap-2">
                  <span className="text-purple-600">⛓️</span>
                  Blockchain Provenance
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Producer:</span>
                    <span className="text-gray-900">{scannedBottle.producer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grape Variety:</span>
                    <span className="text-gray-900">{scannedBottle.grapeVariety}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alcohol:</span>
                    <span className="text-gray-900">{scannedBottle.alcoholContent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bottled:</span>
                    <span className="text-gray-900">{scannedBottle.bottlingDate}</span>
                  </div>
                </div>
              </div>

              {/* NFT Info */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <h5 className="text-sm text-purple-900 mb-2">NFT Details</h5>
                <p className="text-xs text-purple-700 font-mono break-all mb-2">
                  {scannedBottle.nftId}
                </p>
                <a
                  href={`https://suiscan.xyz/testnet/object/${scannedBottle.nftId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <span>View on SUI Explorer →</span>
                </a>
              </div>

              {/* Action Buttons */}
              {scanState === 'owned' && (
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all active:scale-95 shadow-lg"
                >
                  Verified ✓
                </button>
              )}

              {scanState === 'claimable' && (
                <div className="space-y-2">
                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all active:scale-95 shadow-lg"
                  >
                    Claim NFT to My Account
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    This will add the bottle to your collection
                  </p>
                </div>
              )}

              {scanState === 'other-owner' && (
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <p className="text-sm text-red-800">
                    ⚠️ This bottle is already registered to another account. Contact support if you believe this is an error.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}