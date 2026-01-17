import { ACTIVITIES_LIBRARY } from '../domain/recommendations/engine';
import type { ActivitySuggestion } from '../domain/recommendations/types';

// --- COMPONENTE DE ÍCONES (SVG) ---
// Isso garante visual profissional sem dependências externas de libs de ícones
const Icon = ({ 
  name, 
  className 
}: { 
  name: 'heart' | 'move' | 'zap' | 'lightbulb' | 'flame'; 
  className: string 
}) => {
  switch (name) {
    case 'heart': // Cardio
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      );
    case 'move': // Mobilidade
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      );
    case 'zap': // Força/Potência
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      );
    case 'lightbulb': // Dica
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      );
    case 'flame': // Calorias
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
        </svg>
      );
    default:
      return null;
  }
};

// Helper para categorização inteligente
const getCategoryDetails = (title: string) => {
  const t = title.toLowerCase();
  
  if (t.includes('caminh') || t.includes('corrida') || t.includes('walk') || t.includes('run')) {
    return {
      label: 'Cardio',
      iconName: 'heart' as const,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    };
  }
  
  if (t.includes('yoga') || t.includes('stretch') || t.includes('flexibilidade') || t.includes('alongamento')) {
    return {
      label: 'Mobilidade',
      iconName: 'move' as const,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    };
  }
  
  // Default (Força / Geral)
  return {
    label: 'Força',
    iconName: 'zap' as const,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  };
};

export function Activity() {
  
  // Agrupando exercícios dinamicamente
  const groupedActivities = ACTIVITIES_LIBRARY.reduce((acc, item) => {
    const cat = getCategoryDetails(item.title);
    if (!acc[cat.label]) {
      acc[cat.label] = { details: cat, items: [] };
    }
    acc[cat.label].items.push(item);
    return acc;
  }, {} as Record<string, { details: ReturnType<typeof getCategoryDetails>, items: ActivitySuggestion[] }>);

  return (
    <div className="p-6 space-y-8 pb-20">
      
      {/* Header */}
      <header className="border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Atividades</h1>
        <p className="text-sm text-gray-500 mt-1">
          Sugestões técnicas variadas para cada nível e objetivo.
        </p>
      </header>

      {/* Renderização por Categoria */}
      {Object.values(groupedActivities).map((group) => (
        <section key={group.details.label} className="space-y-4">
          
          {/* Título da Categoria com Ícone */}
          <div className="flex items-center gap-2">
            <Icon name={group.details.iconName} className={`w-6 h-6 ${group.details.color}`} />
            <h2 className="text-lg font-bold text-gray-800 capitalize">{group.details.label}</h2>
          </div>

          {/* Lista de Cards */}
          <div className="space-y-3">
            {group.items.map((item: ActivitySuggestion) => (
              <div 
                key={item.id} 
                className={`bg-white border-l-4 ${group.details.borderColor} border-y border-r border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  
                  {/* Badge de Calorias com Ícone */}
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full ${group.details.bgColor} ${group.details.color}`}>
                    <Icon name="flame" className="w-3 h-3" />
                    {item.caloriesBurned} kcal
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {item.description}
                </p>
                
                {/* Área de Benefício / Razão */}
                <div className={`bg-gray-50 p-3 rounded border border-gray-100 flex gap-3 items-start`}>
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
        </section>
      ))}

    </div>
  );
}