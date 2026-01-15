import { NUTRITION_LIBRARY } from '../domain/recommendations/engine';

export function Nutrition() {
  return (
    <div className="p-6 space-y-6">
      <header className="border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Nutrição</h1>
        <p className="text-sm text-gray-500 mt-1">
          Substituições inteligentes para gerenciar calorias.
        </p>
      </header>

      <div className="space-y-4">
        {NUTRITION_LIBRARY.map((item) => (
          <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                -{item.caloriesSaved} kcal
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{item.description}</p>
            <div className="text-xs text-gray-500 italic border-t border-gray-200 pt-2">
              Explicação: {item.reason}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}