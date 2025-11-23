'use client';

import { useEffect } from 'react';
import { Onboarding } from './Onboarding';
import { MainApp } from './MainApp';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useUserStore, useUserProfile } from '@/lib/stores/userStore';
import { useBackendStore } from '@/lib/stores/backendStore';
import { useBlockchainStore } from '@/lib/stores/blockchainStore';
import { namespaceApi } from '@/lib/api';
import { saveUserProfile, trackOnboardingEvent, logTransaction } from '@/lib/api/userTracking';

export default function CorkApp() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteMutate } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  
  // Wrapper function to match expected signature using mutate with callbacks
  const signAndExecute = async (params: { transaction: Transaction }): Promise<{ digest: string }> => {
    return new Promise<{ digest: string }>((resolve, reject) => {
      signAndExecuteMutate(
        params as any,
        {
          onSuccess: async ({ digest }) => {
            try {
              // Wait for transaction confirmation
              await suiClient.waitForTransaction({ digest });
              resolve({ digest });
            } catch (error) {
              reject(error);
            }
          },
          onError: (error) => {
            reject(error);
          },
        }
      );
    });
  };
  const profile = useUserProfile();
  const { setProfile, updateProfile, setLoading, setError, loading, error: registrationError } = useUserStore();
  const { syncProfile } = useBackendStore();
  const { addTransaction, updateTransaction } = useBlockchainStore();

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
        // Ensure account is available before proceeding
        if (!account.address) {
          throw new Error('Wallet account address is not available. Please ensure your wallet is connected.');
        }
        
        console.log('[CorkApp] Registering namespace:', {
          username: data.username,
          village: data.village,
          accountAddress: account.address,
        });
        
        const result = await namespaceApi.registerNamespace(
          data.username,
          data.village,
          data.profilePicBlobId,
          signAndExecute,
          account.address
        );
        
        if (result.success && result.data) {
          // result.data is a string (digest) from registerNamespace
          const digest = result.data;
          
          // Track namespace registration transaction
          const txId = addTransaction({
            type: 'namespace_claim',
            status: 'pending',
            digest: digest,
            metadata: { 
              namespace: `${data.username}.${data.village}`,
              namespaceId: digest, // Use digest as namespaceId for now
            },
          });

          // Update profile with namespace ID
          const updatedProfile = {
            username: data.username,
            village: data.village,
            profilePicBlobId: data.profilePicBlobId,
            namespaceId: digest, // Use digest as namespaceId
            walletAddress: account.address,
          };
          
          setProfile(updatedProfile);
          console.log('Namespace registered:', digest);

          // Update transaction on success
          updateTransaction(txId, {
            status: 'success',
            digest: digest,
          });

          // Sync to backend (after blockchain confirmation)
          try {
            console.log('[CorkApp] Saving profile to Supabase database:', {
              walletAddress: account.address,
              username: data.username,
              village: data.village,
              profilePicBlobId: data.profilePicBlobId,
            });
            
            const saveResult = await saveUserProfile({
              walletAddress: account.address,
              username: data.username,
              village: data.village,
              namespaceId: digest, // Use digest as namespaceId
              profilePicBlobId: data.profilePicBlobId,
              onboardingCompleted: true,
            });
            
            if (saveResult) {
              console.log('[CorkApp] ✅ Profile saved to Supabase:', {
                profilePicBlobId: saveResult.data?.profile_pic_blob_id,
                username: saveResult.data?.username,
              });
            } else {
              console.error('[CorkApp] ❌ Failed to save profile to Supabase');
            }

            // Track completion event
            await trackOnboardingEvent(account.address, 'completed', {
              village: data.village,
              username: data.username,
              step: 5,
            });

            // Log namespace transaction to backend
            await logTransaction({
              walletAddress: account.address,
              transactionType: 'namespace_claim',
              transactionDigest: digest,
              metadata: {
                namespace: `${data.username}.${data.village}`,
                namespaceId: digest, // Use digest as namespaceId
              },
            }).catch((err) => {
              console.error('Failed to log namespace transaction:', err);
            });

            // Also sync via backend store
            await syncProfile({
              walletAddress: account.address,
              username: data.username,
              village: data.village,
              namespaceId: digest, // Use digest as namespaceId
              profilePicBlobId: data.profilePicBlobId,
              onboardingCompletedAt: new Date().toISOString(),
            }).catch((err) => {
              console.error('Failed to sync profile to backend:', err);
            });

          } catch (backendError) {
            console.error('Backend sync failed (non-critical):', backendError);
            // Don't fail onboarding if backend sync fails
          }
        } else {
          // Provide more helpful error messages
          let errorMessage = result.error || 'Failed to register namespace';
          
          // Check for common issues
          if (errorMessage.includes('insufficient funds') || errorMessage.includes('gas')) {
            errorMessage = 'Insufficient SUI tokens for transaction. Please ensure your wallet has enough SUI to pay for gas fees.';
          } else if (errorMessage.includes('user rejected')) {
            errorMessage = 'Transaction was cancelled. Please try again.';
          }
          
          setError(errorMessage);
          console.error('[CorkApp] Namespace registration failed:', {
            error: result.error,
            fullResult: result,
          });
          // Continue with onboarding even if registration fails
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        
        // Provide more helpful error messages
        let userFriendlyError = errorMsg;
        if (errorMsg.includes('insufficient funds') || errorMsg.includes('gas')) {
          userFriendlyError = 'Insufficient SUI tokens for transaction. Please ensure your wallet has enough SUI to pay for gas fees.';
        } else if (errorMsg.includes('user rejected')) {
          userFriendlyError = 'Transaction was cancelled. Please try again.';
        }
        
        setError(userFriendlyError);
        console.error('[CorkApp] Failed to register namespace:', {
          error,
          message: errorMsg,
          stack: error instanceof Error ? error.stack : undefined,
        });
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