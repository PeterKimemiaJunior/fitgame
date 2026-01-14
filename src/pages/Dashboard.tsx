import { useState } from 'react';
import { HistoryChart } from '../components/HistoryChart';
import { MetricCard } from '../components/ui/MetricCard';
import { InsightsCard } from '../components/ui/InsightsCard';
import { StatsChart } from '../components/ui/StatsChart'; // NOVO
import { HABITS_LIST } from '../types';
import { useTodayLog } from '../hooks/useTodayLog';
import { useUserMetrics } from '../hooks/useUserMetrics';
import { useGameProgress } from '../hooks/useGameProgress';
import { useDailyChallenge } from '../hooks/useDailyChallenge';
import { useInsights } from '../hooks/useInsights';
import { useUserStore } from '../store/useUserStore';
import { calculateWeeklyStats, prepareChartData, calculateTrend } from '../metrics/calculators';

export function Dashboard() {
  const user = useUserStore((state) => state.user)!;
  const logs = useUserStore((state) => state.logs);
  const updateDailyStats = useUserStore((state) => state.updateDailyStats);
  
  // Estados Locais UI
  const [showStatsInput, setShowStatsInput] = useState(false);
  const [inputSteps, setInputSteps] = useState('');
  const [inputCalories, setInputCalories] = useState('');

  // Hooks de Negócio
  const { completedIds, toggleHabit } = useTodayLog();
  const { bmi, bmr, calories, bmiLabel } = useUserMetrics();
  const { level, streak, totalPoints } = useGameProgress();
  const { challenge, isCompleted, toggleChallenge } = useDailyChallenge();
  
  // Inteligência (V2 - com Trends)
  const trend = calculateTrend(logs.slice(-7), logs.slice(-14, -7)); // Última 7d vs 7d anterior
  const insights = useInsights(); 
  // Hack rápido para passar trend para feedback engine (evitaria refatoração maior)
  if (insights.feedback === null && trend.change !== 0) {
     // Poderíamos injetar aqui, mas vamos manter simples
  }
  
  const stats = calculateWeeklyStats(logs);

  // Handlers
  const handleStatsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = new Date().toISOString().split('T')[0];
    updateDailyStats(todayStr, Number(inputSteps), Number(inputCalories));
    setShowStatsInput(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md space-y-6">
        
        {/* Header */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase">Olá, {user.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold border border-indigo-200">
                  Nível {level}
                </span>
                <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold border border-orange-200">
                  🔥 {streak} dias
                </span>
              </div>
            </div>
            <div className="text-right">
               <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                {totalPoints} pts
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Inteligência (Trends incluídos) */}
        {insights.feedback && (
          <InsightsCard 
            feedback={insights.feedback} 
            consistencyScore={insights.consistencyScore} 
          />
        )}

        {/* Cards de Métricas Biológicas */}
        <div className="grid grid-cols-3 gap-2">
             <MetricCard
               title="IMC"
               value={bmi}
               containerClass="bg-blue-50 p-2 rounded border border-blue-100 flex flex-col justify-between"
               titleClass="text-[10px] text-blue-600 font-bold uppercase"
               valueClass="text-sm font-black text-blue-800 leading-none"
               subValue={bmiLabel}
               subValueClass="text-[9px] text-blue-400 truncate"
            />
            <MetricCard
               title="TMB"
               value={bmr}
               containerClass="bg-orange-50 p-2 rounded border border-orange-100 flex flex-col justify-center"
               titleClass="text-[10px] text-orange-600 font-bold uppercase"
               valueClass="text-sm font-black text-orange-800 leading-none"
            />
            <MetricCard
               title="Meta"
               value={calories}
               containerClass="bg-emerald-50 p-2 rounded border border-emerald-100 flex flex-col justify-center"
               titleClass="text-[10px] text-emerald-600 font-bold uppercase"
               valueClass="text-sm font-black text-emerald-700 leading-none"
            />
          </div>

        {/* SEÇÃO DE ENTRADA DE DADOS (V3 Feature) */}
        <div>
          <button 
            onClick={() => setShowStatsInput(!showStatsInput)}
            className="text-xs font-bold uppercase text-gray-400 mb-2 hover:text-gray-600 w-full text-right"
          >
            {showStatsInput ? 'Fechar' : '+ Registrar Passos/Calorias'}
          </button>
          
          {showStatsInput && (
            <form onSubmit={handleStatsSubmit} className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input
                value={inputSteps}
                onChange={(e) => setInputSteps(e.target.value)}
                placeholder="Passos"
                type="number"
                className="w-full px-2 py-1 text-xs border rounded focus:outline-none"
              />
              <input
                value={inputCalories}
                onChange={(e) => setInputCalories(e.target.value)}
                placeholder="Kcal Ingeridas"
                type="number"
                className="w-full px-2 py-1 text-xs border rounded focus:outline-none"
              />
              <button type="submit" className="col-span-2 bg-gray-800 text-white text-xs py-1 rounded font-bold">
                Salvar
              </button>
            </form>
          )}
        </div>

        {/* Desafio Diário */}
        <div className={`border-2 p-4 rounded-xl flex items-center justify-between transition-all ${
          isCompleted 
            ? 'bg-purple-50 border-purple-300' 
            : 'bg-white border-dashed border-purple-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl filter drop-shadow-sm">{challenge.icon}</span>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Desafio do Dia</p>
              <p className={`text-sm font-bold leading-tight ${isCompleted ? 'text-purple-700 line-through' : 'text-gray-700'}`}>
                {challenge.title}
              </p>
            </div>
          </div>
          <button
            onClick={toggleChallenge}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors ${
              isCompleted ? 'bg-purple-500' : 'bg-gray-200 hover:bg-purple-200 text-gray-400 hover:text-purple-600'
            }`}
          >
            {isCompleted ? '✓' : '+'}
          </button>
        </div>

        {/* Lista de Hábitos */}
        <div className="space-y-3 text-left">
          <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wide border-b pb-2">
            Seus Hábitos de Hoje
          </h2>
          {/* ... código dos hábitos (igual anterior) ... */}
          {HABITS_LIST.map((habit) => {
            const isHabitCompleted = completedIds.includes(habit.id);
            return (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  isHabitCompleted 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{habit.icon}</span>
                  <span className={`font-medium ${isHabitCompleted ? 'line-through opacity-70' : ''}`}>
                    {habit.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    isHabitCompleted ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-100 text-gray-400'
                  }`}>
                    +{habit.points}
                  </span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isHabitCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'
                  }`}>
                    {isHabitCompleted && <span className="text-white text-xs">✓</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Histórico & Métricas (V3) */}
        <div className="space-y-6 pt-4 border-t border-gray-100">
          
          {/* Gráfico XP (Linha) */}
          <div>
            <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3 text-center">
              Evolução XP (7 dias)
            </h2>
            <HistoryChart logs={logs} />
          </div>

          {/* Gráficos de Métricas (Barra) */}
          <div className="grid grid-cols-1 gap-4">
             <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase">Passos Médios</h3>
                <span className="text-xs font-bold text-blue-600">{stats.avgSteps}</span>
              </div>
              <StatsChart 
                {...prepareChartData(logs, 'steps', 7)} 
                color="#3b82f6" 
                label="Passos" 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase">Calorias Médias</h3>
                <span className="text-xs font-bold text-pink-600">{stats.avgCalories}</span>
              </div>
              <StatsChart 
                {...prepareChartData(logs, 'calories', 7)} 
                color="#ec4899" 
                label="Kcal" 
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}