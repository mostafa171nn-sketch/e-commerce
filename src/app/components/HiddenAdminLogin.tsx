'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HiddenAdminLogin() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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

  return null;
}
