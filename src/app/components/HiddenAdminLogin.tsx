'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HiddenAdminLogin() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Alt+4
      if (event.ctrlKey && event.altKey && event.key === '4') {
        event.preventDefault();
        router.push('/gatekeeper');
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [router]);

  // This component renders nothing
  return null;
}
