import { useMemo } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useV4Store } from '../store/useV4Store';
import { generateRecommendation } from '../domain/recommendations/engine';
import { generateDailyChallenge } from '../domain/recommendations/challenges';
import { calculateHealthMetrics } from '../domain/health/metrics';
import type { DailyRecommendation } from '../domain/recommendations/types';
import type { Challenge } from '../domain/recommendations/challenges';

export function Today() {
  const user = useUserStore((state) => state.user);
  const { toggleActivity, toggleNutrition } = useV4Store();
  
  const todayStr = new Date().toISOString().split('T')[0];
  const recs: DailyRecommendation = useMemo(() => generateRecommendation(todayStr), [todayStr]);
  const challenge: Challenge = useMemo(() => generateDailyChallenge(todayStr), [todayStr]);
  
  // Estado do dia atual
  const dailyProgress = useV4Store((state) => state.dailyProgress);
  const currentRecord = dailyProgress[todayStr] || { activityDone: false, nutritionDone: false };
  
  // Cálculos de Saúde
  const healthMetrics = user ? calculateHealthMetrics(user.age, user.weight, user.height, user.gender, user.activityLevel, user.goal) : null;

  if (!user) {
    return (
      <div className="p-6 text-center mt-20">
        <h1 className="text-xl font-bold text-gray-800 mb-2">Perfil Necessário</h1>
        <p className="text-gray-600">Por favor, atualize seu perfil para receber recomendações diárias.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pb-20">
      
      {/* Header */}
      <header className="border-b border-gray-100 pb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Plano Diário</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h1>
      </header>

      {/* 1. DESAFIO DO DIA (MOVIDO PARA O TOPO) */}
      <section className="bg-purple-50 border-2 border-dashed border-purple-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl filter drop-shadow-sm">{challenge.icon}</span>
          <div>
            <p className="text-[10px] font-bold text-purple-600 uppercase">Desafio do Dia</p>
            <p className="text-base font-bold text-purple-900 leading-tight">{challenge.title}</p>
          </div>
        </div>
        <p className="text-sm text-purple-800 italic">{challenge.reason}</p>
      </section>

      {/* 2. META CALÓRICA (LIMPO - SEM INFO CARD) */}
      <section className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-800">Meta Calórica</h2>
        </div>
        
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-4xl font-black text-emerald-900 leading-none">
            {healthMetrics?.targetCalories || 0}
          </span>
          <span className="text-xl font-bold text-emerald-700">kcal</span>
        </div>
        
        <p className="text-xs text-emerald-600 mt-1 font-medium">
          Baseado no seu TMB ({healthMetrics?.bmr} kcal) e objetivo ({user.goal === 'loss_aggressive' ? 'Acelerado' : user.goal === 'loss_moderate' ? 'Moderado' : 'Manter'}).
        </p>
      </section>

      {/* 3. ATIVIDADE SUGERIDA */}
      <section className={`p-5 rounded-lg border-2 transition-colors ${
        currentRecord.activityDone ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-bold text-gray-800">Atividade</h2>
          <div 
            onClick={() => toggleActivity(todayStr)}
            className={`w-6 h-6 border-2 rounded flex items-center justify-center cursor-pointer ${
              currentRecord.activityDone ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
            }`}
          >
            {currentRecord.activityDone && <span className="text-white text-sm font-bold">✓</span>}
          </div>
        </div>
        
        <h3 className="text-sm font-semibold text-gray-700 mb-1">{recs.activity.title}</h3>
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{recs.activity.description}</p>
        
        <div className="bg-gray-50 p-3 rounded border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Por que é importante</p>
          <p className="text-sm text-gray-700 italic">{recs.activity.reason}</p>
        </div>
      </section>

      {/* 4. NUTRIÇÃO SUGERIDA */}
      <section className={`p-5 rounded-lg border-2 transition-colors ${
        currentRecord.nutritionDone ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-bold text-gray-800">Nutrição</h2>
          <div 
            onClick={() => toggleNutrition(todayStr)}
            className={`w-6 h-6 border-2 rounded flex items-center justify-center cursor-pointer ${
              currentRecord.nutritionDone ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
            }`}
          >
            {currentRecord.nutritionDone && <span className="text-white text-sm font-bold">✓</span>}
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-700 mb-1">{recs.nutrition.title}</h3>
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{recs.nutrition.description}</p>

        <div className="bg-gray-50 p-3 rounded border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Por que é importante</p>
          <p className="text-sm text-gray-700 italic">{recs.nutrition.reason}</p>
        </div>
      </section>

    </div>
  );
}