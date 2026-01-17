// src/app/Layout.tsx
import { type ReactNode } from 'react';
import { Navigation } from '../ui/Navigation';

interface LayoutProps {
  children: ReactNode;
  current: 'today' | 'activity' | 'nutrition' | 'progress' | 'profile';
  onNavigate: (page: 'today' | 'activity' | 'nutrition' | 'progress' | 'profile') => void;
}

export function Layout({ children, current, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <main className="max-w-md mx-auto min-h-screen bg-white shadow-x-lg relative">
        {children}
        
        {/* Barra de Navegação */}
        <Navigation current={current} onNavigate={onNavigate} />
      </main>
    </div>
  );
}