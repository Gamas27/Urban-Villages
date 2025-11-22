'use client';

import { useEffect, useState } from 'react';
import { useIsMobile } from "./components/ui/use-mobile";
import CorkApp from "./cork/CorkApp";
import App from "./App";

export default function Home() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wait for hydration to avoid mismatched content
  if (!mounted) {
    // Return desktop view as default (prevents flash of mobile on desktop)
    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Urban Villages
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Modular community platform where villages tokenize resources and build autonomous local economies on SUI blockchain.
            </p>
          </div>
          
          <div className="flex justify-center">
            <App />
          </div>
        </div>
      </div>
    );
  }

  // Show mobile app on mobile devices
  if (isMobile) {
    return <CorkApp />;
  }

  // Show desktop overview on desktop devices
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Urban Villages
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Modular community platform where villages tokenize resources and build autonomous local economies on SUI blockchain.
          </p>
        </div>
        
        <div className="flex justify-center">
          <App />
        </div>
      </div>
    </div>
  );
}