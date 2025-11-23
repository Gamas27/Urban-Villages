'use client';

import { useEffect } from 'react';
import { Onboarding } from './Onboarding';
import { MainApp } from './MainApp';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useUserStore, useUserProfile } from '@/lib/stores/userStore';
import { namespaceApi } from '@/lib/api';

export default function CorkApp() {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const profile = useUserProfile();
  const { setProfile, updateProfile, setLoading, setError, loading, error: registrationError } = useUserStore();

  // Check if user is onboarded (has profile and wallet connected)
  const isOnboarded = profile !== null && account !== null;

  // Update wallet address when account changes (only if different)
  useEffect(() => {
    if (account && profile && profile.walletAddress !== account.address) {
      updateProfile({
        walletAddress: account.address,
      });
    }
  }, [account?.address, profile?.walletAddress, updateProfile]);

  const handleOnboardingComplete = async (data: {
    username: string;
    village: string;
    profilePicBlobId?: string;
  }) => {
    // Set profile in store (this also persists to sessionStorage)
    setProfile({
      username: data.username,
      village: data.village,
      profilePicBlobId: data.profilePicBlobId,
      walletAddress: account?.address || null,
    });
    
    // Register namespace on SUI blockchain if wallet is connected
    if (account) {
      setLoading(true);
      setError(null);
      
      try {
        const result = await namespaceApi.registerNamespace(
          data.username,
          data.village,
          data.profilePicBlobId,
          signAndExecute
        );
        
        if (result.success && result.data) {
          // Update profile with namespace ID
          setProfile({
            username: data.username,
            village: data.village,
            profilePicBlobId: data.profilePicBlobId,
            namespaceId: result.data,
            walletAddress: account.address,
          });
          console.log('Namespace registered:', result.data);
        } else {
          setError(result.error || 'Failed to register namespace');
          console.error('Namespace registration failed:', result.error);
          // Continue with onboarding even if registration fails
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMsg);
        console.error('Failed to register namespace:', error);
        // Continue with onboarding even if registration fails
      } finally {
        setLoading(false);
      }
    }
  };


  if (!isOnboarded) {
    return (
      <>
        <Onboarding onComplete={handleOnboardingComplete} />
        {loading && (
          <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <p className="text-sm">Registering namespace on-chain...</p>
          </div>
        )}
        {registrationError && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <p className="text-sm">Registration error: {registrationError}</p>
          </div>
        )}
      </>
    );
  }

  return <MainApp />;
}