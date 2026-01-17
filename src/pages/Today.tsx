import { useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useV4Store } from '../store/useV4Store';
import { generateRecommendation } from '../domain/recommendations/engine';
import { generateDailyChallenge } from '../domain/recommendations/challenges';
import { calculateHealthMetrics } from '../domain/health/metrics';
import type { DailyRecommendation } from '../domain/recommendations/types';
import type { Challenge } from '../domain/recommendations/challenges';

// --- COMPONENTE DE ÍCONES (LOCAL) ---
const Icon = ({ name, className }: { name: string; className: string }) => {
  // Mapeia emojis de desafio para chaves internas
  let key = name;
  if (name === '💧') key = 'droplet';
  if (name === '🚶') key = 'footprints';
  if (name === '🍎') key = 'leaf';
  if (name === '🏋️') key = 'dumbbell';
  if (name === '😴') key = 'moon';

  switch (key) {
    case 'droplet': // Água
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>
      );
    case 'footprints': // Caminhar
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 11 3.8 11 8c0 2.85-2.92 7.21-4 9.5" /><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 13 7.8 13 12c0 2.85 2.92 7.21 4 9.5" /><path d="M4 16c0 2.5 2.5 4 4.5 4" /><path d="M20 20c0 2.5-2.5 4-4.5 4" /></svg>
      );
    case 'leaf': // Fruta/Nutrição
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
      );
    case 'dumbbell': // Exercício
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h11" /><path d="M6 20v-2a6 6 0 1 1 12 0v2" /><path d="M18 11V6a6 6 0 1 0-12 0v5" /></svg>
      );
    case 'moon': // Dormir
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
      );
    case 'activity': // Correr
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
      );
    case 'nutrition': // Salada
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5m-4.5-4.5V18" /></svg>
      );
    case 'check': // Visto
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
      );
    default:
      return null;
  }
};

