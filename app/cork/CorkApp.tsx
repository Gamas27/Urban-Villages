'use client';

import { useState, useEffect } from 'react';
import { Onboarding } from './Onboarding';
import { MainApp } from './MainApp';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { registerNamespace } from '@/lib/namespace';

export default function CorkApp() {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [userData, setUserData] = useState<{
    username: string;
    village: string;
    profilePicBlobId?: string;
    namespaceId?: string;
  } | null>(null);

  // Check sessionStorage on mount to restore onboarding state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('cork_onboarding_data');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          // Only restore if we have valid onboarding data
          if (data.username && data.village) {
            setUserData(data);
            // Only set as onboarded if wallet is also connected
            // This ensures wallet connection is required
            if (account) {
              setIsOnboarded(true);
            }
          }
        } catch (err) {
          console.error('Failed to parse onboarding data:', err);
          // Clear invalid data
          sessionStorage.removeItem('cork_onboarding_data');
        }
      }
    }
  }, [account]); // Re-check when account changes

  const handleOnboardingComplete = async (data: {
    username: string;
    village: string;
    profilePicBlobId?: string;
  }) => {
    setUserData(data);
    
    // Register namespace on SUI blockchain if wallet is connected
    if (account) {
      setIsRegistering(true);
      try {
        const digest = await registerNamespace(
          data.username,
          data.village,
          data.profilePicBlobId,
          signAndExecute
        );
        
        console.log('Namespace registered:', digest);
        
        setUserData({
          ...data,
          namespaceId: digest,
        });
      } catch (error) {
        console.error('Failed to register namespace:', error);
        // Continue with onboarding even if registration fails
        // User can register namespace later
      } finally {
        setIsRegistering(false);
      }
    }
    
    setIsOnboarded(true);
    console.log('User onboarded:', data);
  };

  if (!isOnboarded) {
    return (
      <>
        <Onboarding onComplete={handleOnboardingComplete} />
        {isRegistering && (
          <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <p className="text-sm">Registering namespace on-chain...</p>
          </div>
        )}
      </>
    );
  }

  return <MainApp />;
}