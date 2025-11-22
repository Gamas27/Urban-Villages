import React from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, X } from 'lucide-react';

interface Order {
  id: string;
  bottle: {
    id: number;
    name: string;
    vintage: number;
    image: string;
  };
  status: 'minting' | 'processing' | 'shipped' | 'delivered' | 'verified';
  nftId: string;
  orderDate: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  qrCode: string;
}

interface OrderTrackingProps {
  order: Order;
  onVerifyQR: () => void;
  onClose: () => void;
}

export function OrderTracking({ order, onVerifyQR, onClose }: OrderTrackingProps) {
  const steps = [
    {
      id: 'minting',
      label: 'NFT Minted',
      icon: CheckCircle,
      description: 'Blockchain verified',
      color: 'text-purple-600'
    },
    {
      id: 'processing',
      label: 'Processing',
      icon: Clock,
      description: 'Preparing your order',
      color: 'text-blue-600'
    },
    {
      id: 'shipped',
      label: 'Shipped',
      icon: Truck,
      description: 'On the way',
      color: 'text-orange-600'
    },
    {
      id: 'delivered',
      label: 'Delivered',
      icon: MapPin,
      description: 'Package arrived',
      color: 'text-green-600'
    },
    {
      id: 'verified',
      label: 'Verified',
      icon: Package,
      description: 'QR scanned',
      color: 'text-emerald-600'
    }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all active:scale-95"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-rose-600 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white text-xl mb-1">Order Tracking</h3>
              <p className="text-purple-100 text-sm">Order #{order.id.slice(0, 8)}</p>
            </div>
            <div className="text-6xl">{order.bottle.image}</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <p className="text-white text-sm mb-1">{order.bottle.name}</p>
            <p className="text-purple-100 text-xs">Vintage {order.bottle.vintage}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-6">
          <div className="space-y-6">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.id} className="relative">
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div 
                      className={`absolute left-6 top-12 w-0.5 h-10 ${
                        index < currentStepIndex ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isCompleted 
                        ? 'bg-purple-600 shadow-lg shadow-purple-500/30' 
                        : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        isCompleted ? 'text-white' : 'text-gray-400'
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <h4 className={`text-sm font-medium mb-1 ${
                        isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </h4>
                      <p className={`text-xs ${
                        isCompleted ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>

                      {/* Additional Info */}
                      {isCurrent && step.id === 'minting' && (
                        <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                          <p className="text-xs text-purple-700 mb-1">NFT Object ID</p>
                          <p className="text-xs text-purple-900 font-mono break-all">{order.nftId}</p>
                          <a 
                            href={`https://suiexplorer.com/object/${order.nftId}?network=testnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-purple-600 hover:text-purple-700 mt-2 inline-block"
                          >
                            View on SUI Explorer →
                          </a>
                        </div>
                      )}

                      {isCurrent && step.id === 'processing' && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-xs text-blue-700">
                            Your bottle is being prepared for shipment
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Est. ship date: {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {isCurrent && step.id === 'shipped' && order.trackingNumber && (
                        <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                          <p className="text-xs text-orange-700 mb-2">Tracking Number</p>
                          <p className="text-xs text-orange-900 font-mono">{order.trackingNumber}</p>
                          <a 
                            href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.trackingNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-orange-600 hover:text-orange-700 mt-2 inline-block"
                          >
                            Track Package →
                          </a>
                        </div>
                      )}

                      {isCurrent && step.id === 'delivered' && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
                          <p className="text-xs text-green-700 mb-3">
                            📦 Your bottle has arrived! Scan the QR code on the bottle to verify it's yours.
                          </p>
                          <button
                            onClick={onVerifyQR}
                            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-rose-600 text-white rounded-lg hover:from-purple-700 hover:to-rose-700 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm shadow-lg shadow-purple-500/20"
                          >
                            <Package className="w-4 h-4" />
                            Scan QR to Verify
                          </button>
                        </div>
                      )}

                      {step.id === 'verified' && isCompleted && (
                        <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                          <p className="text-xs text-emerald-700">
                            ✓ Bottle verified! Now in your collection.
                          </p>
                          <p className="text-xs text-emerald-600 mt-1">
                            Verified: {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    {isCurrent && (
                      <div className="flex-shrink-0">
                        <div className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          Current
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">Order Date</p>
                <p className="text-sm text-gray-900">{new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Est. Delivery</p>
                <p className="text-sm text-gray-900">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}