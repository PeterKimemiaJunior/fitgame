import type { ReactNode } from 'react';

interface EducationCardProps {
  title: string;
  children: ReactNode;
}

export function EducationCard({ title, children }: EducationCardProps) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-left">
      <h3 className="text-xs font-bold text-blue-700 uppercase mb-1">{title}</h3>
      <p className="text-xs text-blue-900 leading-relaxed">{children}</p>
    </div>
  );
}