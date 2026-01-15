import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      <main className="max-w-md mx-auto min-h-screen bg-white shadow-x-lg">
        {children}
      </main>
    </div>
  );
}