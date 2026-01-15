import { ACTIVITIES_LIBRARY } from '../domain/recommendations/engine';
import type { ActivitySuggestion } from '../domain/recommendations/types';

// Função simples para categorizar
const getCategoryColor = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('walk')) return 'text-blue-600';
  if (t.includes('stretch') || t.includes('yoga')) return 'text-purple-600';
  return 'text-orange-600'; // default (strength)
};

export function Activity() {
  return (
    <div className="p-6 space-y-6">
      <header className="border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Exercícios</h1>
        <p className="text-sm text-gray-500 mt-1">
          Movimentos simples para iniciar a atividade.
        </p>
      </header>

      <div className="space-y-4">
        {ACTIVITIES_LIBRARY.map((item: ActivitySuggestion) => {
          const colorClass = getCategoryColor(item.title);
          
          return (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-lg font-bold ${colorClass}`}>{item.title}</h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  {item.caloriesBurned} kcal
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{item.description}</p>
              
              <div className="bg-gray-50 p-3 rounded border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Benefício</p>
                <p className="text-sm text-gray-700 italic">{item.reason}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}