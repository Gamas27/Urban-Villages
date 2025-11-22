'use client';

import { useState } from 'react';
import { Onboarding } from './Onboarding';
import { MainApp } from './MainApp';
import { ZkLoginInfoBanner } from '@/components/ZkLoginInfoBanner';

export default function CorkApp() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userData, setUserData] = useState<{
    username: string;
    village: string;
    profilePicBlobId?: string;
  } | null>(null);

  const handleOnboardingComplete = (data: {
    username: string;
    village: string;
    profilePicBlobId?: string;
  }) => {
    setUserData(data);
    setIsOnboarded(true);
    
    // TODO: Register namespace on SUI blockchain
    // Format: username.village (e.g., maria.lisbon)
    // Store profilePicBlobId in metadata
    
    console.log('User onboarded:', data);
  };

  if (!isOnboarded) {
    return (
      <>
        <Onboarding onComplete={handleOnboardingComplete} />
        <ZkLoginInfoBanner />
      </>
    );
  }

  return <MainApp />;
}