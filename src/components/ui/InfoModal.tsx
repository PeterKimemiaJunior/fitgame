import type { ReactNode } from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function InfoModal({ isOpen, onClose, title, children }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden transform transition-all">
        
        {/* Header do Modal */}
        <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors font-bold text-xl leading-none"
          >
            ×
          </button>
        </div>
        
        {/* Conteúdo Rolável */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer do Modal */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}