export function Today() {
  // --- Estado Global ---
  const user = useUserStore((state) => state.user);
  
  const {
    dailyProgress,
    profileMetrics,
    toggleActivity,
    toggleNutrition,
    addWater,
    logWeight,
  } = useV4Store();

  // --- Lógica Local ---
  const todayStr = new Date().toISOString().split('T')[0];
  const currentRecord = dailyProgress[todayStr] || { 
    activityDone: false, 
    nutritionDone: false, 
    waterIntake: 0, 
    weightLogged: null 
  };

  const [editingWeight, setEditingWeight] = useState(!currentRecord.weightLogged);
  const [weightInput, setWeightInput] = useState(
    String(currentRecord.weightLogged || user?.weight || '')
  );

  const recs: DailyRecommendation = generateRecommendation(todayStr);
  const challenge: Challenge = generateDailyChallenge(todayStr);

  // Lógica de Métricas
  let healthMetrics = profileMetrics;
  if (!healthMetrics && user) {
    healthMetrics = calculateHealthMetrics(user.age, user.weight, user.height, user.gender, user.activityLevel, user.goal);
  }

  const handleAddWater = () => addWater(todayStr);
  
  const handleLogWeight = () => {
    const val = parseFloat(weightInput);
    if (val && val > 0) {
      logWeight(todayStr, val);
      setEditingWeight(false);
    }
  };

  const handleEditWeight = () => {
    setWeightInput(String(currentRecord.weightLogged || user?.weight || ''));
    setEditingWeight(true);
  };

  if (!user) {
    return (
      <div className="p-6 text-center mt-20">
        <h1 className="text-xl font-bold text-gray-800 mb-2">Perfil Necessário</h1>
        <p className="text-gray-600">Por favor, atualize seu perfil para receber recomendações diárias.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      
      {/* Header */}
      <header className="border-b border-gray-100 pb-4">
        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          Olá, {user.name.split(' ')[0]} <Icon name="hand" className="inline-block w-6 h-6 text-emerald-500 align-middle ml-1" />
        </h1>
      </header>

      {/* 1. DESAFIO DO DIA */}
      <section className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600">
            {/* Challenge Icon -> SVG */}
            <Icon name={challenge.icon} className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-purple-600 uppercase">Desafio do Dia</p>
            <p className="text-base font-bold text-gray-900 leading-tight">{challenge.title}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 italic pl-13">{challenge.reason}</p>
      </section>

      {/* 2. META CALÓRICA */}
      <section className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10 text-emerald-800">
          <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
        </div>
        <h2 className="text-sm font-bold text-emerald-800 uppercase mb-1">Meta Diária</h2>
        <div className="flex items-baseline gap-2 relative z-10">
          <span className="text-4xl font-black text-emerald-900 leading-none">
            {healthMetrics?.targetCalories || '-'}
          </span>
          <span className="text-lg font-bold text-emerald-700">kcal</span>
        </div>
        <p className="text-xs text-emerald-700 mt-2 leading-relaxed max-w-[90%]">
          Calculado com base no seu TMB de <strong>{healthMetrics?.bmr} kcal</strong> e objetivo de <strong>{user.goal === 'loss_aggressive' ? 'emagrecer rápido' : user.goal === 'loss_moderate' ? 'emagrecer' : user.goal === 'gain_muscle' ? 'ganhar massa' : 'manter peso'}</strong>.
        </p>
      </section>

      {/* 3. HÁBITOS */}
      <div className="space-y-4">
        
        {/* Atividade */}
        <section className={`p-5 rounded-xl border-2 transition-all ${
          currentRecord.activityDone ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-100 bg-white hover:border-emerald-200'
        }`}>
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentRecord.activityDone ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                <Icon name="activity" className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Atividade</h2>
                <p className="text-xs text-gray-500">Cumpriu o plano de hoje</p>
              </div>
            </div>
            <div 
              onClick={() => toggleActivity(todayStr)}
              className={`w-8 h-8 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                currentRecord.activityDone ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
              }`}
            >
              {currentRecord.activityDone && <Icon name="check" className="w-5 h-5 text-white" />}
            </div>
          </div>
          <div className="bg-white/50 p-3 rounded-lg border border-gray-100">
             <p className="text-sm text-gray-600 font-medium mb-1">{recs.activity.title}</p>
             <p className="text-xs text-gray-500 italic">"{recs.activity.reason}"</p>
          </div>
        </section>

        {/* Nutrição */}
        <section className={`p-5 rounded-xl border-2 transition-all ${
          currentRecord.nutritionDone ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-100 bg-white hover:border-emerald-200'
        }`}>
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentRecord.nutritionDone ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                <Icon name="nutrition" className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Nutrição</h2>
                <p className="text-xs text-gray-500">Manteve a dieta</p>
              </div>
            </div>
            <div 
              onClick={() => toggleNutrition(todayStr)}
              className={`w-8 h-8 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                currentRecord.nutritionDone ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
              }`}
            >
              {currentRecord.nutritionDone && <Icon name="check" className="w-5 h-5 text-white" />}
            </div>
          </div>
          <div className="bg-white/50 p-3 rounded-lg border border-gray-100">
             <p className="text-sm text-gray-600 font-medium mb-1">{recs.nutrition.title}</p>
             <p className="text-xs text-gray-500 italic">"{recs.nutrition.reason}"</p>
          </div>
        </section>

      </div>

      <div className="h-px bg-gray-100 my-4"></div>

      {/* 4. HIDRATAÇÃO */}
      <section className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">Hidratação</h2>
          <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {currentRecord.waterIntake} / 2000 ml
          </div>
        </div>
        
        <div className="grid grid-cols-8 gap-2 mb-4 h-8">
          {Array.from({ length: 8 }).map((_, i) => {
            const glassesCount = Math.floor(currentRecord.waterIntake / 250);
            const isActive = i < glassesCount;
            return (
              <div 
                key={i} 
                className={`rounded transition-all duration-300 ${isActive ? 'bg-blue-400 shadow-sm' : 'bg-gray-100'}`}
              />
            );
          })}
        </div>

        <button 
          onClick={handleAddWater}
          className="w-full py-3 border-2 border-dashed border-blue-200 text-blue-600 font-bold rounded-lg hover:bg-blue-50 active:bg-blue-100 transition-colors flex items-center justify-center gap-2"
        >
          <span>+</span> 250ml de Água
        </button>
      </section>

      {/* 5. REGISTRO DE PESO */}
      <section className="bg-white border border-gray-200 rounded-xl p-5">
        {editingWeight ? (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-800">Peso Hoje</h2>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder={`${user.weight} kg`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-center font-bold text-gray-800"
              />
              <button 
                onClick={handleLogWeight}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Salvar
              </button>
            </div>
            {currentRecord.weightLogged && (
               <button 
                onClick={() => setEditingWeight(false)}
                className="w-full py-2 text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors"
              >
                Cancelar edição
              </button>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-gray-500 uppercase mb-1">Peso Hoje</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-900">
                  {currentRecord.weightLogged}
                </span>
                <span className="text-sm font-bold text-gray-500">kg</span>
              </div>
            </div>
            <button 
              onClick={handleEditWeight}
              className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Editar
            </button>
          </div>
        )}
      </section>

    </div>
  );
}