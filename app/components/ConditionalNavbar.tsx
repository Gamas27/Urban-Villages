'use client';

import { useEffect, useState } from 'react';
import { useIsMobile } from './ui/use-mobile';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wait for hydration before showing/hiding to avoid layout shift
  if (!mounted) {
    return null;
  }

  // Only show navbar on desktop devices
  if (isMobile) {
    return null;
  }

  return <Navbar />;
}

