import { NUTRITION_LIBRARY } from '../domain/recommendations/engine';

// --- COMPONENTE DE ÍCONES (Estendido) ---
const Icon = ({ 
  name, 
  className 
}: { 
  name: 'leaf' | 'refresh' | 'minus' | 'lightbulb'; 
  className: string 
}) => {
  switch (name) {
    case 'leaf': // Nutrição Saudável
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      );
    case 'refresh': // Troca / Substituição
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      );
    case 'minus': // Redução Calórica
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
        </svg>
      );
    case 'lightbulb': // Dica
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      );
    default:
      return null;
  }
};

export function Nutrition() {
  return (
    <div className="p-6 space-y-6 pb-20">
      
      {/* Header */}
      <header className="border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Guia Nutricional</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pequenas trocas que geram grandes resultados.
        </p>
      </header>

      <div className="space-y-4">
        {NUTRITION_LIBRARY.map((item) => (
          <div key={item.id} className="bg-white border-l-4 border-emerald-500 border-y border-r border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
            
            {/* Topo: Título e Badge de Economia */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900 flex-1">{item.title}</h3>
              
              <span className="flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 ml-3 flex-shrink-0">
                
                -{item.caloriesSaved} kcal
              </span>
            </div>
            
            {/* Descrição */}
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {item.description}
            </p>
            
            {/* Rodapé Educacional */}
            <div className="bg-gray-50 p-3 rounded border border-gray-100 flex gap-3 items-start">
              <div className="text-gray-400 mt-0.5">
                <Icon name="lightbulb" className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Por que funciona</p>
                <p className="text-sm text-gray-700 italic leading-tight">{item.reason}</p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}