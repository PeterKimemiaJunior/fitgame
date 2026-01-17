import type { ReactNode } from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

// Componente de Ícone Local (Close)
const IconClose = ({ className }: { className: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2.5} 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export function InfoModal({ isOpen, onClose, title, children }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden transform transition-all flex flex-col max-h-[85vh]">
        
        {/* Header do Modal */}
        <div className="flex justify-between items-center bg-gray-50 px-5 py-4 border-b border-gray-100 shrink-0">
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all rounded-lg p-1 active:scale-95"
            aria-label="Fechar modal"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>
        
        {/* Conteúdo Rolável */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>

        {/* Footer do Modal */}
        <div className="bg-gray-50 px-5 py-4 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm active:scale-95"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}