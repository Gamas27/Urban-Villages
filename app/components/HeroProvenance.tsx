import { QrCode, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

interface HeroProvenanceProps {
  onScanDemo: () => void;
}

export function HeroProvenance({ onScanDemo }: HeroProvenanceProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-rose-900 to-amber-900 rounded-2xl lg:rounded-3xl shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative grid md:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 lg:p-12">
        {/* Left: Message */}
        <div className="flex flex-col justify-center text-white space-y-4 sm:space-y-6">
          <div className="inline-block">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300" />
              <span className="text-xs sm:text-sm">Powered by SUI Blockchain</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-tight">
            Every Bottle,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-300">
              Verified On-Chain
            </span>
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-white/90">
            Scan the QR code on any bottle to instantly verify its authenticity, view complete provenance, and explore its journey from vineyard to glass.
          </p>

          {/* Value Props */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-sm sm:text-base lg:text-lg">100% Authentic • Blockchain Verified</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-sm sm:text-base lg:text-lg">Full Provenance • Vineyard to Glass</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-sm sm:text-base lg:text-lg">NFT Certificate • Own the Story</span>
            </div>
          </div>

          <button
            onClick={onScanDemo}
            className="group w-full md:w-auto px-6 sm:px-8 py-4 sm:py-5 bg-white text-purple-900 rounded-xl sm:rounded-2xl hover:bg-amber-100 transition-all duration-300 active:scale-95 lg:hover:scale-105 shadow-2xl flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg lg:text-xl"
          >
            <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>See Live Demo</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Right: Visual Demo */}
        <div className="flex items-center justify-center mt-4 md:mt-0">
          <div className="relative w-full max-w-xs sm:max-w-sm">
            {/* Bottle Mockup */}
            <div className="relative bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border-2 sm:border-4 border-amber-900">
              {/* Label */}
              <div className="text-center mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg lg:text-xl text-amber-900">Quinta do Montalto</h3>
                <p className="text-xs sm:text-sm text-amber-800">Sunset Orange</p>
                <p className="text-xs text-amber-700">2023</p>
              </div>

              {/* Custom Image Area */}
              <div className="my-4 sm:my-6 bg-white p-3 sm:p-4 rounded-lg shadow-md">
                <div className="w-full h-24 sm:h-32 bg-gradient-to-br from-orange-200 to-rose-200 rounded-lg flex items-center justify-center text-5xl sm:text-6xl">
                  🍊
                </div>
              </div>

              {/* Custom Message */}
              <div className="my-3 sm:my-4 text-center">
                <p className="text-xs sm:text-sm text-amber-900 italic border-t border-b border-amber-300 py-2">
                  "To Sarah, Happy Birthday!"
                </p>
              </div>

              {/* QR Code Area */}
              <div className="text-center pt-3 sm:pt-4 border-t border-amber-300">
                <p className="text-xs text-amber-800 mb-2">Scan for Blockchain Provenance</p>
                <div className="inline-block relative group cursor-pointer" onClick={onScanDemo}>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg border-2 border-amber-900 group-hover:scale-110 active:scale-105 transition-transform">
                    <QrCode className="w-14 h-14 sm:w-16 sm:h-16 text-gray-800" />
                  </div>
                  {/* Scan Animation Ring */}
                  <div className="absolute inset-0 rounded-lg sm:rounded-xl border-4 border-amber-400 animate-ping opacity-75"></div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-xs text-amber-700 mt-2">Click to verify →</p>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 bg-green-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-xl flex items-center gap-1 sm:gap-2 animate-pulse">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">Verified</span>
            </div>

            <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-purple-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-xl flex items-center gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm">NFT #127/500</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Flow Diagram */}
      <div className="relative border-t border-white/20 bg-black/20 backdrop-blur-sm p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">How It Works</p>
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-1 sm:gap-2 text-white">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-base sm:text-xl">🍷</span>
              </div>
              <span className="text-xs sm:text-sm">Physical Bottle</span>
            </div>

            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />

            <div className="flex items-center gap-1 sm:gap-2 text-white">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm">Scan QR Code</span>
            </div>

            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />

            <div className="flex items-center gap-1 sm:gap-2 text-white">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-base sm:text-xl">⛓️</span>
              </div>
              <span className="text-xs sm:text-sm">SUI Blockchain</span>
            </div>

            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />

            <div className="flex items-center gap-1 sm:gap-2 text-white">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm">Full Provenance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}