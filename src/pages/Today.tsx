import { useMemo } from 'react';

import { useV4Store } from '../store/useV4Store';
import { generateRecommendation } from '../domain/recommendations/engine';

export function Today() {
  
  const { dailyProgress, toggleActivity, toggleNutrition } = useV4Store();
  
  const todayStr = new Date().toISOString().split('T')[0];
  const recs = useMemo(() => generateRecommendation(todayStr), [todayStr]);
  
  const progress = dailyProgress[todayStr] || { activityDone: false, nutritionDone: false };



  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Plano Diário</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h1>
      </div>

      {/* Activity Recommendation */}
      <div className={`p-5 rounded-lg border-2 transition-colors ${
        progress.activityDone ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-bold text-gray-800">Atividade</h2>
          <div 
            onClick={() => toggleActivity(todayStr)}
            className={`w-6 h-6 border-2 rounded flex items-center justify-center cursor-pointer ${
              progress.activityDone ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
            }`}
          >
            {progress.activityDone && <span className="text-white text-sm font-bold">✓</span>}
          </div>
        </div>
        
        <h3 className="text-sm font-semibold text-gray-700 mb-1">{recs.activity.title}</h3>
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{recs.activity.description}</p>
        
        <div className="bg-gray-50 p-3 rounded border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Por que é importante</p>
          <p className="text-sm text-gray-700 italic">{recs.activity.reason}</p>
          <div className="mt-2 inline-block text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
            {recs.activity.caloriesBurned} kcal estimado
          </div>
        </div>
      </div>

      {/* Nutrition Recommendation */}
      <div className={`p-5 rounded-lg border-2 transition-colors ${
        progress.nutritionDone ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-bold text-gray-800">Nutrição</h2>
          <div 
            onClick={() => toggleNutrition(todayStr)}
            className={`w-6 h-6 border-2 rounded flex items-center justify-center cursor-pointer ${
              progress.nutritionDone ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
            }`}
          >
            {progress.nutritionDone && <span className="text-white text-sm font-bold">✓</span>}
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-700 mb-1">{recs.nutrition.title}</h3>
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{recs.nutrition.description}</p>

        <div className="bg-gray-50 p-3 rounded border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Por que é importante</p>
          <p className="text-sm text-gray-700 italic">{recs.nutrition.reason}</p>
          <div className="mt-2 inline-block text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
            {recs.nutrition.caloriesSaved} kcal de economia
          </div>
        </div>
      </div>
    </div>
  );
}