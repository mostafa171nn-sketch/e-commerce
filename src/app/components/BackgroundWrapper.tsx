'use client';

import { usePathname } from 'next/navigation';

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bodyBg = pathname === '/brands' ? 'bg-white' : 'bg-gray-50';

  return (
    <div className={bodyBg}>
      {children}
    </div>
  );
}
